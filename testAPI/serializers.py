from rest_framework import serializers
from drf_writable_nested.serializers import WritableNestedModelSerializer
from .models import Colors, MarkAutos, ModelAutos, Bucket

class ColorsSerializers(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(required=False, allow_blank=True, max_length=255)

    class Meta:
        model = Colors
        fields = ['id', 'name']

class MarkAutosSerializers(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(required=False, allow_blank=True, max_length=255)

    class Meta:
        model = MarkAutos
        fields = ['id', 'name']

class ModelAutosSerializers(serializers.ModelSerializer):
    mark_auto = MarkAutosSerializers().fields.get('name')

    class Meta:
        model = ModelAutos
        fields = ['id', 'name', 'mark_auto']
        depth = 1

class BucketSerializers(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    color = ColorsSerializers()
    model_auto = ModelAutosSerializers()
    amount = serializers.IntegerField()
    date = serializers.DateTimeField(required=False, format="%d.%m.%Y %H:%M")

    class Meta:
        model = Bucket
        fields = ['id', 'color', 'model_auto', 'amount', 'date']
        depth = 1