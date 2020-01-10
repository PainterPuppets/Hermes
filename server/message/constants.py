
class MessageType(object):
    TEXT = 1
    IMAGE = 2
    FILE = 3


MESSAGE_TYPE_CHOICES = (
    (MessageType.TEXT, '文字'),
    (MessageType.IMAGE, '图片'),
    (MessageType.FILE, '文件'),
)
