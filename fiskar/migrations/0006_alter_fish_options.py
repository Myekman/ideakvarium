# Generated by Django 5.0.1 on 2024-03-01 07:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('fiskar', '0005_fish_name'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='fish',
            options={'ordering': ['-created_at']},
        ),
    ]
