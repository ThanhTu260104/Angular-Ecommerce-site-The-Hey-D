import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { LoaiService } from '../../core/services/loai.service';
import { AttributeService } from '../../core/services/attribute.service';
import { SanPham } from '../../data/data';
import { Loai } from '../../data/data';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouterLink } from '@angular/router';
import { PaginationComponent } from '../pagination/pagination.component';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, RouterLink, PaginationComponent, SearchComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {
  sp_arr: SanPham[] = [];
  loai_arr: Loai[] = [];
  searchTerm: string = '';
  selectedCategory: number = 0;
  selectedPriceSort: string = '';
  selectedAnHien: number = -1;
  selectedHot: number = -1;

  // Phân trang 
  page: number = 1;
  totalPages: number = 1;
  limit: number = 10;
  
  onPageChange(newPage: number) {
    this.page = newPage;
    this.loadData();
  }

  onSearch(term: string) {
    this.searchTerm = term;
    this.page = 1;
    this.loadData();
  }

  onCategoryChange(categoryId: number) {
    this.selectedCategory = categoryId;
    this.page = 1;
    this.loadData();
  }

  onPriceSortChange(sort: string) {
    this.selectedPriceSort = sort;
    this.page = 1;
    this.loadData();
  }

  onAnHienChange(value: number) {
    console.log('onAnHienChange:', value, typeof value);
    this.selectedAnHien = value;
    this.page = 1;
    this.loadData();
  }

  onHotChange(value: number) {
    console.log('onHotChange:', value, typeof value);
    this.selectedHot = value;
    this.page = 1;
    this.loadData();
  }

  showDeleteModal: boolean = false;
  showDetailModal: boolean = false;
  selectedProduct: SanPham | null = null;

  constructor(
    private productService: ProductService,
    private loaiService: LoaiService,
    private attributeService: AttributeService
  ) {}

  ngOnInit(): void {
    // Khởi tạo giá trị ban đầu
    this.selectedAnHien = -1;
    this.selectedHot = -1;
    this.loadData();
  }

  loadData() {
    console.log('Loading data with filters:', {
      category: this.selectedCategory,
      priceSort: this.selectedPriceSort,
      anHien: this.selectedAnHien,
      hot: this.selectedHot
    });

    this.productService.getAll(
      this.page, 
      this.limit, 
      this.searchTerm,
      this.selectedCategory,
      this.selectedPriceSort,
      this.selectedAnHien,
      this.selectedHot
    ).subscribe({
      next: (data: any) => {
        console.log('Received data:', data);
        if (data && data.items) {
          this.sp_arr = data.items;
          this.totalPages = Math.ceil(data.total / this.limit);
        }
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.sp_arr = [];
        this.totalPages = 1;
      }
    });

    this.loaiService.getAll().subscribe({
      next: (data: { data: Loai[]; total: number }) => {
        console.log('Loaded categories:', data);
        this.loai_arr = data.data;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loai_arr = [];
      }
    });
  }

  deleteProduct(id: number) {
    this.productService.delete(id).subscribe(() => {
      this.sp_arr = this.sp_arr.filter(sp => sp.id !== id);
      this.hideDeleteModal();
    });
  }

  showDeleteModalHandler(product: SanPham) {
    this.selectedProduct = product;
    this.showDeleteModal = true;
  }

  hideDeleteModal() {
    this.showDeleteModal = false;
    this.selectedProduct = null;
  }

  showDetailProduct(product: SanPham) {
    this.selectedProduct = product;
    this.showDetailModal = true;
  }

  hideDetailProduct() {
    this.showDetailModal = false;
    this.selectedProduct = null;
  }
}
