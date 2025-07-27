import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  constructor(private http: HttpClient) {}

  submitBusinessPlan(data: any): Observable<any> {
    // Replace '/api/business-plan' with your actual endpoint
    return this.http.post<any>('/api/business-plan', data);
  }

  getBudgetData(month: string): Observable<any> {
    // Try to fetch from API, fallback to static data on error
    const staticData = [
      {
        category: 'Dairy & Eggs',
        items: [
          { name: 'Milk', quantity: 2, actual: 9.5, forecast: 10, threshold: 3 },
          { name: 'Cheese', quantity: 1, actual: 10, forecast: 11, threshold: 13 },
          { name: 'Yogurt', quantity: 3, actual: 10.5, forecast: 12, threshold: 14 },
          { name: 'Eggs', quantity: 2, actual: 6.5, forecast: 7, threshold: 9 },
          { name: 'Butter', quantity: 1, actual: 8.0, forecast: 8.5, threshold: 10 }
        ]
      },
      {
        category: 'Meat & Seafood',
        items: [
          { name: 'Chicken', quantity: 2, actual: 18, forecast: 19, threshold: 22 },
          { name: 'Beef', quantity: 1, actual: 10, forecast: 10.5, threshold: 13 },
          { name: 'Fish', quantity: 2, actual: 12.5, forecast: 13.5, threshold: 15 },
          { name: 'Pork', quantity: 1, actual: 15.5, forecast: 16, threshold: 18 },
          { name: 'Lamb', quantity: 1, actual: 11, forecast: 11.5, threshold: 13 }
        ]
      },
      {
        category: 'Pantry Staples',
        items: [
          { name: 'Rice', quantity: 3, actual: 9, forecast: 10, threshold: 10 },
          { name: 'Pasta', quantity: 2, actual: 7.5, forecast: 8.5, threshold: 10 },
          { name: 'Canned goods (Beans, Tomatoes, Tuna)', quantity: 6, actual: 13.5, forecast: 14, threshold: 10 },
          { name: 'Condiments (Ketchup, Mustard, Vinegar)', quantity: 3, actual: 10, forecast: 11, threshold: 13 }
        ]
      }
    ];
    return of(staticData);
    // return this.http.get<any>(`/getBudgetData?month=${encodeURIComponent(month)}`)
    //   .pipe(
    //     catchError(() => of(staticData))
    //   );
  }

  getBudgetDataFromApi(month: string): Observable<any> {
    // For now, just call getBudgetData
    return this.getBudgetData(month);
  }

  saveBudgetData(data: any): Observable<any> {
    return this.http.post<any>('/save', data);
  }

  getLearningModules(): Observable<any[]> {
    // const staticData = [
    //   {
    //     id: '1',
    //     title: 'Financial & Legal Basics',
    //     shortDescription: 'Handle taxes, bookkeeping & legal setup confidently.',
    //     description: 'Understand taxes, compliance, and how to keep your business financially healthy.',
    //     thumbnail: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    //     learnings: [
    //       'How to file taxes (GST, ITR, etc.)',
    //       'How to manage basic bookkeeping',
    //       'Business registration types: Sole Proprietorship, LLP, Pvt Ltd',
    //       'Understanding compliance: MSME registration, licenses'
    //     ]
    //   },
    //   {
    //     id: '2',
    //     title: 'Digital Marketing Essentials',
    //     shortDescription: 'Promote your business online.',
    //     description: 'Learn how to promote your business online and reach more customers.',
    //     thumbnail: 'https://cdn-icons-png.flaticon.com/512/1055/1055687.png',
    //     learnings: [
    //       'How to set up social media pages',
    //       'Basics of online advertising',
    //       'SEO fundamentals'
    //     ]
    //   },
    //   {
    //     id: '3',
    //     title: 'Founder Mindset & Business Growth Thinking',
    //     shortDescription: 'Start thinking like a founder, not just a worker.',
    //     description: 'Learn how to think like a founder and grow beyond daily operations.',
    //     thumbnail: 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png',
    //     learnings: [
    //       'Delegate and build trust with your team',
    //       'Create repeatable processes (SOPs) that save time',
    //       'Focus on growth tasks, not just routine work',
    //       'Track what matters: revenue, leads, repeat customers',
    //       'Think scale: experiment with what works and expand'
    //     ]
    //   }
    // ];
    // return of(staticData)
    return this.http.get<any[]>('https://bizwise-351605267307.europe-west1.run.app/api/learning_modules').pipe(
      catchError(() => of([]))
    );
  }

  getLearningModuleDetails(id: string): Observable<any> {
    return this.http.get<any>(`https://bizwise-351605267307.europe-west1.run.app/api/learning_module_details/${id}`);
  }
} 