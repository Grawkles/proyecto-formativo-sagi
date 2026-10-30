from django.test import TestCase
from rest_framework.test import APIClient

from modules.permissions.services import PermissionService
from modules.products.models import (
    Brand,
    Category,
    ConsumableMaterial,
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
