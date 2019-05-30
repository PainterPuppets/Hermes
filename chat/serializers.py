from rest_framework import serializers
from message.models import Message

class PrivateChatSerializer(serializers.Serializer):
    target_id = serializers.CharField()
    content = serializers.CharField()