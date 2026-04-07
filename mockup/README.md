# Mare Nostrum Mockup

Bu klasör, `mare_nostrum_implementation_plan_v2.md` dokümanının Faz 0 + Faz 1 omurgasını hızlıca doğrulamak için hazırlanmış ayrı bir mockup workspace'idir.

## İçerik

- `packages/client`: Next.js tabanlı tek sayfalık mockup arayüzü
- `packages/server`: Express + Socket.io mock API
- `packages/shared`: ortak tipler ve formül yardımcıları
- `packages/engine`: ekonomi, savaş, söylenti, deneyim ve tur çözümleme motoru
- `data/`: liman, rota, mal ve fallback fısıltı verileri
- `docker-compose.yml`: PostgreSQL + Redis lokal altyapı taslağı

## Çalıştırma

```bash
cd /home/runner/work/Mare-Nostrum/Mare-Nostrum/mockup
corepack enable
pnpm install
pnpm dev
```

- Client: `http://localhost:3000`
- Server: `http://localhost:4000`

## Doğrulama

```bash
pnpm build
pnpm test
pnpm typecheck
```

## Bu mockup'ın kapsadığı dikey kesit

- 15 liman + 29 rota ile etkileşimli harita
- Fondaco akışı: Kahvehane, Pazar, Müzakere placeholder, Tersane özeti
- Emir sistemi: nereye / nasıl / niyet
- Rüzgâr çözümlemesi: hareket, karşılaşma, savaş, söylenti, deneyim, ticaret özeti
- Socket ping/pong sağlık göstergesi
- Drizzle şema taslağı ve veri dosyaları
