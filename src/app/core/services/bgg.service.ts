import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { BoardGame } from '../models/board-game.model';

@Injectable({
  providedIn: 'root'
})
export class BggService {
  private readonly http = inject(HttpClient);
  private readonly BASE_URL = 'https://boardgamegeek.com/xmlapi2';

  search(query: string, limit: number = 20): Observable<BoardGame[]> {
    const url = `${this.BASE_URL}/search?query=${encodeURIComponent(query)}&type=boardgame&limit=${limit}`;

    return this.http.get(url, { responseType: 'text' }).pipe(
      map((xml: string) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, 'text/xml');
        const items = xmlDoc.getElementsByTagName('item');

        return Array.from(items).map(item => ({
          id: item.getAttribute('id') ?? '',
          name: item.getElementsByTagName('name')[0]?.getAttribute('value') ?? 'Unknown',
          year_published: item.getElementsByTagName('yearpublished')[0]?.getAttribute('value') ?? '',
          thumbnail: '', // No thumbnail from XML search; placeholder for now
          min_players: 0,
          max_players: 0,
          price: 0
        })) satisfies BoardGame[];
      })
    );
  }
}
