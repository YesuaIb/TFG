import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-team-matchup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team-matchup.component.html',
  styleUrls: ['./team-matchup.component.scss'],
})
export class TeamMatchupComponent {
  @Input() strengths: { [type: string]: number } = {};
  @Input() weaknesses: { [type: string]: number } = {};

  getTypeList(obj: { [key: string]: number }) {
    return Object.keys(obj)
      .filter(key => key !== 'poison')
      .map(key => ({ name: key, value: obj[key] }));
  }
}
