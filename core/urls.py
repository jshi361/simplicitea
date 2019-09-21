from django.urls import path
from .views import (
    ItemDetailView,
    CheckoutView,
    HomeView,
    OrderSummaryView,
    add_to_cart,
    remove_from_cart,
    remove_single_item_from_cart,
    PaymentView,
    AddCouponView,
    RequestRefundView,
    ShopView,
    ContactView,
    BlackView,
    JasmineView,
    PureView,
    BestView,
    faceView,
    facecheckView

)

app_name = 'core'

urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('shop/', ShopView.as_view(), name='shop'),
    path('pure/', PureView.as_view(), name='pure'),
    path('bestseller/', BestView.as_view(), name='bestseller'),
    path('facecheck/', facecheckView.as_view(), name='facecheck'),
    path('contact/', ContactView.as_view(), name='contact'),
    path('black/', BlackView.as_view(), name='black'),
    path('jasmine/', JasmineView.as_view(), name='jasmine'),
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('face/', faceView.as_view(), name='face'),
    path('order-summary/', OrderSummaryView.as_view(), name='order-summary'),
    path('product/<slug>/', ItemDetailView.as_view(), name='product'),
    path('add-to-cart/<slug>/', add_to_cart, name='add-to-cart'),
    path('add-coupon/', AddCouponView.as_view(), name='add-coupon'),
    path('remove-from-cart/<slug>/', remove_from_cart, name='remove-from-cart'),
    path('remove-item-from-cart/<slug>/', remove_single_item_from_cart,
         name='remove-single-item-from-cart'),
    path('payment/<payment_option>/', PaymentView.as_view(), name='payment'),
    path('request-refund/', RequestRefundView.as_view(), name='request-refund')
]
