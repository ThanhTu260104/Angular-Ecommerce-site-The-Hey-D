import { Component } from '@angular/core';
import { HeaderComponent } from './user/header/header.component';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { FooterComponent } from './user/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [
    HeaderComponent,
    CommonModule,
    RouterOutlet,
    RouterModule,
    FooterComponent,
  ],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'frontend';
}
