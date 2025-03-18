import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    RouterModule,
    NavbarComponent,

  ],

  templateUrl: './app.component.html',
  styles: [
    `
      .spacer {
        flex: 1 1 auto;
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  showNavbar = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      const excludedRoutes = [
        '/login',
        '/register',
        '/login?returnUrl=%2Fprojects',
        '/login?returnUrl=%2Ftasks',
      ];
      this.showNavbar = !excludedRoutes.includes(this.router.url);
    });
  }
}
