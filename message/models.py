# coding: utf-8
import json

from django.db import models
from django.contrib.auth.models import User

class Message(models.Model):
    user = models.ForeignKey(User, on_delete=None)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
