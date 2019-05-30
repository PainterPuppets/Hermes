# coding: utf-8
import json

from rest_framework.test import APIClient
from testing.testcases import TestCase
from gatekeeper.models import GateKeeper
from gatekeeper.constants import GKType
from gatekeeper.helper import gk_add_permission
from django.conf import settings


class WebSocketAPITests(TestCase):
    def setUp(self):
        self.gk_websocket = GateKeeper.objects.create(name='notification-websocket', type=GKType.PERMISSION)

        self.client = APIClient(enforce_csrf_checks=True)

        self.user = self.createUser('authenticated@jz.com')
        self.user_client = APIClient(enforce_csrf_checks=True)
        self.user_client.force_authenticate(user=self.user)

        self.other_user = self.createUser('others@jz.com')
        self.other_user_client = APIClient(enforce_csrf_checks=True)
        self.other_user_client.force_authenticate(user=self.other_user)

    def test_get_websocket_data(self):
        # guest get websocket data
        response = self.client.get('/api/websocket/', format='json')
        self.assertEqual(response.status_code, 403)

        response = self.user_client.get('/api/websocket/', format='json')
        self.assertEqual(response.status_code, 200)
        result = json.loads(response.content)
        self.assertEqual(result['user'], self.user.id)
