from django.urls import path
# from .views import ExampleView
from .views import FishList
from .views import FishDetail
from .views import like_unlike_fish, get_user_info

urlpatterns = [
    path('user/', get_user_info, name='get_user_info'),
    path('fiskar/', FishList.as_view()),
    path('fiskar/<int:pk>', FishDetail.as_view()),
    path('fiskar/<int:pk>/like-unlike/', like_unlike_fish, name='like-unlike-fish'), #anropa denna endpoint från frontend-koden när en användare interagerar med like/unlike-knapparna, oavsett om det är på listvyn eller detaljvyn.
]