import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-pass',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './change-pass.component.html',
  styleUrl: './change-pass.component.css'
})
export class ChangePassComponent {
  user = {
    email: '',
    pass_old: '',
    pass_new1: '',
    pass_new2: ''
  };

  thong_bao = '';
  errcolor = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // ✅ Đọc thong_bao từ sessionStorage nếu có
    const msg = sessionStorage.getItem('thong_bao');
    if (msg) {
      this.thong_bao = msg;
      this.errcolor = true;
      sessionStorage.removeItem('thong_bao');

      setTimeout(() => {
        this.thong_bao = '';
      }, 5000);
    }

    // Lấy email từ localStorage
    let u = localStorage.getItem('user') || '{}';
    this.user.email = JSON.parse(u).email;
  }

  doipass() {
    let token = sessionStorage.getItem('token')?.trim();
    if (!token) {
      this.thong_bao = 'Bạn chưa đăng nhập!';
      this.errcolor = true;

      setTimeout(() => {
        this.router.navigateByUrl('/login');
      }, 5000);

      return;
    }

    const opt = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(this.user),
    };

    fetch('http://localhost:3005/api/doipass', opt)
      .then(res => res.json())
      .then(data => {
        if (data.thong_bao === 'Đã cập nhật') {
          this.thong_bao = 'Đổi mật khẩu thành công!';
          this.errcolor = false;
          setTimeout(() => {
            window.location.reload();
          }, 5000);
        } else {
          this.thong_bao = data.thong_bao || 'Có lỗi xảy ra!';
          this.errcolor = true;
        }
      })
      .catch(err => {
        this.thong_bao = 'Lỗi kết nối đến server!';
        this.errcolor = true;
      });
  }
}
