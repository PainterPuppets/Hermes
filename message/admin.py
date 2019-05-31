#!/usr/bin/env python
# encoding: utf-8

from django.contrib import admin
from message.models import Message, Signal


class MessageAdmin(admin.ModelAdmin):
    list_display = ('user', 'content', 'time')

class SignalAdmin(admin.ModelAdmin):
    list_display = ('receiver', 'channel', 'message')


admin.site.register(Message, MessageAdmin)
admin.site.register(Signal, SignalAdmin)
