import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../features/authentication/services/auth.service';
import { LayoutService } from '../../core/services/layout.service';

export interface BreadcrumbItem {
  label: string;
  url: string;
}

declare var webkitSpeechRecognition: any;

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {

  title = 'Smart Fleet Management';
  isDarkMode = false;
  breadcrumbs: BreadcrumbItem[] = [];

  isListening = false;
  voiceTranscript = '';
  voiceFeedback = '';

  private routeMap: Record<string, { title: string; crumbs: BreadcrumbItem[] }> = {
    '/dashboard':          { title: 'Dashboard',             crumbs: [{ label: 'Home', url: '/dashboard' }, { label: 'Dashboard', url: '/dashboard' }] },
    '/fleet':              { title: 'Vehicle Fleet',          crumbs: [{ label: 'Home', url: '/dashboard' }, { label: 'Fleet Management', url: '/fleet' }] },
    '/drivers':            { title: 'Driver Roster',          crumbs: [{ label: 'Home', url: '/dashboard' }, { label: 'Driver Management', url: '/drivers' }] },
    '/tracking':           { title: 'Real-Time Tracking',     crumbs: [{ label: 'Home', url: '/dashboard' }, { label: 'Live Tracking', url: '/tracking' }] },
    '/routes':             { title: 'Routes Management',      crumbs: [{ label: 'Home', url: '/dashboard' }, { label: 'Routes', url: '/routes' }] },
    '/trips':              { title: 'Trips Overview',         crumbs: [{ label: 'Home', url: '/dashboard' }, { label: 'Trip Management', url: '/trips' }] },
    '/fuel':               { title: 'Fuel & Expenses',        crumbs: [{ label: 'Home', url: '/dashboard' }, { label: 'Fuel Analytics', url: '/fuel' }] },
    '/route-optimization': { title: 'Route Optimizer',        crumbs: [{ label: 'Home', url: '/dashboard' }, { label: 'Route Optimization', url: '/route-optimization' }] },
    '/reports':            { title: 'Reports & Export',       crumbs: [{ label: 'Home', url: '/dashboard' }, { label: 'Reports', url: '/reports' }] },
    '/settings':           { title: 'System Settings',        crumbs: [{ label: 'Home', url: '/dashboard' }, { label: 'Settings', url: '/settings' }] }
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    public layoutService: LayoutService
  ) {}

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      document.body.classList.add('dark-theme');
    }

    this.updateBreadcrumbs(this.router.url);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateBreadcrumbs(event.urlAfterRedirects || event.url);
      });
  }

  // Voice AI Assistant Speech Listener
  toggleVoiceControl(): void {
    if (typeof webkitSpeechRecognition === 'undefined') {
      this.simulateVoiceCommand();
      return;
    }

    if (this.isListening) {
      this.isListening = false;
      return;
    }

    try {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';

      this.isListening = true;
      this.voiceFeedback = 'Listening... Say "Show Fleet", "Go to Fuel", or "Optimize Route"';

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript.toLowerCase();
        this.voiceTranscript = text;
        this.processVoiceCommand(text);
        this.isListening = false;
      };

      recognition.onerror = () => {
        this.simulateVoiceCommand();
      };

      recognition.start();
    } catch (e) {
      this.simulateVoiceCommand();
    }
  }

  simulateVoiceCommand(): void {
    this.isListening = true;
    this.voiceFeedback = 'Simulating Voice AI: "Show Fleet Vehicles"';

    setTimeout(() => {
      this.isListening = false;
      this.router.navigate(['/fleet']);
      this.voiceFeedback = 'Navigated to Fleet Management!';
      setTimeout(() => this.voiceFeedback = '', 3000);
    }, 1500);
  }

  processVoiceCommand(cmd: string): void {
    if (cmd.includes('fleet') || cmd.includes('vehicle')) {
      this.router.navigate(['/fleet']);
      this.voiceFeedback = 'Navigating to Fleet Management...';
    } else if (cmd.includes('fuel') || cmd.includes('gas')) {
      this.router.navigate(['/fuel']);
      this.voiceFeedback = 'Navigating to Fuel Analytics...';
    } else if (cmd.includes('route') || cmd.includes('optimize')) {
      this.router.navigate(['/route-optimization']);
      this.voiceFeedback = 'Opening AI Route Optimizer...';
    } else if (cmd.includes('tracking') || cmd.includes('map')) {
      this.router.navigate(['/tracking']);
      this.voiceFeedback = 'Opening Live Tracking Map...';
    } else if (cmd.includes('driver')) {
      this.router.navigate(['/drivers']);
      this.voiceFeedback = 'Navigating to Driver Roster...';
    } else {
      this.voiceFeedback = `Command "${cmd}" received. Navigating to Dashboard.`;
      this.router.navigate(['/dashboard']);
    }

    setTimeout(() => this.voiceFeedback = '', 3500);
  }

  updateBreadcrumbs(url: string): void {
    const matched = this.routeMap[url] || {
      title: 'Smart Fleet',
      crumbs: [{ label: 'Home', url: '/dashboard' }, { label: 'Overview', url }]
    };
    this.title = matched.title;
    this.breadcrumbs = matched.crumbs;
  }

  toggleSidebar(): void {
    this.layoutService.toggleSidebar();
  }

  toggleNotifDrawer(): void {
    this.layoutService.toggleNotifDrawer();
  }

  toggleProfileMenu(): void {
    this.layoutService.toggleProfileMenu();
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }

  logout(): void {
    this.layoutService.closeProfileMenu();
    this.layoutService.closeNotifDrawer();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
