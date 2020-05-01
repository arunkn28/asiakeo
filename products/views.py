from django.views import View
from django.shortcuts import render
from products.models import Category, Product
from siteconfigurations.models import SiteConfig
from .utils import slug_category_mapping


class BaseView(View):
    def __init__(self, **kwargs):
        self.context_dict = {}
        categories = Category.objects.filter(show_on_header=True)
        self.context_dict['categories'] = categories
        self.context_dict['website_closed'] = SiteConfig.objects.is_website_closed()
        super().__init__(**kwargs)


class Products(BaseView):
    def get(self, request, category):
        category_type = slug_category_mapping.get(category)
        if not category_type:
            category_type = category
        products = Product.objects.filter(category__name__icontains=category_type)
        self.context_dict['products'] = products
        self.context_dict['product_category'] = category
        return render(request, 'products.html', self.context_dict)