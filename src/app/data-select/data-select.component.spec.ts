import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSelectComponent } from './data-select.component';

describe('DataSelectComponent', () => {
  let component: DataSelectComponent;
  let fixture: ComponentFixture<DataSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
