import { Component, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Chart from 'chart.js/auto';
import { log } from 'console';

@Component({
  selector: 'app-business-forecast',
  templateUrl: './business-forecast.component.html',
  styleUrl: './business-forecast.component.scss'
})
export class BusinessForecastComponent implements AfterViewInit {
  @ViewChild('multiAxisChart') multiAxisChartRef!: ElementRef;
  @ViewChild('lineChart') lineChartRef!: ElementRef;
  @ViewChild('doughnutChart') doughnutChartRef!: ElementRef;
  @ViewChild('byItemBarChart') barChartRef!: ElementRef;

  chartList = [
    'multiAxisChart',
    'lineChart',
    'doughnutChart',
    'byItemBarChart'
  ];
  activeIndex = 0;

  chartInstance: Chart | null = null;

  barChartData: any = null;
  doughnutChartData: any = null;
  multiAxisData: any = null;
  lineChartData: any = null;

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    this.fetchBarChartData();
    this.fetchDoughnutChartData();
    this.fetchLineChartData();
    this.fetchMultiAxisData();
    this.initActiveChart();
  }

  ngAfterViewChecked() {
    this.initActiveChart();
  }

  goToSlide(index: number) {
    console.log(index);
    this.activeIndex = index;
    this.destroyChart();
    // Chart will be initialized in ngAfterViewChecked after DOM updates
  }

  destroyChart() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }
  }

  fetchBarChartData() {
    this.http.get('https://bizwise-351605267307.europe-west1.run.app/api/analytics/by-item').subscribe({
      next: (data: any) => {
        this.barChartData = data;
        if (this.activeIndex === this.chartList.indexOf('byItemBarChart')) {
          this.destroyChart();
          this.initActiveChart();
        }
      },
      error: (err) => {
        console.error('Failed to fetch bar chart data', err);
      }
    });
  }

  fetchDoughnutChartData() {
    this.http.get('https://bizwise-351605267307.europe-west1.run.app/api/analytics/by-category').subscribe({
      next: (data: any) => {
        this.doughnutChartData = data;
        if (this.activeIndex === this.chartList.indexOf('doughnutChart')) {
          this.destroyChart();
          this.initActiveChart();
        }
      },
      error: (err) => {
        console.error('Failed to fetch doughnut chart data', err);
      }
    });
  }

  fetchLineChartData() {
    this.http.get('https://bizwise-351605267307.europe-west1.run.app/api/analytics/by-month').subscribe({
      next: (data: any) => {
        this.lineChartData = data;
        if (this.activeIndex === this.chartList.indexOf('lineChart')) {
          this.destroyChart();
          this.initActiveChart();
        }
      },
      error: (err) => {
        console.error('Failed to fetch line chart data', err);
      }
    });
  }

  fetchMultiAxisData() {
    this.http.get('https://bizwise-351605267307.europe-west1.run.app/api/forecast').subscribe({
      next: (data: any) => {
        this.multiAxisData = data;
        if (this.activeIndex === this.chartList.indexOf('multiAxisChart')) {
          this.destroyChart();
          this.initActiveChart();
        }
      },
      error: (err) => {
        console.error('Failed to fetch multi axis chart data', err);
      }
    });
  }

  initActiveChart() {
    if (this.chartInstance) return; // Already initialized for this slide

    const chartType = this.chartList[this.activeIndex];
    let ctx: CanvasRenderingContext2D | null = null;

    switch (chartType) {
      case 'multiAxisChart':
        if (this.multiAxisChartRef && this.multiAxisData) {
          ctx = this.multiAxisChartRef.nativeElement.getContext('2d');
          if (ctx) {
            // Prepare data from multiAxisData
            const actualMonths = this.multiAxisData.actual.map((a: any) => a.month);
            const forecastMonths = this.multiAxisData.forecast.map((f: any) => f.month);
            const allMonths = Array.from(new Set([...actualMonths, ...forecastMonths]));
            const actualData = allMonths.map(month => {
              const found = this.multiAxisData.actual.find((a: any) => a.month === month);
              return found ? found.total_sales : null;
            });
            const forecastData = allMonths.map(month => {
              const found = this.multiAxisData.forecast.find((f: any) => f.month === month);
              return found ? found.total_sales : null;
            });
            this.chartInstance = new Chart(ctx, {
              type: 'line',
              data: {
                labels: allMonths,
                datasets: [
                  {
                    label: 'Forecast',
                    data: forecastData,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    yAxisID: 'y',
                  },
                  {
                    label: 'Actual',
                    data: actualData,
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    yAxisID: 'y',
                  }
                ]
              },
              options: {
                responsive: true,
                interaction: { mode: 'index', intersect: false },
                scales: {
                  y: { type: 'linear', display: true, position: 'left', stacked: false }
                }
              }
            });
          }
        }
        break;
      case 'lineChart':
        if (this.lineChartRef && this.lineChartData) {
          ctx = this.lineChartRef.nativeElement.getContext('2d');
          if (ctx) {
            // Prepare grouped bar chart data
            const incomeLabels = this.lineChartData.income_graph.map((i: any) => i.x);
            const expenseLabels = this.lineChartData.expense_graph.map((e: any) => e.x);
            const allLabels = Array.from(new Set([...incomeLabels, ...expenseLabels]));
            const incomeData = allLabels.map(label => {
              const found = this.lineChartData.income_graph.find((i: any) => i.x === label);
              return found ? found.y : 0;
            });
            const expenseData = allLabels.map(label => {
              const found = this.lineChartData.expense_graph.find((e: any) => e.x === label);
              return found ? found.y : 0;
            });
            this.chartInstance = new Chart(ctx!, {
              type: 'bar',
              data: {
                labels: allLabels,
                datasets: [
                  {
                    label: 'Income',
                    data: incomeData,
                    backgroundColor: 'rgba(52, 152, 219, 0.85)', // Modern blue
                    borderColor: 'rgba(41, 128, 185, 1)',
                    borderWidth: 2
                  },
                  {
                    label: 'Expense',
                    data: expenseData,
                    backgroundColor: 'rgba(231, 76, 60, 0.85)', // Modern red
                    borderColor: 'rgba(192, 57, 43, 1)',
                    borderWidth: 2
                  }
                ]
              },
              options: {
                responsive: true,
                plugins: {
                  legend: {
                    display: true,
                    position: 'top'
                  }
                }
              }
            });
          }
        }
        break;
      case 'doughnutChart':
        if (this.doughnutChartRef && this.doughnutChartData) {
          ctx = this.doughnutChartRef.nativeElement.getContext('2d');
          if (ctx) {
            // Prepare grouped bar chart data
            const incomeLabels = this.doughnutChartData.income_by_category.map((i: any) => i.category);
            const expenseLabels = this.doughnutChartData.expense_by_category.map((e: any) => e.category);
            const allLabels = Array.from(new Set([...incomeLabels, ...expenseLabels]));
            const incomeData = allLabels.map(label => {
              const found = this.doughnutChartData.income_by_category.find((i: any) => i.category === label);
              return found ? found.y : 0;
            });
            const expenseData = allLabels.map(label => {
              const found = this.doughnutChartData.expense_by_category.find((e: any) => e.category === label);
              return found ? found.y : 0;
            });
            this.chartInstance = new Chart(ctx!, {
              type: 'bar',
              data: {
                labels: allLabels,
                datasets: [
                  {
                    label: 'Income',
                    data: incomeData,
                    backgroundColor: 'rgba(52, 152, 219, 0.85)',
                    borderColor: 'rgba(41, 128, 185, 1)',
                    borderWidth: 2
                  },
                  {
                    label: 'Expense',
                    data: expenseData,
                    backgroundColor: 'rgba(231, 76, 60, 0.85)',
                    borderColor: 'rgba(192, 57, 43, 1)',
                    borderWidth: 2
                  }
                ]
              },
              options: {
                responsive: true,
                plugins: {
                  legend: {
                    display: true,
                    position: 'top'
                  }
                }
              }
            });
          }
        }
        break;
      case 'byItemBarChart':
        if (this.barChartRef && this.barChartData) {
          ctx = this.barChartRef.nativeElement.getContext('2d');
          if (ctx) {
            // Prepare data for grouped bar chart
            const incomeLabels = this.barChartData.income_by_item.map((i: any) => i.name);
            const expenseLabels = this.barChartData.expense_by_item.map((e: any) => e.name);
            const allLabels = Array.from(new Set([...incomeLabels, ...expenseLabels]));
            const incomeData = allLabels.map(label => {
              const found = this.barChartData.income_by_item.find((i: any) => i.name === label);
              return found ? found.y : 0;
            });
            const expenseData = allLabels.map(label => {
              const found = this.barChartData.expense_by_item.find((e: any) => e.name === label);
              return found ? found.y : 0;
            });
            this.chartInstance = new Chart(ctx!, {
              type: 'bar',
              data: {
                labels: allLabels,
                datasets: [
                  {
                    label: 'Income',
                    data: incomeData,
                    backgroundColor: 'rgba(52, 152, 219, 0.85)',
                    borderColor: 'rgba(41, 128, 185, 1)',
                    borderWidth: 2
                  },
                  {
                    label: 'Expense',
                    data: expenseData,
                    backgroundColor: 'rgba(231, 76, 60, 0.85)',
                    borderColor: 'rgba(192, 57, 43, 1)',
                    borderWidth: 2
                  }
                ]
              },
              options: {
                responsive: true,
                plugins: {
                  legend: {
                    display: true,
                    position: 'top'
                  }
                }
              }
            });
          }
        }
        break;
    }
  }

  get dynamicHeader(): string {
    switch (this.chartList[this.activeIndex]) {
      case 'multiAxisChart':
        return 'Sales Forecast vs Actual';
      case 'lineChart':
        return 'Monthly Income & Expense';
      case 'doughnutChart':
        return 'Income & Expense by Category';
      case 'byItemBarChart':
        return 'Income & Expense by Item';
      default:
        return 'Grocery Store Forecast Dashboard';
    }
  }

  @HostListener('window:keydown.arrowleft', ['$event'])
  onLeft(event: KeyboardEvent) {
    if (this.activeIndex > 0) {
      this.goToSlide(this.activeIndex - 1);
    }
  }

  @HostListener('window:keydown.arrowright', ['$event'])
  onRight(event: KeyboardEvent) {
    if (this.activeIndex < this.chartList.length - 1) {
      this.goToSlide(this.activeIndex + 1);
    }
  }
}
