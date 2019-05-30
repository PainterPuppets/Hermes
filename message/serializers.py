from rest_framework import serializers
from message.models import Message

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = (
            'content',
            'time',
        )
