# coding: utf-8
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.contenttypes.models import ContentType
from realtime.service import WebSocketService
from realtime.constants import WebSocketChannel
from user.serializers import UserSerializer


def push_signal(sender, instance, created, **kwargs):
    from message.serializers import MessageSerializer, SignalSerializer
    if not created:
        return

    user = instance.receiver
    channel_name = WebSocketChannel.MESSAGE_RECEIVE + str(user.id)
    message = SignalSerializer(instance).data
    WebSocketService.push_message(channel_name, message)


def fanout_message(sender, instance, created, **kwargs):
    from message.models import Signal, Channel
    if not created:
        return
    
    channel = instance.channel
    signals = []
    for user in channel.members.all():
        Signal.objects.create(
            receiver=user,
            channel=channel,
            is_received=(user == instance.user),
            message=instance
        )
