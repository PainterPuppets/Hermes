from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from realtime.service import WebSocketService
from realtime.permissions import WebSocketPermission


class RealtimeViewSet(ViewSet):
    permission_classes = (WebSocketPermission, )

    def get(self, request, format=None):
        websocket_data = WebSocketService.get_websocket_data(request.user)

        return Response(websocket_data)
