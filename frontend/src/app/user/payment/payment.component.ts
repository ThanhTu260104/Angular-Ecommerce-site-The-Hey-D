import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { ICart } from '../../data/data';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [FormsModule, NgClass, NgIf],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css',
})
export class PaymentComponent {
  constructor(public cartService: CartService) {}

  donhang = { ho_ten: '', email: '', ghi_chu: '' };
  thong_bao: string = '';
  dang_xu_ly = false;

  luudonhang() {
    if (this.dang_xu_ly) return;
    this.dang_xu_ly = true;

    const listSP: ICart[] = this.cartService.listSanPham();
    if (listSP.length === 0) {
      this.thong_bao = 'Chưa có sản phẩm nào nên chưa lưu đơn hàng';
      this.dang_xu_ly = false;
      return;
    }

    if (this.donhang.ho_ten.trim() === '') {
      this.thong_bao = 'Chưa nhập họ tên';
      this.dang_xu_ly = false;
      return;
    }

    const opt = {
      method: 'POST',
      body: JSON.stringify(this.donhang),
      headers: { 'Content-Type': 'application/json' },
    };

    fetch('http://localhost:3005/api/luudonhang', opt)
      .then((res) => res.json())
      .then((data) => {
        this.thong_bao = data.thong_bao;

        if (data.dh !== undefined) {
          const id_dh = data.dh.id;

          const promises = listSP.map((sp) => {
            const chiTiet = {
              id_dh: id_dh,
              id_sp: sp.id,
              so_luong: sp.so_luong,
            };

            const chiTietOpt = {
              method: 'POST',
              body: JSON.stringify(chiTiet),
              headers: { 'Content-Type': 'application/json' },
            };

            return fetch('http://localhost:3005/api/luugiohang', chiTietOpt).catch((err) =>
              console.log('Lỗi lưu sản phẩm', sp)
            );
          });

          return Promise.all(promises);
        }
        return;
      })
      .catch((err) => {
        this.thong_bao = 'Đã có lỗi xảy ra khi lưu đơn hàng!';
        console.error(err);
      })
      .finally(() => {
        this.dang_xu_ly = false;
      });
  }
}
