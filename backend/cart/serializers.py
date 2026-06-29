from rest_framework import serializers
from .models import Cart, CartItem
from products.models import Product
from django.db import transaction

class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    product_image = serializers.ImageField(source='product.image', read_only=True)
    unit = serializers.ReadOnlyField(source='product.unit')
    unit_display = serializers.ReadOnlyField(source='product.get_unit_display')
    farmer_name = serializers.ReadOnlyField(source='product.farmer.get_full_name')
    farmer_id = serializers.ReadOnlyField(source='product.farmer.id')
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    available_quantity = serializers.ReadOnlyField(source='product.quantity')
    
    class Meta:
        model = CartItem
        fields = [
            'id', 'product', 'product_name', 'product_image', 'quantity', 
            'subtotal', 'unit', 'unit_display', 'farmer_name', 'farmer_id',
            'available_quantity'
        ]
        read_only_fields = [
            'id', 'product_name', 'product_image', 'subtotal', 'unit', 
            'unit_display', 'farmer_name', 'farmer_id', 'available_quantity'
        ]

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.IntegerField(read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = Cart
        fields = ['id', 'buyer', 'items', 'total_items', 'subtotal']
        read_only_fields = ['id', 'buyer', 'total_items', 'subtotal']

class AddToCartSerializer(serializers.Serializer):
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.filter(is_available=True),
        source='product'
    )
    quantity = serializers.IntegerField(min_value=1)
    
    def validate(self, data):
        product = data['product']
        quantity = data['quantity']
        
        if not product.is_available:
            raise serializers.ValidationError("This product is not available for purchase.")
        
        if quantity > product.quantity:
            raise serializers.ValidationError(f"Cannot add more than {product.quantity} units of this product.")
        
        return data
    
    @transaction.atomic
    def create(self, validated_data):
        product = validated_data['product']
        quantity = validated_data['quantity']
        user = self.context['request'].user
        
        # Get or create user's cart
        cart, created = Cart.objects.get_or_create(buyer=user)
        
        # Check if item already in cart
        try:
            cart_item = cart.items.get(product=product)
            # Update quantity if exists
            new_quantity = cart_item.quantity + quantity
            if new_quantity > product.quantity:
                raise serializers.ValidationError(f"Cannot add more than {product.quantity} units of this product.")
            cart_item.quantity = new_quantity
            cart_item.save()
        except CartItem.DoesNotExist:
            # Create new cart item
            cart_item = CartItem.objects.create(
                cart=cart,
                product=product,
                quantity=quantity
            )
        
        return cart_item

class UpdateCartItemSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=0)
    
    def validate(self, data):
        quantity = data['quantity']
        cart_item = self.instance
        
        if quantity > cart_item.product.quantity:
            raise serializers.ValidationError(f"Cannot add more than {cart_item.product.quantity} units of this product.")
        
        return data
    
    def update(self, instance, validated_data):
        quantity = validated_data.get('quantity')
        
        if quantity == 0:
            # Remove the item if quantity is 0
            instance.delete()
            return None
        else:
            instance.quantity = quantity
            instance.save()
            return instance 