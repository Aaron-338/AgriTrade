from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, permissions, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from .models import Order, OrderItem
from .serializers import (
    OrderSerializer, OrderItemSerializer, OrderCreateSerializer,
    UpdateOrderStatusSerializer
)

class IsOwnerOrFarmerOrAdmin(permissions.BasePermission):
    """
    Allow access to:
    - The buyer who placed the order
    - Farmers who have products in the order
    - Admins
    """
    def has_object_permission(self, request, view, obj):
        # Allow if user is admin
        if request.user.is_staff:
            return True
        
        # Allow if user is the buyer
        if obj.buyer == request.user:
            return True
        
        # Allow if user is a farmer with products in this order
        if request.user.user_type == 'farmer':
            return obj.items.filter(farmer=request.user).exists()
        
        return False


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'payment_status', 'payment_method']
    ordering_fields = ['created_at', 'updated_at', 'total_amount']
    ordering = ['-created_at']
    
    def get_queryset(self):
        user = self.request.user
        
        # Different querysets based on user type
        if user.is_staff:
            # Admins can see all orders
            return Order.objects.all()
        elif user.user_type == 'buyer':
            # Buyers see their own orders
            return Order.objects.filter(buyer=user)
        elif user.user_type == 'farmer':
            # Farmers see orders containing their products
            return Order.objects.filter(items__farmer=user).distinct()
        else:
            return Order.objects.none()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        elif self.action == 'update_status':
            return UpdateOrderStatusSerializer
        return OrderSerializer
    
    def create(self, request, *args, **kwargs):
        # Only buyers can create orders
        if request.user.user_type != 'buyer':
            return Response(
                {"detail": "Only buyers can place orders."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        
        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_201_CREATED
        )
    
    def get_permissions(self):
        if self.action in ['retrieve', 'update', 'partial_update', 'destroy', 'update_status']:
            return [permissions.IsAuthenticated(), IsOwnerOrFarmerOrAdmin()]
        return super().get_permissions()
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Update an order's status"""
        order = self.get_object()
        serializer = self.get_serializer(order, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(OrderSerializer(order).data)
    
    @action(detail=False, methods=['get'])
    def my_orders(self, request):
        """Get current user's orders"""
        user = request.user
        
        if user.user_type == 'buyer':
            orders = Order.objects.filter(buyer=user)
        elif user.user_type == 'farmer':
            orders = Order.objects.filter(items__farmer=user).distinct()
        else:
            return Response(
                {"detail": "Invalid user type."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        page = self.paginate_queryset(orders)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)


class OrderItemViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = OrderItemSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrFarmerOrAdmin]
    
    def get_queryset(self):
        order = get_object_or_404(Order, pk=self.kwargs['order_pk'])
        
        user = self.request.user
        
        # Check permissions
        if user.is_staff or order.buyer == user:
            # Admin or buyer can see all items
            return order.items.all()
        elif user.user_type == 'farmer':
            # Farmer can only see their items
            return order.items.filter(farmer=user)
        
        return OrderItem.objects.none()
