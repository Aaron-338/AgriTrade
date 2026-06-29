from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, permissions, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product, ProductImage
from .serializers import (
    CategorySerializer, ProductSerializer, ProductDetailSerializer,
    ProductCreateSerializer, ProductImageSerializer
)

class IsFarmerOrReadOnly(permissions.BasePermission):
    """
    Allow read access to anyone, but only farmers can create/update/delete
    """
    def has_permission(self, request, view):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to farmers
        return request.user.is_authenticated and request.user.user_type == 'farmer'
    
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to the farmer who owns the product
        return obj.farmer == request.user


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_organic', 'is_available', 'farmer']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at', 'name']
    ordering = ['-created_at']
    permission_classes = [IsFarmerOrReadOnly]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return ProductCreateSerializer
        return ProductSerializer
    
    def perform_create(self, serializer):
        serializer.save(farmer=self.request.user)
    
    def get_queryset(self):
        queryset = Product.objects.all()
        
        # Filter by min/max price if provided
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def farmer_products(self, request):
        """Get products for the authenticated farmer"""
        if not request.user.is_authenticated or request.user.user_type != 'farmer':
            return Response(
                {'detail': 'You must be a farmer to view your products.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        queryset = self.get_queryset().filter(farmer=request.user)
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class ProductImageViewSet(viewsets.ModelViewSet):
    serializer_class = ProductImageSerializer
    permission_classes = [IsFarmerOrReadOnly]
    
    def get_queryset(self):
        return ProductImage.objects.filter(product_id=self.kwargs['product_pk'])
    
    def perform_create(self, serializer):
        product = get_object_or_404(Product, pk=self.kwargs['product_pk'])
        
        # Ensure the user is the farmer who owns this product
        if product.farmer != self.request.user:
            return Response(
                {'detail': 'You do not have permission to add images to this product.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer.save(product=product)
