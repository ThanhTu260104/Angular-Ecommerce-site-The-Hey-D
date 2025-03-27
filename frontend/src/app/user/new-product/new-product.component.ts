import { CartService } from './../../core/services/cart.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ISanPham } from '../../data/data';

@Component({
  selector: 'app-new-product',
  imports: [CommonModule],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.css',
})
export class NewProductComponent {
  constructor(public cartService: CartService) {} // khởi tạo dịch vụ giỏ hàng
  sp_arr: ISanPham[] = []; // mảng chứa danh sách sản phẩm

  public formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  }

  ngOnInit() {
    fetch('http://localhost:3005/api/spmoi/4')
      .then((res) => res.json())
      .then((data) => (this.sp_arr = data as ISanPham[])) // chuyển dữ liệu trả về thành mảng ISanPham
      .catch((err) => console.error('Lỗi khi lấy dữ liệu từ sphot:', err)); // xử lý lỗi nếu có
  }
}
