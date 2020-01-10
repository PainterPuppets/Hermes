# coding: utf-8
from rest_framework import permissions


class WebSocketPermission(permissions.BasePermission):
    message = '您没有权限'

    def has_permission(self, request, view):
        if request.user.is_authenticated:
            return True

        return False
