from django.shortcuts import render, get_object_or_404
from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .models import FarmerRating
from .serializers import (
    UserSerializer, FarmerSerializer, BuyerSerializer,
    UserRegistrationSerializer, FarmerRatingSerializer
)

User = get_user_model()

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user

class FarmerListView(generics.ListAPIView):
    queryset = User.objects.filter(user_type='farmer')
    serializer_class = FarmerSerializer
    permission_classes = [permissions.AllowAny]

class FarmerDetailView(generics.RetrieveAPIView):
    queryset = User.objects.filter(user_type='farmer')
    serializer_class = FarmerSerializer
    permission_classes = [permissions.AllowAny]

class FarmerRatingViewSet(viewsets.ModelViewSet):
    serializer_class = FarmerRatingSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        farmer_id = self.kwargs.get('farmer_id')
        return FarmerRating.objects.filter(farmer_id=farmer_id)
    
    def create(self, request, *args, **kwargs):
        farmer_id = self.kwargs.get('farmer_id')
        farmer = get_object_or_404(User, id=farmer_id, user_type='farmer')
        
        # Check if user is a buyer
        if request.user.user_type != 'buyer':
            return Response(
                {"detail": "Only buyers can rate farmers."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Check if buyer has already rated this farmer
        existing_rating = FarmerRating.objects.filter(
            farmer=farmer,
            buyer=request.user
        ).first()
        
        if existing_rating:
            # Update existing rating
            serializer = self.get_serializer(existing_rating, data=request.data, partial=True)
        else:
            # Create new rating
            serializer = self.get_serializer(data=request.data)
        
        serializer.is_valid(raise_exception=True)
        serializer.save(farmer=farmer, buyer=request.user)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
