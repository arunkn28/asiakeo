from django.db import models

# Create your models here.
class SiteConfigManager(models.Manager):

    def save(self, *args, **kwargs):
        self.__class__.objects.exclude(id=self.id).delete()
        super().save(*args, **kwargs)

    def is_website_closed(self):
        configurations = SiteConfig.objects.all()
        if configurations:
            start_time = configurations[0].start_time
            end_time = configurations[0].end_time
            open_for = ((end_time - start_time).total_seconds())/60
            if open_for > 15:
                return False
        return True


class SiteConfig(models.Model):
    class Meta:
        db_table = 'site_config'
    start_time = models.DateTimeField(null=False, blank=False)
    end_time = models.DateTimeField(null=False, blank=False)
    objects = SiteConfigManager()

    def __str__(self):
        return "Site Configuration"