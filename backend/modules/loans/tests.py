from unittest.mock import patch

from django.test import TestCase
from rest_framework.test import APIClient

from modules.products.models import Brand, Category, ConsumableMaterial
from modules.permissions.services import PermissionService
from modules.users.models import User
from .models import LoanDraft, Loans


class LoanBatchCreateTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_superuser(
            email="admin@example.com",
            password="test-password",
            first_name="Admin",
            last_name="Sistema",
        )
        self.receiver = User.objects.create_user(
            email="receiver@example.com",
            password="test-password",
            first_name="Usuario",
            last_name="Receptor",
        )
        brand = Brand.objects.create(name="Marca de prueba")
        category = Category.objects.create(name="Categoría de prueba")
        self.first_material = ConsumableMaterial.objects.create(
            brand=brand,
            category=category,
            name="Material uno",
            quantity=10,
            unit_price=100,
            total_price=1000,
            state="Disponible",
            description="Material para prueba de préstamo",
            purchase_date="2026-01-01",
            entry_date="2026-01-01",
        )
        self.second_material = ConsumableMaterial.objects.create(
            brand=brand,
            category=category,
            name="Material dos",
            quantity=1,
            unit_price=100,
            total_price=100,
            state="Disponible",
            description="Material para prueba de préstamo",
            purchase_date="2026-01-01",
            entry_date="2026-01-01",
        )
        self.client.force_authenticate(user=self.admin)

    def loan_payload(self, material_ids, amount=1):
        return {
            "id_responsable_user": self.admin.id,
            "id_receptor_user": self.receiver.id,
            "id_material": material_ids,
            "amount_lent": {str(material_id): amount for material_id in material_ids},
            "apprentice_group": "123456",
            "justification_use": "Préstamo para una actividad de formación.",
            "return_date": "2026-12-31",
        }

    def external_loan_payload(self, responsable_id=None):
        return {
            "id_responsable_user": self.admin.id if responsable_id is None else responsable_id,
            "receptor_is_registered": False,
            "receptor_name": "Receptor externo",
            "receptor_email": "externo@example.com",
            "id_material": [self.first_material.id],
            "amount_lent": {str(self.first_material.id): 1},
            "apprentice_group": "123456",
            "loan_type": "Interno",
            "justification_use": "Préstamo para una actividad de formación.",
            "return_date": "2026-12-31",
        }

    def test_creates_one_loan_for_each_selected_material(self):
        payload = self.loan_payload([self.first_material.id, self.second_material.id])
        payload["amount_lent"] = {
            str(self.first_material.id): 3,
            str(self.second_material.id): 1,
        }
        response = self.client.post(
            "/api/loans/",
            payload,
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(Loans.objects.count(), 2)
        self.assertEqual(
            list(Loans.objects.order_by("id_material").values_list("amount_lent", flat=True)),
            [3, 1],
        )

    def test_rolls_back_batch_when_one_material_cannot_be_lent(self):
        response = self.client.post(
            "/api/loans/",
            self.loan_payload([self.first_material.id, self.second_material.id], amount=2),
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(Loans.objects.count(), 0)

    @patch("modules.loans.views._send_draft_sign_email")
    def test_external_receiver_email_is_used_when_primary_admin_creates_draft(self, send_sign_email):
        self.admin.is_primary_admin = True
        self.admin.save(update_fields=["is_primary_admin"])

        response = self.client.post(
            "/api/loans/draft/",
            self.external_loan_payload(),
            format="json",
        )

        self.assertEqual(response.status_code, 201, response.data)
        draft = LoanDraft.objects.get(batch_id=response.data["batch_id"])
        self.assertIsNone(draft.id_receptor_user_id)
        self.assertEqual(draft.receptor_email, "externo@example.com")

        external_email_call = next(
            call for call in send_sign_email.call_args_list
            if call.kwargs.get("external") is True
        )
        self.assertEqual(external_email_call.args[1], "externo@example.com")
        self.assertEqual(external_email_call.args[3], "receptor")

    def test_other_users_cannot_assign_primary_admin_as_responsable(self):
        primary_admin = User.objects.create_superuser(
            email="primigenio@example.com",
            password="test-password",
            first_name="Admin",
            last_name="Primigenio",
        )
        primary_admin.is_primary_admin = True
        primary_admin.save(update_fields=["is_primary_admin"])

        response = self.client.post(
            "/api/loans/draft/",
            self.external_loan_payload(responsable_id=primary_admin.id),
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["id_responsable_user"], "Usuario no encontrado.")
        self.assertEqual(LoanDraft.objects.count(), 0)

    @patch("modules.loans.views._send_draft_sign_email", side_effect=RuntimeError("SMTP caído"))
    def test_reports_when_signature_email_cannot_be_sent(self, _send_sign_email):
        response = self.client.post(
            "/api/loans/draft/",
            self.external_loan_payload(),
            format="json",
        )

        self.assertEqual(response.status_code, 502)
        self.assertEqual(response.data["failed_roles"], ["responsable", "receptor"])
        self.assertTrue(LoanDraft.objects.filter(batch_id=response.data["batch_id"]).exists())


class DeleteLoanPermissionTest(TestCase):
    def test_delete_loan_requires_assignable_delete_permission(self):
        user = User.objects.create_user(email="loan-delete@example.com", password="secure123")
        receiver = User.objects.create_user(email="loan-receiver@example.com", password="secure123")
        brand = Brand.objects.create(name="Loan delete brand")
        category = Category.objects.create(name="Loan delete category")
        material = ConsumableMaterial.objects.create(
            brand=brand,
            category=category,
            name="Loan delete material",
            quantity=1,
            unit_price=100,
            total_price=100,
            state="Disponible",
            description="test",
            purchase_date="2026-01-01",
            entry_date="2026-01-01",
        )
        loan = Loans.objects.create(
            id_responsable_user=user,
            id_receptor_user=receiver,
            id_material=material,
            amount_lent=1,
            apprentice_group="123",
            justification_use="test",
        )
        client = APIClient()
        client.force_authenticate(user)

        self.assertEqual(client.delete(f"/api/loans/{loan.pk}/").status_code, 403)
        PermissionService.assign_permission_to_user(user, "delete_loan")
        self.assertEqual(client.delete(f"/api/loans/{loan.pk}/").status_code, 204)
