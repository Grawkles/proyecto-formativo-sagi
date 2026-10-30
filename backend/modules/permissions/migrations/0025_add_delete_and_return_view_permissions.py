from django.db import migrations


NEW_PERMISSIONS = [
    ("delete_brand", "Eliminar marca", "Eliminar una marca del catálogo."),
    (
        "delete_consumable",
        "Eliminar material de consumo",
        "Eliminar un material de consumo cuando no tenga registros asociados.",
    ),
    (
        "delete_returnable",
        "Eliminar material devolutivo",
        "Eliminar un material devolutivo cuando no tenga registros asociados.",
    ),
    ("delete_loan", "Eliminar préstamo", "Eliminar un préstamo sin devoluciones asociadas."),
    ("view_return", "Ver devoluciones", "Consultar el historial de devoluciones de préstamos."),
]

GRANTS = {
    "delete_brand": ["SADMIN", "ADMIN"],
    "delete_consumable": ["SADMIN", "ADMIN"],
    "delete_returnable": ["SADMIN", "ADMIN"],
    "delete_loan": ["SADMIN", "ADMIN"],
    "view_return": ["SADMIN", "ADMIN", "INST", "INV"],
}


def add_permissions(apps, schema_editor):
    Permission = apps.get_model("permissions", "Permission")
    Group = apps.get_model("permissions", "Group")

    for codename, name, description in NEW_PERMISSIONS:
        permission, _ = Permission.objects.get_or_create(
            codename=codename,
            defaults={"name": name, "description": description},
        )
        for group in Group.objects.filter(name__in=GRANTS[codename]):
            group.permissions.add(permission)


def remove_permissions(apps, schema_editor):
    Permission = apps.get_model("permissions", "Permission")
    codenames = [codename for codename, _, _ in NEW_PERMISSIONS]
    Permission.objects.filter(codename__in=codenames).delete()


class Migration(migrations.Migration):
    dependencies = [("permissions", "0024_backfill_scope")]

    operations = [migrations.RunPython(add_permissions, remove_permissions)]
