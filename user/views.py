# coding: utf-8
from django.contrib.auth.models import User, Group
from django.contrib.auth import login as django_login, authenticate, logout as django_logout

from rest_framework.decorators import api_view, permission_classes, list_route
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework import viewsets, status

from user.serializers import UserSerializer, SignupSerializer, LoginSerializer, UserSerializerForMe


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

    def list(self, request):
        if not request.user.is_authenticated:
            return Response({u'detail': u'请登录后再试' }, status.HTTP_403_FORBIDDEN)

        return Response(UserSerializerForMe(request.user).data, status=status.HTTP_200_OK)

    @list_route(methods=['GET'], permission_classes=[IsAuthenticated])
    def search(self, request):
        username = request.query_params.get('username', '')
        query = User.objects.filter(username__contains=username)

        return Response(UserSerializer(query, many=True).data)


    @list_route(methods=['POST'])
    def login(self, request):
        '''
        handle user's login when POST to /api/user/login/
        '''
        if request.user.is_authenticated:
            return Response(UserSerializerForMe(request.user).data, status=status.HTTP_200_OK)
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        if not User.objects.filter(username__iexact=username).exists():
            return Response({u'detail': u'您输入的账号不存在，请重新输入', u'field': u'username'}, status=status.HTTP_401_UNAUTHORIZED)

        user = authenticate(username=username, password=password)
        if user is None:
            return Response({u'detail': u'您的密码有误，请重新输入', u'field': 'password'}, status.HTTP_401_UNAUTHORIZED)

        django_login(request, user)
        request.session.set_expiry(60 * 60 * 24 * 60)

        return Response(UserSerializerForMe(request.user).data, status=status.HTTP_200_OK)
    
    @list_route(methods=['POST'])
    def signup(self, request):
        '''
        handle user's login when POST to /api/user/signup/
        '''
        serializer = SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        
        if User.objects.filter(email__iexact=email).exists():
            return Response({u'detail': u'该email已被注册，请重新输入', u'field': u'email'}, status=status.HTTP_401_UNAUTHORIZED)

        if User.objects.filter(username__iexact=username).exists():
            return Response({u'detail': u'该username已被注册，请重新输入', u'field': u'username'}, status=status.HTTP_401_UNAUTHORIZED)

        user = User.objects.create_user(
            email=email,
            username=username,
            password=password,
        )

        return Response({u'detail': u'注册成功'}, status=status.HTTP_200_OK)

    @list_route(methods=['POST'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        '''
        handle user's logout when POST to /api/accounts/logout/
        '''
        django_logout(request)
        return Response(status=status.HTTP_200_OK)
