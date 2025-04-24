import { Component, OnInit } from '@angular/core';
import { LoaiService } from '../../core/services/loai.service';
import { CommonModule } from '@angular/common';
import { ILoai } from '../../data/data';
import { PaginationComponent } from '../pagination/pagination.component';
import { RouterModule, RouterLink } from '@angular/router';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-category',
  imports: [CommonModule, RouterModule, RouterLink, PaginationComponent, SearchComponent],
  templateUrl: './category.component.html',
  standalone: true,
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {
  loai_arr: ILoai[] = [];
  searchTerm: string = '';

  constructor(private loaiService: LoaiService) {}

  ngOnInit() {
    this.loadData();
  }

  page: number = 1;
  totalPages: number = 1;
  limit: number = 10;

  onPageChange(newPage: number) {
    this.page = newPage;
    this.loadData();
  }

  onSearch(term: string) {
    this.searchTerm = term;
    this.page = 1; // Reset to first page when searching
    this.loadData();
  }
  
  loadData() {
    this.loaiService.getAll({ page: this.page, limit: this.limit, search: this.searchTerm }).subscribe(res => {
      this.loai_arr = res.data;
      this.totalPages = Math.ceil(res.total / this.limit);
    });
  }

  xoaLoai(id: number) {
    if(confirm('Bạn có chắc chắn muốn xóa danh mục này không?')) {
      this.loaiService.delete(id).subscribe(() => this.loadData());
    }
  }

  xoaId: number | null = null;
  ten_loai_xoa: string | null = null;
  
  showDeleteModal(id: number) {
    const item = this.loai_arr.find(loai => loai.id === id);
    if (item) {
      this.ten_loai_xoa = item.ten_loai;
      this.xoaId = id;
    }
  }
  
  hideDeleteModal() {
    this.xoaId = null;
    this.ten_loai_xoa = null;
  }
  
  confirmDelete() {
    if (this.xoaId !== null) {
      this.loaiService.delete(this.xoaId).subscribe(() => {
        this.loadData();
        this.hideDeleteModal();
      });
    }
  }
}
