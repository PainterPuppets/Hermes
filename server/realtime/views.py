from rest_framework.response import Response
from rest_framework.viewsets import ViewSet, GenericViewSet
from rest_framework.decorators import api_view, permission_classes, list_route
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from realtime.service import WebSocketService
from realtime.permissions import WebSocketPermission


class RealtimeViewSet(GenericViewSet):
    permission_classes = (WebSocketPermission, )

    @list_route(methods=['GET'], permission_classes=[IsAuthenticated])
    def config(self, request, format=None):
        websocket_data = WebSocketService.get_websocket_data(request.user)

        return Response(websocket_data)
