import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMatchupComponent } from './team-matchup.component';

describe('TeamMatchupComponent', () => {
  let component: TeamMatchupComponent;
  let fixture: ComponentFixture<TeamMatchupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamMatchupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeamMatchupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
