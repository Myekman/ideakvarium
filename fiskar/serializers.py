# serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Fish
from .models import Like


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username']  # Inkludera bara fältet 'username'


class FishSerializer(serializers.ModelSerializer):
    likes_count = serializers.SerializerMethodField()
    user = UserSerializer(read_only=True)  # Lägg till den här raden för att inkludera UserSerializer

    class Meta:
        model = Fish
        fields = ['id', 'fish_type', 'message', 'title', 'created_at', 'user', 'likes_count', 'name']

    def get_likes_count(self, obj):
        # Använder 'related_name' för att räkna "likes"
        return obj.likes.count()
    

class LikeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # Lägg till den här raden för att inkludera UserSerializer

    class Meta:
        model = Like
        fields = ['id', 'user', 'fish', 'created_at']