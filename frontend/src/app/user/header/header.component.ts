import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // cầnn import RouterModule để sử dụng routerLink trong template

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent  implements OnInit{
  isDropdownOpen = false;
  isMobileMenuOpen = false;
  ho_ten: string | null = null;


  ngOnInit(): void {
    this.ho_ten = sessionStorage.getItem('ho_ten');
  }
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
