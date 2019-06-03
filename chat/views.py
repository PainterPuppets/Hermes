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

    @list_route(methods=['POST'], permission_classes=[IsAuthenticated], url_path='message/(?P<channel_id>[^/.]+)')
    def message(self, request, channel_id=None):
        try:
            channel = ChannelService.get_channel_from_id(channel_id)
        except Channel.DoesNotExist:
            return Response({u'detail': u'channel不存在'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ChatSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        content = serializer.validated_data['content']

        message = channel.send_message(request.user, content)
        return Response(MessageSerializer(message).data, status=status.HTTP_200_OK)

    
    @list_route(methods=['GET'], permission_classes=[IsAuthenticated], url_path='directs')
    def directs(self, request):
        directs = Direct.objects.filter(user=request.user, is_close=False)
        serializer = DirectSerializer(directs, context={'request': request}, many=True)
        return Response(serializer.data)


    @list_route(methods=['GET'], permission_classes=[IsAuthenticated], url_path='direct/(?P<id>[^/.]+)')
    def direct(self, request, id=None):
        if not ChannelService.check_channel_exist(id):
            return Response({u'detail': u'channel不存在'}, status=status.HTTP_404_NOT_FOUND)

        channel = ChannelService.get_channel_from_id(id)
        direct = channel.direct_set.get(user=request.user)
        return Response(DirectSerializer(direct, context={'request': request}).data)


    @list_route(methods=['Delete'], permission_classes=[IsAuthenticated], url_path='direct/(?P<id>[^/.]+)')
    def direct_delete(self, request, id=None):
        if not ChannelService.check_channel_exist(id):
            return Response({u'detail': u'channel不存在'}, status=status.HTTP_404_NOT_FOUND)

        channel = ChannelService.get_channel_from_id(id)
        direct = channel.direct_set.get(user=request.user)
        direct.is_close = True
        direct.save()

        return Response(DirectSerializer(direct, context={'request': request}).data)
    
    @list_route(methods=['POST'], permission_classes=[IsAuthenticated], url_path='direct_read/(?P<id>[^/.]+)')
    def direct_read(self, request, id=None):
        if not ChannelService.check_channel_exist(id):
            return Response({u'detail': u'channel不存在'}, status=status.HTTP_404_NOT_FOUND)

        channel = ChannelService.get_channel_from_id(id)
        channel.signal_set.filter(receiver=request.user).update(is_received=True)

        return Response(status=status.HTTP_200_OK)
