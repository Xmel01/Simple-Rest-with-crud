from datetime import datetime

from django.shortcuts import render
from django.http import HttpResponseRedirect, Http404
from rest_framework.generics import get_object_or_404

from rest_framework.pagination import LimitOffsetPagination

from .models import Colors, MarkAutos, ModelAutos, Bucket
from .serializers import ColorsSerializers, MarkAutosSerializers, ModelAutosSerializers, BucketSerializers
from rest_framework import viewsets, filters
from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

class ColorsViewSet(viewsets.ModelViewSet):
    queryset = Colors.objects.all()
    serializer_class = ColorsSerializers
    parser_classes = [JSONParser, FormParser, MultiPartParser]
    #permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['id','name']
    pagination_class = LimitOffsetPagination

    def get_queryset(self):
        queryset = self.queryset.all()
        sort = self.request.query_params.get('sort')
        order = self.request.query_params.get('order')
        if sort and order:
            if order == 'asc':
                queryset = queryset.order_by(sort)
            else:
                queryset = queryset.order_by('-' + sort)
        return queryset

class MarkAutosViewSet(viewsets.ModelViewSet):
    queryset = MarkAutos.objects.all()
    serializer_class = MarkAutosSerializers
    parser_classes = [JSONParser, FormParser, MultiPartParser]
    #permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['id', 'name']
    pagination_class = LimitOffsetPagination

    def get_queryset(self):
        queryset = self.queryset.all()
        sort = self.request.query_params.get('sort')
        order = self.request.query_params.get('order')
        if sort and order:
            if order == 'asc':
                queryset = queryset.order_by(sort)
            else:
                queryset = queryset.order_by('-' + sort)
        return queryset

class ModelAutosViewSet(viewsets.ModelViewSet):
    queryset = ModelAutos.objects.all()
    serializer_class = ModelAutosSerializers
    parser_classes = [JSONParser, FormParser, MultiPartParser]
    #permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['id', 'name', 'mark_auto__name']
    pagination_class = LimitOffsetPagination


    def create(self, request, *args, **kwargs):
        new_model = ModelAutos.objects.create(name=request.data.get('name'), mark_auto=MarkAutos.objects.get(id=int(request.data.get('mark_auto'))))
        print(new_model)
        new_model.save()
        serializer = ModelAutosSerializers(new_model)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        pk = kwargs['pk']
        try:
            ModelAutos.objects.filter(id=pk).update(name=request.data.get('name'), mark_auto=MarkAutos.objects.get(name=request.data.get('mark_auto')))
            return Response(status=200)
        except:
            return Response(status=404)

    def get_queryset(self):
        queryset = self.queryset.all()
        sort = self.request.query_params.get('sort')
        order = self.request.query_params.get('order')
        if sort and order:
            if order == 'asc':
                queryset = queryset.order_by(sort)
            else:
                queryset = queryset.order_by('-' + sort)
        return queryset

class BucketViewSet(viewsets.ModelViewSet):
    queryset = Bucket.objects.all()
    serializer_class = BucketSerializers
    parser_classes = [JSONParser, FormParser, MultiPartParser]
    #permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['id', 'color__name', 'model_auto__name', 'model_auto__mark_auto__name', 'amount', 'date']
    pagination_class = LimitOffsetPagination


    def create(self, request, *args, **kwargs):
        color = Colors.objects.get(name=request.data.get('color'))
        model = ModelAutos.objects.get(name=request.data.get('model_auto'))
        new_model = Bucket.objects.create(color=color, model_auto=model, amount=request.data.get('amount'))
        new_model.save()
        serializer = BucketSerializers(new_model)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        pk = kwargs['pk']
        print(request.data)
        color = Colors.objects.get(name=request.data.get('color.name'))
        model = ModelAutos.objects.get(name=request.data.get('model_auto.name'))
        print(color, model)
        try:
            Bucket.objects.filter(id=pk).update(color=color, model_auto=model, amount=int(request.data.get('amount')))
            return Response(status=200)
        except Exception as e:
            print(e)
            return Response(status=404)


    def get_queryset(self):
        queryset = self.queryset.all()
        sort = self.request.query_params.get('sort')
        order = self.request.query_params.get('order')
        if sort and order:
            if order == 'asc':
                queryset = queryset.order_by(sort)
            else:
                queryset = queryset.order_by('-' + sort)
        return queryset

def main(request):
    return HttpResponseRedirect('colors')

def colors(request):
    col = Colors.objects.all()
    return render(request, 'Colors.html', {'colors': col})

def mark_auto(request):
    return render(request, 'MarkAuto.html')

def model_auto(request):
    marks = MarkAutos.objects.all()
    return render(request, 'ModelAuto.html', {'marks': marks})

def bucket(request):
    col = Colors.objects.all()
    model = ModelAutos.objects.all()
    return render(request, 'Bucket.html', {'colors': col, 'models': model})

def b(request):
    return render(request, 'b.html')
