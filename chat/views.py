# coding: utf-8
from django.contrib.auth.models import User, Group
from django.contrib.auth import login as django_login, authenticate, logout as django_logout

from rest_framework.decorators import api_view, permission_classes, list_route
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.viewsets import ViewSet

from user.serializers import UserSerializer, SignupSerializer, LoginSerializer, UserSerializerForMe
from chat.serializers import PrivateChatSerializer

from message.models import Message, Signal
from message.services import MessageService


class ChatViewSet(ViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    # queryset = User.objects.all().order_by('-date_joined')
    # serializer_class = UserSerializer

    @list_route(methods=['POST'], permission_classes=[IsAuthenticated])
    def private(self, request):
        serializer = PrivateChatSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        target_id = serializer.validated_data['target_id']
        content = serializer.validated_data['content']

        if not User.objects.filter(id=target_id).exists():
            return Response({u'detail': u'用户不存在'}, status=status.HTTP_404_NOT_FOUND)

        target = User.objects.get(id=target_id)
        MessageService.send_private_message(target, request.user, content)
