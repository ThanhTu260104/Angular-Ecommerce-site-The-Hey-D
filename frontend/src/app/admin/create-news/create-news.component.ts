import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-news',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-news.component.html',
  styleUrl: './create-news.component.css'
})
export class CreateNewsComponent implements OnInit {
  news = {
    tieu_de: '',
    mo_ta: '',
    noi_dung: '',
    hinh: null as File | null,
    id_loai: '', // Thêm trường id_loai để lưu danh mục tin
  };

  categories: Array<{ id: number; ten_loai: string }> = []; // Danh sách danh mục tin

  constructor(
    private http: HttpClient,
    public router: Router
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.http.get('http://localhost:3005/api/loaitin').subscribe({
      next: (response: any) => {
        this.categories = response; // Gán danh mục từ API
      },
      error: (error) => {
        console.error('Lỗi khi lấy danh mục tin:', error);
      },
    });
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.news.hinh = event.target.files[0];
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('tieu_de', this.news.tieu_de);
    formData.append('mo_ta', this.news.mo_ta);
    formData.append('noi_dung', this.news.noi_dung);
    formData.append('id_loai', this.news.id_loai); // Gửi danh mục tin
    if (this.news.hinh) {
      formData.append('hinh', this.news.hinh);
    }

    this.http.post('http://localhost:3005/api/tintuc', formData)
      .subscribe({
        next: (response: any) => {
          alert('Thêm tin tức thành công!');
          this.router.navigate(['/admin/news']);
        },
        error: (error) => {
          console.error('Lỗi khi thêm tin tức:', error);
          alert('Có lỗi xảy ra khi thêm tin tức!');
        }
      });
  }
}
