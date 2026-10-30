from django.test import TestCase
from rest_framework.test import APIClient

from modules.loans.models import Loans
from modules.permissions.services import PermissionService
from modules.products.models import Brand, Category, ConsumableMaterial
from modules.users.models import User


class DashboardLoanCountTestCase(TestCase):
    def test_dashboard_loan_count_matches_all_scope_list(self):
        sadmin = User.objects.create_user(
            email="dashboard-sadmin@example.com", password="secure123"
        )
        other = User.objects.create_user(
            email="dashboard-other@example.com", password="secure123"
        )
        receptor = User.objects.create_user(
            email="dashboard-receptor@example.com", password="secure123"
        )
        PermissionService.add_user_to_group(sadmin, "SADMIN")

        brand = Brand.objects.create(name="Dashboard brand")
        category = Category.objects.create(name="Dashboard category")
        material = ConsumableMaterial.objects.create(
            brand=brand,
            category=category,
            name="Dashboard material",
            quantity=10,
            unit_price=100,
            total_price=1000,
            state="Disponible",
            description="test",
            purchase_date="2026-01-01",
            entry_date="2026-01-01",
        )
        for _ in range(3):
            Loans.objects.create(
                id_responsable_user=other,
                id_receptor_user=receptor,
                id_material=material,
                amount_lent=1,
                apprentice_group="123",
                justification_use="Dashboard test",
            )

        client = APIClient()
        client.force_authenticate(sadmin)
        summary = client.get("/api/dashboard/summary/")
        loans = client.get("/api/loans/")

        self.assertEqual(summary.status_code, 200)
        self.assertEqual(loans.status_code, 200)
        if isinstance(loans.data, dict):
            listed_count = loans.data.get("count", len(loans.data.get("results", [])))
        else:
            listed_count = len(loans.data)
        self.assertEqual(summary.data["loans"], listed_count)
        self.assertEqual(summary.data["loans"], 3)
