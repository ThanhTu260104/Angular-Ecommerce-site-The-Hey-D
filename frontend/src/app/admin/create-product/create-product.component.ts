import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { LoaiService } from '../../core/services/loai.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ILoai, SanPham, ThuocTinh } from '../../data/data';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css'
})
export class CreateProductComponent implements OnInit {
  loai_arr: ILoai[] = [];
  sanpham: SanPham = new SanPham();
  thuoc_tinh: ThuocTinh = new ThuocTinh();
  previewUrl: string | null = null;
  selectedFile: File | null = null;
  errorMessage: string | null = null;
  errors: { [key: string]: string } = {};

  constructor(
    private productService: ProductService,
    private loaiService: LoaiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLoai();
  }

  onImageChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      this.selectedFile = file;
      this.errors['hinh'] = '';
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.selectedFile = null;
      this.previewUrl = null;
    }
  }
  
  loadLoai() {
    this.loaiService.getAll().subscribe((res) => {
      this.loai_arr = res.data;
    });
  }

  validateForm(): boolean {
    this.errors = {};
    let isValid = true;

    if (!this.sanpham.ten_sp || this.sanpham.ten_sp.trim().length === 0) {
      this.errors['ten_sp'] = 'Tên sản phẩm là bắt buộc.';
      isValid = false;
    } else if (this.sanpham.ten_sp.length < 3) {
       this.errors['ten_sp'] = 'Tên sản phẩm phải có ít nhất 3 ký tự.';
       isValid = false;
    }

    if (this.sanpham.gia === null || this.sanpham.gia === undefined || this.sanpham.gia < 0) {
      this.errors['gia'] = 'Giá là bắt buộc và phải là số không âm.';
      isValid = false;
    }

    if (this.sanpham.gia_km === null || this.sanpham.gia_km === undefined || this.sanpham.gia < 0) {
      this.errors['gia_km'] = 'Giá khuyến mãi là bắt buộc và phải là số không âm.';
      isValid = false;
    }

    if (this.sanpham.gia_km !== null && this.sanpham.gia_km !== undefined && this.sanpham.gia_km < 0) {
        this.errors['gia_km'] = 'Giá khuyến mãi phải là số không âm.';
        isValid = false;
    }

    if (!this.sanpham.id_loai) {
      this.errors['id_loai'] = 'Vui lòng chọn loại sản phẩm.';
      isValid = false;
    }

    if (!this.selectedFile) {
      this.errors['hinh'] = 'Vui lòng chọn hình ảnh sản phẩm.';
      isValid = false;
    }

    if (this.thuoc_tinh.can_nang !== null && this.thuoc_tinh.can_nang !== undefined && this.thuoc_tinh.can_nang < 0) {
        this.errors['can_nang'] = 'Cân nặng phải là số không âm.';
        isValid = false;
    }

    if (!isValid) {
      this.errorMessage = 'Vui lòng kiểm tra lại các trường thông tin.';
    } else {
      this.errorMessage = null;
    }

    return isValid;
  }

  onSubmit() {
    this.errorMessage = null;

    if (!this.validateForm()) {
      const firstErrorKey = Object.keys(this.errors)[0];
      if (firstErrorKey) {
          const firstInvalidElement = document.querySelector(`[name="${firstErrorKey}"]`);
          firstInvalidElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    this.productService.uploadImage(this.selectedFile!).subscribe({
      next: (uploadRes) => {
        const payload = {
          ...this.sanpham,
          hot: this.sanpham.hot ? '1' : '0',
          an_hien: this.sanpham.an_hien ? '1' : '0',
          hinh: uploadRes.url,
          hinh_public_id: uploadRes.public_id,
          thuoc_tinh: this.thuoc_tinh
        };

        this.productService.add(payload).subscribe({
          next: () => {
            alert('Thêm sản phẩm thành công!');
            this.router.navigate(['/admin/product']);
          },
          error: (addError) => {
            console.error("Lỗi khi thêm sản phẩm:", addError);
            this.errorMessage = `Lỗi khi thêm sản phẩm: ${addError.error?.thong_bao || addError.message}`;
          }
        });
      },
      error: (uploadError) => {
        console.error("Lỗi khi upload ảnh:", uploadError);
        this.errorMessage = `Lỗi khi upload ảnh: ${uploadError.error?.thong_bao || uploadError.message}`;
      }
    });
  }
}
