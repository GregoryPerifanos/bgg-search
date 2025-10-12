// src/server.ts
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express, { type Request } from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// XML parser for BGG
import { parseStringPromise } from 'xml2js';

// ---------- Angular SSR bootstrap ----------
const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// ---------- Helpers for BGG XML API ----------
async function fetchXml(url: string, retries = 6, delayMs = 700): Promise<string> {
  for (let i = 0; i < retries; i++) {
    const r = await fetch(url);
    // BGG often replies 202 (queued). Wait and retry.
    if (r.status === 202) {
      await new Promise((res) => setTimeout(res, delayMs));
      continue;
    }
    if (!r.ok) throw new Error(`BGG upstream error ${r.status}`);
    return await r.text();
  }
  throw new Error('BGG queue timeout');
}

function mapThingToGame(it: any) {
  const first = (n: any, k: string) => (Array.isArray(n?.[k]) ? n[k][0] : undefined);

  const id = it.$.id;
  const nameNode =
    (it.name || []).find((n: any) => n.$?.type === 'primary') || it.name?.[0];
  const name = nameNode?.$.value ?? 'Unknown';

  const year = Number(first(it, 'yearpublished')?.$.value) || undefined;
  const minPlayers = Number(first(it, 'minplayers')?.$.value) || undefined;
  const maxPlayers = Number(first(it, 'maxplayers')?.$.value) || undefined;
  const playingTime = Number(first(it, 'playingtime')?.$.value) || undefined;

  const stats = first(it, 'statistics');
  const ratings = stats?.ratings?.[0];
  const avgRating = ratings ? Number(ratings.average?.[0]?.$.value) : undefined;

  const ranks = ratings?.ranks?.[0]?.rank || [];
  const overall = ranks.find((r: any) => r.$.name === 'boardgame');
  const rank =
    overall && !isNaN(Number(overall.$.value)) ? Number(overall.$.value) : undefined;

  const thumbnail = first(it, 'thumbnail') || undefined;
  const image = first(it, 'image') || undefined;

  return {
    id,
    name,
    year,
    thumbnail,
    image,
    minPlayers,
    maxPlayers,
    playingTime,
    avgRating,
    rank,
  };
}

// ---------- Local API: /api/bgg/search (no key needed) ----------
// Example: GET /api/bgg/search?q=Catan&limit=20
app.get(
  '/api/bgg/search',
  async (
    req: Request<{}, any, any, { q?: string; limit?: string }>,
    res: express.Response
  ) => {
    try {
      const { q = '', limit = '20' } = req.query; // ✅ typed query params
      const name = q.trim();
      const limitNum = Number(limit);

      if (!name) return res.json({ games: [] });

      // 1) Search for matching items (IDs)
      const searchUrl = `https://boardgamegeek.com/xmlapi2/search?query=${encodeURIComponent(
        name
      )}&type=boardgame`;
      const searchXml = await fetchXml(searchUrl);
      const searchJson: any = await parseStringPromise(searchXml);
      const items = searchJson.items?.item ?? [];
      const ids: string[] = items.slice(0, limitNum).map((it: any) => it.$.id);

      if (!ids.length) return res.json({ games: [] });

      // 2) Fetch details/stats for those IDs
      const thingUrl = `https://boardgamegeek.com/xmlapi2/thing?id=${ids.join(
        ','
      )}&stats=1`;
      const thingXml = await fetchXml(thingUrl);
      const thingJson: any = await parseStringPromise(thingXml);
      const games = (thingJson.items?.item ?? []).map(mapThingToGame);

      return res.json({ games });
    } catch (e: any) {
      return res.status(500).json({ error: e?.message || 'BGG server error' });
    }
  }
);

// ---------- Static files from /browser ----------
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  })
);

// ---------- Catch-all: render Angular app ----------
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next()
    )
    .catch(next);
});

// ---------- Start server when run directly ----------
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// ---------- Export handler for CLI/hosts ----------
export const reqHandler = createNodeRequestHandler(app);
