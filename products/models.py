from django.db import models


class Category(models.Model):
    class Meta:
        db_table = 'categories'
        verbose_name_plural = 'categories'
    name = models.CharField(max_length=255)
    show_on_header = models.BooleanField(default=False)
    image = models.ImageField(upload_to='categories', null=True, blank=True)
    slug = models.CharField(max_length=50, null=True, blank=True)
    def __str__(self):
        return self.name


class Product(models.Model):
    class Meta:
        db_table = 'products'
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='products', null=True, blank=True)
    price = models.FloatField(default=0.0)
    number_pieces = models.IntegerField()

    def __str__(self):
        return self.name


class ProductAttribute(models.Model):
    class Meta:
        db_table = 'product_attributes'
    product = models.OneToOneField(Product, on_delete=models.CASCADE)
    show_on_home_page = models.BooleanField(default=False)
    promotion = models.FloatField(default=0.0)
    available = models.BooleanField(default=True)
    is_sauce = models.BooleanField(default=False)
    is_sour_sweet_sauce = models.BooleanField(default=False)
    is_ginger_wasabi = models.BooleanField(default=False)
    free_nos = models.IntegerField(default=0)
    def __str__(self):
        return self.product_id.name

