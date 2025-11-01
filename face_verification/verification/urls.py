from django.urls import path
from . import views

urlpatterns = [
    path('verify/', views.FaceVerificationView.as_view(), name='face-verify'),
]