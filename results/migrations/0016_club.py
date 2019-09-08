# Generated by Django 2.2.5 on 2019-09-08 08:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('results', '0015_auto_20190908_0834'),
    ]

    operations = [
        migrations.CreateModel(
            name='Club',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=30)),
                ('abbreviation', models.CharField(blank=True, max_length=5, null=True)),
                ('index_code', models.CharField(blank=True, max_length=5, null=True)),
                ('colours', models.CharField(blank=True, max_length=50, null=True)),
                ('blade_image', models.CharField(blank=True, max_length=200, null=True)),
            ],
        ),
    ]
