# coding: utf-8
import json

from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db.models.signals import post_save
from message.listener import push_signal, fanout_message


class Channel(models.Model):
    members = models.ManyToManyField(User, related_name="joined_channel_set")
    is_private = models.BooleanField(default=False)
    create_at = models.DateTimeField(auto_now_add=True)
    last_activity_at = models.DateTimeField(auto_now_add=True)

    def send_message(self, sender, content):
        Message.objects.create(
            user=sender,
            content=content,
            channel=self,
        )

        self.last_activity_at = timezone.now()
        self.save()


class Message(models.Model):
    user = models.ForeignKey(User, on_delete=None)
    channel = models.ForeignKey(Channel, on_delete=None)
    content = models.TextField()
    time = models.DateTimeField(auto_now_add=True)


class Signal(models.Model):
    receiver = models.ForeignKey(User, on_delete=None)
    channel = models.ForeignKey(Channel, on_delete=None)
    is_recieved = models.BooleanField(default=False)
    message = models.ForeignKey(Message, on_delete=None)


class Direct(models.Model):
    user = models.ForeignKey(User, on_delete=None, related_name="direct_messages")
    channel = models.ForeignKey(Channel, on_delete=None)
    is_close = models.BooleanField(default=False)


post_save.connect(fanout_message, sender=Message)
post_save.connect(push_signal, sender=Signal)