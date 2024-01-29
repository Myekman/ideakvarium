from django.urls import path
# from .views import ExampleView
from .views import FishList
from .views import FishDetail
from .views import like_unlike_fish, get_user_info, get_user_liked_fishes

urlpatterns = [
    path('user/', get_user_info, name='get_user_info'),
    path('fiskar/', FishList.as_view()),
    path('fiskar/<int:pk>', FishDetail.as_view()),
    path('fiskar/<int:pk>/like-unlike/', like_unlike_fish, name='like-unlike-fish'),
    path('liked-fishes/', get_user_liked_fishes, name='get_user_liked_fishes'),
]