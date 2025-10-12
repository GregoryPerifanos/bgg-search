import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardGame } from '../../core/services/bgg.service'; 

@Component({
  selector: 'app-boardgame-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './boardgame-card.component.html',
  styleUrls: ['./boardgame-card.component.css']
})
export class BoardgameCardComponent {
  // One game in, render its details. Keeps logic minimal and focused on presentation.
  @Input() game!: BoardGame;
}
