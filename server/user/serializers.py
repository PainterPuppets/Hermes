from django.contrib.auth.models import User, Group
from rest_framework import serializers



class UserSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'avatar_url',
        )
    
    def get_avatar_url(self, obj):
        if obj.profile.avatar :
            return obj.profile.avatar.url

        return 'https://api.adorable.io/avatars/285/' + obj.username + '.png'


class UserSerializerForMe(UserSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'email',
            'is_authenticated',
            'is_superuser',
            'avatar_url',
        )


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()


class SignupSerializer(serializers.Serializer):
    email = serializers.CharField()
    username = serializers.CharField()
    password = serializers.CharField()


class AvatarSerializer(serializers.Serializer):
    avatar = serializers.ImageField()

    def save(self, **kwargs):
        user = self.context['user']
        avatar = self.validated_data['avatar']
        user.profile.avatar = avatar
        user.save()