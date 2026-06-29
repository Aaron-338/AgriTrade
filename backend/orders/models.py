from django.db import models
from django.conf import settings
from products.models import Product

class Order(models.Model):
    class OrderStatus(models.TextChoices):
        PENDING = 'pending', 'Pending'
        PROCESSING = 'processing', 'Processing'
        SHIPPED = 'shipped', 'Shipped'
        DELIVERED = 'delivered', 'Delivered'
        CANCELLED = 'cancelled', 'Cancelled'
    
    class PaymentStatus(models.TextChoices):
        PENDING = 'pending', 'Pending'
        PAID = 'paid', 'Paid'
        FAILED = 'failed', 'Failed'
        REFUNDED = 'refunded', 'Refunded'
    
    class PaymentMethod(models.TextChoices):
        CREDIT_CARD = 'credit_card', 'Credit Card'
        MOBILE_MONEY = 'mobile_money', 'Mobile Money'
        CASH_ON_DELIVERY = 'cash_on_delivery', 'Cash on Delivery'
    
    buyer = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='orders',
        limit_choices_to={'user_type': 'buyer'}
    )
    status = models.CharField(
        max_length=15,
        choices=OrderStatus.choices,
        default=OrderStatus.PENDING
    )
    payment_status = models.CharField(
        max_length=10,
        choices=PaymentStatus.choices,
        default=PaymentStatus.PENDING
    )
    payment_method = models.CharField(
        max_length=20,
        choices=PaymentMethod.choices,
        default=PaymentMethod.CASH_ON_DELIVERY
    )
    shipping_address = models.TextField()
    shipping_city = models.CharField(max_length=100)
    shipping_country = models.CharField(max_length=100)
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_cost = models.DecimalField(max_digits=8, decimal_places=2, default=5.00)
    tax_amount = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    tracking_number = models.CharField(max_length=50, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    estimated_delivery = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Order #{self.id} - {self.buyer.get_full_name()}"
    
    @property
    def subtotal(self):
        return sum(item.subtotal for item in self.items.all())
    
    @property
    def grand_total(self):
        return self.subtotal + self.shipping_cost + self.tax_amount


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    # Store product details at time of purchase in case product is deleted
    product_name = models.CharField(max_length=100)
    product_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    farmer = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True,
        related_name='sold_items',
        limit_choices_to={'user_type': 'farmer'}
    )
    farmer_name = models.CharField(max_length=255)
    unit = models.CharField(max_length=10)
    
    @property
    def subtotal(self):
        return self.product_price * self.quantity
    
    def __str__(self):
        return f"{self.quantity} x {self.product_name} in Order #{self.order.id}"
    
    def save(self, *args, **kwargs):
        # Populate fields from product if not already set
        if self.product and not self.product_name:
            self.product_name = self.product.name
            self.product_price = self.product.price
            self.farmer = self.product.farmer
            self.farmer_name = self.product.farmer.get_full_name()
            self.unit = self.product.unit
        
        super().save(*args, **kwargs)
