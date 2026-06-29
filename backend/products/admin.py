from django.contrib import admin
from .models import Category, Product, ProductImage

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'farmer', 'category', 'price', 'quantity', 'unit', 'is_available', 'created_at')
    list_filter = ('category', 'is_available', 'is_organic', 'unit', 'created_at')
    search_fields = ('name', 'description', 'farmer__first_name', 'farmer__last_name')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [ProductImageInline]

class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name', 'description')

admin.site.register(Category, CategoryAdmin)
admin.site.register(Product, ProductAdmin)
