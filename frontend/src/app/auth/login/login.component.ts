import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  user = { email: "", mat_khau: "" };
  thong_bao: string = "";
  errcolor: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // ✅ Hiển thị thông báo nếu được redirect từ authGuard
    const msg = sessionStorage.getItem('thong_bao');
    if (msg) {
      this.thong_bao = msg;
      this.errcolor = true;
      sessionStorage.removeItem('thong_bao');

      setTimeout(() => {
        this.thong_bao = '';
      }, 5000);
    }
  }

  dangnhap() {
    const opt = {
      method: 'POST',
      body: JSON.stringify(this.user),
      headers: { 'Content-Type': 'application/json' }
    };

    fetch('http://localhost:3005/api/dangnhap', opt)
      .then(res => res.json())
      .then(data => {
        this.thong_bao = data.thong_bao;
        this.errcolor = !data.thong_bao.toLowerCase().includes('thành công');

        if (data.token) {
          sessionStorage.setItem('token', data.token);
          sessionStorage.setItem('email', data.info.email);
          sessionStorage.setItem('ho_ten', data.info.ho_ten);
          sessionStorage.setItem('expiresIn', data.expiresIn);

          setTimeout(() => {
            this.router.navigate(['/']);
          }, 3000);
        }
      })
      .catch(err => {
        console.error("Lỗi:", err);
        this.thong_bao = "Có lỗi khi đăng nhập: " + err.message;
        this.errcolor = true;
      });
  }
}
