# Generated by Django 3.0.5 on 2020-04-29 20:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0003_auto_20200430_0156'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='slug',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
