from django.views import View
from django.shortcuts import render
from products.models import Category, Product
from .models import Cart, CartDetails
from siteconfigurations.models import SiteConfig


class BaseView(View):
    def __init__(self, **kwargs):
        self.context = {}
        self.cart_obj = Cart.objects
        self.cart_det_obj = CartDetails.objects
        categories = Category.objects.filter(show_on_header=True)
        self.context['categories'] = categories
        self.context['website_closed'] = SiteConfig.objects.is_website_closed()
        super().__init__(**kwargs)


class CartView(BaseView):
    def get(self, request):
        """
        View to show the cart page. Get the products in the cart base on whether the user is
        logged in or not.
        Think about the idea when user is logged in and not logged in.
        """
        try:
            if request.user:
                cart = self.cart_obj.get_cart_by_user(request.user)

            else:
                cart = self.cart_obj.get_cart_by_id(request.session.get('cart_id', None))

            if not cart:
                self.context['no_items'] = True
                return render(request, 'cart-page.html', self.context)
            request.session['cart_id'] = cart.first().id
            cart_details_list = []
            if cart:
                cart_details = self.cart_det_obj.get_cart_items(cart.first().id)
                """ 
                :Note If face any issue with cart order by cartid and get the latest cartid.
                """
                for cart in cart_details:
                    product = Product.objects.filter(id=cart.product_id)
                    cart_temp_dict = {}
                    cart_temp_dict['product'] = product.first()
                    cart_temp_dict['quantity'] = cart.quantity
                    cart_temp_dict['price'] = product.first().price
                    cart_temp_dict[cart.id] = cart.id
                    cart_details_list.append(cart_temp_dict)

                self.context['cart_details'] = cart_details_list
                self.context['cart_count'] = cart_details.count()
            response = render(request, 'cart-page.html', self.context)
            return response
        except Exception as e:
            print("500 %s" %e)
            raise Exception

    def post(self, request):
        pass
