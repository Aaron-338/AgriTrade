from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    readonly_fields = ('product_name', 'product_price', 'farmer_name', 'subtotal')
    extra = 0

class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'buyer', 'full_name', 'status', 'payment_status', 'total_amount', 'created_at')
    list_filter = ('status', 'payment_status', 'payment_method', 'created_at')
    search_fields = ('full_name', 'email', 'phone', 'buyer__email', 'buyer__first_name', 'buyer__last_name')
    readonly_fields = ('created_at', 'updated_at', 'subtotal', 'grand_total')
    inlines = [OrderItemInline]
    fieldsets = (
        ('Order Information', {
            'fields': ('buyer', 'status', 'payment_status', 'payment_method')
        }),
        ('Customer Information', {
            'fields': ('full_name', 'email', 'phone')
        }),
        ('Shipping Information', {
            'fields': ('shipping_address', 'shipping_city', 'shipping_country', 'tracking_number', 'estimated_delivery')
        }),
        ('Financial Details', {
            'fields': ('subtotal', 'shipping_cost', 'tax_amount', 'total_amount', 'grand_total')
        }),
        ('Additional Information', {
            'fields': ('notes', 'created_at', 'updated_at')
        }),
    )

admin.site.register(Order, OrderAdmin)
