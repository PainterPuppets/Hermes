# coding: utf-8
from django.contrib.auth.models import User, Group
from django.contrib.auth import login as django_login, authenticate, logout as django_logout

from rest_framework.decorators import api_view, permission_classes, list_route
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.viewsets import ViewSet

from user.serializers import UserSerializer, SignupSerializer, LoginSerializer, UserSerializerForMe
from chat.serializers import ChatSerializer, DirectSerializer, DirectCreateSerializer

from message.models import Message, Signal, Direct, Channel
from message.services import MessageService, ChannelService
from message.serializers import MessageSerializer


class ChatViewSet(ViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """

    @list_route(methods=['POST'], permission_classes=[IsAuthenticated], url_path='message/(?P<channel_id>[0-9]+)')
    def message(self, request, channel_id=None):
        try:
            channel = Channel.objects.get(id=channel_id)
        except Channel.DoesNotExist:
            return Response({u'detail': u'channel不存在'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ChatSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        content = serializer.validated_data['content']

        channel.send_message(request.user, content)

    
    @list_route(methods=['GET'], permission_classes=[IsAuthenticated])
    def directs(self, request):
        directs = Direct.objects.filter(user=request.user, is_close=False)
        serializer = DirectSerializer(directs, context={'request': request}, many=True)
        return Response(serializer.data)


    @list_route(methods=['GET'], permission_classes=[IsAuthenticated], url_path='direct/(?P<user_id>[0-9]+)')
    def direct(self, request, user_id=None):
        try:
            target = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({u'detail': u'未找到对应的用户'}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        channel = ChannelService.get_or_create_private_channel(user, target)
        try:
            direct = Direct.objects.get(user=user, channel=channel)
            direct.is_close = False
            direct.save()

        except Direct.DoesNotExist:
            direct = Direct.objects.create(user=user, channel=channel)

        return Response(DirectSerializer(direct, context={'request': request}).data)
