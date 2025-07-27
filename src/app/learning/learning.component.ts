import { Component, OnInit } from '@angular/core';
import { MainService } from '../services/main-service';

@Component({
  selector: 'app-learning',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.scss']
})
export class LearningComponent implements OnInit {
  learnings: any[] = [];
  errorMessage: string | null = null;
  selectedModuleDetails: any = null;

  constructor(private mainService: MainService) {}

  ngOnInit() {
    this.mainService.getLearningModules().subscribe({
      next: (data: any[]) => {
        this.learnings = data;
        this.errorMessage = null;
      },
      error: (err: any) => {
        this.learnings = [];
        this.errorMessage = 'Failed to load learning modules. Please try again later.';
      }
    });
  }

  onCardClick(id: string) {
    this.mainService.getLearningModuleDetails(id).subscribe({
      next: (details) => {
        this.selectedModuleDetails = details;
        setTimeout(() => {
          // Show the Bootstrap modal
          const modal: any = document.getElementById('detailModal');
          if (modal) {
            const bsModal = new (window as any).bootstrap.Modal(modal);
            bsModal.show();
          }
        });
      },
      error: () => {
        alert('Failed to load module details.');
      }
    });
  }

  closeModal() {
    this.selectedModuleDetails = null;
  }
}
