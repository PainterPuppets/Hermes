from django.test import TestCase
from django.contrib.auth.models import User
from message.services import ChannelService
from message.models import Channel

# Create your tests here.


class ChannelServiceTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user('user')
        self.other = User.objects.create_user('other')

    def test_create_private_channel(self):
        channel = ChannelService.create_private_channel(self.user, self.other)
        self.assertEqual(Channel.objects.filter(id=channel.id).exists(), True)
        channel_member_ids = list(Channel.objects.filter(id=channel.id).first().members.values_list('id', flat=True))
        self.assertEqual(channel_member_ids, [self.user.id, self.other.id])

    def test_get_private_channel(self):
        channel = ChannelService.create_private_channel(self.user, self.other)
        self.assertEqual(Channel.objects.filter(id=channel.id).exists(), True)

        get_channel = ChannelService.get_private_channel(self.user, self.other)
        self.assertEqual(get_channel, channel)

    def test_get_or_create_private_channel(self):
        channel, created = ChannelService.get_or_create_private_channel(self.user, self.other)

        self.assertEqual(created, True)
        self.assertEqual(Channel.objects.all().count(), 1)

        get_channel = ChannelService.get_private_channel(self.user, self.other)
        self.assertEqual(get_channel, channel)

        channel, created = ChannelService.get_or_create_private_channel(self.user, self.other)
        
        self.assertEqual(created, False)
        self.assertEqual(Channel.objects.all().count(), 1)
