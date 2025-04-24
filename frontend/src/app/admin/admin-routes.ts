import { Routes } from '@angular/router';
import { AdminLayoutComponent } from '../shared/component/layout/admin-layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CategoryComponent } from './category/category.component';
import { EditCategoryComponent } from './edit-category/edit-category.component';
import { CreateCategoryComponent } from './create-category/create-category.component';
import { ProductComponent } from './product/product.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { SearchComponent } from './search/search.component';
import { authGuard } from '../auth/auth.guard';
import { adminGuard } from '../auth/admin.guard';
import { NewsComponent } from './news/news.component';
import { EditNewsComponent } from './edit-news/edit-news.component';
import { CreateNewsComponent } from './create-news/create-news.component';
export const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'category', component: CategoryComponent },
      { path: 'create-category', component: CreateCategoryComponent },
      { path: 'edit-category/:id', component: EditCategoryComponent },
      { path: 'product', component: ProductComponent },
      { path: 'create-product', component: CreateProductComponent },
      { path: 'edit-product/:id', component: EditProductComponent },
      { path: 'news', component: NewsComponent },
      { path: 'edit-news:id', component: EditNewsComponent },
      { path: 'create-news', component: CreateNewsComponent },
      { path: 'search', component: SearchComponent },
      
    ],
  },
];
