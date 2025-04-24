import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoaiService } from '../../core/services/loai.service';
import { ILoai } from '../../data/data';
import { Loai } from '../../data/data';


@Component({
  selector: 'app-edit-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.css'
})

export class EditCategoryComponent implements OnInit {
  loai: Loai = new Loai();
  isEdit: boolean = false;
//Khi có id trong route gọi hàm getOne và đặt isEdit thành true
//Khi không có id trong route gọi hàm create và đặt isEdit thành false
//Khi submit form: nếu là edit thì gọi hàm update và đặt isEdit thành true
//Khi submit form: nếu không có id trong route thì gọi hàm create và đặt isEdit thành false
  constructor(
    private loaiService: LoaiService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.loaiService.getOne(+id).subscribe((data) => (this.loai = data));
    }
  }

  onSubmit() {
    if (this.isEdit) {
      this.loaiService.update(this.loai.id, this.loai).subscribe(() => {
        this.router.navigate(['/admin/category']);
      });
    } else {
      this.loaiService.create(this.loai).subscribe(() => {
        this.router.navigate(['/admin/category']);
      });
    }
  }
}

