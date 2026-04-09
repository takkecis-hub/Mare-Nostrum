# Teknik Mimari

> Ana referans: [`mare_nostrum_implementation_plan_v2.md`](../../mare_nostrum_implementation_plan_v2.md)

---

## Teknoloji Stack

> **Uygulama durumu:** Aşağıdaki stack `mockup/` workspace'inde çalışır durumdadır.

```
┌─ CLIENT ─────────────────────────────────┐
│  Next.js 15 (App Router)                  │
│  React 19                                 │
│  Harita: Etkileşimli SVG (MapView.tsx)    │
│  State: Zustand (3 store)                │
│  Realtime: Socket.io-client               │
│  Deployment: Vercel (hedef)              │
└──────────────────────────────────────────┘

┌─ SERVER ─────────────────────────────────┐
│  Runtime: Node.js 20+ (TypeScript, ESM)   │
│  Framework: Express 4                    │
│  Realtime: Socket.io 4                   │
│  API Style: REST + WebSocket hibrit       │
│  Deployment: Railway veya Fly.io (hedef)  │
└──────────────────────────────────────────┘

┌─ VERİTABANI ─────────────────────────────┐
│  Primary: PostgreSQL 16 (oyun durumu)     │
│  Cache/Sess: Redis 7 (session, LLM cache) │
│  ORM: Drizzle ORM (type-safe, 12 tablo)  │
│  Migrations: Drizzle Kit                  │
└──────────────────────────────────────────┘

┌─ MOTOR ──────────────────────────────────┐
│  Pure TypeScript — deterministik          │
│  Injectable RNG (testlerde fixedRng)      │
│  Vitest: 383 test, 10 test dosyası       │
│  Modüller: combat, conflict, economy,    │
│    experience, quest, rumor, scoring,    │
│    shipyard, turn-resolver               │
└──────────────────────────────────────────┘

┌─ LLM ────────────────────────────────────┐
│  Hedef: Claude API (Haiku + Sonnet)       │
│  Mevcut: Statik JSON fısıltı havuzu      │
│  Fallback: whispers.json (liman bazlı)   │
│  Bütçe: 8 çağrı/oturum, 5sn timeout     │
└──────────────────────────────────────────┘

┌─ ALTYAPI ─────────────────────────────────┐
│  Repo: GitHub (monorepo)                  │
│  Workspace: pnpm 10.7.1                  │
│  Docker: PostgreSQL 16 + Redis 7          │
│  CI/CD: GitHub Actions                    │
│  Modül: ESM ("type": "module")            │
└───────────────────────────────────────────┘
```

---

## Monorepo Yapısı

> **Not:** Aşağıdaki yapı `mockup/` workspace'indeki gerçek düzeni yansıtır.

```
mockup/
├── packages/
│   ├── shared/              # Ortak tipler, sabitler, formüller, doğrulayıcılar
│   │   ├── src/
│   │   │   ├── types/       # GameState, Player, Port, Route, Rumor, Ship, Order...
│   │   │   ├── constants/   # Tüm oyun sabitleri (savaş, ekonomi, ün, LLM bütçe)
│   │   │   ├── formulas/    # Deneyim oranları, fiyat göstergesi (●●●○○)
│   │   │   ├── validators/  # Emir doğrulama (isOrderReachable)
│   │   │   └── geo/         # Mercator projeksiyonu (lat/lon → SVG)
│   │   └── package.json
│   │
│   ├── engine/              # Deterministik oyun motoru (LLM'den bağımsız)
│   │   ├── src/
│   │   │   ├── combat.ts          # Pruva/Ateş/Manevra, d6 zar, güç hesabı
│   │   │   ├── economy.ts         # Fiyat göstergesi, port doyma, otomatik satış
│   │   │   ├── experience.ts      # Deneyim birikimi, ün belirleme, ün çürüme
│   │   │   ├── rumor.ts           # Söylenti üretim, rota bazlı yayılma, güç çürümesi
│   │   │   ├── scoring.ts         # Zafer puanı, Efsane kontrolü
│   │   │   ├── shipyard.ts        # Tamir maliyeti, tersane indirimi
│   │   │   ├── turn-resolver.ts   # Tam tur döngüsü (çok turlu transit dahil)
│   │   │   └── *.test.ts          # Her modülün co-located test dosyası
│   │   └── package.json
│   │
│   ├── server/              # Express + Socket.io API sunucusu
│   │   ├── src/
│   │   │   ├── index.ts     # REST API uç noktaları + Socket.io
│   │   │   ├── db/
│   │   │   │   └── schema.ts  # Drizzle ORM şema (12 tablo)
│   │   │   └── llm/
│   │   │       └── mock-whispers.ts  # Statik fısıltı havuzundan çekme
│   │   └── package.json
│   │
│   └── client/              # Next.js 15 frontend
│       ├── app/
│       │   ├── page.tsx           # Ana sayfa
│       │   ├── layout.tsx         # Root layout
│       │   ├── components/
│       │   │   ├── game/          # GameShell, MapView, MapBackground, EmirView,
│       │   │   │                  # FondacoView, Kahvehane, Pazar, Tersane,
│       │   │   │                  # Muzakere, RuzgarView, TopBar, PortPanel, MainMenu
│       │   │   └── ui/            # Badge, Card, DotIndicator, Modal, ProgressBar,
│       │   │                      # StarRating, Timer, Tooltip
│       │   └── stores/            # useGameStore, useUIStore, useSocketStore
│       └── package.json
│
├── data/
│   ├── ports.json           # 15 liman (koordinatlar, üretim/talep, özellikler, trivia)
│   ├── routes.json          # 29 rota (9 tramontana, 7 kabotaj, 12 fortuna, 1 uzun_kabotaj)
│   ├── goods.json           # 17 menşe mal (7 yemek, 6 lüks, 4 savaş)
│   ├── whispers.json        # Statik fısıltı fallback havuzu (liman bazlı)
│   ├── coastlines.json      # SVG kıyı çizgileri (harita render)
│   └── port-geo.json        # Gerçek lat/lon koordinatları
│
├── docker-compose.yml       # PostgreSQL 16 + Redis 7
├── pnpm-workspace.yaml      # Workspace tanımı
└── tsconfig.base.json       # Paylaşılan TypeScript yapılandırması
```

---

## Veritabanı Şeması (12 Tablo)

> **Not:** Aşağıdaki şema `mockup/packages/server/src/db/schema.ts` dosyasındaki Drizzle ORM tanımlarını yansıtır.

### Ana Tablolar

```sql
games              -- oyun durumu: tur, mevsim, dönem, mod, max oyuncu, fondaco zamanlayıcı
players            -- oyuncu: altın, gemi, liman, transit durum, kargo, ün, görev
hidden_experience  -- 4 gizli havuz (Meltem/Terazi/Mürekkep/Simsar)
orders             -- emir: hedef liman, rota tipi, niyet, kilit durumu

port_states        -- liman: kontrolör, açlık durumu, kapanma
city_relations     -- oyuncu × liman ilişkisi (yabancı/tanıdık/kem göz)

rumors             -- söylentiler: metin, ton, güç, yaş, mevcut limanlar
combat_encounters  -- savaş kayıtları: saldırgan, savunan, taktik, güç, sonuç

events             -- tetiklenen eventler ve etkileri
messages           -- oyuncu/NPC mesajları (açık/özel kanal)
quest_progress     -- görev zinciri aşama takibi
npc_states         -- NPC kişilik, motivasyon, borç sayacı
trade_history      -- ticaret geçmişi: liman, mal, miktar, fiyat
```

### Kritik Tasarım Kararı: Emir Gizliliği

```sql
CREATE TABLE orders (
  ...
  intent      VARCHAR(20) NOT NULL,   -- GİZLİ
  route_type  VARCHAR(20) NOT NULL,   -- GİZLİ
  locked      BOOLEAN DEFAULT FALSE,
  locked_at   TIMESTAMP               -- Rüzgâr fazında açılır
);
```

Emirler çözümleme anına kadar hiçbir client'a gönderilmez. Browser devtools ile emir gözetlenemez.

---

## Tur Çözümleme Akışı (Sunucu Tarafı)

> **Not:** Aşağıdaki akış `mockup/packages/engine/src/turn-resolver.ts` dosyasındaki gerçek uygulamayı yansıtır.

```typescript
// packages/engine/src/turn-resolver.ts
function resolveTurn(input: {
  state: GameState;
  order: Order;
  ports: Port[];
  routes: Route[];
  goods: Good[];
  tactic?: Tactic;
  rng?: () => number;  // Injectable RNG (testlerde deterministic)
}): TurnResolution {

  // 1. Transit kontrol (çok turlu rota devam ediyor mu?)
  //    → Kabotaj/uzun_kabotaj rotalarında ara turlar

  // 2. Emir doğrulama (rota geçerli mi?)
  //    → isOrderReachable validator kontrolü

  // 3. Çok turlu rota kontrolü (kabotaj = 2 tur, uzun_kabotaj = 3 tur)
  //    → transitStatus/transitTurnsRemaining ayarla

  // 4. Kara Bayrak niyetinde savaş çözümleme
  //    → resolveCombat: taktik karşılaştırma + d6 zar + güç hesabı
  //    → Gemiyi batırma (durability ≤ 0 → feluka ile respawn)

  // 5. Hareket çözümleme
  //    → Oyuncuyu hedef limana taşı

  // 6. Deneyim güncelleme (sessiz)
  //    → applyExperienceGain: niyet bazlı havuz artışı

  // 7. Ticaret çözümü (Kervan niyetinde)
  //    → sellCargoAtPort: port doyma çarpanıyla otomatik satış

  // 8. Söylenti üretimi ve yayılma
  //    → createRumor + spreadRumors: rota grafı boyunca yayılma

  // 9. Ün kontrolü
  //    → determineRenown: oran eşikleri + söylenti sayısı
  //    → checkRenownDecay: pasiflik uyarısı + çelişki kontrolü
  //    → updateRenownTracking: son eylem turu takibi

  // 10. Mevsim geçişi (her 4 turda yaz ↔ kış)

  // 11. Port doyma çürümesi (her 3 turda -1)
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
