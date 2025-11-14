import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardGame } from '../../core/models/board-game.model';
import { BoardgameCardComponent } from '../boardgame-card/boardgame-card.component';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, BoardgameCardComponent],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent {
  @Input({ required: true }) items: BoardGame[] = [];

  // Convert items to signal for @for syntax if you like
  games = signal<BoardGame[]>([]);

  ngOnChanges() {
    this.games.set(this.items);
  }
}
