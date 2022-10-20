from django.db import models


class Colors(models.Model):
    name = models.CharField('Цвет', max_length=128)

    def __str__(self):
        return f'{self.name}'

    class Meta:
        verbose_name = 'Цвет'
        verbose_name_plural = 'Цвета'

class MarkAutos(models.Model):
    name = models.CharField('Марка', max_length=128)

    def __str__(self):
        return f'{self.name}'

    class Meta:
        verbose_name = 'Марка авто'
        verbose_name_plural = 'Марки авто'

class ModelAutos(models.Model):
    name = models.CharField('Модель', max_length=128)
    mark_auto = models.ForeignKey(MarkAutos, on_delete=models.CASCADE, blank=False, null=False, related_name='mark_auto')

    def __str__(self):
        return f'{self.mark_auto} {self.name}'

    class Meta:
        verbose_name = 'Модель авто'
        verbose_name_plural = 'Модели авто'

class Bucket(models.Model):
    color = models.ForeignKey(Colors, on_delete=models.CASCADE, blank=False, null=False)
    model_auto = models.ForeignKey(ModelAutos, on_delete=models.CASCADE, blank=False, null=False)
    amount = models.PositiveIntegerField('Количество', null=False, blank=False)
    date = models.DateTimeField('Дата добавления', auto_now_add=True)

    def __str__(self):
        return f'{self.color} {self.model_auto}  Количество: {self.amount}'
    class Meta:
        verbose_name = 'Корзина'
        verbose_name_plural = 'Корзины'


