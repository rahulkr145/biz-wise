import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent {
  activeTab: string = 'budget';
  isCollapsed: boolean = false;

  tabs = [
    { key: 'forecast', label: 'Business Forecast', icon: 'bi-graph-up-arrow' },
    { key: 'budget', label: 'Budget', icon: 'bi-wallet2' },
    { key: 'stocks', label: 'Stocks Inventory', icon: 'bi-box-seam' },
    { key: 'notification', label: 'Notifications', icon: 'bi-bell' },
    { key: 'fund', label: 'Fundings', icon: 'bi-cash-stack' },
    { key: 'plan', label: 'Business Plan', icon: 'bi-journal-richtext' },
    { key: 'learning', label: 'Learning', icon: 'bi-mortarboard' },
    { key: 'about', label: 'About Us', icon: 'bi-info-circle' }
  ];

  setTab(tab: string) {
    this.activeTab = tab;
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
