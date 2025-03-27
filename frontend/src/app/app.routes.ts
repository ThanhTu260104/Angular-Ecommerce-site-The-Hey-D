import { Routes } from '@angular/router';
import { HomeComponent } from './user/home/home.component';
import { ContactComponent } from './user/contact/contact.component';
import { NotfoundComponent } from './user/notfound/notfound.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProductCategoryComponent } from './user/product-category/product-category.component';
import { ProductDetailComponent } from './user/product-detail/product-detail.component';
import { CartComponent } from './user/cart/cart.component';
import { PaymentComponent } from './user/payment/payment.component';
import { ProductComponent } from './user/product/product.component';
import { AboutUsComponent } from './user/about-us/about-us.component';
import { NewsComponent } from './user/news/news.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Trang chủ' },
  { path: 'contact', component: ContactComponent, title: 'Liên hệ' },
  { path: 'login', component: LoginComponent, title: 'Đăng nhập' },
  { path: 'register', component: RegisterComponent, title: 'Đăng ký' },
  // Trang new
  { path: 'news', component: NewsComponent, title: 'Tin tức' },

  {
    path: 'product-category/:id',
    component: ProductCategoryComponent,
    title: 'Sản phẩm trong loại',
  },
  {
    path: 'product-detail/:id',
    component: ProductDetailComponent,
    title: 'Chi tiết sản phẩm',
  },
  { path: 'about-us', component: AboutUsComponent, title: 'Về chúng tôi' },
  { path: 'product', component: ProductComponent, title: 'Sản phẩm' },
  { path: 'cart', component: CartComponent, title: 'Giỏ hàng' },
  { path: 'payment', component: PaymentComponent, title: 'Thanh toán' },
  { path: '**', component: NotfoundComponent, title: 'Không tìm thấy trang' },
];
