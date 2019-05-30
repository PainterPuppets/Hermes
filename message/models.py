# coding: utf-8
import json

from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db.models.signals import post_save
from message.listener import push_signal


class Message(models.Model):
    user = models.ForeignKey(User, on_delete=None)
    content = models.TextField()
    time = models.DateTimeField(auto_now_add=True)


class Signal(models.Model):
    receiver = models.ForeignKey(User, on_delete=None)
    source = GenericForeignKey('source_type', 'source_id')
    source_id = models.PositiveIntegerField()
    source_type = models.ForeignKey(ContentType, on_delete=None)
    is_recieved = models.BooleanField(default=False)
    message = models.ForeignKey(Message, on_delete=None)


post_save.connect(push_signal, sender=Signal)