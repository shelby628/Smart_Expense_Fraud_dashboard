import os
import sys
import traceback
from django.core.management import execute_from_command_line

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

try:
    execute_from_command_line(["manage.py", "makemigrations", "core", "transactions"])
except Exception:
    with open("traceback.log", "w") as f:
        traceback.print_exc(file=f)
    print("Error occurred. Check traceback.log")
