import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NewsService } from '../../core/services/news.service';
import { ITinTuc } from '../../data/data';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent implements OnInit {
  newsList: ITinTuc[] = [];
  searchTerm: string = '';
  selectedCategory: string = 'all';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  Math = Math; // Add Math object for template use

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(): void {
    this.newsService.getNews().subscribe({
      next: (data) => {
        this.newsList = data;
        this.totalItems = data.length;
      },
      error: (error) => {
        console.error('Error loading news:', error);
      }
    });
  }

  deleteNews(id: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      this.newsService.deleteNews(id).subscribe({
        next: () => {
          this.newsList = this.newsList.filter(news => news.id !== id);
          this.totalItems--;
        },
        error: (error) => {
          console.error('Error deleting news:', error);
        }
      });
    }
  }

  editNews(id: number): void {
    // TODO: Implement edit functionality
    console.log('Edit news with id:', id);
  }

  showAddModal(): void {
    // TODO: Implement add modal functionality
    console.log('Show add modal');
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get paginatedNews(): ITinTuc[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.newsList.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  formatDate(date: string | null): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('vi-VN');
  }
}
