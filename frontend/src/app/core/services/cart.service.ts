import { Injectable } from '@angular/core';
import { ICart, ISanPham } from '../../data/data';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  themVaoGio(sp: ISanPham) {
    let sp_arr = JSON.parse(localStorage.getItem('cart') || '[]') as ICart[]; // lấy giỏ hàng từ localStorage
    let index = sp_arr.findIndex((s) => s.id === sp.id); // tìm sản phẩm trong giỏ hàng
    if (index >= 0) {
      sp_arr[index].so_luong++;
    } // nếu sản phẩm đã có trong giỏ hàng thì tăng số lượng lên 1
    else {
      let c: ICart = {
        id: sp.id,
        ten_sp: sp.ten_sp,
        so_luong: 1,
        gia_mua: sp.gia_km,
        hinh: sp.hinh,
      }; // tạo đối tượng sản phẩm mới
      sp_arr.push(c); // thêm sản phẩm vào giỏ hàng
    }
    localStorage.setItem('cart', JSON.stringify(sp_arr)); // lưu giỏ hàng vào localStorage
    alert(`Thêm sản phẩm vào giỏ hàng thành công! ${sp.ten_sp}`); // thông báo thêm sản phẩm thành công
  }

  laySanPham() {}

  suaSoLuong(id: number, so_luong: number) {
    let sp_arr = JSON.parse(localStorage.getItem('cart') || '[]') as ICart[]; // lấy giỏ hàng từ localStorage
    let index = sp_arr.findIndex((s) => s.id === id); // tìm sản phẩm trong giỏ hàng
    if (index !== -1 && so_luong > 0) {
      sp_arr[index].so_luong = so_luong; // sửa số lượng sản phẩm trong giỏ hàng
    } else if (index !== -1 && so_luong <= 0) {
      sp_arr.splice(index, 1); // xóa sản phẩm khỏi giỏ hàng nếu số lượng <= 0
    }
    localStorage.setItem('cart', JSON.stringify(sp_arr)); // lưu giỏ hàng vào localStorage
  }

  xoaSanPham(id: number) {
    let sp_arr = JSON.parse(localStorage.getItem('cart') || '[]') as ICart[]; // lấy giỏ hàng từ localStorage
    let index = sp_arr.findIndex((s) => s.id === id); // tìm sản phẩm trong giỏ hàng
    if (index >= 0) {
      sp_arr.splice(index, 1); // xóa sản phẩm khỏi giỏ hàng
    }
    localStorage.setItem('cart', JSON.stringify(sp_arr)); // lưu giỏ hàng vào localStorage
  }
  xoaGioHang() {
    localStorage.removeItem('cart'); // xóa giỏ hàng khỏi localStorage
  }
  listSanPham() {
    return JSON.parse(localStorage.getItem('cart') || '[]') as ICart[]; // lấy giỏ hàng từ localStorage
  }
}
