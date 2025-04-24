import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';


@Component({
  selector: 'app-root',
  imports: [
   
    CommonModule,
    RouterOutlet,
    RouterModule,
  
  ],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})  
export class AppComponent {
  title = 'frontend';
}
