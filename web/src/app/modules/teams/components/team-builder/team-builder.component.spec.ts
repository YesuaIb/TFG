import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamBuilderComponent } from './team-builder.component';

describe('ComponentsComponent', () => {
  let component: TeamBuilderComponent;
  let fixture: ComponentFixture<TeamBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamBuilderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeamBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
