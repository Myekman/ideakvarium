import django_filters
from .models import Fish

class FishFilter(django_filters.FilterSet):
    class Meta:
        model = Fish
        fields = {
            'like_count': ['gt', 'lte'] #gt för större än, lte för mindre än
        }