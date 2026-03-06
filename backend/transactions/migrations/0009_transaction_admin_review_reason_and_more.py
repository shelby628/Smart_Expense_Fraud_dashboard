import django.utils.timezone
from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('transactions', '0007_rename_uploaded_at_prediction_created_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='transaction',
            name='admin_review_reason',
            field=models.TextField(blank=True, help_text='Reason provided by admin when blocking', null=True),
        ),
        migrations.AddField(
            model_name='transaction',
            name='admin_review_status',
            field=models.CharField(choices=[('pending', 'Pending Review'), ('approved', 'Approved'), ('blocked', 'Blocked')], default='pending', max_length=20),
        ),
    ]