import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  @Input() page: number = 1;
  @Input() totalPages: number = 1;
  @Output() pageChange = new EventEmitter<number>();

  get visiblePages(): (number | string)[] {
    const pages: (number | string)[] = [];
    const maxVisible = 3;
    const half = Math.floor(maxVisible / 2);

    let start = Math.max(1, this.page - half);
    let end = Math.min(this.totalPages, this.page + half);

    if (end - start + 1 < maxVisible) {
      if (start === 1) {
        end = Math.min(this.totalPages, start + maxVisible - 1);
      } else if (end === this.totalPages) {
        start = Math.max(1, end - maxVisible + 1);
      }
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('...');
    }

    for (let i = start; i <= end; i++) pages.push(i);

    if (end < this.totalPages) {
      if (end < this.totalPages - 1) pages.push('...');
      pages.push(this.totalPages);
    }

    return pages;
  }

  isNumber(value: any): boolean {
    return typeof value === 'number';
  }

  goToPage(p: number | string) {
    if (typeof p === 'number' && p !== this.page) {
      this.pageChange.emit(p);
    }
  }

  prevPage() {
    if (this.page > 1) this.pageChange.emit(this.page - 1);
  }

  nextPage() {
    if (this.page < this.totalPages) this.pageChange.emit(this.page + 1);
  }
}


