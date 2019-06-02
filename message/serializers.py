from rest_framework import serializers
from message.models import Message, Signal, Channel
from message.services import ChannelService
from user.serializers import UserSerializer

class MessageSerializer(serializers.ModelSerializer):
    channel_id = serializers.SerializerMethodField(read_only=True)
    user = UserSerializer()

    class Meta:
        model = Message
        fields = (
            'id',
            'channel_id',
            'content',
            'time',
            'user',
        )

    def get_channel_id(self, obj):
        return ChannelService.get_channel_id(obj.channel)


class SignalSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='message.id')
    content = serializers.CharField(source='message.content')
    time = serializers.CharField(source='message.time')
    user = UserSerializer(source='message.user')
    channel_id = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Signal
        fields = (
            'id',
            'channel_id',
            'content',
            'time',
            'is_received',
            'user',
        )

    def get_channel_id(self, obj):
        return ChannelService.get_channel_id(obj.channel)
