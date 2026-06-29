from django.db import models
from django.conf import settings

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    
    class Meta:
        verbose_name_plural = 'Categories'
    
    def __str__(self):
        return self.name


class Product(models.Model):
    class UnitChoices(models.TextChoices):
        KG = 'kg', 'Kilogram'
        GRAM = 'g', 'Gram'
        LITER = 'l', 'Liter'
        PIECE = 'pc', 'Piece'
        DOZEN = 'dz', 'Dozen'
        BUNCH = 'bn', 'Bunch'
        CRATE = 'cr', 'Crate'
        BAG = 'bg', 'Bag'
    
    farmer = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='products',
        limit_choices_to={'user_type': 'farmer'}
    )
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='products')
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    unit = models.CharField(
        max_length=3,
        choices=UnitChoices.choices,
        default=UnitChoices.KG
    )
    image = models.ImageField(upload_to='product_images/', blank=True, null=True)
    is_organic = models.BooleanField(default=False)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} by {self.farmer.get_full_name()}"
    
    @property
    def is_in_stock(self):
        return self.quantity > 0 and self.is_available


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='additional_images')
    image = models.ImageField(upload_to='product_images/')
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Image for {self.product.name}"
