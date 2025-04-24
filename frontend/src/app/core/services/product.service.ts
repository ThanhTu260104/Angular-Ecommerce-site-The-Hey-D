import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SanPham } from '../../data/data';
import { Loai } from '../../data/data';
import { ISanPham } from '../../data/data';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3005/api';

  constructor(private http: HttpClient) {}

  getAll(
    page: number = 1, 
    limit: number = 10, 
    searchTerm: string = '', 
    categoryId?: number, 
    priceSort?: string,
    anHien?: number,
    hot?: number
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (searchTerm && searchTerm.trim() !== '') {
      params = params.set('tu_khoa', searchTerm);
    }

    if (categoryId && categoryId > 0) {
      params = params.set('id_loai', categoryId.toString());
    }

    if (priceSort) {
      params = params.set('sort', `gia:${priceSort}`);
    }

    console.log('anHien is:', anHien, typeof anHien);
    console.log('hot is:', hot, typeof hot);

    // Chuyển đổi sang number và kiểm tra
    const anHienNum = Number(anHien); 
    const hotNum = Number(hot);

    // Chỉ thêm params khi giá trị là 0 hoặc 1
    if (anHienNum === 0 || anHienNum === 1) {
      params = params.set('an_hien', anHienNum.toString());
    }

    if (hotNum === 0 || hotNum === 1) {
      params = params.set('hot', hotNum.toString());
    }

    console.log('Request params:', params.toString());
    return this.http.get(`${this.apiUrl}/admin/sanpham`, { params });
  }

  getById(id: number): Observable<SanPham> {
    return this.http.get<SanPham>(`${this.apiUrl}/admin/sanpham/${id}`);
  }

  add(sp: Partial<ISanPham>): Observable<any> {
    return this.http.post(this.apiUrl + '/admin/sanpham', sp);
  }
  

  update(id: number, sp: SanPham): Observable<SanPham> {
    return this.http.put<SanPham>(this.apiUrl + '/admin/sanpham/' + id, sp);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(this.apiUrl + '/admin/sanpham/' + id);
  }

  uploadImage(image: File): Observable<{ url: string; public_id: string }> {
    const formData = new FormData();
    formData.append('image', image);
    return this.http.post<{ url: string; public_id: string }>(
      this.apiUrl + '/upload',
      formData
    );
  }
}
