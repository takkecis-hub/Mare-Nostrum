# Teknik Mimari

> Ana referans: [`mare_nostrum_implementation_plan_v2.md`](../../mare_nostrum_implementation_plan_v2.md)

---

## Teknoloji Stack

```
┌─ CLIENT ─────────────────────────────────┐
│  Next.js 14+ (App Router, SSR)            │
│  Harita: Pixi.js (Canvas) veya SVG        │
│  State: Zustand (hafif, TypeScript dostu) │
│  Realtime: Socket.io-client               │
│  UI Kit: Tailwind CSS + shadcn/ui         │
│  Deployment: Vercel                       │
└──────────────────────────────────────────┘

┌─ SERVER ─────────────────────────────────┐
│  Runtime: Node.js 20+ (TypeScript)        │
│  Framework: Express.js veya Fastify       │
│  Realtime: Socket.io                     │
│  API Style: REST + WebSocket hibrit       │
│  Deployment: Railway veya Fly.io          │
└──────────────────────────────────────────┘

┌─ VERİTABANI ─────────────────────────────┐
│  Primary: PostgreSQL 16 (oyun durumu)     │
│  Cache/Sess: Redis 7 (session, LLM cache) │
│  ORM: Drizzle ORM (type-safe)             │
│  Migrations: Drizzle Kit                  │
└──────────────────────────────────────────┘

┌─ LLM ────────────────────────────────────┐
│  Primary: Claude Haiku 3.5 (hızlı, ucuz) │
│  Fallback: OpenAI GPT-4o-mini             │
│  Kritik: Claude Sonnet 3.5 (görev NPC)   │
│  SDK: Vercel AI SDK (streaming, TS)       │
│  Cache: Redis (aynı prompt → aynı yanıt) │
│  Fallback: Statik JSON fısıltı havuzu    │
└──────────────────────────────────────────┘

┌─ ALTYAPI ─────────────────────────────────┐
│  Repo: GitHub (monorepo)                  │
│  CI/CD: GitHub Actions                    │
│  Monitoring: Sentry (hata takip)          │
│  Analytics: PostHog (oyuncu davranışı)    │
│  LLM Monitor: Custom dashboard            │
└───────────────────────────────────────────┘
```

---

## Monorepo Yapısı

```
mare-nostrum/
├── packages/
│   ├── shared/              # Ortak tipler, sabitler, formüller
│   │   ├── types/           # GameState, Player, Port, Route, Rumor...
│   │   ├── constants/       # 15 liman, 29 rota, 15 menşe mal, 8 ün
│   │   ├── formulas/        # Savaş gücü, deneyim oranı, fiyat hesabı
│   │   └── validators/      # Emir doğrulama, kargo kontrol
│   │
│   ├── engine/              # Deterministik oyun motoru (LLM'den bağımsız)
│   │   ├── turn-resolver/   # Fondaco → Emir → Rüzgâr döngüsü
│   │   ├── combat/          # Pruva/Ateş/Manevra çözümleme
│   │   ├── economy/         # Açlık/doyma, fiyat, ilk gelen bonusu
│   │   ├── rumor/           # Söylenti üretim, yayılma, çürüme
│   │   ├── experience/      # Gizli havuz birikimi, oran hesabı
│   │   ├── renown/          # Ün koşul kontrolü, kazanım/kayıp
│   │   ├── event/           # Event tetikleyici, etki uygulama
│   │   └── quest/           # Görev zinciri aşama takibi
│   │
│   ├── server/              # API + WebSocket sunucu
│   │   ├── api/             # REST endpoints
│   │   ├── ws/              # Socket.io handler'ları
│   │   ├── llm/             # LLM çağrı yönetimi, cache, fallback
│   │   ├── db/              # Drizzle schema + migrations
│   │   └── auth/            # Basit auth (email + OAuth)
│   │
│   └── client/              # Next.js frontend
│       ├── app/             # Next.js App Router sayfalar
│       ├── components/
│       │   ├── map/         # Harita render (Pixi.js)
│       │   ├── fondaco/     # Kahvehane, Pazar, Müzakere, Tersane
│       │   ├── combat/      # Savaş ekranı, taktik seçimi
│       │   ├── hud/         # Altın, kargo, ün gösterimi
│       │   └── chat/        # Multiplayer mesajlaşma
│       ├── hooks/           # useGameState, useSocket, useLLM
│       └── stores/          # Zustand store'ları
│
├── data/
│   ├── ports.json           # 15 liman detayları
│   ├── routes.json          # 29 rota tanımları
│   ├── goods.json           # 15 menşe mal
│   ├── events.json          # 92 event tanımı
│   ├── trivia.json          # ☽ Tarihsel trivia havuzu
│   ├── whispers.json        # Statik fısıltı fallback havuzu
│   ├── npc-profiles.json    # NPC kişilik şablonları
│   └── quest-chains.json    # 4 görev zinciri tanımları
│
├── docs/                    # Tasarım dokümanları
│   └── wiki/                # ← Bu wiki
├── tests/
└── docker-compose.yml       # PostgreSQL + Redis
```

---

## Veritabanı Şeması (12 Tablo)

### Ana Tablolar

```sql
games          -- oyun durumu, tur sayısı, dönem, mod
players        -- oyuncu verileri (altın, gemi, ün)
orders         -- verilen emirler (kilitli, gizli)
cargo          -- kargo takibi (kim ne taşıyor)

rumors         -- aktif söylentiler
rumor_ports    -- söylenti × liman ilişkisi

port_hunger    -- her liman × menşe mal açlık seviyesi
experience     -- 4 gizli havuz (Meltem/Terazi/Mürekkep/Simsar)
renowns        -- kazanılmış ünler

quest_states   -- görev aşama takibi
events_log     -- tetiklenmiş event'ler
npc_states     -- NPC durumları (borç sayacı, motivasyon)
```

### Kritik Tasarım Kararı: Emir Gizliliği

```sql
CREATE TABLE orders (
  ...
  intent      VARCHAR(20) NOT NULL,   -- GİZLİ
  route_type  VARCHAR(20) NOT NULL,   -- GİZLİ
  locked      BOOLEAN DEFAULT FALSE,
  revealed_at TIMESTAMP               -- Rüzgâr fazında açılır
);
```

Emirler çözümleme anına kadar hiçbir client'a gönderilmez. Browser devtools ile emir gözetlenemez.

---

## Tur Çözümleme Akışı (Sunucu Tarafı)

```typescript
// packages/engine/turn-resolver/index.ts
async function resolveTurn(gameId: string) {
  // 1. Hava durumu (fırtına kontrolü)
  const weather = rollWeather(game.season, game.routes);

  // 2. Tüm emirleri aç (gizliliği kaldır)
  const orders = await revealOrders(gameId, game.turn);

  // 3. Hareket çözümleme (paralel)
  const movements = resolveMovements(orders, weather);

  // 4. Karşılaşma kontrolü
  const encounters = detectEncounters(movements, game.ports);

  // 5. Niyet matrisi çözümü
  for (encounter of encounters) {
    const result = resolveIntentMatrix(encounter);
    if (result.combat) await combat.resolve(result);
  }

  // 6. Ticaret çözümü
  await economy.resolveTrading(movements, game.portHunger);

  // 7. Söylenti üretimi
  await rumor.generateAndSpread(gameId, actionLog);

  // 8. Deneyim güncelleme
  await experience.update(gameId, actionLog);

  // 9. Ün kontrolü
  await renown.checkConditions(gameId);

  // 10. Event tetikleyici
  await eventEngine.checkTriggers(gameId, game.turn);
}
```

---

## 26 Haftalık Geliştirme Planı

| Faz | Haftalar | Hedef | Milestone |
|-----|----------|-------|-----------|
| **Faz 0** | 1–3 | Kağıt prototip + teknik altyapı | M0: Kağıt test + dev env |
| **Faz 1** | 4–11 | Çekirdek demo (3-5 tur) | M3: Oynanabilir demo |
| **Faz 2** | 12–19 | Tam singleplayer | M4: 20-40 tur SP |
| **Faz 3** | 20–26 | Multiplayer + lansman | M6: Beta |

### Milestone Detayları

| Milestone | Hafta | Kabul Kriteri |
|-----------|-------|---------------|
| **M0: Paper OK** | 3 | 5 turlu kağıt test raporu |
| **M1: Hello World** | 5 | Harita + tıklanabilir limanlar + LLM merhaba |
| **M2: One Turn** | 9 | Tam 1 tur: Fondaco → Emir → Rüzgâr |
| **M3: Demo** | 11 | 3-5 turlu oynanabilir demo |
| **M4: Full SP** | 19 | 20-40 turlu tam singleplayer |
| **M5: MP Alpha** | 22 | 2 oyunculu multiplayer çalışıyor |
| **M6: Beta** | 26 | 4+ oyunculu, tutorial, landing page |

---

## Multiplayer Teknik Notlar

### Disconnect Yönetimi

| Durum | Davranış |
|-------|---------|
| Fondaco'da disconnect | 2 dk bekleme, sonra AFK |
| 3 tur AFK | NPC autopilot devralır |
| 5 tur AFK | Oyuncu çıkarılır, NPC kalır |
| Rüzgâr'da disconnect | Emir kilitliyse normal devam |
| Savaşta disconnect | Savunan Manevra seçmiş kabul edilir |
| Reconnect | Son durum özeti gösterilir |

### AFK Emri

Zamanlayıcı dolunca kilitlemeyenler otomatik **"aynı limanda kal + Duman"** emri alır.

### NPC Sayısı Ölçeklemesi

| Oyuncu Sayısı | NPC Sayısı |
|---------------|-----------|
| 2 | 4 NPC |
| 4 | 2 NPC |
| 6+ | 0-1 NPC |

---

## Maliyet Modeli

| Senaryo | Aylık LLM Maliyeti |
|---------|-------------------|
| 100 aktif kullanıcı | ~$50 |
| 1.000 aktif kullanıcı | ~$500 |
| Oturum başına maliyet | < $0.50 |

Redis cache ile tekrarlayan prompt maliyeti %60-70 azaltılır.

---

## Bağlantılı Sayfalar

- [LLM Entegrasyonu](llm-entegrasyon.md) — LLM mimarisi ve cache stratejisi
- [Oyun Genel Bakış](oyun-genel-bakis.md) — Geliştirme senaryoları (Solo / Ekip / Stüdyo)
