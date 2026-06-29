from rest_framework import serializers
from .models import Category, Product, ProductImage
from accounts.serializers import FarmerSerializer

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_primary']


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    farmer_name = serializers.ReadOnlyField(source='farmer.get_full_name')
    farmer_location = serializers.ReadOnlyField(source='farmer.location')
    farmer_rating = serializers.ReadOnlyField(source='farmer.rating')
    additional_images = ProductImageSerializer(many=True, read_only=True)
    unit_display = serializers.CharField(source='get_unit_display', read_only=True)
    in_stock = serializers.BooleanField(source='is_in_stock', read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'quantity', 'unit', 'unit_display',
            'image', 'is_organic', 'is_available', 'in_stock', 'created_at',
            'category', 'category_name', 'farmer', 'farmer_name', 'farmer_location',
            'farmer_rating', 'additional_images'
        ]
        read_only_fields = ['id', 'created_at', 'category_name', 'farmer_name', 'farmer_location', 'farmer_rating']


class ProductDetailSerializer(ProductSerializer):
    farmer = FarmerSerializer(read_only=True)
    
    class Meta(ProductSerializer.Meta):
        pass


class ProductCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'name', 'description', 'price', 'quantity', 'unit', 
            'category', 'image', 'is_organic', 'is_available'
        ]
    
    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['farmer'] = request.user
        return super().create(validated_data) 