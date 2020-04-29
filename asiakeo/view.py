from django.views import View
from django.shortcuts import render


class BaseView(View):
    def __init__(self):
        pass


class NotreConcept(BaseView):
    def get(self, request):
        return render(request, 'notre-concept.html')
