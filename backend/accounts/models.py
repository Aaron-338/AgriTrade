from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    class UserType(models.TextChoices):
        FARMER = 'farmer', _('Farmer')
        BUYER = 'buyer', _('Buyer')
        ADMIN = 'admin', _('Admin')
    
    email = models.EmailField(_('email address'), unique=True)
    user_type = models.CharField(
        max_length=10,
        choices=UserType.choices,
        default=UserType.BUYER
    )
    phone = models.CharField(max_length=20, blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Farmer specific fields
    farm_name = models.CharField(max_length=100, blank=True, null=True)
    farm_location = models.CharField(max_length=100, blank=True, null=True)
    farm_size = models.CharField(max_length=50, blank=True, null=True)
    
    # For ratings (calculated field)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    rating_count = models.PositiveIntegerField(default=0)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.user_type})"
    
    @property
    def is_farmer(self):
        return self.user_type == self.UserType.FARMER
    
    @property
    def is_buyer(self):
        return self.user_type == self.UserType.BUYER


class FarmerRating(models.Model):
    farmer = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='ratings',
        limit_choices_to={'user_type': User.UserType.FARMER}
    )
    buyer = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='given_ratings',
        limit_choices_to={'user_type': User.UserType.BUYER}
    )
    rating = models.PositiveSmallIntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['farmer', 'buyer']
        
    def __str__(self):
        return f"{self.buyer.get_full_name()} rated {self.farmer.get_full_name()}: {self.rating}"
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update farmer's average rating
        ratings = self.farmer.ratings.all()
        total_rating = sum(r.rating for r in ratings)
        count = ratings.count()
        
        self.farmer.rating = total_rating / count if count > 0 else 0
        self.farmer.rating_count = count
        self.farmer.save()
