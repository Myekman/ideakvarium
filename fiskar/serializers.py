# serializers.py
from rest_framework import serializers
from .models import Fish

class FishSerializer(serializers.ModelSerializer):
    likes_count = serializers.SerializerMethodField()

    class Meta:
        model = Fish
        fields = ['id', 'fish_type', 'message', 'created_at', 'user', 'likes_count']

    def get_likes_count(self, obj):
        return obj.likes.count()