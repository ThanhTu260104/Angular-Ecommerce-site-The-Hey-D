import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ILoai } from '../../data/data';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaiService {
  private apiUrl = 'http://localhost:3005/api/admin/loai';
  constructor(private http: HttpClient) { }

  getAll(params: { page?: number; limit?: number; search?: string } = {}): Observable<{ data: ILoai[], total: number }> {
    return this.http.get<{ data: ILoai[], total: number }>(this.apiUrl, { params });
  }
  
  getOne(id: number): Observable<ILoai> {
    return this.http.get<ILoai>(`${this.apiUrl}/${id}`);
  }

  create(loai: ILoai): Observable<ILoai> {
    return this.http.post<ILoai>(this.apiUrl, loai);
  }

  update(id: number, loai: ILoai): Observable<ILoai> {
    return this.http.put<ILoai>(`${this.apiUrl}/${id}`, loai);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
