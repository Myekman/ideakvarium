
from rest_framework.decorators import api_view, permission_classes
from rest_framework import generics,permissions
from rest_framework.response import Response
from rest_framework import status
from .models import Fish
from .serializers import FishSerializer
from backend.permissions import IsOwnerOrReadOnly
from rest_framework import filters

from django_filters.rest_framework import DjangoFilterBackend
from .filters import FishFilter


#----------------------------------------------------------------------LIKE/UNLIKE FISH
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def like_unlike_fish(request, pk):
    try:
        fish = Fish.objects.get(pk=pk)
    except Fish.DoesNotExist:
        return Response({"detail": "Fish not found"}, status=status.HTTP_404_NOT_FOUND)

    user = request.user
    existing_like = fish.likes.filter(user=user).first()

    if existing_like:
        # user already liked teh fish, unlike it
        existing_like.delete()
        fish.like_count = fish.likes.count()  # Update like_count after unliking
        fish.save(update_fields=['like_count'])
        liked = False
        # return Response({"detail": "Fish unliked"}, status=status.HTTP_200_OK)
    else:
        # User did not like the fish, like it
        fish.likes.create(user=user)
        fish.like_count = fish.likes.count()  # Update like_count after liking
        fish.save(update_fields=['like_count'])
        liked = True

    return Response({"like_count": fish.like_count, "is_liked": liked}, status=status.HTTP_200_OK if existing_like else status.HTTP_201_CREATED)
    # return Response({"detail": "Fish liked"}, status=status.HTTP_201_CREATED)

# # Potentiell vy för QR-kod användare (icke-autentiserade)
# @api_view(['POST'])
# @permission_classes([AllowAny])
# def like_fish_via_qr(request, pk):
#     # Antag att vi har validerat QR-koden och att det är en giltig förfrågan
#     try:
#         fish = Fish.objects.get(pk=pk)
#         # Öka like_count atomärt
#         fish.like_count = F('like_count') + 1
#         fish.save()
#         # Uppdatera instansen för att få det nya värdet av like_count
#         fish.refresh_from_db()
#     except Fish.DoesNotExist:
#         return Response({"detail": "Fish not found"}, status=status.HTTP_404_NOT_FOUND)
#     return Response({"like_count": fish.like_count}, status=status.HTTP_201_CREATED)

# # Observera att i ovanstående exempel kommer vi inte att kontrollera om en användare redan har gillat fisken,
# # eftersom vi antar att icke-autentiserade användare inte har ett konto att associera med 'likes'.

class FishList(generics.ListCreateAPIView):
    queryset = Fish.objects.all()
    serializer_class = FishSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly] # Allow GET for everyone, require authentication for POST


    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = FishFilter #för likes_count
    search_fields = ('user__username', 'message', 'fish_type')


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
        serializer.save(user=self.request.user)


class FishDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Fish.objects.all()
    serializer_class = FishSerializer
    permission_classes = [IsOwnerOrReadOnly]
