import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamBuilderComponent } from '../../components/team-builder/team-builder.component';
import { TeamMatchupComponent } from '../../components/team-matchup/team-matchup.component';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, TeamBuilderComponent, TeamMatchupComponent],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss'
})
export class TeamsComponent {
  strengths = {};
  weaknesses = {};

  updateEffectiveness(effectiveness: { strength: any, weakness: any }) {
    this.strengths = effectiveness.strength;
    this.weaknesses = effectiveness.weakness;
  }
}
