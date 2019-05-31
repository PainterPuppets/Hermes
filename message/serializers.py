from rest_framework import serializers
from message.models import Message, Signal
from user.serializers import UserSerializer

class MessageSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Message
        fields = (
            'content',
            'time',
            'user',
        )


class SignalSerializer(serializers.ModelSerializer):
    content = serializers.CharField(source='message.content')
    time = serializers.CharField(source='message.time')
    user = UserSerializer(source='message.user')

    class Meta:
        model = Signal
        fields = (
            'content',
            'time',
            'is_recieved',
            'user',
        )