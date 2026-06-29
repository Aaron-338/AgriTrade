from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db import transaction
from .models import Cart, CartItem
from .serializers import (
    CartSerializer, CartItemSerializer, AddToCartSerializer, UpdateCartItemSerializer
)

# Create your views here.

class IsBuyerOrReadOnly(permissions.BasePermission):
    """Only buyers can interact with carts"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == 'buyer'

class CartViewSet(viewsets.GenericViewSet):
    serializer_class = CartSerializer
    permission_classes = [IsBuyerOrReadOnly]
    
    def get_queryset(self):
        return Cart.objects.filter(buyer=self.request.user)
    
    def get_object(self):
        cart, created = Cart.objects.get_or_create(buyer=self.request.user)
        return cart
    
    def list(self, request):
        """Get user's cart"""
        cart = self.get_object()
        serializer = self.get_serializer(cart)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def add_item(self, request):
        """Add a product to cart"""
        serializer = AddToCartSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        # Return the updated cart
        cart = self.get_object()
        cart_serializer = self.get_serializer(cart)
        return Response(cart_serializer.data)
    
    @action(detail=False, methods=['delete'])
    def clear(self, request):
        """Remove all items from cart"""
        cart = self.get_object()
        cart.items.all().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CartItemViewSet(viewsets.GenericViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [IsBuyerOrReadOnly]
    
    def get_queryset(self):
        return CartItem.objects.filter(cart__buyer=self.request.user)
    
    def get_object(self):
        return get_object_or_404(self.get_queryset(), pk=self.kwargs['pk'])
    
    def update(self, request, pk=None):
        """Update quantity of a cart item"""
        cart_item = self.get_object()
        serializer = UpdateCartItemSerializer(cart_item, data=request.data)
        serializer.is_valid(raise_exception=True)
        updated_item = serializer.save()
        
        if updated_item is None:
            # Item was removed
            return Response(status=status.HTTP_204_NO_CONTENT)
        
        return Response(CartItemSerializer(updated_item).data)
    
    def destroy(self, request, pk=None):
        """Remove an item from cart"""
        cart_item = self.get_object()
        cart_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
