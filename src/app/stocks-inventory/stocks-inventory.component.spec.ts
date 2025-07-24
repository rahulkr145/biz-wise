import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StocksInventoryComponent } from './stocks-inventory.component';

describe('StocksInventoryComponent', () => {
  let component: StocksInventoryComponent;
  let fixture: ComponentFixture<StocksInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StocksInventoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StocksInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
