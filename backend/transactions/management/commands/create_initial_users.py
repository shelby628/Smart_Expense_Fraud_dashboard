from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
            self.stdout.write('Admin created')

        for name in ['alice', 'bob', 'charlie', 'employee1', 'employee2', 'employee3']:
            if not User.objects.filter(username=name).exists():
                User.objects.create_user(name, f'{name}@example.com', 'password123')
                self.stdout.write(f'{name} created')