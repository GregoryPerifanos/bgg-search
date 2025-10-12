import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ResultsComponent } from '../results/results.component';
import { BggService, BoardGame } from '../../core/services/bgg.service';

@Component({
  selector: 'app-search',
  standalone: true,
  // We import what we use because there’s no NgModule in standalone world
  imports: [CommonModule, ReactiveFormsModule, ResultsComponent],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  // Reactive form control for the search box (string, non-nullable)
  query = new FormControl<string>('', { nonNullable: true });

  // Signals: ergonomic reactive state (no Subjects needed)
  loading = signal(false);
  error = signal<string | null>(null);
  results = signal<BoardGame[]>([]);

  // Derived state: UI-ready count
  count = computed(() => this.results().length);

  constructor(private bgg: BggService) {
  this.query.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
    .subscribe(q => {
      this.error.set(null);
      if (!q.trim()) { this.results.set([]); this.loading.set(false); return; }
      this.loading.set(true);
      this.bgg.search(q).subscribe({
        next: data => { this.results.set(data); this.loading.set(false); },
        error: () => { this.error.set('Search failed. Try again.'); this.loading.set(false); }
      });
    });
}
}
