import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../features/authentication/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css'
})

export class Header {

  title: string = 'Smart Fleet Management';
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout() {

    this.authService.logout();

    this.router.navigate(['/login']);

  }

}
