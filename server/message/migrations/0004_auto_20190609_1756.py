# Generated by Django 2.1 on 2019-06-09 09:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('message', '0003_auto_20190603_1043'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='file',
            field=models.FileField(blank=True, null=True, upload_to='static/user_avatars/'),
        ),
        migrations.AddField(
            model_name='message',
            name='type',
            field=models.FileField(choices=[(1, '文字'), (2, '图片'), (3, '文件')], default=1, upload_to=''),
        ),
    ]