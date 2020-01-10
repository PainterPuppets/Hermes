#!/usr/bin/env python
# encoding: utf-8

from django.contrib import admin
from message.models import Message, Signal, Channel


class MessageAdmin(admin.ModelAdmin):
    list_display = ('user', 'content', 'time')

class SignalAdmin(admin.ModelAdmin):
    list_display = ('receiver', 'channel', 'message')

class ChannelAdmin(admin.ModelAdmin):
    list_display = ('id', 'is_private')


admin.site.register(Message, MessageAdmin)
admin.site.register(Signal, SignalAdmin)
admin.site.register(Channel, ChannelAdmin)
