from rest_framework import serializers
from message.models import Message, Signal, Channel
from message.services import ChannelService
from user.serializers import UserSerializer


class MessageFileSerializer(serializers.BaseSerializer):
    def to_representation(self, file):
        if not file:
            return {
                'name': '',
                'size': '',
                'url': '',
            }

        return {
            'name': file.name,
            'size': '',
            'url': file.url,
        }


class MessageSerializer(serializers.ModelSerializer):
    channel_id = serializers.SerializerMethodField(read_only=True)
    file = serializers.SerializerMethodField(read_only=True)
    user = UserSerializer()

    class Meta:
        model = Message
        fields = (
            'id',
            'channel_id',
            'content',
            'time',
            'user',
            'type',
            'file',
        )

    def get_channel_id(self, obj):
        return ChannelService.get_channel_id(obj.channel)

    def get_file(self, obj):
        return MessageFileSerializer(obj.file).data

class SignalSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='message.id')
    content = serializers.CharField(source='message.content')
    time = serializers.CharField(source='message.time')
    user = UserSerializer(source='message.user')
    type = serializers.IntegerField(source='message.type')
    channel_id = serializers.SerializerMethodField(read_only=True)
    file = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Signal
        fields = (
            'id',
            'channel_id',
            'content',
            'time',
            'is_received',
            'user',
            'type',
            'file',
        )

    def get_channel_id(self, obj):
        return ChannelService.get_channel_id(obj.channel)

    def get_file(self, obj):
        return MessageFileSerializer(obj.message.file).data