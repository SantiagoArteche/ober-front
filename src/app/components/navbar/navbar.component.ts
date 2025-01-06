import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public token = localStorage.getItem('token');
  public currentUrl: string | null = null;

  logout() {
    if (this.token) {
      localStorage.removeItem('token');

      this.router.navigate(['/login']);
    }
  }
}
