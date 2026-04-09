# Mare Nostrum Mockup

Bu klasör, `mare_nostrum_implementation_plan_v2.md` dokümanının Faz 0 + Faz 1 omurgasını hızlıca doğrulamak için hazırlanmış ayrı bir mockup workspace'idir.

## İçerik

| Paket | Açıklama |
|-------|----------|
| `packages/shared` | Ortak tipler, sabitler, formüller ve doğrulayıcılar |
| `packages/engine` | Deterministik oyun motoru — savaş, ekonomi, deneyim, söylenti, tersane ve tur çözümleme |
| `packages/server` | Express + Socket.io REST API sunucusu |
| `packages/client` | Next.js 15 tek sayfalık oyun arayüzü |
| `data/` | Liman, rota, mal ve fallback fısıltı verileri (JSON) |
| `docker-compose.yml` | PostgreSQL 16 + Redis 7 lokal altyapı |

## Gereksinimler

- **Node.js 20+**
- **pnpm 10.7.1** (`corepack enable && corepack prepare pnpm@10.7.1 --activate`)
- **Docker** (opsiyonel — veritabanı altyapısı için)

## Kurulum & Çalıştırma

```bash
cd mockup/
pnpm install

# (Opsiyonel) Veritabanı altyapısını başlat
docker compose up -d

# Geliştirme sunucularını başlat
pnpm dev
```

- **Client:** `http://localhost:3000`
- **Server:** `http://localhost:4000`

## Doğrulama

```bash
pnpm test        # Vitest — 156 test, 8 test dosyası (engine paketi)
pnpm typecheck   # TypeScript derleyici kontrolleri (4 paket)
pnpm build       # Üretim derlemesi
```

## API Uç Noktaları

| Yöntem | Uç Nokta | Açıklama |
|--------|----------|----------|
| GET | `/api/health` | Sağlık kontrolü |
| GET | `/api/bootstrap` | Tam başlangıç durumu (limanlar, rotalar, mallar, oyuncu) |
| POST | `/api/whispers` | Kahvehane fısıltıları (liman + deneyim profili) |
| POST | `/api/resolve-turn` | Tur çözümleme (durum + emir + taktik) |
| POST | `/api/buy-good` | Limandaki malı satın al |
| POST | `/api/load-cargo` | Kargo yönetimi (at) |
| POST | `/api/repair-cost` | Tamir maliyeti sorgusu (durum gerekli) |
| POST | `/api/repair-ship` | Gemiyi tamir et |

## Mockup Kapsamı (Dikey Kesit)

- 15 liman + 29 rota + 17 menşe mal ile etkileşimli SVG harita
- **Fondaco akışı:** Kahvehane (3 fısıltı), Pazar (al/sat/at), Tersane (tamir + dayanıklılık çubuğu), Müzakere
- **Emir sistemi:** Nereye / Nasıl / Niyet / Taktik
- **Rüzgâr çözümlemesi:** Hareket (çok turlu kabotaj dahil), karşılaşma, savaş (Pruva/Ateş/Manevra), ticaret (port doyma destekli), söylenti yayılımı
- **Deneyim sistemi:** Meltem / Terazi / Mürekkep / Simsar havuzları + oran bazlı ün belirleme + ün çürüme/çelişki takibi
- **Skorlama:** Söylenti yayılım genişliği × 2 + ün sayısı × 15, Efsane eşiği = 100
- **Kargo yönetimi:** Sunucu API üzerinden satın al / at
- **Gemi tamiri:** Tersane üzerinden tam/kısmi tamir (tersane indirimi destekli)
- **156 birim test:** Savaş, ekonomi, deneyim, söylenti, skorlama, tersane, tur çözümleme, paylaşılan formüller
- Socket.io ping/pong bağlantı göstergesi
- Drizzle ORM şema taslağı (12 tablo) ve JSON veri dosyaları
