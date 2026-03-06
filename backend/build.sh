#!/usr/bin/env bash
set -o errexit
pip install -r requirements.txt
mkdir -p staticfiles
python manage.py collectstatic --no-input
python manage.py migrate --run-syncdb
python manage.py shell -c "
from django.contrib.auth.models import User

# Create admin
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print('Admin created')

# Create employees
employees = ['alice', 'bob', 'charlie', 'employee1', 'employee2', 'employee3']
for name in employees:
    if not User.objects.filter(username=name).exists():
        User.objects.create_user(name, f'{name}@example.com', 'password123')
        print(f'{name} created')
"