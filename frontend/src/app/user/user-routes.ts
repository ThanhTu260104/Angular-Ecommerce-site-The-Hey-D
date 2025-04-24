import { Routes } from '@angular/router';
import { UserLayoutComponent } from '../shared/component/layout/user-layout/user-layout.component';

import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { NewsComponent } from './news/news.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { LoginComponent } from '../auth/login/login.component';
import { RegisterComponent } from '../auth/register/register.component';
import { ChangePassComponent } from '../auth/change-pass/change-pass.component';
import { ProductComponent } from './product/product.component';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { CartComponent } from './cart/cart.component';
import { PaymentComponent } from './payment/payment.component';

import { authGuard } from '../auth/auth.guard';

export const userRoutes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'news', component: NewsComponent },
      { path: 'about-us', component: AboutUsComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'change-pass', component: ChangePassComponent, canActivate: [authGuard] },
      { path: 'product', component: ProductComponent },
      { path: 'product-category/:id', component: ProductCategoryComponent },
      { path: 'product-detail/:id', component: ProductDetailComponent },
      { path: 'cart', component: CartComponent },
      { path: 'payment', component: PaymentComponent }
    ]
  }
];
