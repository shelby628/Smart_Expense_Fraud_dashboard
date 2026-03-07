#!/usr/bin/env bash
set -o errexit
pip install django-ratelimit==4.1.0
pip install -r requirements.txt
mkdir -p staticfiles
python manage.py collectstatic --no-input
python manage.py migrate --fake-initial
python manage.py migrate
python manage.py create_initial_users