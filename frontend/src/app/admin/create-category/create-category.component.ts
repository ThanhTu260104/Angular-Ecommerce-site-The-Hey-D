import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { LoaiService } from '../../core/services/loai.service';
import { Loai } from '../../data/data';

@Component({
  selector: 'app-create-category',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create-category.component.html',
  styleUrl: './create-category.component.css',
})
export class CreateCategoryComponent {
  loai = new Loai();

  constructor(private loaiService: LoaiService, private router: Router) {
    this.loai.an_hien = 1;
  }

  onSubmit() {
    // Nếu không nhập thứ tự, gán giá trị mặc định
    if (!this.loai.thu_tu && this.loai.thu_tu !== 0) {
      this.loai.thu_tu = 0;
    }
  
    this.loaiService.create(this.loai).subscribe({
      next: () => this.router.navigate(['/admin/category']),
      error: (err) => {
        console.error('Lỗi tạo danh mục:', err);
        alert('❌ ' + (err.error?.thong_bao || 'Tạo thất bại'));
      },
    });
  }
}
