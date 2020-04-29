from django.views import View
from django.shortcuts import render


class BaseView(View):
    def __init__(self):
        pass


class NotreConcept(BaseView):
    def get(self, request):
        return render(request, 'notre-concept.html')


class NosRestuarants(BaseView):
    def get(self, request):
        return render(request, 'nos-restaurants.html')


class ServiceConsommateur(BaseView):
    def get(self, request):
        return render(request, 'service-consommateur.html')
