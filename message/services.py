from message.models import Message, Signal, Channel, Direct
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import User

import re


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


    @classmethod
    def check_channel_exist(cls, id):
        pattern = re.compile(r'([\s\S]*)#([\s\S]*)')
        result = re.search(pattern, id)
        if not result:
            return None

        if result[1] == 'direct' :
            pattern = re.compile(r'([\s\S]*)-([\s\S]*)')
            ids = re.search(pattern, result[2])
            users = User.objects.filter(id__in=[ids[1], ids[2]])
            channel = Channel.objects.filter(
                is_private=True,
                members__in=[users[0], users[1]]
            )
            return channel.exists()

        if result[1] == 'channel' :
            channel = Channel.objects.filter(id=result[2])
            return channel.exists()

        return False


    @classmethod
    def get_channel_from_id(cls, id):
        pattern = re.compile(r'(\w*)#(\w*)')
        result = re.search(pattern,id)
        if result[1] == 'direct' :
            pattern = re.compile(r'(\w*)-(\w*)')
            result = re.search(pattern, result[2])
            users = User.objects.filter(id__in=[result[1], result[2]])
            channel = cls.get_or_create_private_channel(users[0], users[1])
            return channel

        if result[1] == 'channel' :
            channel = Channel.objects.get(id=result[2])
            return channel
        
        return None


    @classmethod
    def get_channel_id(cls, channel):
        prefix=''
        id=''
        if channel.is_private:
            users = channel.members
            prefix = 'direct'
            id = users[0].id + '-' + users[1].id
        else:
            prefix = 'channel'
            id = channel.id
        
        return prefix + '#' + id


class MessageService(object):

    @classmethod
    def send_private_message(cls, reciever, sender, content):
        channel, created = ChannelService.get_or_create_private_channel(sender, reciever)
        message = cls._send_message(sender, content, channel)


