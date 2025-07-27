import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-business-plan',
  templateUrl: './business-plan.component.html',
  styleUrl: './business-plan.component.scss'
})
export class BusinessPlanComponent {
  businessForm: FormGroup;
  apiResponse: string | null = null;
  showPopup = false;
  isLoading = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.businessForm = this.fb.group({
      business_name: ['', Validators.required],
      industry: ['', Validators.required],
      location: [''],
      business_size: ['small'],
      goals: this.fb.array([this.fb.control('', Validators.required)]),
      current_challenges: this.fb.array([])
    });
  }

  get goals() {
    return this.businessForm.get('goals') as FormArray;
  }

  get current_challenges() {
    return this.businessForm.get('current_challenges') as FormArray;
  }

  addGoal() {
    this.goals.push(this.fb.control('', Validators.required));
  }

  addChallenge() {
    this.current_challenges.push(this.fb.control(''));
  }

  onSubmit() {
    if (this.businessForm.valid) {
      const payload = {
        user_id: 'string', // Replace with actual user_id if available
        ...this.businessForm.value
      };
      this.isLoading = true;
      this.http.post('https://bizwise-351605267307.europe-west1.run.app/api/plan', payload, {
        headers: { 'accept': 'application/json', 'Content-Type': 'application/json' }
      }).subscribe({
        next: (response: any) => {
          console.log(response);
          this.apiResponse = response?.business_plan_text || 'Submission successful!';
          this.showPopup = true;
          this.isLoading = false;
        },
        error: (err) => {
          this.apiResponse = 'Submission failed. Please try again.';
          this.showPopup = true;
          this.isLoading = false;
        }
      });
    } else {
      this.businessForm.markAllAsTouched();
    }
  }

  // To close the popup
  closePopup() {
    this.showPopup = false;
  }
}
