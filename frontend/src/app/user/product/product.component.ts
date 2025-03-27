import { Component } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { ILoai, ISanPham } from '../../data/data';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-product',
  imports: [CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent {
  constructor(public cartService: CartService) {}
  sp_arr: ISanPham[] = []; // mảng chứa danh sách sản phẩm
  loai_arr: ILoai[] = []; // mảng chứa danh sách loại sản phẩm
  public formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  }
  filters = {
    category: '',
    priceRange: '',
    discount: '',
    sort: 'newest',
  };

  page = 1;
  limit = 16;

  ngOnInit() {
    fetch('http://localhost:3005/api/sanpham')
      .then((res) => res.json())
      .then((data) => (this.sp_arr = data as ISanPham[])) // chuyển dữ liệu trả về thành mảng ISanPham
      .catch((err) => console.error('Lỗi khi lấy dữ liệu từ sphot:', err)); // xử lý lỗi nếu có
    console.log(this.sp_arr);
    fetch('http://localhost:3005/api/loai')
      .then((res) => res.json())
      .then((data) => (this.loai_arr = data as ILoai[])) // chuyển dữ liệu trả về thành mảng ISanPham
      .catch((err) => console.error('Lỗi khi lấy dữ liệu từ sphot:', err)); // xử lý lỗi nếu có
    console.log(this.loai_arr);
  }
}
