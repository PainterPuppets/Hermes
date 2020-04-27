# coding: utf-8
import six
import hmac
import time
import logging
import jwt
from hashlib import sha256
from cent import Client

from django.conf import settings
from realtime.constants import WEBSOCKET_ENV

logger = logging.getLogger(__name__)


class WebSocketClient(object):
    client = None

    def __new__(cls, *args, **kw):
        if not cls.client:
            cls.client = Client(
                settings.CENTRIFUGE_ADDRESS,
                settings.CENTRIFUGE_SECRET,
                timeout=settings.CENTRIFUGE_TIMEOUT,
            )
        return cls.client


class WebSocketService(object):
    client = WebSocketClient()

    @classmethod
    def get_channel_name(cls, text):
        return WEBSOCKET_ENV + text

    @classmethod
    def generate_token(cls, user, timestamp, secret=settings.CENTRIFUGE_SECRET):
        claims = {"sub": str(user), "exp": timestamp}
        # print('233')
        token = jwt.encode(claims, secret).decode()

        return token

    @classmethod
    def get_websocket_data(cls, user):
        timestamp = int(time.time()) + 300
        token = cls.generate_token(user.id, timestamp)

        return dict(user=user.id, timestamp=timestamp, token=token, env=WEBSOCKET_ENV)

    @classmethod
    def push_message(cls, channel_name, message):
        logger.info('push message to %s' % channel_name)
        channel_name = cls.get_channel_name(channel_name)
        print('send %s to %s' % (message, channel_name))

        # try:
        cls.client.publish(channel_name, message)
        # except Exception as e:
        #     logger.error('Socket server has error', repr(e))
