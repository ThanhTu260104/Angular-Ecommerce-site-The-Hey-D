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
  luudonhang() {
    let listSP: ICart[] = this.cartService.listSanPham();
    if (listSP.length == 0) {
      this.thong_bao = 'Chưa có sản phẩm nào nên chưa lưu đơn hàng';
      return;
    }
    if (this.donhang.ho_ten.trim() == '') {
      this.thong_bao = 'Chưa nhập họ tên';
      return;
    }
    let opt = {
      method: 'post',
      body: JSON.stringify(this.donhang),
      headers: { 'Content-Type': 'application/json' },
    };
    fetch(`http://localhost:3005/api/luudonhang`, opt)
      .then((res) => res.json())
      .then((data) => {
        this.thong_bao = data.thong_bao;
        if (data.dh != undefined) {
          let id_dh = data.dh.id;
          //lưu chi tiết đơn hàng
          for (let i = 0; i < listSP.length; i++) {
            let sp = listSP[i];
            let t = { id_dh: id_dh, id_sp: sp.id, so_luong: sp.so_luong };
            let opt = {
              method: 'POST',
              body: JSON.stringify(t),
              headers: { 'Content-Type': 'application/json' },
            };
            fetch('http://localhost:3005/api/luugiohang', opt)
              .then((res) => res.json())
              .catch((err) => console.log('Lỗi lưu sản phẩm', sp));
          }
        }
      });
  } //luudonhang
} //class
