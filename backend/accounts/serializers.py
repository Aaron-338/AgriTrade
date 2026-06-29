from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import FarmerRating

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'user_type', 'phone', 'location', 'bio', 'profile_image',
            'farm_name', 'farm_location', 'farm_size', 'rating', 'rating_count'
        ]
        read_only_fields = ['id', 'rating', 'rating_count']
        extra_kwargs = {
            'password': {'write_only': True}
        }

class FarmerSerializer(serializers.ModelSerializer):
    """Serializer for displaying farmer profiles"""
    class Meta:
        model = User
        fields = [
            'id', 'username', 'first_name', 'last_name', 
            'farm_name', 'farm_location', 'farm_size', 'location',
            'bio', 'profile_image', 'rating', 'rating_count'
        ]
        read_only_fields = fields

class BuyerSerializer(serializers.ModelSerializer):
    """Serializer for displaying buyer profiles"""
    class Meta:
        model = User
        fields = [
            'id', 'username', 'first_name', 'last_name', 
            'location', 'bio', 'profile_image'
        ]
        read_only_fields = fields

class UserRegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password2', 'first_name', 
            'last_name', 'user_type', 'phone', 'location'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'first_name': {'required': True},
            'last_name': {'required': True}
        }
    
    def validate(self, data):
        if data['password'] != data.pop('password2'):
            raise serializers.ValidationError("Passwords do not match")
        return data
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            user_type=validated_data['user_type'],
            phone=validated_data.get('phone', ''),
            location=validated_data.get('location', '')
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class FarmerRatingSerializer(serializers.ModelSerializer):
    buyer_name = serializers.SerializerMethodField()
    
    class Meta:
        model = FarmerRating
        fields = ['id', 'farmer', 'buyer', 'buyer_name', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'buyer', 'buyer_name', 'created_at']
    
    def get_buyer_name(self, obj):
        return obj.buyer.get_full_name()
    
    def create(self, validated_data):
        # Set the buyer to the current user
        validated_data['buyer'] = self.context['request'].user
        return super().create(validated_data) 