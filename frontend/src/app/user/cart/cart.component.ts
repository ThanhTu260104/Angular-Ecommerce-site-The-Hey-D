import { Component, OnInit } from '@angular/core';
import { CartService } from './../../core/services/cart.service';
import { CommonModule } from '@angular/common'; // xử lí các module của angular
import { ICart } from '../../data/data'; // import interface ICart từ data.ts
import { FormsModule } from '@angular/forms'; //Xử lí các module của angulaim
import { RouterModule } from '@angular/router'; // cầnn import RouterModule để sử dụng routerLink trong template

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  listSP: ICart[] = []; // mảng chứa danh sách sản phẩm trong giỏ hàng

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.listSP = this.cartService.listSanPham(); // lấy danh sách sản phẩm trong giỏ hàng từ service
  }
  suaSoLuong(id: number, soLuong: number) {
    this.cartService.suaSoLuong(id, soLuong); // gọi hàm sửa số lượng sản phẩm trong giỏ hàng
    this.listSP = this.cartService.listSanPham(); // cập nhật lại danh sách sản phẩm trong giỏ hàng
  }
  xoaSanPham(id: number) {
    this.cartService.xoaSanPham(id); // gọi hàm xóa sản phẩm trong giỏ hàng
    this.listSP = this.cartService.listSanPham(); // cập nhật lại danh sách sản phẩm trong giỏ hàng
    return false; // trả về false để không làm mới trang
  }

  xoaGioHang() {
    this.cartService.xoaGioHang(); // gọi hàm xóa giỏ hàng
    this.listSP = this.cartService.listSanPham(); // cập nhật lại danh sách sản phẩm trong giỏ hàng
  }

  getTotalAmount(): number {
    return this.listSP.reduce(
      (total, item) => total + item.gia_mua * item.so_luong,
      0
    );
  }
}
