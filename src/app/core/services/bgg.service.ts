import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface BoardGame {
  id: string;
  name: string;
  year?: number;
  thumbnail?: string;
  image?: string;
  minPlayers?: number;
  maxPlayers?: number;
  playingTime?: number;
  avgRating?: number;
  rank?: number;
}

@Injectable({ providedIn: 'root' })
export class BggService {
  constructor(private http: HttpClient) {}

  search(query: string, limit = 20): Observable<BoardGame[]> {
    if (!query?.trim()) return of([]);
    const params = new HttpParams().set('q', query.trim()).set('limit', limit);
    return this.http.get<{ games: BoardGame[] }>('/api/bgg/search', { params })
      .pipe(map(r => r.games ?? []));
  }
}
