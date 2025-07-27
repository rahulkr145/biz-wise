import { Component } from '@angular/core';

interface Notification {
  title: string;
  message: string;
  time: string;
  linkText?: string;
  category: 'App' | 'Inventory' | 'Budget';
  unread: boolean;
}

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent {
  notifications: Notification[] = [
    {
      title: 'New feature available',
      message: 'Version 2.5 is now available with dark mode and performance improvements.',
      time: 'Just now',
      linkText: 'Dismiss',
      category: 'App',
      unread: true
    },
    {
      title: 'Low stock alert',
      message: 'Product "Premium Widget X" is running low (only 5 items left in stock).',
      time: '15 minutes ago',
      linkText: 'Order more',
      category: 'Inventory',
      unread: true
    },
    {
      title: 'Budget exceeded',
      message: 'Marketing budget for Q3 has exceeded the limit by $1,250.',
      time: '2 hours ago',
      linkText: 'View report',
      category: 'Budget',
      unread: false
    },
    {
      title: 'Your subscription is expiring',
      message: 'Your Premium subscription will expire in 7 days. Renew now to avoid interruption.',
      time: '1 day ago',
      linkText: 'Renew now',
      category: 'App',
      unread: true
    },
    {
      title: 'New shipment received',
      message: 'Your order #45678 has been successfully delivered to the warehouse.',
      time: '3 days ago',
      linkText: 'Confirm receipt',
      category: 'Inventory',
      unread: false
    }
  ];

  selectedTab: string = 'All';

  markAllAsRead() {
    this.notifications.forEach(n => n.unread = false);
  }

  get filteredNotifications() {
    return this.selectedTab === 'All'
      ? this.notifications
      : this.notifications.filter(n => n.category === this.selectedTab);
  }

  getUnreadCount(tab: string): number {
    if (tab === 'All') {
      return this.notifications.filter(n => n.unread).length;
    }
    return this.notifications.filter(n => n.unread && n.category === tab).length;
  }

  dismissNotification(index: number) {
    this.notifications.splice(index, 1);
  }
}
