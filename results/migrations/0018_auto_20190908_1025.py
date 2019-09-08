# Generated by Django 2.2.5 on 2019-09-08 09:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('results', '0017_event'),
    ]

    operations = [
        migrations.AlterField(
            model_name='crew',
            name='club_id',
            field=models.ForeignKey(default=99999, on_delete=django.db.models.deletion.CASCADE, related_name='crews', to='results.Club'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='crew',
            name='event_id',
            field=models.ForeignKey(default=99999, on_delete=django.db.models.deletion.CASCADE, related_name='crews', to='results.Event'),
            preserve_default=False,
        ),
    ]
