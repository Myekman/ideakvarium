from rest_framework.decorators import api_view, permission_classes
from rest_framework import generics,permissions
from rest_framework.response import Response
from rest_framework import status
from .models import Fish
from .serializers import FishSerializer
from backend.permissions import IsOwnerOrReadOnly



@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def like_unlike_fish(request, pk):
    try:
        fish = Fish.objects.get(pk=pk)
    except Fish.DoesNotExist:
        return Response({"detail": "Fish not found"}, status=status.HTTP_404_NOT_FOUND)

    user = request.user

    # Check if the user already liked the fish
    existing_like = fish.likes.filter(user=user).first()

    if existing_like:
        # User already liked the fish, unlike it
        existing_like.delete()
        return Response({"detail": "Fish unliked"}, status=status.HTTP_200_OK)
    else:
        # User did not like the fish, like it
        fish.likes.create(user=user)
        return Response({"detail": "Fish liked"}, status=status.HTTP_201_CREATED)
    

class FishList(generics.ListCreateAPIView):
    queryset = Fish.objects.all()
    serializer_class = FishSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly] # Allow GET for everyone, require authentication for POST

    def get_queryset(self):
        return Fish.objects.all()
        
        
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class FishDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Fish.objects.all()
    serializer_class = FishSerializer
    permission_classes = [IsOwnerOrReadOnly]
