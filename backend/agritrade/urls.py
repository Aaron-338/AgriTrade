"""
URL configuration for agritrade project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Import views from apps
from accounts.views import (
    UserRegistrationView, UserProfileView, FarmerListView,
    FarmerDetailView, FarmerRatingViewSet
)
from products.views import CategoryViewSet, ProductViewSet, ProductImageViewSet
from cart.views import CartViewSet, CartItemViewSet
from orders.views import OrderViewSet, OrderItemViewSet

# Set up API router
router = routers.DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'cart', CartViewSet, basename='cart')
router.register(r'cart-items', CartItemViewSet, basename='cart-items')
router.register(r'orders', OrderViewSet, basename='orders')

# API root view
def api_root(request):
    return JsonResponse({
        'status': 'ok',
        'message': 'Welcome to Agritrade API',
        'api_endpoints': {
            'api/': 'API endpoints',
            'admin/': 'Admin interface',
            'media/': 'Media files'
        }
    })

# URL patterns
urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    
    # API URLs
    path('api/', include([
        # Router URLs
        path('', include(router.urls)),
        
        # Authentication URLs
        path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
        path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
        path('register/', UserRegistrationView.as_view(), name='register'),
        path('profile/', UserProfileView.as_view(), name='profile'),
        
        # Farmers URLs
        path('farmers/', FarmerListView.as_view(), name='farmer-list'),
        path('farmers/<int:pk>/', FarmerDetailView.as_view(), name='farmer-detail'),
        path('farmers/<int:farmer_id>/ratings/', FarmerRatingViewSet.as_view({
            'get': 'list',
            'post': 'create'
        }), name='farmer-ratings'),
        
        # Nested URLs
        path('products/<int:product_pk>/images/', ProductImageViewSet.as_view({
            'get': 'list',
            'post': 'create'
        }), name='product-images'),
        path('orders/<int:order_pk>/items/', OrderItemViewSet.as_view({
            'get': 'list'
        }), name='order-items'),
    ])),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
