import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../../user/header/header.component';
import { FooterComponent } from '../../../../user/footer/footer.component';

@Component({
  selector: 'app-user-layout',
  imports: [RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.css'
})
export class UserLayoutComponent {

}
