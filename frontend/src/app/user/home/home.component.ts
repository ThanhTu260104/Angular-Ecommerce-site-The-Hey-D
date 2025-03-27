import { Component } from '@angular/core';
import { HotProductComponent } from '../hot-product/hot-product.component';
import { CommonModule } from '@angular/common';
import { NewProductComponent } from '../new-product/new-product.component';
@Component({
  selector: 'app-home',
  imports: [HotProductComponent, NewProductComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
