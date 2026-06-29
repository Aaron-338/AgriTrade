from django.contrib import admin
from .models import Cart, CartItem

class CartItemInline(admin.TabularInline):
    model = CartItem
    readonly_fields = ('subtotal',)
    extra = 0

class CartAdmin(admin.ModelAdmin):
    list_display = ('buyer', 'total_items', 'subtotal', 'updated_at')
    readonly_fields = ('total_items', 'subtotal', 'created_at', 'updated_at')
    inlines = [CartItemInline]
    search_fields = ('buyer__email', 'buyer__first_name', 'buyer__last_name')

admin.site.register(Cart, CartAdmin)
