# serializers.py
from rest_framework import serializers
from .models import Fish
from .models import Like

class FishSerializer(serializers.ModelSerializer):
    likes_count = serializers.SerializerMethodField()

    class Meta:
        model = Fish
        fields = ['id', 'fish_type', 'message', 'created_at', 'user', 'likes_count']

    def get_likes_count(self, obj):
        # Använder 'related_name' för att räkna "likes"
        return obj.likes.count()
    

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['id', 'user', 'fish', 'created_at']