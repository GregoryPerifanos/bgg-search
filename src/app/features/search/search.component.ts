import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ResultsComponent } from '../results/results.component';
import { BggService } from '../../core/services/bgg.service';
import { BoardGame } from '../../core/models/board-game.model';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ResultsComponent],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  // Reactive form control for the search input
  query = new FormControl<string>('', { nonNullable: true });

  // Signals for app state
  loading = signal(false);
  error = signal<string | null>(null);
  results = signal<BoardGame[]>([]);

  // Derived signal for result count
  count = computed(() => this.results().length);

  private bgg = inject(BggService);

  constructor() {
    this.query.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe(q => {
        this.error.set(null);
        const trimmed = q.trim();
        if (!trimmed) {
          this.results.set([]);
          this.loading.set(false);
          return;
        }

        this.loading.set(true);

        this.bgg.search(trimmed).subscribe({
          next: data => {
            this.results.set(data);
            this.loading.set(false);
          },
          error: () => {
            this.error.set('Search failed. Try again.');
            this.loading.set(false);
          }
        });
      });
  }
}
