from django import template

register = template.Library()


def price(value):
    return str(value).replace('.', ',')

register.filter('price', price)


@register.simple_tag()
def multiply(qty, unit_price):
    value = qty * unit_price
    return price(value)
