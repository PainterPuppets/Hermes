# coding: utf-8
import json

from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db.models.signals import post_save
from message.listener import push_signal, fanout_message
from message.constants import MessageType, MESSAGE_TYPE_CHOICES


class Channel(models.Model):
    members = models.ManyToManyField(User, related_name="joined_channel_set")
    is_private = models.BooleanField(default=False)
    create_at = models.DateTimeField(auto_now_add=True)
    last_activity_at = models.DateTimeField(auto_now_add=True)

    def send_message(self, sender, type, content='', file=None):
        message = Message.objects.create(
            user=sender,
            type=type,
            content=content,
            file=file,
            channel=self,
        )

        if self.is_private:
            for direct in self.direct_set.all():
                direct.active()

        self.last_activity_at = timezone.now()
        self.save()

        return message


class Message(models.Model):
    user = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    channel = models.ForeignKey(Channel, null=True, on_delete=models.SET_NULL)
    content = models.TextField()
    file = models.FileField(null=True, blank=True, upload_to="static/files/")
    type = models.IntegerField(choices=MESSAGE_TYPE_CHOICES, default=MessageType.TEXT)
    time = models.DateTimeField(auto_now_add=True)


class Signal(models.Model):
    receiver = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    channel = models.ForeignKey(Channel, null=True, on_delete=models.SET_NULL)
    is_received = models.BooleanField(default=False)
    message = models.ForeignKey(Message, on_delete=models.CASCADE)


class Direct(models.Model):
    user = models.ForeignKey(User, null=True, on_delete=models.SET_NULL, related_name="direct_messages")
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE)
    is_close = models.BooleanField(default=False)

    def active(self):
        if not self.is_close:
            return

        self.is_close = False
        self.save()


post_save.connect(fanout_message, sender=Message)
post_save.connect(push_signal, sender=Signal)