from django.db import models
from django.conf import settings
from products.models import Product

class Cart(models.Model):
    buyer = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='cart',
        limit_choices_to={'user_type': 'buyer'}
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    @property
    def total_items(self):
        return sum(item.quantity for item in self.items.all())
    
    @property
    def subtotal(self):
        return sum(item.subtotal for item in self.items.all())
    
    def __str__(self):
        return f"Cart for {self.buyer.get_full_name()}"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['cart', 'product']
    
    @property
    def subtotal(self):
        return self.product.price * self.quantity
    
    def __str__(self):
        return f"{self.quantity} x {self.product.name} in {self.cart}"
    
    def clean(self):
        from django.core.exceptions import ValidationError
        
        # Check if quantity is valid
        if self.quantity <= 0:
            raise ValidationError("Quantity must be at least 1.")
        
        # Check if product has enough stock
        if self.quantity > self.product.quantity:
            raise ValidationError(f"Cannot add more than {self.product.quantity} units of this product.")
        
        # Check if product is available
        if not self.product.is_available:
            raise ValidationError("This product is not available for purchase.")
        
        # Check if product belongs to a farmer
        if not self.product.farmer.is_farmer:
            raise ValidationError("Product must belong to a farmer.")
