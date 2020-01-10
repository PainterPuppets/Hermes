# coding: utf-8
import json

from rest_framework.test import APIClient
from django.contrib.auth.models import User
from django.test import TestCase
from django.conf import settings


class RealTimeAPITests(TestCase):
    def setUp(self):
        self.client = APIClient(enforce_csrf_checks=True)

        self.user = User.objects.create_user('user')
        self.user_client = APIClient(enforce_csrf_checks=True)
        self.user_client.force_authenticate(user=self.user)

        self.other = User.objects.create_user('other')
        self.other_user_client = APIClient(enforce_csrf_checks=True)
        self.other_user_client.force_authenticate(user=self.other)

    def test_get_realtime_data(self):
        # guest get realtime data
        response = self.client.get('/api/realtime/config/', format='json')
        self.assertEqual(response.status_code, 403)

        response = self.user_client.get('/api/realtime/config/', format='json')
        self.assertEqual(response.status_code, 200)
        result = json.loads(response.content)
        self.assertEqual(result['user'], self.user.id)
