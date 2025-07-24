import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundingsComponent } from './fundings.component';

describe('FundingsComponent', () => {
  let component: FundingsComponent;
  let fixture: ComponentFixture<FundingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FundingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FundingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
