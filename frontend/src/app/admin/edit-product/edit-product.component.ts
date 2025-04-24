import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { AttributeService } from '../../core/services/attribute.service';
import { LoaiService } from '../../core/services/loai.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ISanPham, ILoai, IThuocTinh, SanPham, ThuocTinh } from '../../data/data';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent implements OnInit {
  loai_arr: ILoai[] = [];
  sanpham: SanPham = new SanPham();
  thuoc_tinh: ThuocTinh = new ThuocTinh();
  previewUrl: string | null = null;

  constructor(
    private productService: ProductService,
    private loaiService: LoaiService,
    private route: ActivatedRoute,
    private attributeService: AttributeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLoai();
  
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getById(+id).subscribe(res => {
        this.sanpham = res;
        this.thuoc_tinh = res.thuoc_tinh || new ThuocTinh();
        this.previewUrl = res.hinh;
      });
    }
  }

  onImageChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
  
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file); 
    }
  }

  loadLoai() {
    this.loaiService.getAll().subscribe((data: { data: ILoai[], total: number }) => {
      this.loai_arr = data.data;
    });
  }

  onSubmit() {
    const fileInput = document.querySelector<HTMLInputElement>('#imageInput');
    const file = fileInput?.files?.[0];
  
    const updateProduct = (imageUrl: string, publicId: string) => {
      const payload = {
        ...this.sanpham,
        hinh: imageUrl,
        hinh_public_id: publicId,
        thuoc_tinh: this.thuoc_tinh
      };
  
      this.productService.update(this.sanpham.id, payload).subscribe(() => {
        alert('Cập nhật sản phẩm thành công!');
        this.router.navigate(['/admin/product']);
      });
    };
  
    if (file) {
      this.productService.uploadImage(file).subscribe({
        next: (res) => updateProduct(res.url, res.public_id),
        error: () => alert('Lỗi khi upload ảnh!')
      });
    } else {
      updateProduct(this.sanpham.hinh, this.sanpham.hinh_public_id || '');
    }
  }
}
