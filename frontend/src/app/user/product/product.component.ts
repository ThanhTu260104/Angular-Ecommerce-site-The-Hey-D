import { Component } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { ILoai, ISanPham } from '../../data/data';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent {
  constructor(public cartService: CartService) {}

  sp_arr: ISanPham[] = [];
  loai_arr: ILoai[] = [];
  totalItems = 0;
  totalPages = 0;
  pagesToShow: number[] = [];

  filters = {
    category: '',
    priceRange: '',
    discount: '',
    sort: 'newest',
  };

  page = 1;
  limit = 12;

  ngOnInit() {
    this.fetchLoai();
    this.fetchSanPham();
  }

  public formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  }

  fetchLoai() {
    fetch('http://localhost:3005/api/loai')
      .then((res) => res.json())
      .then((data) => (this.loai_arr = data as ILoai[]))
      .catch((err) => console.error('Lỗi khi lấy loại:', err));
  }

  getPriceRange(price: string) {
    switch (price) {
      case 'low':
        return { min: 0, max: 200000 };
      case 'mid':
        return { min: 200000, max: 500000 };
      case 'high':
        return { min: 500000, max: 999999999 };
      default:
        return null;
    }
  }

  fetchSanPham() {
    const url = new URL('http://localhost:3005/api/sanpham');

    if (this.filters.category) {
      url.searchParams.set('category', this.filters.category);
    }

    if (this.filters.priceRange) {
      const range = this.getPriceRange(this.filters.priceRange);
      if (range) {
        url.searchParams.set('minPrice', range.min.toString());
        url.searchParams.set('maxPrice', range.max.toString());
      }
    }

    if (this.filters.sort && this.filters.sort !== 'newest') {
      url.searchParams.set('sort', this.filters.sort);
    }

    url.searchParams.set('page', this.page.toString());
    url.searchParams.set('limit', this.limit.toString());

    fetch(url.toString())
      .then((res) => res.json())
      .then((data) => {
        this.sp_arr = data.items;
        this.totalItems = data.total;
        this.totalPages = Math.ceil(this.totalItems / this.limit);
        this.updatePagination();
      })
      .catch((err) => console.error('Lỗi khi lấy sản phẩm:', err));
  }

  updatePagination() {
    const max = this.totalPages;
    const current = this.page;

    let start = Math.max(1, current - 2);
    let end = Math.min(max, current + 2);

    if (end - start < 4) {
      if (start === 1) end = Math.min(max, start + 4);
      if (end === max) start = Math.max(1, end - 4);
    }

    this.pagesToShow = [];
    for (let i = start; i <= end; i++) {
      this.pagesToShow.push(i);
    }
  }

  chonSapXepEvent(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.chonSapXep(select.value);
  }

  chonLoai(id_loai: string | number) {
    this.filters.category = id_loai.toString();
    this.page = 1;
    this.fetchSanPham();
  }

  chonSapXep(value: string) {
    this.filters.sort = value;
    this.fetchSanPham();
  }

  chonKhoangGia(range: string) {
    this.filters.priceRange = range;
    this.page = 1;
    this.fetchSanPham();
  }

  chuyenTrang(trangMoi: number) {
    this.page = trangMoi;
    this.fetchSanPham();
  }
}
