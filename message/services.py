from message.models import Message, Signal
from django.contrib.contenttypes.models import ContentType

class MessageService(object):

    @classmethod
    def _send_message(cls, user, content):
        message = Message.objects.create(
            user=user,
            content=content,
        )

        return message


    @classmethod
    def send_private_message(cls, reciever, sender, content):
        message = cls._send_message(sender, content)

        Signal.objects.create(
            receiver=reciever,
            source_type=ContentType.objects.get_for_model(sender),
            source_id=sender.id,
            message=message,
        )

