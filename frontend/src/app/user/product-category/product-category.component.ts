import { ISanPham, ILoai } from './../../data/data';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-product-category',
  imports: [CommonModule],
  templateUrl: './product-category.component.html',
  styleUrl: './product-category.component.css',
})
export class ProductCategoryComponent {
  constructor(private route: ActivatedRoute) {}
  sp_arr: ISanPham[] = []; // mảng chứa danh sách sản phẩm
  id: number = 0; // biến lưu id sản phẩm
  loai: ILoai = {} as ILoai; // biến lưu loại sản phẩm4

  public formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  }
  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id')); // lấy id từ đưchờng dẫn
    fetch(`http://localhost:3005/api/sptrongloai/${this.id}`) // gọi api lấy danh sách sản phẩm
      .then((res) => res.json())
      .then((data) => {
        this.sp_arr = data as ISanPham[]; // gán dữ liệu trả về cho mảng sản phẩm
      })
      .catch((err) =>
        console.error('Lỗi khi gọi API sản phẩm trong loại:', err)
      ); // xử lý lỗi nếu có
    fetch(`http://localhost:3005/api/loai/${this.id}`) // gọi api lấy danh sách sản phẩm
      .then((res) => res.json())
      .then((data) => {
        this.sp_arr = data as ISanPham[]; // gán dữ liệu trả về cho mảng sản phẩm
      })
      .catch((err) =>
        console.error('Lỗi khi gọi API sản phẩm trong loại:', err)
      ); // xử lý lỗi nếu có
  }
}
