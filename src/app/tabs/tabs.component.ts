import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent {
  activeTab: string = 'fund';

  setTab(tab: string) {
    console.log(tab);
    this.activeTab = tab;
  }
}
