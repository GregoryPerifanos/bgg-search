import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardGame } from '../../core/services/bgg.service'; 
import { BoardgameCardComponent } from '../boardgame-card/boardgame-card.component';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, BoardgameCardComponent],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent {
  // Parent (Search) supplies the data. This component stays stateless.
  @Input() items: BoardGame[] = [];
}
