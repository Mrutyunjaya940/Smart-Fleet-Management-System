import { Injectable, signal } from '@angular/core';

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'warning' | 'error' | 'info' | 'success';
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  isSidebarCollapsed = signal<boolean>(false);
  isNotifDrawerOpen = signal<boolean>(false);
  isProfileMenuOpen = signal<boolean>(false);

  notifications = signal<NotificationItem[]>([
    {
      id: 1,
      title: 'Low Fuel Warning',
      message: 'Vehicle OD-05-XY-9876 fuel dropped below 15%',
      time: '12 mins ago',
      type: 'warning',
      read: false
    },
    {
      id: 2,
      title: 'Maintenance Alert',
      message: 'Engine diagnostic failed for Heavy Truck OD-02-AB-1234',
      time: '45 mins ago',
      type: 'error',
      read: false
    },
    {
      id: 3,
      title: 'Route Optimization Ready',
      message: 'Fastest route calculated for Driver Rahul Kumar',
      time: '2 hours ago',
      type: 'info',
      read: false
    }
  ]);

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(state => !state);
  }

  toggleNotifDrawer(): void {
    this.isNotifDrawerOpen.update(state => !state);
    if (this.isNotifDrawerOpen()) {
      this.isProfileMenuOpen.set(false);
    }
  }

  closeNotifDrawer(): void {
    this.isNotifDrawerOpen.set(false);
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen.update(state => !state);
    if (this.isProfileMenuOpen()) {
      this.isNotifDrawerOpen.set(false);
    }
  }

  closeProfileMenu(): void {
    this.isProfileMenuOpen.set(false);
  }

  markAllNotificationsAsRead(): void {
    this.notifications.update(list =>
      list.map(n => ({ ...n, read: true }))
    );
  }

  clearNotifications(): void {
    this.notifications.set([]);
  }

  get unreadCount(): number {
    return this.notifications().filter(n => !n.read).length;
  }
}
