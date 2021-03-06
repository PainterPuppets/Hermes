from rest_framework import serializers
from message.models import Message, Direct
from message.serializers import MessageSerializer, SignalSerializer
from message.services import ChannelService
from user.serializers import UserSerializer

class ChatSerializer(serializers.Serializer):
    file = serializers.FileField(required=False)
    content = serializers.CharField(required=False)
    type = serializers.CharField()

class DirectCreateSerializer(serializers.Serializer):
    target_id = serializers.IntegerField()

class DirectSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField(read_only=True)
    target = serializers.SerializerMethodField(read_only=True)
    messages = serializers.SerializerMethodField(read_only=True)
    last_activity_at = serializers.CharField(source='channel.last_activity_at')

    class Meta:
        model = Direct
        fields = (
            'id',
            'target',
            'messages',
            'last_activity_at',
        )
    
    def get_id(self, obj):
        return ChannelService.get_channel_id(obj.channel)

    def get_target(self, obj):
        user = self.context['request'].user
        target = obj.channel.members.exclude(id=user.id).first()
        return UserSerializer(target).data
    
    def get_messages(self, obj):
        user = self.context['request'].user
        signals = obj.channel.signal_set.filter(receiver=user)
        return SignalSerializer(signals, many=True).data
