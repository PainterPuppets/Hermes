# coding: utf-8
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.contenttypes.models import ContentType
from realtime.service import WebSocketService
from realtime.constants import WebSocketChannel
from user.serializers import UserMiniSerializer


def push_signal(sender, instance, created, **kwargs):
    from message.serializers import MessageSerializer
    if not created:
        return

    user = instance.receiver
    channel_name = WebSocketChannel.MESSAGE_RECIEVE + str(user.id)
    source = UserMiniSerializer(instance.source).data
    message = {
        'source_type': instance.source_type,
        'source': source,
        'is_recieved': instance.is_recieved,
        'message': MessageSerializer(instance.message).data,
    }

    WebSocketService.push_message(channel_name, message)


def fanout_message(sender, instance, created, **kwargs):
    from message.models import Signal
    if not created:
        return
    
    channel = sender.channel
    signals = []
    for user in channel.members:
        signals.append(Signal(
            receiver=user,
            channel=channel,
            is_recieved=(user != sender.user),
            message=sender
        ))

    Signal.objects.bulk_create(signals)
