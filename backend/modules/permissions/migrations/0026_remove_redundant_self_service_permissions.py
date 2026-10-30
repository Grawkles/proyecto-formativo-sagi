from django.db import migrations


RETIRED_PERMISSIONS = [
    (
        "view_own_profile",
        "Ver perfil propio",
        "Ver la información de perfil del usuario actual",
    ),
    (
        "change_password",
        "Cambiar contraseña",
        "Cambiar la contraseña personal",
    ),
]


def remove_self_service_permissions(apps, schema_editor):
    Permission = apps.get_model("permissions", "Permission")
    Permission.objects.filter(codename__in=[item[0] for item in RETIRED_PERMISSIONS]).delete()


def restore_self_service_permissions(apps, schema_editor):
    Permission = apps.get_model("permissions", "Permission")
    for codename, name, description in RETIRED_PERMISSIONS:
        Permission.objects.get_or_create(
            codename=codename,
            defaults={"name": name, "description": description},
        )


class Migration(migrations.Migration):
    dependencies = [("permissions", "0025_add_delete_and_return_view_permissions")]

    operations = [
        migrations.RunPython(
            remove_self_service_permissions,
            restore_self_service_permissions,
        )
    ]
