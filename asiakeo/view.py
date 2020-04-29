from django.views import View
from django.shortcuts import render
from products.models import Category

class BaseView(View):
    def __init__(self):
        self.context_dict = {}
        categories = Category.objects.filter(show_on_header=True)
        self.context_dict['categories'] = categories

class NotreConcept(BaseView):
    def get(self, request):
        return render(request, 'notre-concept.html', self.context_dict)


class NosRestuarants(BaseView):
    def get(self, request):
        return render(request, 'nos-restaurants.html', self.context_dict)


class ServiceConsommateur(BaseView):
    def get(self, request):
        return render(request, 'service-consommateur.html', self.context_dict)
