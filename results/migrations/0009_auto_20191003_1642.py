# Generated by Django 2.2.5 on 2019-10-03 15:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('results', '0008_auto_20190930_2138'),
    ]

    operations = [
        migrations.AddField(
            model_name='crew',
            name='did_not_finish',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='crew',
            name='did_not_start',
            field=models.BooleanField(default=False),
        ),
    ]