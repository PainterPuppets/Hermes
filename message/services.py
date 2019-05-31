from message.models import Message, Signal, Channel, Direct
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import User


class ChannelService(object):
    
    @classmethod
    def get_or_create_private_channel(cls, user1, user2):
        channel = Channel.objects.filter(
            is_private=True,
            members__in=[user1, user2]
        )
        if channel.exists():
            return channel.first(), False

        channel = Channel.objects.create(
            is_private=True,
            members=[user1, user2]
        )

        # channel.members.add(user1, user2)
        directs = []
        for user in [user1, user2]:
            directs.append(Direct(user=user, channel=channel))

        Direct.objects.bulk_create(directs)

        return channel, True

class MessageService(object):

    @classmethod
    def send_private_message(cls, reciever, sender, content):
        channel, created = ChannelService.get_or_create_private_channel(sender, reciever)
        message = cls._send_message(sender, content, channel)


