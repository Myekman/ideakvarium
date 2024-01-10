from django.urls import path
from .views import ExampleView

urlpatterns = [
    path('fiskar', ExampleView.as_view(), name='example'),
]