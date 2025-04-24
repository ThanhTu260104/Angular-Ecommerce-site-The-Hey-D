import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({

  providedIn: 'root'
})
export class AttributeService {
  private thuocTinhUrl = 'http://localhost:3005/api/admin/thuoctinh';

  constructor(private http: HttpClient) {}
// lấy tất cả thuộc tính
  getAll(): Observable<any> {
    return this.http.get(this.thuocTinhUrl);
  }
  // lấy thuộc tính theo sản phẩm
  getByProductId(id_sp: number): Observable<any> {
    return this.http.get(`${this.thuocTinhUrl}/sanpham/${id_sp}`);
  }

  add(data: any): Observable<any> {
    return this.http.post(this.thuocTinhUrl, data);
  }
  // cập nhật thuộc tính
  update(id_sp: number, data: any): Observable<any> {
    return this.http.put(`${this.thuocTinhUrl}/sanpham/${id_sp}`, data);
  }
  // xóa thuộc tính
  delete(id_sp: number): Observable<any> {
    return this.http.delete(`${this.thuocTinhUrl}/sanpham/${id_sp}`);
  }
}
