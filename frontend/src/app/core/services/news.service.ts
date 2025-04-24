import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITinTuc } from '../../data/data';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiUrl = 'http://localhost:3005/api/tintuc';

  constructor(private http: HttpClient) { }

  // Lấy danh sách tin tức
  getNews(): Observable<ITinTuc[]> {
    return this.http.get<ITinTuc[]>(this.apiUrl);
  }

  // Lấy chi tiết tin tức theo id
  getNewsById(id: number): Observable<ITinTuc> {
    return this.http.get<ITinTuc>(`${this.apiUrl}/${id}`);
  }

  // Thêm tin tức mới
  createNews(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  // Cập nhật tin tức
  updateNews(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }

  // Xóa tin tức
  deleteNews(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
