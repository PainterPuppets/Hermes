# coding: utf-8
import six
import hmac
import time
import logging
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
    def generate_token(cls, user, timestamp, info="", secret=settings.CENTRIFUGE_SECRET):
        user = str(user)

        sign = hmac.new(six.b(secret), digestmod=sha256)
        sign.update(six.b(user))
        sign.update(six.b(timestamp))
        sign.update(six.b(info))
        return sign.hexdigest()

    @classmethod
    def get_websocket_data(cls, user):
        timestamp = str(int(time.time()) * 1000000)
        token = cls.generate_token(user.id, timestamp)
        url = '%s/connection' % settings.CENTRIFUGE_ADDRESS

        return dict(user=user.id, timestamp=timestamp, token=token, url=url, env=WEBSOCKET_ENV)

    @classmethod
    def push_message(cls, channel_name, message):
        logger.info('push message to %s' % channel_name)
        channel_name = cls.get_channel_name(channel_name)

        print('push message to ' + channel_name)
        try:
            cls.client.publish(channel_name, message)
        except Exception as e:
            logger.error('Socket server has error', repr(e))
