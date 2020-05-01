from django import template

register = template.Library()


def price(value):
    return str(value).replace('.', ',')

register.filter('price', price)
