from django.contrib import admin
from .models import Fish

@admin.register(Fish)
class FishAdmin(admin.ModelAdmin):
    list_display = ('id', 'fish_type', 'message', 'created_at', 'user', 'like_count')
