from rest_framework import serializers
from .models import Order, OrderItem
from cart.models import Cart, CartItem
from django.db import transaction
from accounts.serializers import UserSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    farmer_data = UserSerializer(source='farmer', read_only=True)
    
    class Meta:
        model = OrderItem
        fields = [
            'id', 'product', 'product_name', 'product_price', 'quantity', 
            'farmer', 'farmer_name', 'farmer_data', 'unit', 'subtotal'
        ]
        read_only_fields = [
            'id', 'product_name', 'product_price', 'farmer_name', 
            'farmer_data', 'subtotal'
        ]

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    buyer_data = UserSerializer(source='buyer', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_status_display = serializers.CharField(source='get_payment_status_display', read_only=True)
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'buyer', 'buyer_data', 'status', 'status_display', 
            'payment_status', 'payment_status_display', 'payment_method',
            'payment_method_display', 'shipping_address', 'shipping_city',
            'shipping_country', 'full_name', 'email', 'phone', 
            'total_amount', 'shipping_cost', 'tax_amount', 'subtotal',
            'grand_total', 'tracking_number', 'notes', 'estimated_delivery',
            'created_at', 'updated_at', 'items'
        ]
        read_only_fields = [
            'id', 'buyer', 'buyer_data', 'status_display', 'payment_status_display',
            'payment_method_display', 'subtotal', 'grand_total', 'created_at', 'updated_at'
        ]

class OrderCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            'shipping_address', 'shipping_city', 'shipping_country',
            'full_name', 'email', 'phone', 'payment_method', 'notes'
        ]
    
    @transaction.atomic
    def create(self, validated_data):
        user = self.context['request'].user
        
        # Get user's cart
        try:
            cart = Cart.objects.get(buyer=user)
        except Cart.DoesNotExist:
            raise serializers.ValidationError("You don't have a cart to checkout.")
        
        # Check if cart has items
        if cart.items.count() == 0:
            raise serializers.ValidationError("Your cart is empty.")
        
        # Calculate totals
        subtotal = cart.subtotal
        shipping_cost = 5.00  # Fixed shipping cost for now
        tax_rate = 0.15  # 15% tax rate
        tax_amount = subtotal * tax_rate
        total_amount = subtotal + shipping_cost + tax_amount
        
        # Create order
        order = Order.objects.create(
            buyer=user,
            shipping_address=validated_data.get('shipping_address'),
            shipping_city=validated_data.get('shipping_city'),
            shipping_country=validated_data.get('shipping_country'),
            full_name=validated_data.get('full_name'),
            email=validated_data.get('email'),
            phone=validated_data.get('phone'),
            payment_method=validated_data.get('payment_method'),
            notes=validated_data.get('notes', ''),
            shipping_cost=shipping_cost,
            tax_amount=tax_amount,
            total_amount=total_amount
        )
        
        # Create order items from cart items
        for cart_item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                quantity=cart_item.quantity,
                # Other fields will be auto-populated by the model's save method
            )
            
            # Update product quantities
            product = cart_item.product
            product.quantity -= cart_item.quantity
            if product.quantity <= 0:
                product.is_available = False
            product.save()
        
        # Clear the cart
        cart.items.all().delete()
        
        return order

class UpdateOrderStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['status']
    
    def validate(self, data):
        user = self.context['request'].user
        order = self.instance
        
        # Only farmers who have products in this order can update status
        if user.user_type == 'farmer':
            # Check if farmer has products in this order
            has_products = order.items.filter(farmer=user).exists()
            if not has_products:
                raise serializers.ValidationError("You don't have products in this order.")
        
        return data
    
    def update(self, instance, validated_data):
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        return instance 