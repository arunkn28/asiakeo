from django.urls import path
from .views import *

app_name = 'products'
urlpatterns = [
    path('<slug:category>/', Products.as_view(), name='category-products'),
    ]