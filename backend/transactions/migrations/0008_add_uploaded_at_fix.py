from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('transactions', '0007_rename_uploaded_at_prediction_created_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='transaction',
            name='uploaded_at',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
    ]