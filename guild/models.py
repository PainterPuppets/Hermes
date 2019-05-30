# coding: utf-8
import json

from django.db import models
from django.contrib.auth.models import User
from message.models import Message

class Guild(models.Model):
    name = models.TextField()
    avatar = models.ImageField(blank=True, upload_to="avatars/")
    creator = models.ForeignKey(User, on_delete=None, related_name="create_guilds")
    members = models.ManyToManyField(User, related_name="join_guilds")
    created_at = models.DateTimeField(auto_now_add=True)


class Role(models.Model):
    name = models.TextField()
    guild = models.ForeignKey(Guild, on_delete=None)
    color = models.TextField()


class Channel(models.Model):
    name = models.TextField()
    messages = models.ManyToManyField(Message, blank=True)

    
class Categorie(models.Model):
    name = models.TextField()
    guild = models.ForeignKey(Guild, on_delete=None)
    channels = models.ManyToManyField(Channel)