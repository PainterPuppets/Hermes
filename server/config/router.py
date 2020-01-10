from django.conf.urls import url, include
from rest_framework import routers
from user.views import UserViewSet
from chat.views import ChatViewSet
from realtime.views import RealtimeViewSet

router = routers.DefaultRouter()
router.register(r'user', UserViewSet)
router.register(r'realtime', RealtimeViewSet, base_name="realtime")
router.register(r'chat', ChatViewSet, base_name="chat")
