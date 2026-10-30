from tempfile import TemporaryDirectory

from django.core.files.base import ContentFile
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.files.storage import default_storage
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from modules.permissions.services import PermissionService
from modules.products.models import (
    Brand,
    Category,
    ConsumableMaterial,
    Quotation,
    ReturnableMaterial,
)
from modules.users.models import User


class DeletePermissionTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="delete@example.com", password="secure123")
        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def grant(self, codename):
        PermissionService.assign_permission_to_user(self.user, codename)

    def material(self, name):
        category = Category.objects.create(name=f"{name} category")
        return ConsumableMaterial.objects.create(
            category=category,
            name=name,
            quantity=1,
            unit_price=100,
            total_price=100,
            state="Disponible",
            description=name,
            purchase_date="2026-01-01",
            entry_date="2026-01-01",
        )

    def test_delete_brand_requires_delete_brand(self):
        brand = Brand.objects.create(name="Delete brand")
        self.assertEqual(self.client.delete(f"/api/products/brands/{brand.pk}/").status_code, 403)
        self.grant("delete_brand")
        self.assertEqual(self.client.delete(f"/api/products/brands/{brand.pk}/").status_code, 204)

    def test_delete_materials_require_distinct_permissions(self):
        consumable = self.material("Delete consumable")
        returnable_material = self.material("Delete returnable")
        ReturnableMaterial.objects.create(
            consumable=returnable_material,
            category=returnable_material.category,
            model="Model",
        )

        self.assertEqual(
            self.client.delete(f"/api/products/consumables/{consumable.pk}/").status_code,
            403,
        )
        self.assertEqual(
            self.client.delete(f"/api/products/returnables/{returnable_material.pk}/").status_code,
            403,
        )

        self.grant("delete_consumable")
        self.grant("delete_returnable")
        self.assertEqual(
            self.client.delete(f"/api/products/consumables/{consumable.pk}/").status_code,
            204,
        )
        self.assertEqual(
            self.client.delete(f"/api/products/returnables/{returnable_material.pk}/").status_code,
            204,
        )


class AuthenticatedMediaStorageTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="media-reader@example.com", password="secure123"
        )
        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def storage_settings(self, directory):
        return {
            "default": {
                "BACKEND": "django.core.files.storage.FileSystemStorage",
                "OPTIONS": {"location": directory},
            },
            "staticfiles": {
                "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
            },
        }

    def test_registered_media_is_read_through_default_storage(self):
        with TemporaryDirectory() as directory:
            with override_settings(
                MEDIA_ROOT=directory,
                STORAGES=self.storage_settings(directory),
            ):
                quotation = Quotation.objects.create(
                    file=SimpleUploadedFile(
                        "fases_de_1-4_compressed.pdf",
                        b"%PDF-1.4 SAGI test",
                        content_type="application/pdf",
                    )
                )

                response = self.client.get(f"/media/{quotation.file.name}")

                self.assertEqual(response.status_code, 200)
                self.assertEqual(b"".join(response.streaming_content), b"%PDF-1.4 SAGI test")

    def test_unregistered_storage_object_remains_private(self):
        with TemporaryDirectory() as directory:
            with override_settings(
                MEDIA_ROOT=directory,
                STORAGES=self.storage_settings(directory),
            ):
                default_storage.save(
                    "quotes/orphan.pdf", ContentFile(b"not registered in database")
                )

                response = self.client.get("/media/quotes/orphan.pdf")

                self.assertEqual(response.status_code, 404)

    def test_registered_media_does_not_require_a_local_file_path(self):
        storages = self.storage_settings("")
        storages["default"] = {
            "BACKEND": "django.core.files.storage.InMemoryStorage",
        }
        with override_settings(STORAGES=storages):
            quotation = Quotation.objects.create(
                file=SimpleUploadedFile(
                    "remote.pdf", b"%PDF-1.4 remote storage", content_type="application/pdf"
                )
            )

            response = self.client.get(f"/media/{quotation.file.name}")

            self.assertEqual(response.status_code, 200)
            self.assertEqual(
                b"".join(response.streaming_content), b"%PDF-1.4 remote storage"
            )


class ProductSearchFieldsTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="product-search@example.com", password="secure123"
        )
        self.client = APIClient()
        self.client.force_authenticate(self.user)
        PermissionService.assign_permission_to_user(self.user, "view_consumable")
        PermissionService.assign_permission_to_user(self.user, "view_returnable")
        self.category = Category.objects.create(name="Search tools")

    @staticmethod
    def results(response):
        if isinstance(response.data, dict):
            return response.data.get("results", [])
        return response.data

    def test_consumables_search_by_sena_plate_and_serial(self):
        material = ConsumableMaterial.objects.create(
            category=self.category,
            name="Search consumable",
            sena_plate="PLACA-SENA-742",
            serial="SERIAL-CONS-815",
            quantity=4,
            unit_price=100,
            total_price=400,
            state="Disponible",
            description="Material de búsqueda",
            purchase_date="2026-01-01",
            entry_date="2026-01-02",
        )

        for term in ("PLACA-SENA-742", "SERIAL-CONS-815"):
            response = self.client.get("/api/products/consumables/", {"search": term})
            self.assertEqual(response.status_code, 200)
            self.assertIn(material.pk, [row["id"] for row in self.results(response)])

    def test_returnables_search_by_sena_plate_and_returnable_serial(self):
        material = ConsumableMaterial.objects.create(
            category=self.category,
            name="Search returnable",
            sena_plate="PLACA-SENA-936",
            quantity=1,
            unit_price=200,
            total_price=200,
            state="Disponible",
            description="Material devolutivo de búsqueda",
            purchase_date="2026-01-01",
            entry_date="2026-01-02",
        )
        returnable = ReturnableMaterial.objects.create(
            consumable=material,
            category=self.category,
            model="Modelo de búsqueda",
            serial="SERIAL-RET-527",
        )

        for term in ("PLACA-SENA-936", "SERIAL-RET-527"):
            response = self.client.get("/api/products/returnables/", {"search": term})
            self.assertEqual(response.status_code, 200)
            self.assertIn(
                returnable.pk,
                [row["consumable_id"] for row in self.results(response)],
            )
