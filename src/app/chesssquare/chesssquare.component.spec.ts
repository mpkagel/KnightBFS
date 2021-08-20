import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChesssquareComponent } from './chesssquare.component';

describe('ChesssquareComponent', () => {
  let component: ChesssquareComponent;
  let fixture: ComponentFixture<ChesssquareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChesssquareComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChesssquareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
