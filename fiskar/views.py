
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import AnonymousUser
from rest_framework import generics,permissions
from rest_framework.response import Response
from rest_framework import status
from .models import Fish
from .models import Like
from .serializers import FishSerializer
from backend.permissions import IsOwnerOrReadOnly
from rest_framework import filters
from django.db.models import Count
from django.db.models import F
from django.db import IntegrityError
# from django.views.decorators.csrf import csrf_exempt

from .serializers import UserSerializer
from django.contrib.auth.models import User


from django_filters.rest_framework import DjangoFilterBackend
from .filters import FishFilter

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_user_info(request):
    # Användaren är redan autentiserad och `request.user` är användarobjektet
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
 # Hämta alla 'Like'-objekt för den inloggade användaren
def get_user_liked_fishes(request):
    user = request.user
    liked_fishes = Like.objects.filter(user=user).values_list('fish', flat=True)
    return Response({"liked_fishes": list(liked_fishes)})


def get_user_or_guest(request):
    if request.user.is_authenticated:
        return request.user
    else:
        return User.objects.get(username='guestuser')


@api_view(['POST'])
# @csrf_exempt
@permission_classes([permissions.AllowAny])
def like_unlike_fish(request, pk):
    try:
        fish = Fish.objects.get(pk=pk)
    except Fish.DoesNotExist:
        return Response({"detail": "Fish not found"}, status=status.HTTP_404_NOT_FOUND)
  
    user = get_user_or_guest(request)
    print(f"User or guestuser obtained: {user}")

   
    if user.username == 'guestuser':
        fish.likes.create(user=user)
    elif request.user.is_authenticated:
        liked = False
        existing_like = fish.likes.filter(user=user).first()
        if existing_like:
            existing_like.delete()
        else:
            fish.likes.create(user=user)
            liked = True
            print(f"User or guest attempting to like: {user.username}") 

        fish.like_count = fish.likes.count()
        fish.save(update_fields=['like_count'])
        return Response({"like_count": fish.like_count, "is_liked": liked}, status=status.HTTP_200_OK)
    
    # Om vi når denna punkt är det en gästanvändare som har utfört åtgärden
    fish.like_count = fish.likes.count()
    fish.save(update_fields=['like_count'])
    # Skicka inte med 'is_liked' i svaret för gästanvändare

    # Skicka tillbaka relevant svar baserat på om det är 'guestuser' eller en autentiserad användare
    if user.username == 'guestuser':
        return Response({"like_count": fish.like_count}, status=status.HTTP_200_OK)
    else:
        return Response({"like_count": fish.like_count, "is_liked": liked}, status=status.HTTP_200_OK)



class FishList(generics.ListCreateAPIView):
    queryset = Fish.objects.all()
    serializer_class = FishSerializer
    permission_classes = [permissions.AllowAny] # Allow GET for everyone, require authentication for POST


    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = FishFilter #för likes_count
    search_fields = ('user__username', 'message', 'title', 'fish_type')


    #     return queryset
    def get_queryset(self):
        queryset = super().get_queryset()
        largest = self.request.query_params.get('largest', None)
        smallest = self.request.query_params.get('smallest', None)

        # Konvertera likes till en numerisk kolumn för att räkna och beräkna percentiler
        queryset = queryset.annotate(like_count=Count('likes'))

        if largest:
            # Antag att en "stor fisk" har fler likes än 90% av alla fiskar
            ninetieth_percentile = queryset.aggregate(ninetieth_percentile=Percentile('like_count', 0.9))['ninetieth_percentile']
            queryset = queryset.filter(like_count__gt=ninetieth_percentile)
        elif smallest:
            # Antag att en "liten fisk" har färre likes än 10% av alla fiskar
            tenth_percentile = queryset.aggregate(tenth_percentile=Percentile('like_count', 0.1))['tenth_percentile']
            queryset = queryset.filter(like_count__lte=tenth_percentile)

        return queryset


    def get_queryset(self):
        return Fish.objects.all()

    def perform_create(self, serializer):
        user = get_user_or_guest(self.request)
        serializer.save(user=user)
    # def perform_create(self, serializer):
    #     serializer.save(user=self.request.user)


class FishDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Fish.objects.all()
    serializer_class = FishSerializer
    permission_classes = [IsOwnerOrReadOnly]
