from django.conf.urls import url, include
from rest_framework import routers
from account import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)