import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardGame } from '../../core/models/board-game.model';

@Component({
  selector: 'app-boardgame-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './boardgame-card.component.html',
  styleUrls: ['./boardgame-card.component.css']
})
export class BoardgameCardComponent {
  @Input({ required: true }) game!: BoardGame;
}
