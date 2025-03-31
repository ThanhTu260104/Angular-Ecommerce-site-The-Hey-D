import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Có khả năng sử dụng ngIf và ngFor
import { FormsModule } from '@angular/forms'; // Có khả năng sử dụng ngModel
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  user = {email:"", mat_khau:"",go_lai_mat_khau:"", ho_ten:""}; // biến user này sẽ được gán giá trị từ form
  thong_bao:string = "";
  errcolor:boolean = false; // nếu lỗi thì true


  constructor(private router: Router) {}
  dangky() {
    const opt = {
      method: 'POST',
      body: JSON.stringify(this.user),
      headers: { 'Content-Type': 'application/json' }
    };

    fetch('http://localhost:3005/api/dangky', opt)
      .then(res => res.json())
      .then(data => {
        this.thong_bao = data.thong_bao;
        this.errcolor = !data.thong_bao.toLowerCase().includes("thành công");

        // ✅ Nếu thành công, chuyển trang sau 5 giây
        if (!this.errcolor) {
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 5000);
        }
      })
      .catch(err => {
        console.error("Lỗi fetch:", err);
        this.thong_bao = "Có lỗi khi gửi dữ liệu";
        this.errcolor = true;
      });
  }
}