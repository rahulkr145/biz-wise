import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ExcelService } from '../services/excel.service';
import { MainService } from '../services/main-service';
import Chart from 'chart.js/auto';
import { HttpClient } from '@angular/common/http';

interface BudgetItem {
  category: string;
  items: {
    name: string;
    quantity: number;
    actual: number;
    forecast: number;
    threshold: number;
  }[];
}

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.scss'
})
export class BudgetComponent implements OnInit {
  constructor(private excelService: ExcelService, private mainService: MainService, private http: HttpClient) {}
  total = 615.00;

  budgetData: BudgetItem[] = [];
  originalBudgetData: BudgetItem[] = [];

  editing: { sectionIdx: number, itemIdx: number } | null = null;
  thresholdChanged = false;
  showToast = false;

  startEdit(sectionIdx: number, itemIdx: number) {
    this.editing = { sectionIdx, itemIdx };
  }

  saveEdit(sectionIdx: number, itemIdx: number, value: string) {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      this.budgetData[sectionIdx].items[itemIdx].threshold = num;
      this.checkThresholdChanged();
    }
    this.editing = null;
  }

  checkThresholdChanged() {
    this.thresholdChanged = !this.budgetData.every((section, sIdx) =>
      section.items.every((item, iIdx) =>
        item.threshold === this.originalBudgetData[sIdx]?.items[iIdx]?.threshold
      )
    );
  }

  exportBudget() {
    const flatData = this.budgetData.flatMap(section =>
      section.items.map(item => ({
        Category: section.category,
        Item: item.name,
        Quantity: item.quantity,
        Actual: item.actual,
        Forecast: item.forecast,
        Threshold: item.threshold
      }))
    );
  
    this.excelService.exportToExcel(flatData, 'Grocery_Budget');
  }

  save() {
    // this.mainService.saveBudgetData(this.budgetData).subscribe({
    //   next: (response) => {
    //     console.log('Budget data saved successfully:', response);
    //     // Optionally, show a success message to the user
    //     this.originalBudgetData = JSON.parse(JSON.stringify(this.budgetData));
    //     this.thresholdChanged = false;
    //     this.showToast = true;
    //     setTimeout(() => { this.showToast = false; }, 2500);
    //   },
    //   error: (err) => {
    //     console.error('Failed to save budget data:', err);
    //     // Optionally, show an error message to the user
    //   }
    // });
    this.originalBudgetData = JSON.parse(JSON.stringify(this.budgetData));
    this.thresholdChanged = false;
    this.showToast = true;
    setTimeout(() => { this.showToast = false; }, 2500);
  }

  showInsightPopup = false;
  insightChart: Chart | null = null;
  insightPoints: string[] = [];
  insightPercentages: { [key: string]: number } = {};
  insightRecommendations: string[] = [];
  isInsightLoading = false;
  @ViewChild('insightPieChart') insightPieChartRef!: ElementRef;

  insight() {
    this.isInsightLoading = true;
    this.http.get<any>('https://bizwise-351605267307.europe-west1.run.app/api/budget_summary/30').subscribe({
      next: (data) => {
        // Use insight percentages and add a remainder category so total is 1
        this.insightPercentages = { ...data.percentages };
        const sum = Object.values(this.insightPercentages).reduce((acc, v) => acc + v, 0);
        const remainder = 1 - sum;
        if (remainder > 0) {
          this.insightPercentages['Profit'] = remainder;
        }
        this.insightRecommendations = data.recommendations || [];
        // Prepare pie chart data from insightPercentages
        const labels = Object.keys(this.insightPercentages);
        const chartData = Object.values(this.insightPercentages).map((v: any) => v * 100);
        this.insightPoints = labels.map(
          (label, idx) => `${label}: ${chartData[idx].toFixed(1)}%`
        );
        this.showInsightPopup = true;
        setTimeout(() => {
          if (this.insightPieChartRef) {
            if (this.insightChart) {
              this.insightChart.destroy();
            }
            this.insightChart = new Chart(this.insightPieChartRef.nativeElement, {
              type: 'pie',
              data: {
                labels,
                datasets: [{
                  data: chartData,
                  backgroundColor: [
                    '#007bff', '#28a745', '#ffc107', '#dc3545', '#17a2b8', '#6f42c1', '#888888'
                  ]
                }]
              },
              options: {
                responsive: true,
                plugins: {
                  legend: { display: true, position: 'top' }
                }
              }
            });
          }
        }, 0);
        this.isInsightLoading = false;
      },
      error: (err) => {
        this.insightPercentages = {};
        this.insightRecommendations = ['Failed to fetch insight data.'];
        this.insightPoints = [];
        this.showInsightPopup = true;
        this.isInsightLoading = false;
      }
    });
  }

  closeInsightPopup() {
    this.showInsightPopup = false;
    if (this.insightChart) {
      this.insightChart.destroy();
      this.insightChart = null;
    }
  }

  months = [
    'January 2025',
    'February 2025',
    'March 2025',
    'April 2025',
    'May 2025',
    'June 2025',
    'July 2025',
    'August 2025',
    'September 2025',
    'October 2025',
    'November 2025',
    'December 2025'
  ];
  selectedMonth = this.months[0];

  ngOnInit() {
    this.fetchBudgetData(this.selectedMonth);
  }

  onMonthChange(month: string) {
    this.fetchBudgetData(month);
  }

  fetchBudgetData(month: string) {
    this.mainService.getBudgetDataFromApi(month).subscribe({
      next: (data) => {
        // Shuffle actual, forecast, and threshold for each item, but keep item names
        const shuffledData = data.map((section: BudgetItem) => {
          // Extract arrays of values
          const actuals = section.items.map((item: any) => item.actual);
          const forecasts = section.items.map((item: any) => item.forecast);
          const thresholds = section.items.map((item: any) => item.threshold);

          // Shuffle helper
          function shuffle(arr: any[]) {
            for (let i = arr.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
          }

          shuffle(actuals);
          shuffle(forecasts);
          shuffle(thresholds);

          // Assign shuffled values back to items
          const newItems = section.items.map((item: any, idx: number) => ({
            ...item,
            actual: actuals[idx],
            forecast: forecasts[idx],
            threshold: thresholds[idx]
          }));
          return { ...section, items: newItems };
        });
        this.budgetData = shuffledData;
        this.originalBudgetData = JSON.parse(JSON.stringify(shuffledData));
        this.thresholdChanged = false;
      },
      error: (err) => {
        console.error('Failed to fetch budget data:', err);
        this.budgetData = [];
        this.originalBudgetData = [];
        this.thresholdChanged = false;
      }
    });
  }
}
