import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './modules/shared/components/navbar/navbar.component';
import { FooterComponent } from './modules/shared/components/footer/footer.component';
import { ApiService } from './modules/core/services/api/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'tfg';

  constructor(private api: ApiService) {
    this.api.preload();
  }
}
