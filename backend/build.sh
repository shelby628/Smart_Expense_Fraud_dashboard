#!/usr/bin/env bash
set -o errexit
pip install -r requirements.txt
mkdir -p staticfiles
python manage.py collectstatic --no-input
python manage.py migrate
```

Also the 404 on `/` suggests the health check isn't registering. Test by visiting this URL directly in your browser:
```
https://smart-expense-fraud-dashboard.onrender.com/