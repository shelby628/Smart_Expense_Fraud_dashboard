from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = "Creates demo admin and employee accounts if they don't exist"

    def handle(self, *args, **kwargs):
        User = get_user_model()

        if not User.objects.filter(username="demo_admin").exists():
            User.objects.create_user(
                username="demo_admin",
                password="Demo@Admin123",
                is_staff=True,
                is_superuser=False
            )
            self.stdout.write("Created demo_admin")
        else:
            self.stdout.write("demo_admin already exists")

        if not User.objects.filter(username="demo_employee").exists():
            User.objects.create_user(
                username="demo_employee",
                password="Demo@Employee123",
                is_staff=False,
                is_superuser=False
            )
            self.stdout.write("Created demo_employee")
        else:
            self.stdout.write("demo_employee already exists")