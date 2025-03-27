import { Component } from '@angular/core';
import { ISanPham } from './../../data/data';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CartService } from './../../core/services/cart.service';
@Component({
  selector: 'app-product-detail',
  standalone: true, // sử dụng standalone component
  imports: [CommonModule],

  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent {
  constructor(public cartService: CartService, private route: ActivatedRoute) {}

  id: number = 0; // id của sản phẩm
  sp: ISanPham = {} as ISanPham; // biến lưu trữ sản phẩm
  // hàm khởi tạo
  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id')); // lấy id từ đường dẫn
    fetch(`http://localhost:3005/api/sp/${this.id}`).then((res) =>
      res
        .json() // chuyển đổi dữ liệu thành đối tượng JSON
        .then((data) => (this.sp = data as ISanPham)) // gán dữ liệu vào biến sp
        .catch(
          (error) =>
            console.error('Lỗi khi fecth dữ liệu chi tiết sản phẩm ', error) // nếu có lỗi thì in ra console
        )
    );
  }
  // format giá tiền
  public formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  }
}
