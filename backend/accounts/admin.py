from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User, FarmerRating

class CustomUserAdmin(BaseUserAdmin):
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'email', 'phone', 'location', 'bio', 'profile_image')}),
        (_('Farmer details'), {'fields': ('farm_name', 'farm_location', 'farm_size'), 'classes': ('collapse',)}),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'user_type', 'groups', 'user_permissions'),
        }),
        (_('Important dates'), {'fields': ('last_login', 'date_joined', 'created_at', 'updated_at')}),
        (_('Rating'), {'fields': ('rating', 'rating_count'), 'classes': ('collapse',)}),
    )
    readonly_fields = ('created_at', 'updated_at', 'rating', 'rating_count')
    list_display = ('username', 'email', 'first_name', 'last_name', 'user_type', 'is_active')
    list_filter = ('user_type', 'is_active', 'is_staff', 'is_superuser')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'farm_name')
    ordering = ('email',)
    
    def get_fieldsets(self, request, obj=None):
        if not obj:
            return self.add_fieldsets
        return super().get_fieldsets(request, obj)
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'user_type'),
        }),
    )


class FarmerRatingAdmin(admin.ModelAdmin):
    list_display = ('farmer', 'buyer', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('farmer__first_name', 'farmer__last_name', 'buyer__first_name', 'buyer__last_name', 'comment')
    readonly_fields = ('created_at', 'updated_at')


admin.site.register(User, CustomUserAdmin)
admin.site.register(FarmerRating, FarmerRatingAdmin)
