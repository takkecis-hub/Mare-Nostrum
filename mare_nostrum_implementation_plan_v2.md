# MARE NOSTRUM — Kapsamlı İmplementasyon Planı v2
## Tüm Sistemlerin Teknik Yol Haritası

> ✅ **AKTİF DOKÜMAN** — Bu plan, v1 implementasyon planını genişletir ve `mare_nostrum_mechanics_review.md` düzeltmelerini entegre eder.
> 📋 **Kaynak Dokümanlar:** Master v3, 8 modüler çalışma dokümanı, mekanik review
> 📐 **Hedef:** Solo/küçük ekip (Senaryo A) odaklı, 26 haftalık yol haritası

---

# İÇİNDEKİLER

1. [Stratejik Kararlar & Teknoloji Stack](#bölüm-1-stratejik-kararlar--teknoloji-stack)
2. [Proje Yönetimi & Agile Yapısı](#bölüm-2-proje-yönetimi--agile-yapısı)
3. [Faz 0 — Kağıt Prototip & Altyapı](#bölüm-3-faz-0--kağıt-prototip--altyapı-hafta-1-3)
4. [Faz 1 — Çekirdek Demo](#bölüm-4-faz-1--çekirdek-demo-hafta-4-11)
5. [Faz 2 — Tam Singleplayer](#bölüm-5-faz-2--tam-singleplayer-hafta-12-19)
6. [Faz 3 — Multiplayer & Lansman](#bölüm-6-faz-3--multiplayer--lansman-hafta-20-26)
7. [Detaylı DB Şeması](#bölüm-7-detaylı-db-şeması)
8. [LLM Entegrasyon Mimarisi](#bölüm-8-llm-entegrasyon-mimarisi)
9. [Söylenti Motoru Teknik Tasarımı](#bölüm-9-söylenti-motoru-teknik-tasarımı)
10. [Ekonomi Motoru](#bölüm-10-ekonomi-motoru)
11. [Savaş Motoru](#bölüm-11-savaş-motoru)
12. [Deneyim & Ün Motoru](#bölüm-12-deneyim--ün-motoru)
13. [Test Stratejisi](#bölüm-13-test-stratejisi)
14. [Maliyet & Ölçekleme](#bölüm-14-maliyet--ölçekleme)
15. [Kritik Düzeltmeler Entegrasyonu](#bölüm-15-kritik-düzeltmeler-entegrasyonu)
16. [Açık Sorular & Gelecek Yol Haritası](#bölüm-16-açık-sorular--gelecek-yol-haritası)

---

# BÖLÜM 1: STRATEJİK KARARLAR & TEKNOLOJİ STACK

## 1.1 Geliştirme Senaryosu

```
SENARYO A — Solo / 1-2 kişi (BU PLAN):
  → 26 hafta (6 ay), sıkı MVP, web-first
  → LLM maliyeti: oturum başına < $0.50
  → İlk hedef: oynanabilir singleplayer demo (Faz 1)

SENARYO B — Küçük Ekip (3-5 kişi):
  → Fazlar paralelleştirilebilir, ~16-20 haftaya düşer
  → Dedicated backend + frontend + game designer

SENARYO C — Stüdyo:
  → 12-16 hafta agresif, custom art + ses
```

## 1.2 Teknoloji Stack

```
┌─ CLIENT ──────────────────────────────────────────────┐
│  Framework:    Next.js 14+ (App Router, SSR)          │
│  Harita:       Pixi.js (Canvas) veya SVG              │
│  State:        Zustand (hafif, TypeScript dostu)       │
│  Realtime:     Socket.io-client                        │
│  UI Kit:       Tailwind CSS + shadcn/ui                │
│  Deployment:   Vercel (otomatik preview deploys)       │
└───────────────────────────────────────────────────────┘

┌─ SERVER ──────────────────────────────────────────────┐
│  Runtime:      Node.js 20+ (TypeScript)                │
│  Framework:    Express.js veya Fastify                  │
│  Realtime:     Socket.io                               │
│  API Style:    REST + WebSocket hibrit                  │
│  Deployment:   Railway veya Fly.io (container)          │
└───────────────────────────────────────────────────────┘

┌─ VERİTABANI ──────────────────────────────────────────┐
│  Primary:      PostgreSQL 16 (game state, kalıcı veri) │
│  Cache/Sess:   Redis 7 (session, LLM cache, pub/sub)   │
│  ORM:          Drizzle ORM (type-safe, lightweight)     │
│  Migrations:   Drizzle Kit                              │
└───────────────────────────────────────────────────────┘

┌─ LLM ─────────────────────────────────────────────────┐
│  Primary:      Claude Haiku 3.5 (düşük maliyet, hızlı) │
│  Fallback:     OpenAI GPT-4o-mini                       │
│  Kritik:       Claude Sonnet 3.5 (görev NPC diyalog)    │
│  SDK:          Vercel AI SDK (streaming, TypeScript)     │
│  Cache:        Redis (aynı prompt → aynı cevap)         │
│  Fallback:     Statik JSON fısıltı havuzu               │
└───────────────────────────────────────────────────────┘

┌─ ALTYAPI ─────────────────────────────────────────────┐
│  Repo:         GitHub (monorepo: /client + /server)     │
│  CI/CD:        GitHub Actions                           │
│  Monitoring:   Sentry (hata takip)                      │
│  Analytics:    PostHog (oyuncu davranışı)                │
│  LLM Monitor:  Custom dashboard (maliyet/token izleme)  │
└───────────────────────────────────────────────────────┘
```

## 1.3 Monorepo Yapısı

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
│       ├── components/      # UI bileşenleri
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
├── docs/                    # Tasarım dokümanları (bu dosyalar)
├── tests/                   # Test dosyaları
└── docker-compose.yml       # Lokal geliştirme (PG + Redis)
```

---

# BÖLÜM 2: PROJE YÖNETİMİ & AGILE YAPISI

## 2.1 Sprint Yapısı

```
HER SPRİNT = 2 HAFTA
  → Sprint Planning (Pazartesi sabah, 1 saat)
  → Daily standup (15 dk, solo geliştiricide skip)
  → Sprint Review + Demo (Cuma, 1 saat)
  → Retrospective (30 dk)
  → ÇIKTI: Oynanabilir bir şey (demo, test, ekran)
```

## 2.2 Faz Genel Bakış

```
┌───────────────────────────────────────────────────────┐
│                                                       │
│  FAZ 0        FAZ 1        FAZ 2        FAZ 3        │
│  TEMEL        ÇEKİRDEK    TAM OYUN     CİLALAMA     │
│  2-3 hafta    6-8 hafta    6-8 hafta    4-6 hafta    │
│                                                       │
│  Kağıt        Tek turlu    Çok turlu    Multiplayer   │
│  prototip     singleplayer singleplayer + polish      │
│  + teknik     demo         tam oyun     + beta test   │
│  altyapı                                              │
│                                                       │
│  ══════════════════════════════════════════════════    │
│  Toplam: ~26 hafta (6 ay)                             │
│                                                       │
└───────────────────────────────────────────────────────┘
```

## 2.3 Milestone Tanımları

| Milestone | Hafta | Kabul Kriteri |
|-----------|-------|---------------|
| M0: Paper OK | 3 | 5 turlu kağıt oyun test raporu |
| M1: Hello World | 5 | Harita + tıklanabilir limanlar + LLM "merhaba" |
| M2: One Turn | 9 | Tam 1 tur: Fondaco → Emir → Rüzgâr |
| M3: Demo | 11 | 3-5 turlu oynanabilir singleplayer demo |
| M4: Full SP | 19 | 20-40 turlu tam singleplayer |
| M5: MP Alpha | 22 | 2 oyunculu multiplayer çalışıyor |
| M6: Beta | 26 | 4+ oyunculu, tutorial, landing page |

---

# BÖLÜM 3: FAZ 0 — KAĞIT PROTOTİP & ALTYAPI (Hafta 1-3)

## 3.1 Kağıt Prototip (Hafta 1)

**Hedef:** Tek bir satır kod yazmadan önce, kağıt üzerinde tam bir tur oyna.

```
HAZIRLIK:
  → 15 liman kartı (port bilgileri, üretim/talep)
  → 29 rota kartı (tip, darboğaz?)
  → 15 menşe mal tokeni
  → 3 gemi kartı (Feluka, Karaka, Kadırga)
  → 3 taktik kartı (Pruva, Ateş, Manevra)
  → Zar (1d6)
  → Altın tokenleri
  → Kargo takip kağıdı

OYNANIŞ:
  → 1 kişi oyuncu, 1 kişi "LLM" (kahvehane fısıltıları + NPC)
  → 5 tur oyna, her turda not al:
    - Tur süresi (hedef: 7-12 dk)
    - Hangi kararlar ilginçti, hangileri sıkıcıydı?
    - Ekonomi çalışıyor mu? (menşe mal, açlık/doyma)
    - Savaş tatmin edici mi? (Pruva/Ateş/Manevra)
    - Söylenti sistemi anlaşılıyor mu?

ÇIKTI:
  → Mekanik düzeltme listesi (GDD güncelleme)
  → Denge sorunları listesi
  → "Bu çalışıyor / bu çalışmıyor" raporu
```

### Kağıt Prototipte Test Edilecek Kritik Mekanikler

```
1. AÇLIK/DOYMA: 2 oyuncuyla 5 tur, fiyatlar çöküyor mu?
2. SAVAŞ: Pruva/Ateş/Manevra seçimi anlamlı mı?
   → Manevra ödülü (istihbarat + moral) yeterli mi?
3. DARBOĞAZ: %75 karşılaşma olasılığı çok mu, az mı?
4. SÖYLENTİ: 3 turda söylenti yayılması hissediliyor mu?
5. İLK GELEN BONUSU: Feluka hep birinci mi geliyor?
   → Kargo-bonus ters orantısı çalışıyor mu?
6. GEMİ DENGESİ: Kadırga çok güçlü mü?
   → Kadırga Kabotaj'da ekstra 1 tur cezası hissediliyor mu?
7. 200 ALTIN BAŞLANGIÇ: Yeterli mi? (Feluka 100, kalan 100 ticaret)
```

## 3.2 Teknik Altyapı (Hafta 2-3)

```
GÖREVLER:
  □ Monorepo oluştur (pnpm workspace)
  □ TypeScript yapılandırması (shared types)
  □ Docker Compose: PostgreSQL 16 + Redis 7
  □ Drizzle ORM kurulum + ilk migration
  □ Temel veri modelleri (shared/types/)
  □ Basit Express/Fastify server "hello world"
  □ Next.js client "hello world"
  □ Socket.io bağlantı testi (ping/pong)
  □ LLM API bağlantı testi:
    → Claude Haiku: basit kahvehane prompt → 3 fısıltı al
    → Gecikme ölç (<3sn hedef)
    → Token sayısı ve maliyet kaydet
  □ Redis cache testi (prompt hash → response cache)
  □ CI/CD: GitHub Actions (lint + type-check + test)

KABUL KRİTERİ:
  → `pnpm dev` ile client + server + DB çalışıyor
  → LLM API çağrısı başarılı, <3sn yanıt
  → WebSocket bağlantı kurulabiliyor
  → DB migration'lar çalışıyor
```

### LLM Performans Baseline Testleri

```
TEST 1 — Kahvehane Fısıltısı:
  Input: ~300 token (liman durumu + deneyim profili + event)
  Output: ~100 token (3 kısa cümle Türkçe)
  Hedef: <3sn, <$0.002
  Model: Claude Haiku 3.5

TEST 2 — Şehir Yöneticisi Diyalogu:
  Input: ~500 token (şehir + oyuncu söylenti + deneyim)
  Output: ~150 token (kısa diyalog)
  Hedef: <4sn, <$0.004
  Model: Claude Haiku 3.5

TEST 3 — NPC Mesajı:
  Input: ~400 token (NPC profili + oyuncu durumu + motivasyon)
  Output: ~80 token (kısa mesaj)
  Hedef: <3sn, <$0.003
  Model: Claude Haiku 3.5

SONUÇ: Gecikme ve maliyet tablosu → maliyet modeli doğrulama
```

**Faz 0 Çıktısı:** Çalışan dev environment + kağıt prototip notları + LLM performans baseline.

---

# BÖLÜM 4: FAZ 1 — ÇEKİRDEK DEMO (Hafta 4-11)

**Hedef:** 3-5 turlu, singleplayer, oynanabilir demo. Fondaco → Emir → Rüzgâr tam döngüsü.

## Sprint 1: Harita + Liman Sistemi (Hafta 4-5)

```
GÖREVLER:
  □ Pixi.js/SVG harita render: 15 liman, 29 rota, 3 darboğaz
  □ Liman tıklama → liman detay paneli
  □ Oyuncu konumu gösterimi (gemi ikonu)
  □ Rota tipleri görsel ayrım:
    → Tramontana: düz çizgi (mavi)
    → Kabotaj: noktalı çizgi (yeşil)
    → Fortuna: dalgalı çizgi (kırmızı)
  □ Darboğaz vurgulama (kalın, kırmızı çerçeve)
  □ Bölge renklendirme (Batı/Orta/Doğu/Güney)
  □ Port tooltip: isim, bölge, üretim/talep kısa bilgi

15 LİMAN VERİ YAPISI (ports.json):
  {
    id: "venedik",
    name: "Venedik",
    displayName: "La Serenissima",
    region: "orta",       // bati, orta, dogu, guney
    controller: "venedik", // dönemsel değişir
    produces: { good: "murano_cami", category: "luks", basePrice: "ucuz" },
    desires: { good: "lubnan_sediri", category: "savas", basePrice: "pahali" },
    hunger: {},            // runtime: { [goodId]: "ac" | "normal" | "tok" }
    special: ["arsenal_indirim", "cam_tekeli"],
    trivia: ["venedik_trivia_1", "venedik_trivia_2"]
  }

29 ROTA VERİ YAPISI (routes.json):
  {
    id: "venedik_ragusa",
    from: "venedik",
    to: "ragusa",
    type: "tramontana",    // tramontana, kabotaj, fortuna, uzun_kabotaj
    isChokepoint: "otranto", // null veya darboğaz adı
    encounterChance: 0.65,   // darboğaz oranı
    turnsRequired: 1         // 1, 2, veya 3
  }

KABUL KRİTERİ:
  → Harita ekranda görünüyor, 15 liman tıklanabilir
  → Rotalar çizilmiş, tip ayrımı (renk/stil) var
  → Darboğazlar vurgulanmış
```

## Sprint 2: Fondaco — Kahvehane + Pazar (Hafta 5-6)

```
GÖREVLER:
  □ Fondaco ana ekran: 4 lokasyon butonu (Kahvehane, Pazar, Müzakere, Tersane)
  □ Kahvehane ekranı:
    → 3 fısıltı gösterimi (metin kartları)
    → LLM entegrasyonu: kahvehane prompt → 3 fısıltı
    → Deneyim profiline göre fısıltı filtreleme
    → ☽ Trivia fısıltısı (her 3-4 turda, statik JSON'dan)
  □ Kahvehane aksiyonları:
    → Kahve Falı (pasif bilgi toplama)
    → Rüzgâr Ek (söylenti yayma, 25 altın) — Faz 1'de basit UI
    → Ateşe Su (söylenti çürütme) — Faz 1'de placeholder
    → İzi Sürmek (kaynak bulma) — Faz 1'de placeholder
  □ Pazar ekranı:
    → Menşe mal listesi (limanın ürettiği + mevcut stok)
    → ●●●○○ fiyat göstergesi (beş nokta sistemi)
    → Terazi deneyimine göre detay artışı (hard-coded seviyelerde)
    → Al/sat butonu + kargo yönetimi
    → Altın güncelleme (real-time)
  □ Kargo paneli (HUD): mevcut kargo listesi, kalan kapasite

LLM KAHVEHANE PROMPT ŞABLONU:
  """
  Sen bir Akdeniz kahvehanesinin atmosferini yaratıyorsun.
  Liman: {port_name} ({port_region})
  Mevsim: {season}
  Aktif olaylar: {active_events}
  Oyuncunun deneyim profili (kelime olarak): {experience_words}
  
  Tam olarak 3 kısa fısıltı üret (her biri 1-2 cümle, Türkçe).
  Fısıltı 1: {experience_dominant} alanıyla ilgili
  Fısıltı 2: genel piyasa/güvenlik bilgisi
  Fısıltı 3: NPC veya söylenti bilgisi
  
  KURAL: Fısıltılar %70 doğru, %30 yanıltıcı olabilir.
  KURAL: Kısa, atmosferik, kahvehane dili kullan.
  """

KABUL KRİTERİ:
  → Kahvehaneye girince LLM 3 fısıltı üretiyor (<3sn)
  → Pazar ekranında mal alınıp satılabiliyor
  → ●●●○○ göstergesi çalışıyor
  → Altın güncelleniyor
  → Kargo kapasitesi kontrol ediliyor
```

## Sprint 3: Fondaco — Müzakere + Emir Sistemi (Hafta 6-7)

```
GÖREVLER:
  □ NPC mesaj paneli (singleplayer):
    → 4 NPC oluşturma (LLM ile oyun başı)
    → NPC kişilik kartları: her NPC için 5-7 madde
    → NPC mesaj gösterimi (teklif/tehdit/bilgi/hikaye)
    → Oyuncu cevap seçenekleri (3-4 seçenek)
  □ Emir ekranı:
    → NEREYE: haritadan hedef liman seç
    → NASIL: Tramontana / Kabotaj / Fortuna dropdown
    → NİYET: Kervan / Kara Bayrak / Pusula / Duman seçimi
    → Seçim özeti gösterimi
    → "Emri Kilitle" butonu
  □ Tersane ekranı (basit):
    → Mevcut gemi durumu gösterimi
    → Tamir butonu (gemi değerinin %25'i)
    → Gemi değiştirme listesi (Faz 1'de sadece UI)

NPC YARATMA PROMPT ŞABLONU:
  """
  Oyunun başında 4 NPC yarat. Her biri için:
  1. İsim (dönemine ve kökenine uygun)
  2. Köken şehir ve backstory (2 cümle)
  3. Gizli motivasyon (oyuncunun başta bilmediği)
  4. Başlangıç gemisi ve ünü
  5. Konuşma tarzı (kısa örnekle)
  
  DÖNEM: {era}
  OYUNCUNUN KÖKENİ: {player_origin}
  
  Format: JSON array
  """

EMİR VERİ YAPISI:
  {
    playerId: UUID,
    gameId: UUID,
    turn: number,
    destinationPort: string,   // liman ID
    routeType: "tramontana" | "kabotaj" | "fortuna",
    intent: "kervan" | "kara_bayrak" | "pusula" | "duman",
    locked: boolean,
    lockedAt: timestamp
  }

KABUL KRİTERİ:
  → En az 1 NPC mesaj atıyor (LLM)
  → Emir verilebiliyor (3 seçim: nereye, nasıl, niyet)
  → Emir kilitlenince Rüzgâr fazına geçiş
```

## Sprint 4: Rüzgâr — Çözümleme Motoru (Hafta 7-9)

```
GÖREVLER:
  □ Tur çözümleme motoru (packages/engine/turn-resolver/):
    1. Hava durumu kontrolü (mevsim + zar → fırtına?)
    2. Hareket çözümleme (tüm emirler eş zamanlı)
    3. Kabotaj 2. tur yönetimi:
       → Transit durumda: Fondaco yok, denizde gözlem modu
       → Küçük deniz olayı tetiklenebilir (balıkçı, enkaz)
    4. Karşılaşma kontrolü (aynı rotada kimler var?)
       → Darboğaz: encounterChance kullan
       → Normal rota: NPC karşılaşma olasılığı
    5. Niyet çözümü:
       → Kervan vs Kervan: geçiş (ticaret)
       → Kara Bayrak vs herhangi: savaş başlat
       → Pusula vs herhangi: gözlem (bilgi topla)
       → Duman vs herhangi: görünmez geç, borç yarat
    6. Savaş sistemi (combat modülü çağır)
    7. Ticaret çözümü (economy modülü çağır)
    8. Söylenti üretimi (rumor modülü çağır)
    9. Deneyim güncelleme (experience modülü çağır)
    10. Ün kontrolü (renown modülü çağır)

  □ Savaş ekranı UI:
    → Taktik seçimi: Pruva / Ateş / Manevra (3 buton + ikon)
    → Savunan: 4. seçenek "Kaçış Denemesi"
    → Animasyonlu sonuç gösterimi
    → Ganimet/hasar özeti

  □ Ticaret sonuç ekranı:
    → Satılan mal, pazar durumu (AÇ/NORMAL/TOK)
    → İlk gelen bonusu (evet/hayır)
    → Kazanç gösterimi + yıldız sistemi
    → ★ = idare eder, ★★ = iyi, ★★★ = mükemmel, ★★★★ = efsanevi

FIRITINA KONTROLÜ:
  if (season === "kış") {
    stormChance = route.type === "fortuna" ? 0.35 : 0.15;
  } else {
    stormChance = route.type === "fortuna" ? 0.20 : 0.05;
  }
  // Meltem deneyimine göre hasar azalır (Bölüm 12'de detay)

KARŞILAŞMA KONTROLÜ:
  if (route.isChokepoint) {
    encounterChance = route.encounterChance; // %65-80
  } else {
    encounterChance = 0.15 + (npcCount * 0.05);
  }

NİYET ÇÖZÜM MATRİSİ:
  ┌──────────┬──────────┬──────────┬──────────┬──────────┐
  │          │ Kervan   │ K.Bayrak │ Pusula   │ Duman    │
  ├──────────┼──────────┼──────────┼──────────┼──────────┤
  │ Kervan   │ geçiş    │ SAVAŞ    │ geçiş    │ geçiş    │
  │ K.Bayrak │ SAVAŞ    │ SAVAŞ    │ SAVAŞ    │ geçiş*   │
  │ Pusula   │ gözlem   │ SAVAŞ    │ geçiş    │ geçiş    │
  │ Duman    │ geçiş    │ geçiş*   │ geçiş    │ geçiş    │
  └──────────┴──────────┴──────────┴──────────┴──────────┘
  * Duman başarılı: karşılaşma olmaz (Simsar kontrolü)

KABUL KRİTERİ:
  → Emir verildiğinde çözümleme çalışıyor
  → Karşılaşma oluyorsa savaş ekranı çıkıyor
  → Taktik seçimi yapılıyor (Pruva/Ateş/Manevra)
  → Limana varıldığında ticaret çözülüyor
  → Sonuç ekranı gösteriliyor (★ yıldız sistemi)
```

## Sprint 5: Söylenti + Deneyim + Ün (Hafta 9-11)

```
GÖREVLER:
  □ Söylenti motoru (packages/engine/rumor/):
    → Eylem → otomatik söylenti üretimi
    → Her tur söylenti yayılma (komşu limanlara)
    → Şablon bazlı çarpıtma (seven: olumlu, sevmeyen: olumsuz)
    → Söylenti ömrü takibi (küçük: 3-4, orta: 5-6, büyük: 8-10 tur)
    → Söylenti gücü azalması (her tur -15 strength)
  □ Söylenti UI:
    → Liman girişinde "hakkında bilinenler" paneli
    → Rüzgâr Ek aksiyonu tam çalışır (25 altın maliyet)
  □ Deneyim motoru (packages/engine/experience/):
    → 4 gizli havuz birikimi (eylem → havuz + puan)
    → Oran hesaplama (Meltem / Toplam)
    → Kahvehane fısıltılarını deneyime göre filtreleme
  □ Ün motoru (packages/engine/renown/):
    → 8 ün koşul kontrolü (deneyim oranı + söylenti eşiği)
    → Ün kazanım bildirimi
    → Ün kaybı takibi (5 tur uyarı, 8 tur kayıp)
  □ Oyuncu profil ekranı:
    → Ünler (★ Altın Parmak, ★ İpek Dil, ☆ boş)
    → Hakkında bilinen söylentiler listesi
    → Gemi durumu, altın, kargo

SÖYLENTİ YAYILMA ALGORİTMASI:
  function spreadRumors(gameState) {
    for (rumor of gameState.activeRumors) {
      rumor.age += 1;
      rumor.strength -= 15; // her tur %15 zayıfla
      if (rumor.strength <= 0) { remove(rumor); continue; }
      
      for (port of rumor.currentPorts) {
        for (route of port.connectedRoutes) {
          neighbor = route.otherPort(port);
          if (neighbor not in rumor.currentPorts) {
            spreadChance = {
              tramontana: 0.8,
              kabotaj: 0.5,
              fortuna: 0.6
            }[route.type];
            if (random() < spreadChance) {
              distorted = distortRumor(rumor, neighbor, gameState);
              distorted.currentPorts.push(neighbor);
            }
          }
        }
      }
    }
  }

ÜN KOŞUL TABLOSU:
  ┌──────────────┬────────────────────────────┬───────────────────────┐
  │ Ün           │ Deneyim Koşulu             │ Söylenti Koşulu       │
  ├──────────────┼────────────────────────────┼───────────────────────┤
  │ Altın Parmak │ Terazi oranı ≥ %35         │ 3+ aktif ticaret söyl.│
  │ Demir Pruva  │ Meltem oranı ≥ %35         │ 2+ aktif savaş söyl.  │
  │ İpek Dil     │ Mürekkep oranı ≥ %35       │ 2+ aktif diplomatik   │
  │ Hayalet Pala │ Simsar oranı ≥ %30         │ Neredeyse 0 negatif   │
  │ Mühürlü Söz  │ Mürekkep oranı ≥ %25       │ 0 ihanet söylentisi   │
  │ Akrep        │ (herhangi)                 │ 3+ ihanet söylentisi  │
  │ Açık El      │ Yüksek itibar, düşük Simsar│ Cömertlik söylentileri│
  │ Deli Rüzgâr  │ Yüksek Meltem + Simsar     │ Tehlikeli eylem söyl. │
  └──────────────┴────────────────────────────┴───────────────────────┘

KABUL KRİTERİ:
  → Savaş yapınca söylenti üretiliyor
  → Söylenti sonraki turda komşu limanlarda görünüyor
  → Deneyim birikimi çalışıyor (debug ekranında kontrol)
  → Yeterli deneyim + söylenti → ün kazanılıyor
  → Kahvehane fısıltıları deneyime göre farklılaşıyor
```

### Faz 1 Milestone Demo Akışı

```
1. Oyun başlar → Harita görünür, oyuncu Venedik'te
2. Fondaco:
   - Kahvehane: LLM 3 fısıltı üretir
   - Pazar: Murano Camı ucuz, Lüks yükle
   - NPC Fatma mesaj atar: "İskenderiye'de baharat pahalı"
3. Emir: İskenderiye, Tramontana, Kervan
4. Rüzgâr:
   - Hareket çözülür
   - Girit açıklarında NPC Yorgos ile karşılaşma (Kara Bayrak!)
   - Savaş: Pruva/Ateş/Manevra seçimi → çözüm
   - İskenderiye'ye varış
   - Ticaret: Murano Camı sat → ●●●●○ fiyat → ★★★ tur!
5. Söylenti: "Girit'te savaş oldu" yayılır
6. Deneyim: Meltem +2, Terazi +1
7. Yeni tur başlar → Fondaco (İskenderiye)
```

**Faz 1 Çıktısı:** 3-5 tur oynanabilir singleplayer demo. LLM kahvehane ve NPC'ler aktif.

---

# BÖLÜM 5: FAZ 2 — TAM SİNGLEPLAYER (Hafta 12-19)

## Sprint 6: Event Sistemi (Hafta 12-13)

```
GÖREVLER:
  □ Event motoru (packages/engine/event/):
    → 4 tetikleyici tipi: zamansal, koşullu, rastgele, zincir
    → Event veri yapısı (events.json: 92 event)
    → Event duyuru ekranı (LLM dramatik duyuru + ☽ trivia)
    → Event mekanik etkileri: liman kapanma, fiyat şoku, savaş ilanı
    → Mevsim sistemi: yaz/kış (her 5 turda geçiş)

EVENT VERİ YAPISI:
  {
    id: "kara_veba",
    type: "mega",
    trigger: { type: "temporal", turn: 25, era: "14th_century" },
    frequency: "once",
    duration: 5,        // kaç tur sürer
    effects: [
      { type: "port_close", targets: ["cenova", "venedik"], turns: 3 },
      { type: "price_shock", category: "yemek", multiplier: 2.0 },
      { type: "encounter_change", global: -0.3 }
    ],
    announcement: {
      llmPrompt: "Kara Veba event duyurusu yaz...",
      trivia: "kara_veba_trivia_1"
    },
    dilemma: {
      options: [
        { id: "A", text: "Göçmenlere yardım et", effects: [...] },
        { id: "B", text: "Limanları kapat", effects: [...] },
        { id: "C", text: "Fırsatçılık yap", effects: [...] }
      ]
    }
  }

EVENT SIKLIK DENGESİ (Review düzeltmesi):
  → Küçük event: her 3-5 turda (1-3'ten artırıldı)
  → Orta event: her 5-10 turda
  → Büyük event: her 10-15 turda
  → Mega event: yüzyılda 2-3

LİMAN KAPANMA KURALLARI:
  → 1 tur önceden uyarı (kahvehane fısıltısı)
  → Limanda mahsur kalan: çıkabilir ama alım/satım yapamaz
  → Yolda olan: en yakın açık limana yönlendirilir

KABUL KRİTERİ:
  → Belirli turda tarihsel event tetikleniyor
  → Rastgele event'ler çalışıyor (fırtına, piyasa şoku)
  → Event LLM duyurusu + trivia gösteriliyor
  → Event mekanik etkisi uygulanıyor
```

## Sprint 7: Görev Zincirleri (Hafta 14-16)

```
GÖREVLER:
  □ Köken seçim ekranı (4 köken + "rastgele"):
    → Kayıp Hazine, Babanın Şerefi, İntikam, Saf Merak
  □ Görev motoru (packages/engine/quest/):
    → Aşama takibi (5 aşama × 4 yol)
    → Tetikleyiciler (tur + konum + koşul)
    → Dallanma (her aşamada 4+ çözüm yolu: Demir/Mürekkep/Simsar/Zehir)
  □ ⚓ görev ipucu gösterimi (kahvehanede)
  □ Görev özel NPC'leri (Yakup, Hamid, Nuri Usta vb.)
  □ Görev özel LLM diyalogları
  □ 4 görev zincirinin implementasyonu:

GÖREV ZİNCİRİ 1 — KAYIP HAZİNE:
  Aşama 1 (Tur 3):  Yaşlı gemici → Harita Parça 1 (ev limanı)
  Aşama 2 (Tur 7):  İstanbul antikacı Yakup → Harita Parça 2
    → 4 yol: Kabul/Altınla ikna(Terazi %45+)/Çal(Simsar %40+)/Bilgi teklif(Mürekkep %35+)
  Aşama 3 (Tur 13): Korsan Reis Hamid → Harita Parça 3
    → 4 yol: Demir(savaş)/Mürekkep(Fatma aracılığı)/Simsar(ilacı getir)/Zehir(Malta'ya ihbar)
  Aşama 4 (Tur 19): Harita tamamlandı → Gavdos batığı
    → Meltem kontrolü: %70 başarı (yüksek), %30 (düşük, tekrar dene)
  Aşama 5 (Tur 25): 4 final yolu (sat/bağışla/gizle sat/siyasi koz)

GÖREV ZİNCİRİ 2 — BABANIN ŞEREFİ:
  Aşama 1 (Tur 3):  Nuri Usta → Babanın commenda hikayesi
  Aşama 2 (Tur 7):  Ortağı sorguya çek (NPC'lerden biri düşman çıkar)
  Aşama 3 (Tur 13): 3 kanıt topla (gümrük/mürettebat/maliye)
  Aşama 4 (Tur 20): Adalet seçimi (mahkeme/dedikodu/savaş/affetme)
  Aşama 5 (Tur 28): Miras ve sonuç

GÖREV ZİNCİRİ 3 — İNTİKAM:
  Aşama 1 (Tur 1):  Düşman NPC belirlenir (arma ipucu)
  Aşama 2 (Her 5 tur): İz sürme, bilgi toplama
  Aşama 3 (Orta oyun): Yüzleşme → asıl sorumluluk büyük güçte
  Aşama 4: İntikam ikilemi (öldür/sistemi çökert/affet)
  Aşama 5: Sonuç ünü (Demir Pruva / Akrep / Mühürlü Söz)

GÖREV ZİNCİRİ 4 — SAF MERAK:
  7 bağımsız sır keşfi (herhangi sırada):
  1. Kayıp Kütüphane (İskenderiye/Terazi)
  2. Rum Ateşi Formülü (Girit/Meltem)
  3. Ragusa Diplomasisi (Ragusa/Mürekkep)
  4. Korsan Hazinesi (Cezayir/Simsar)
  5. Kartaca Laneti (Tunus/Meltem+Terazi)
  6. Şövalyelerin Sırrı (Malta/Mürekkep+Meltem)
  7. Alfabe Kökenleri (Beyrut/Mürekkep+Simsar)
  Final: "Kaşif" özel ünü

KABUL KRİTERİ:
  → Oyun başında köken seçilebiliyor
  → Görev ipuçları kahvehanede görünüyor (⚓ sembol)
  → En az 1 görev zinciri baştan sona oynanabiliyor
  → Görev dallanıyor (oyuncu seçimine göre)
```

## Sprint 8: Anlatı + Trivia + Cilalama (Hafta 17-19)

```
GÖREVLER:
  □ 10 tur özeti (LLM "Kaptanın Günlüğü")
  □ Dönem geçiş anlatıları (her yüzyıl değişimi)
  □ ☽ Trivia sistemi:
    → 15 liman × 3-5 trivia = ~60 statik trivia (trivia.json)
    → Event trivia: Kara Veba, İstanbul Fethi, İnebahtı, vb.
    → NPC trivia: her NPC'nin kendi paylaşacağı trivia
    → Görünüm: ☽ sembol + [!] kutusu
  □ Şehir yöneticisi LLM diyalogu (Mürekkep deneyimine göre)
  □ Denge ayarları:
    → 20 tur simülasyon (menşe mal fiyat dengesi)
    → Açlık/doyma hız ayarı
    → Savaş zar aralıkları
    → NPC zorluk dengesi
  □ LLM prompt optimizasyonu (token azaltma, kalite koruma)
  □ LLM cache sistemi (Redis: tekrarlayan prompt hash)
  □ UI/UX cilalama (animasyonlar, geçişler, renkler)

10 TUR ÖZETİ PROMPT:
  """
  Oyuncunun son 10 turluk hikayesini dramatik şekilde özetle.
  Dahil et: önemli olaylar, NPC ilişkileri, ün değişimleri,
  kişisel görev ilerlemesi, ve 1 tarihsel perspektif.
  3-4 paragraf. Sonunda 1 stratejik soru sor.
  
  Oyuncu verileri: {player_summary_json}
  Son 10 tur özet: {turn_events_summary}
  """

KABUL KRİTERİ:
  → Her 10 turda LLM özet yazıyor
  → ☽ Trivia kahvehanede ve event'lerde görünüyor
  → 20 turlu oyun pürüzsüz oynanıyor
  → LLM çağrıları <3sn
  → Her oyun tarzı viable (tüccar, korsan, diplomat, gölge)
```

**Faz 2 Çıktısı:** Tam singleplayer oyun. 20-40 tur, 4 köken hikayesi, event'ler, trivia, NPC'ler.

---

# BÖLÜM 6: FAZ 3 — MULTIPLAYER & LANSMAN (Hafta 20-26)

## Sprint 10: Multiplayer Altyapı (Hafta 20-22)

```
GÖREVLER:
  □ WebSocket sunucu (Socket.io):
    → Oda oluşturma / katılma
    → Oyun durumu senkronizasyonu
  □ Eş zamanlı emir sistemi:
    → Tüm oyuncular kilitleyince çözüm
    → "Kilitlendi" bildirimi broadcast (emir içeriği GİZLİ)
    → Zamanlayıcı (7 dk Fondaco, ilk 5 turda %50 uzatılmış = 10.5 dk)
    → Zamanlayıcı dolunca: kilitlemeyenler "Duman" emri alır
  □ Chat sistemi:
    → Açık kanal (tüm oyuncular)
    → Özel kanal (ikili mesajlaşma)
    → Rüzgâr fazında chat kapalı
  □ Commenda mekaniği:
    → Yatırımcı + tüccar anlaşma UI
    → İhanet seçeneği + otomatik söylenti
  □ Konvoy emir koordinasyonu
  □ Multiplayer savaş (oyuncu vs oyuncu taktik seçimi)
  □ Lobby sistemi:
    → Oyun ayarları: tur sayısı, dönem, oyuncu sayısı (2-8)
    → Hazır/bekliyor durumu
    → Oyun başlatma

EMİR GİZLİLİĞİ TEKNİK:
  → Emirler SUNUCU TARAFINDA şifrelenir
  → Çözümleme anına kadar hiçbir client'a gönderilmez
  → API rate limiting: saniyede max 10 istek (bot koruması)
  → Browser devtools ile emir gözetlenemez

KABUL KRİTERİ:
  → 2 oyuncu aynı oyuna girebiliyor
  → Chat çalışıyor (açık + özel)
  → Emir sistemi eş zamanlı çalışıyor
  → Savaş oyuncu vs oyuncu çözülüyor
```

## Sprint 11: Multiplayer Denge + Test (Hafta 23-24)

```
GÖREVLER:
  □ 4 oyunculu playtest (en az 10 oturum)
  □ Açlık/doyma hız ölçeklemesi (oyuncu sayısına göre):
    → 2 oyuncu: 1 getiri -1, 2+ getiri -3
    → 4 oyuncu: 1/-1, 2/-2, 3+/DİBE
    → 6+ oyuncu: 1/-1, 2/-1, 3/-2, 4+/DİBE
  □ NPC sayısı ayarı (oyuncu sayısına göre): 
    → 2 oyuncu: 4 NPC | 4 oyuncu: 2 NPC | 6+ oyuncu: 0-1 NPC
  □ Disconnect handling:
    → Fondaco'da disconnect: 2 dk bekleme, sonra AFK
    → AFK oyuncu emri: "aynı limanda kal + Duman"
    → 3 tur AFK → NPC autopilot devralır
    → 5 tur AFK → oyuncu otomatik çıkarılır, NPC kalır
    → Rüzgâr fazında disconnect: emir kilitliyse normal devam
    → Savaşta disconnect: savunan Manevra seçmiş kabul edilir
    → Reconnect: son durum özeti gösterilir
  □ Kingmaker dinamiği testi
  □ Koalisyon dinamiği testi

KABUL KRİTERİ:
  → 4 oyunculu 20 turlu oyun pürüzsüz bitiyor
  → Ekonomi dengeli (her oyun tarzı viable)
  → Disconnect sorunsuz yönetiliyor
```

## Sprint 12: Lansman Hazırlığı (Hafta 25-26)

```
GÖREVLER:
  □ Tutorial / onboarding (ilk 3 tur rehberli)
  □ Hesap sistemi (email + OAuth: Google, Discord)
  □ Landing page
  □ Oyun geçmişi kaydı (istatistikler)
  □ Davet sistemi
  □ Bug fix sprint
  □ LLM maliyet projeksiyonu (kullanıcı başına)

KABUL KRİTERİ:
  → Yeni oyuncu 5 dakikada oyuna başlayabiliyor
  → Oyun stabil (crash yok, data loss yok)
  → LLM maliyeti < $0.50/oturum
```

**Faz 3 Çıktısı:** 2-8 oyunculu multiplayer beta. Tutorial, landing page, hesap sistemi.

---

# BÖLÜM 7: DETAYLI DB ŞEMASI

```sql
-- ═══════════════════════════════════════════════════════
-- ANA TABLOLAR
-- ═══════════════════════════════════════════════════════

CREATE TABLE games (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status          VARCHAR(20) NOT NULL DEFAULT 'lobby',
                  -- 'lobby', 'active', 'finished'
  turn            INTEGER NOT NULL DEFAULT 0,
  season          VARCHAR(10) NOT NULL DEFAULT 'yaz',
                  -- 'yaz', 'kış'
  era             VARCHAR(30) DEFAULT '13th_century',
                  -- '11th_century'...'18th_century'
  mode            VARCHAR(20) NOT NULL DEFAULT 'singleplayer',
                  -- 'singleplayer', 'multiplayer'
  max_players     INTEGER DEFAULT 1,
  max_turns       INTEGER DEFAULT 30,
  fondaco_timer   INTEGER DEFAULT 420,
                  -- saniye (7dk = 420sn)
  settings        JSONB DEFAULT '{}',
  created_at      TIMESTAMP DEFAULT NOW(),
  finished_at     TIMESTAMP
);

CREATE TABLE players (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id         UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  user_id         UUID,          -- NULL for NPC
  name            VARCHAR(100) NOT NULL,
  is_npc          BOOLEAN DEFAULT FALSE,
  gold            INTEGER NOT NULL DEFAULT 200,
  ship_type       VARCHAR(20) NOT NULL DEFAULT 'feluka',
                  -- 'feluka', 'karaka', 'kadirga'
  ship_status     VARCHAR(20) NOT NULL DEFAULT 'hazir',
                  -- 'hazir', 'yarali', 'batik'
  current_port_id VARCHAR(50) NOT NULL,
  home_port_id    VARCHAR(50) NOT NULL,
  transit_status  VARCHAR(20) DEFAULT NULL,
                  -- NULL, 'transit_turn_1', 'transit_turn_2'
  transit_dest    VARCHAR(50) DEFAULT NULL,
  cargo           JSONB NOT NULL DEFAULT '[]',
                  -- [{goodId, quantity, originPort, purchasePrice}]
  renown          JSONB NOT NULL DEFAULT '[]',
                  -- ["altin_parmak", "ipek_dil"]
  origin_story    VARCHAR(50),
                  -- 'kayip_hazine', 'babanin_serefi', 'intikam', 'saf_merak'
  quest_chain     VARCHAR(50),
  quest_stage     INTEGER DEFAULT 0,
  quest_branch    VARCHAR(50),
  quest_data      JSONB DEFAULT '{}',
  afk_turns       INTEGER DEFAULT 0,
  is_active       BOOLEAN DEFAULT TRUE,
  joined_at       TIMESTAMP DEFAULT NOW()
);

CREATE TABLE hidden_experience (
  player_id       UUID PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  meltem          INTEGER NOT NULL DEFAULT 0,
  terazi          INTEGER NOT NULL DEFAULT 0,
  murekkep        INTEGER NOT NULL DEFAULT 0,
  simsar          INTEGER NOT NULL DEFAULT 0
  -- Oran hesaplaması: meltem / (meltem + terazi + murekkep + simsar)
  -- %25 altı hard gate: ilgili fırsatlar tamamen kaçırılır
);

CREATE TABLE port_states (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id         UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  port_id         VARCHAR(50) NOT NULL,
  controller      VARCHAR(100),     -- dönemsel güç
  hunger          JSONB NOT NULL DEFAULT '{}',
                  -- { "misir_baharati": "ac", "murano_cami": "tok", ... }
                  -- Değerler: "cok_ac", "ac", "normal", "tok", "cok_tok"
  is_closed       BOOLEAN DEFAULT FALSE,
  close_reason    VARCHAR(50),
  close_turns_left INTEGER DEFAULT 0,
  UNIQUE(game_id, port_id)
);

CREATE TABLE city_relations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id         UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  player_id       UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  port_id         VARCHAR(50) NOT NULL,
  relation_level  VARCHAR(20) NOT NULL DEFAULT 'yabanci',
                  -- 'tanidik_yuz', 'yabanci', 'kem_goz'
  relation_score  INTEGER NOT NULL DEFAULT 0,
                  -- -100 (kem_goz) ... 0 (yabanci) ... +100 (tanidik_yuz)
  last_visit_turn INTEGER,
  active_rumors_about INTEGER DEFAULT 0,
  UNIQUE(game_id, player_id, port_id)
);

CREATE TABLE orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id         UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  player_id       UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  turn            INTEGER NOT NULL,
  destination_port VARCHAR(50) NOT NULL,
  route_type      VARCHAR(20) NOT NULL,
                  -- 'tramontana', 'kabotaj', 'fortuna'
  intent          VARCHAR(20) NOT NULL,
                  -- 'kervan', 'kara_bayrak', 'pusula', 'duman'
  locked          BOOLEAN NOT NULL DEFAULT FALSE,
  locked_at       TIMESTAMP,
  UNIQUE(game_id, player_id, turn)
);

-- Savaş taktiği ayrı tablo — savaş SIRASINDA seçilir, emir SIRASINda değil
CREATE TABLE combat_encounters (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id         UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  turn            INTEGER NOT NULL,
  route_id        VARCHAR(50),
  attacker_id     UUID NOT NULL REFERENCES players(id),
  defender_id     UUID NOT NULL REFERENCES players(id),
  attacker_tactic VARCHAR(20),
                  -- 'pruva', 'ates', 'manevra'
  defender_tactic VARCHAR(20),
                  -- 'pruva', 'ates', 'manevra', 'kacis'
  attacker_power  INTEGER,
  defender_power  INTEGER,
  result          VARCHAR(20),
                  -- 'attacker_wins', 'defender_wins', 'draw', 'escape'
  loot            JSONB DEFAULT '{}',
  attacker_damage BOOLEAN DEFAULT FALSE,
  defender_damage BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE rumors (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id         UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  text            TEXT NOT NULL,
  about_player_id UUID REFERENCES players(id),
                  -- NULL ise genel söylenti (piyasa, event)
  about_type      VARCHAR(30) NOT NULL,
                  -- 'combat', 'trade', 'betrayal', 'smuggling',
                  -- 'diplomacy', 'market', 'generosity', 'fear'
  origin_port     VARCHAR(50) NOT NULL,
  current_ports   JSONB NOT NULL DEFAULT '[]',
                  -- hangi limanlara yayılmış
  age             INTEGER NOT NULL DEFAULT 0,
  strength        INTEGER NOT NULL DEFAULT 100,
                  -- 0'a düşünce silinir
  size            VARCHAR(10) NOT NULL DEFAULT 'medium',
                  -- 'small' (3-4 tur), 'medium' (5-6), 'large' (8-10)
  source_player_id UUID,
                  -- söylentiyi yayan (gizli, İzi Sürmek ile bulunabilir)
  is_fake         BOOLEAN DEFAULT FALSE,
  created_turn    INTEGER NOT NULL,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id         UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  event_type_id   VARCHAR(50) NOT NULL,
                  -- events.json'dan event ID
  turn_triggered  INTEGER NOT NULL,
  duration        INTEGER NOT NULL DEFAULT 1,
  turns_remaining INTEGER NOT NULL DEFAULT 1,
  affected_ports  JSONB DEFAULT '[]',
  effects         JSONB DEFAULT '{}',
  player_choices  JSONB DEFAULT '{}',
                  -- { [playerId]: "option_a" }
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id         UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  from_player_id  UUID REFERENCES players(id),
  to_player_id    UUID,
                  -- NULL = açık kanal
  text            TEXT NOT NULL,
  turn            INTEGER NOT NULL,
  channel         VARCHAR(20) NOT NULL DEFAULT 'public',
                  -- 'public', 'private'
  is_npc          BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE quest_progress (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id       UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  chain           VARCHAR(50) NOT NULL,
                  -- 'kayip_hazine', 'babanin_serefi', 'intikam', 'saf_merak'
  current_stage   INTEGER NOT NULL DEFAULT 1,
  branch          VARCHAR(50),
  stage_data      JSONB DEFAULT '{}',
                  -- aşamaya özel veriler (parça sayısı, kanıt sayısı, vb.)
  completed_at    TIMESTAMP,
  UNIQUE(player_id, chain)
);

CREATE TABLE npc_states (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id       UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
                  -- NPC kaydını temsil eden player
  personality     JSONB NOT NULL,
                  -- LLM kişilik kartı: 5-7 madde
  secret_motivation TEXT,
  historical_ref  TEXT,
  speech_style    TEXT,
  debt_to         JSONB DEFAULT '{}',
                  -- { [playerId]: debtCount }
  last_messages   JSONB DEFAULT '[]'
                  -- son 3 mesaj (LLM tutarlılık için)
);

CREATE TABLE trade_history (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id         UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  player_id       UUID NOT NULL REFERENCES players(id),
  turn            INTEGER NOT NULL,
  port_id         VARCHAR(50) NOT NULL,
  good_id         VARCHAR(50) NOT NULL,
  action          VARCHAR(10) NOT NULL,
                  -- 'buy', 'sell'
  quantity        INTEGER NOT NULL,
  price_level     VARCHAR(20),
                  -- 'cok_ucuz', 'ucuz', 'normal', 'pahali', 'cok_pahali'
  gold_amount     INTEGER NOT NULL,
  first_arrival   BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════
-- İNDEXLER
-- ═══════════════════════════════════════════════════════

CREATE INDEX idx_players_game ON players(game_id);
CREATE INDEX idx_rumors_game_active ON rumors(game_id) WHERE strength > 0;
CREATE INDEX idx_orders_game_turn ON orders(game_id, turn);
CREATE INDEX idx_combat_game_turn ON combat_encounters(game_id, turn);
CREATE INDEX idx_city_rel_player ON city_relations(player_id, port_id);
CREATE INDEX idx_events_game_active ON events(game_id) WHERE is_active = TRUE;
CREATE INDEX idx_messages_game_turn ON messages(game_id, turn);
```

---

# BÖLÜM 8: LLM ENTEGRASYON MİMARİSİ

## 8.1 Üç Temel Görev

```
┌─────────────────────────────────────────────────────────────┐
│                    LLM ENTEGRASYON MİMARİSİ                 │
│                                                             │
│  ┌───────────────┐  ┌───────────────┐  ┌─────────────────┐ │
│  │  KAHVEHANE    │  │  ŞEHİR        │  │  EVENT          │ │
│  │  FISILTILARI  │  │  YÖNETİCİSİ  │  │  ANLATICISI     │ │
│  │  ~$0.002/call │  │  ~$0.004/call │  │  ~$0.003/call   │ │
│  │  Her tur      │  │  Opsiyonel    │  │  Nadir          │ │
│  │  Haiku        │  │  Haiku        │  │  Haiku/Sonnet   │ │
│  └───────────────┘  └───────────────┘  └─────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  SINGLEPLAYER EK GÖREVLER                             │ │
│  │  ┌─────────┐  ┌──────────┐  ┌────────────────────┐   │ │
│  │  │ NPC     │  │ 10 TUR   │  │ GÖREV ZİNCİRİ      │   │ │
│  │  │ MESAJ   │  │ ÖZETİ    │  │ DİYALOG             │   │ │
│  │  │~$0.003  │  │~$0.008   │  │~$0.006 (Sonnet)     │   │ │
│  │  │2-3/tur  │  │her 10 tur│  │nadir, kritik kalite │   │ │
│  │  └─────────┘  └──────────┘  └────────────────────┘   │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 8.2 Çağrı Akışı

```
TUR BAŞLANGICI:
  1. Server TÜM oyuncuların kahvehane promptlarını BATCH oluşturur
  2. Redis cache kontrolü: aynı liman + deneyim + event → cache hit?
  3. Cache miss → paralel LLM çağrıları (Promise.all)
  4. Sonuçlar Redis'e yazılır (TTL: 1 tur)
  5. Client kahvehane ekranını açınca cache'ten okur

CACHE KEY FORMAT:
  `whisper:{gameId}:{portId}:{expProfileHash}:{activeEventsHash}`

FALLBACK SİSTEMİ:
  → 5 saniye timeout → statik fısıltı havuzundan çek (whispers.json)
  → Her liman için 20-30 hazır fısıltı template'i
  → Oyuncu farkı çok az hisseder
  → Fallback oranı hedefi: <%5
```

## 8.3 NPC Tutarlılık Sistemi

```
HER LLM ÇAĞRISINDA NPC'YE GÖNDERİLEN BAĞLAM:

  system: "Sen {npc_name}sin. {personality_card}"
  
  context: {
    npcProfile: { name, origin, speechStyle, secretMotivation },
    lastMessages: [ son 3 mesaj alışverişi ],
    rumorHistory: [ oyuncu hakkında son 5 söylenti ],
    gameState: { turn, season, recentEvents },
    playerState: { experienceWords, renown, cityRelation }
  }

  rules: [
    "Kişilik kartındaki konuşma tarzını koru",
    "Son mesajlarla tutarlı ol",
    "Gizli motivasyonunu dolaylı göster, açıkça söyleme",
    "Maksimum 3 cümle"
  ]

TON TUTARLILIĞI:
  → NPC kişilik kartı her prompt'un başına eklenir
  → Son 3 mesaj chat history olarak verilir
  → Söylenti geçmişi son 5 turun özeti olarak prompt'a dahil
```

## 8.4 Maliyet Modeli

```
SINGLEPLAYER (30 turlu oturum):
  Kahvehane:       30 × $0.002 = $0.060
  Şehir yöneticisi: 9 × $0.004 = $0.036
  NPC mesaj:       75 × $0.003 = $0.225
  Event:            8 × $0.003 = $0.024
  10 tur özeti:     3 × $0.008 = $0.024
  Görev diyalog:    5 × $0.006 = $0.030
  ────────────────────────────────
  TOPLAM: ~$0.40 / singleplayer oturum

MULTIPLAYER (30 turlu, 4 oyuncu):
  Kahvehane:      120 × $0.002 = $0.240
  Şehir yöneticisi:36 × $0.004 = $0.144
  Event:            8 × $0.003 = $0.024
  ────────────────────────────────
  TOPLAM: ~$0.41 / multiplayer oturum (NPC yok)

MALİYET OPTİMİZASYONU:
  → Sık tekrarlayan promptları Redis cache (%20-30 hit oranı hedefi)
  → Trivia'ları statik JSON'dan çek (LLM gerekmez)
  → Küçük model kullan (Haiku/mini) — kalite yeterli
  → Batch çağrı (tüm oyuncuların kahvehane promptlarını tek seferde)
  → Rate limit: oyuncu başına max 10 LLM çağrısı/tur
```

---

# BÖLÜM 9: SÖYLENTİ MOTORU TEKNİK TASARIMI

## 9.1 Söylenti Yaşam Döngüsü

```
DOĞUM → YAYILMA → ÇARPITMA → ÇÜRÜME → ÖLÜM (veya ÜN'E DÖNÜŞÜM)

1. DOĞUM: Eylem → Otomatik söylenti üretimi
   Kaynak: savaş, büyük ticaret, kaçakçılık, ihanet, cömertlik
   
   Örnek: Oyuncu savaş kazanıyor →
   {
     text: "{player} Girit açıklarında {enemy}'yi yendi",
     aboutType: "combat",
     size: "medium",
     originPort: "girit",
     strength: 100
   }

2. YAYILMA: Her tur, komşu limanlara yayılma
   Yayılma şansı: Tramontana %80, Kabotaj %50, Fortuna %60
   
3. ÇARPITMA (Şablon Bazlı, LLM DEĞİL):
   Her söylenti tipinin 2 versiyonu:
   
   combat_positive: "{player} kahraman gibi savaştı"
   combat_negative: "{player} acımasız bir saldırgan"
   
   trade_positive: "{player} zengin ve güvenilir bir tüccar"
   trade_negative: "{player} piyasayı manipüle eden bir fırsatçı"
   
   betrayal_positive: (yok — ihanet her zaman olumsuz)
   betrayal_negative: "{player} ortağının parasını çaldı"
   
   → Seven limanda: positive versiyon
   → Sevmeyen limanda: negative versiyon

4. ÇÜRÜME: Her tur strength -= 15
   → Küçük: başlangıç strength 60 (3-4 turda ölür)
   → Orta: başlangıç strength 100 (5-6 turda ölür)
   → Büyük: başlangıç strength 150 (8-10 turda ölür)

5. ÖLÜM VEYA DÖNÜŞÜM:
   → strength ≤ 0: söylenti silinir
   → 3+ aynı tip söylenti birikirse: ÜN'e dönüşür (kalıcı)
```

## 9.2 Söylenti Silahları (Rüzgâr Ek)

```
SÖYLENTI YAYMA UI (Kahvehanede):

  ┌─ RÜZGÂR EK ─────────────────────────────┐
  │                                           │
  │  KİME KARŞI? [oyuncu/NPC seçimi]          │
  │                                           │
  │  NE TÜR?                                  │
  │    ○ Gözdağı ("korkulan savaşçı")         │
  │    ○ Suçlama ("hırsız/dolandırıcı")       │
  │    ○ Karalama ("güvenilmez/yalancı")      │
  │    ○ Övgü ("kahraman/cömert")             │
  │    ○ İfşa ("gizli anlaşma/kaçakçılık")    │
  │    ○ Piyasa fısıltısı ("fiyat yükseldi")  │
  │                                           │
  │  MALİYET: 25 altın                        │
  │                                           │
  │  ⚠ 5 turda 3+ söylenti yayarsan          │
  │  "çok fısıldıyor" söylentisi HAKKINDA     │
  │  DOĞAR                                    │
  └───────────────────────────────────────────┘

SÖYLENTI SAVUNMA (4 aksiyon):
  1. Ateşe Su (Mürekkep): %30-70 başarı, çürütme
  2. İzi Sürmek (Simsar): %20-60 başarı, kaynak bulma
  3. Yoksay: doğal ömrüne bırak
  4. Karşı Söylenti: saldırgana karşı 25 altın
```

## 9.3 Söylenti → Şehir İlişkisi

```
HER TUR SONU, HER LİMAN İÇİN:

  oyuncuHakkindaSoylentiler = aktifSoylentiler
    .filter(r => r.aboutPlayerId === playerId)
    .filter(r => r.currentPorts.includes(portId));
  
  pozitifSayisi = soylentiler.filter(olumlu).length;
  negatifSayisi = soylentiler.filter(olumsuz).length;
  
  netEtki = pozitifSayisi - negatifSayisi;
  
  cityRelation.relationScore += netEtki * 5;
  
  // Eşik kontrolleri:
  if (relationScore >= 30)  → tanidik_yuz
  if (relationScore <= -30) → kem_goz
  else                      → yabanci

İTTİFAK BULAŞMASI (Söylenti Bazlı, OTOMATİK DEĞİL):
  → "Osmanlı dostu" söylentisi yayılınca etkili olur
  → Yayılmazsa etkisi yok
  → Oyuncu aktif söylenti yönetimiyle (Ateşe Su) önleyebilir
```

---

# BÖLÜM 10: EKONOMİ MOTORU

## 10.1 Menşe Mal Sistemi

```
3 KATEGORİ × 5 MENŞE = 15 MAL:

YEMEK:
  1. Sicilya Buğdayı (Palermo)
  2. Provence Şarabı (Marsilya)
  3. Girit Zeytinyağı (Girit)
  4. Kıbrıs Tuzu (Kıbrıs)
  5. Tunus Zeytinyağı (Tunus)

LÜKS:
  6. Murano Camı (Venedik)
  7. Ligurya Mercanı (Cenova)
  8. Doğu İpeği (İstanbul)
  9. Mısır Baharatı (İskenderiye)
  10. Halep Sabunu (Beyrut)
  11. Sahra Altını (Trablus)

SAVAŞ:
  12. Katalan Demiri (Barselona)
  13. Şövalye Zırhı (Malta)
  14. Ganimet Silahı (Cezayir)
  15. Lübnan Sediri (Beyrut) ← Review düzeltmesi: Beyrut ikinci üretimi
```

## 10.2 Açlık/Doyma Algoritması

```typescript
function updateHunger(port: PortState, goodId: string, deliveryCount: number, playerCount: number) {
  const hungerLevels = ['cok_tok', 'tok', 'normal', 'ac', 'cok_ac'];
  let currentIndex = hungerLevels.indexOf(port.hunger[goodId] ?? 'normal');
  
  if (deliveryCount === 0) {
    // Kimse getirmedi → açlık artar
    currentIndex = Math.min(currentIndex + 1, 4);
  } else {
    // Doyma hızı OYUNCU SAYISINA göre ölçeklenir
    let satiation: number;
    if (playerCount <= 2) {
      satiation = deliveryCount === 1 ? 1 : 3;
    } else if (playerCount <= 4) {
      satiation = deliveryCount === 1 ? 1 : deliveryCount === 2 ? 2 : 4; // DİBE
    } else { // 6+
      satiation = deliveryCount === 1 ? 1 : deliveryCount === 2 ? 1 
                : deliveryCount === 3 ? 2 : 4; // DİBE
    }
    currentIndex = Math.max(currentIndex - satiation, 0);
  }
  
  port.hunger[goodId] = hungerLevels[currentIndex];
}
```

## 10.3 Fiyat Hesaplama

```
TEMEL FİYAT TABLOSU (altın/birim):
  Yemek baz fiyat:  20 altın
  Lüks baz fiyat:   40 altın
  Savaş baz fiyat:  30 altın

AÇLIK ÇARPANI:
  cok_ac:   × 2.5  (●●●●●)
  ac:       × 1.8  (●●●●○)
  normal:   × 1.0  (●●●○○)
  tok:      × 0.5  (●●○○○)
  cok_tok:  × 0.2  (●○○○○)

MENŞE İNDİRİMİ:
  Limanın ürettiği mal: × 0.5 (yarı fiyat — ucuz kaynak)
  Limanın arzuladığı mal: × 1.5 (talep primi)

İLK GELEN BONUSU:
  Aynı turda aynı limana aynı mal → hızlı olan daha iyi fiyat
  Bonus = bazFiyat × 0.2 × (1 / kargoMiktari)
  → Az kargo + ilk gelen = küçük bonus (Feluka hız meta kırılır)
  → Çok kargo + ilk gelen = büyük bonus (Karaka hacim ödüllendirilir)

TOPLU ALIM İNDİRİMİ:
  1-3 birim:  Normal fiyat
  4-7 birim:  %10 indirim
  8+ birim:   %20 indirim

SEZON ETKİSİ:
  Yaz: yemek × 0.8 (hasat), lüks × 1.2 (festival talebi)
  Kış: yemek × 1.3 (kıtlık), lüks × 0.9 (talep düşüşü)

KAÇAK MAL:
  Yasak mal fiyatı: normal × 2-3 (Review: 3-5x'ten düşürüldü)
  Yakalanma: Simsar'a bağlı (%40 → %3)
  Yakalanma cezası: 2 tur hapis + 200 altın
```

## 10.4 Commenda Mekaniği

```
ANLAŞMA:
  1. Yatırımcı + tüccar aynı limanda buluşur
  2. Yatırımcı X altın verir, kâr payı serbest anlaşma
  3. Tüccar denize çıkar, mal alır, satar
  4. Dönüşte kâr paylaşılır

İHANET MEKANİĞİ:
  → Tüccar ihanet ederse: otomatik söylenti üretilir
  → Zamana bağlı güçlenme:
    1. ihanet: hafif söylenti (3 tur ömür)
    2. ihanet: güçlü söylenti (6+ tur ömür)
    3. ihanet: kalıcı "Akrep" ünü
  → Akrep ünü commenda teklifini engellemez ama
    çok kötü şartlar sunar (yüksek faiz, düşük kâr payı)
```

---

# BÖLÜM 11: SAVAŞ MOTORU

## 11.1 Savaş Başlatma Koşulları

```
1. Aynı rotada iki oyuncu/NPC karşılaşır
2. En az birinin niyeti Kara Bayrak ise → savaş
3. Pusula vs Kara Bayrak → savaş (Pusula savunmada)
4. Duman vs herhangi → savaş yok (Simsar kontrolü ile kaçınma)
```

## 11.2 Güç Formülü

```typescript
function calculatePower(player: Player, tactic: Tactic, experience: HiddenExperience): number {
  // 1. Gemi temel gücü
  const shipPower = { feluka: 1, karaka: 2, kadirga: 3 }[player.shipType];
  
  // 2. Ün bonusu
  const renownBonus = player.renown.includes('demir_pruva') ? 2 
                    : player.renown.includes('deli_ruzgar') ? 1 : 0;
  
  // 3. Taktik bonusu (taş-kağıt-makas)
  // Pruva > Ateş > Manevra > Pruva
  // Kazanan taktik: +2 bonus
  let tacticBonus = 0;
  // ... (karşı taktik karşılaştırması)
  
  // 4. Gemi sinerjisi
  const synergyBonus = getSynergyBonus(player.shipType, tactic);
  // Feluka + Manevra = +1
  // Karaka + Ateş = +1 (savunma bonusu)
  // Kadırga + Pruva = +1
  
  // 5. Zar (Meltem deneyimine göre)
  const meltemRatio = experience.meltem / totalExperience;
  let diceMin: number, diceMax = 6;
  if (meltemRatio < 0.20)      diceMin = 1; // 1-6
  else if (meltemRatio < 0.40) diceMin = 2; // 2-6
  else                         diceMin = 2; // 2-6 + beraberliklerde kazanır
  // CAP: 3-6 kaldırıldı (snowball önlemi, Review düzeltmesi)
  
  const dice = randomInt(diceMin, diceMax);
  
  return shipPower + renownBonus + tacticBonus + synergyBonus + dice;
}
```

## 11.3 Savaş Sonuçları

```
TAKTİK SONUÇ TABLOSU:
  ┌──────────────────────────┬────────────────────────────────────┐
  │ Kazanan Taktik           │ Sonuç                              │
  ├──────────────────────────┼────────────────────────────────────┤
  │ PRUVA ile kazanırsan     │ Tüm kargo + gemi ele geçir         │
  │                          │ Kendi geminde %50 hasar şansı      │
  ├──────────────────────────┼────────────────────────────────────┤
  │ ATEŞ ile kazanırsan      │ Düşman kargosunun %30'u denize     │
  │                          │ Kalan %70'in yarısını al            │
  │                          │ Kendi gemi hasarsız                 │
  ├──────────────────────────┼────────────────────────────────────┤
  │ MANEVRA ile kazanırsan   │ Kargo transfer yok                  │
  │                          │ İstihbarat: düşman kargo/altın/emir │
  │                          │ Düşman -1 moral (sonraki savaşta)   │
  │                          │ VEYA: 2. tur zorla (sen +3 bonus)   │
  ├──────────────────────────┼────────────────────────────────────┤
  │ KAÇIŞ başarılı           │ Savaş olmaz, her iki taraf devam    │
  │                          │ Kaçan taraf: Meltem +1 deneyim      │
  ├──────────────────────────┼────────────────────────────────────┤
  │ KAÇIŞ başarısız          │ Saldıran +1 bonus ile savaş başlar  │
  └──────────────────────────┴────────────────────────────────────┘

KAÇIŞ HIZ KARŞILAŞTIRMASI:
  Feluka hız: 3, Karaka: 2, Kadırga: 1
  Meltem bonus: meltemRatio > 0.3 → +1 hız
  Kaçış başarı: kaçanHız > saldıranHız → başarılı

GEMİ DURUMU ETKİLERİ:
  Hazır → normal performans
  Yaralı → güç yarıya düşer, 1 tur onarım gerekli
  Batık → yeni gemi satın al (Feluka 100, Karaka 300, Kadırga 500 altın)
  
  Karaka kaybettiğinde: kargonun %50'si kurtarılabilir (Review düzeltmesi)
  
  Tamir maliyeti: gemi fiyatının %25'i
  Gemi değiştirme: yeni fiyat - eski fiyatın %50'si
```

---

# BÖLÜM 12: DENEYİM & ÜN MOTORU

## 12.1 Deneyim Kazanım Tablosu

```
EYLEM                           │ HAVUZ      │ PUAN
────────────────────────────────┼────────────┼──────
Fırtınadan sağ çık              │ Meltem     │ +3
Savaş (kazan veya kaybet)       │ Meltem     │ +2
Kaçış denemesi                  │ Meltem     │ +1
Mal al veya sat                 │ Terazi     │ +1
Farklı limanda ticaret          │ Terazi     │ +1
2+ oyuncuyla aynı turda mesaj   │ Mürekkep   │ +1
Şehir yöneticisiyle görüşme     │ Mürekkep   │ +2
Söylenti yay/çürüt              │ Mürekkep   │ +1
Commenda/konvoy anlaşması       │ Mürekkep   │ +1
Kaçakçılık (başarılı)           │ Simsar     │ +2
Kaçakçılık (yakalandı)          │ Simsar     │ +1
Sahte söylenti yay              │ Simsar     │ +1
Kargo gözetleme                 │ Simsar     │ +1
Avlanma emri ver                │ Simsar     │ +1

ÖNEMLİ: Denize çıkma otomatik Meltem +1 KALDIRILDI
→ Meltem sadece AKTİF deneyimlerle kazanılır (Review düzeltmesi)
```

## 12.2 Oran Hesaplama ve Etkileri

```typescript
function calculateRatio(pool: string, experience: HiddenExperience): number {
  const total = experience.meltem + experience.terazi 
              + experience.murekkep + experience.simsar;
  if (total === 0) return 0.25; // başlangıçta eşit
  return experience[pool] / total;
}

// GENERALİST DEZAVANTAJI (Hard Gate):
// %25 altı havuzlarda belirli fırsatlar TAMAMEN kaçırılır
function checkHardGate(pool: string, ratio: number): boolean {
  return ratio >= 0.25; // false = fırsat kaçırıldı
}
```

## 12.3 Deneyim → Oyuncu Hissi Tablosu

```
KAHVEHANE FISILTILARI (deneyime göre):
  Meltem ağırlıklı → rüzgâr, akıntı, karakol gemileri, fırtına uyarısı
  Terazi ağırlıklı → fiyat hareket, stok, piyasa tahmin
  Mürekkep ağırlıklı → diplomasi, entrika, ittifak, lider söylentileri
  Simsar ağırlıklı → gizli ticaret, korsan konum, gümrük gevşekliği

PAZAR GÖRÜNÜRLüĞÜ (Terazi seviyesine göre):
  %0-15:  Sadece kategori + menşe. Fiyat ●??○○ (belirsiz)
  %16-30: Fiyat noktaları netleşir ●●●○○. Bulunduğu limanda açlık durumu.
  %31-45: Komşu limanlar + hedef limandaki TAHMİNİ değer
  %46-60: Tüm liman açlık haritası (1 tur eski). Sahte söylenti %50 fark et.
  %61+:   Anlık piyasa bilgisi. Sahte söylentilere bağışık. En iyi kontratlar.

SAVAŞ AVANTAJI (Meltem seviyesine göre):
  %0-20:  Normal zar 1-6. %30 fırtına hasarı.
  %21-40: Zar 2-6. %25 fırtına hasarı. Hafif kaçış bonusu.
  %41+:   Zar 2-6 + beraberliklerde kazanır. %15 fırtına hasarı.
          CAP: 3-6 zar KALDIRILDI (snowball önlemi)

DİPLOMASİ (Mürekkep seviyesine göre):
  Düşük:  Şehir yöneticisi soğuk, söylenti yönetimi zayıf
  Orta:   Yönetici sıcak, söylenti çürütme daha kolay
  Yüksek: Yönetici sır paylaşır, ittifak bulaşması yarı hızda
  
GİZLİLİK (Simsar seviyesine göre):
  %0-15:  %40 yakalanma, söylentiler kolay çürütülür
  %16-30: %25 yakalanma, söylentiler daha inandırıcı
  %31-45: %10 yakalanma, aynı limanda kargo kategorileri görünür
  %46+:   %3 yakalanma, söylenti yayıcıları TESPİT ET, son emri gör
```

## 12.4 Ün Kazanma ve Kaybetme

```
KAZANMA (İki koşul gerekli):
  1. Deneyim oranı eşiği (tablo: Bölüm 4 Sprint 5'te)
  2. Yeterli söylenti sayısı
  3. Maximum 3 ün aynı anda

KAYBETME (Review düzeltmesi — net kurallar):
  → Altın Parmak: Son 5 turda 2+ ticaret yoksa uyarı, 8 turda kayıp
  → Demir Pruva: Son 5 turda 1+ savaş yoksa uyarı, 8 turda kayıp
  → İpek Dil: Son 5 turda 2+ diplomatik etkileşim yoksa uyarı, 8 turda kayıp
  → Hayalet Pala: 2+ negatif söylenti birikirse VEYA yakalanırsa kayıp
  → Akrep: KAYBETİLMEZ (kalıcı damga)
  → Mühürlü Söz: 1 ihanet = anında kayıp
  → Açık El: Simsar oranı %30+ olursa kayıp
  → Deli Rüzgâr: 5 tur limanda kalırsa kayıp

ÇELİŞEN EYLEM KURALI:
  → Altın Parmak iken ihanet = anında kayıp riski
  → Demir Pruva iken 5 tur savaşmama = kayıp
```

---

# BÖLÜM 13: TEST STRATEJİSİ

## 13.1 Test Katmanları

```
KATMAN 1 — BİRİM TESTLERİ (packages/engine/):
  → Savaş güç hesaplaması (50+ test case)
  → Açlık/doyma algoritması (oyuncu sayısı × teslimat kombinasyonları)
  → Söylenti yayılma (yol tipi × yayılma şansı)
  → Deneyim oran hesaplaması
  → Ün koşul kontrolü (kazanma + kaybetme)
  → Fiyat hesaplama (açlık × menşe × sezon × bonus)
  → Niyet çözüm matrisi
  → Event tetikleyici koşulları
  Araç: Vitest
  Hedef: >90% coverage (engine paketi)

KATMAN 2 — ENTEGRASYON TESTLERİ:
  → Tam tur çözümleme (Fondaco → Emir → Rüzgâr)
  → 5 turlu mini senaryo (ekonomi dengesi)
  → Savaş + söylenti + deneyim zinciri
  → Quest aşama geçişleri
  → Multiplayer emir senkronizasyonu
  Araç: Vitest + test database

KATMAN 3 — LLM TESTLERİ:
  → Kahvehane fısıltı kalitesi (10 farklı durum × 3 deneyim profili)
  → NPC tutarlılık testi (aynı NPC, 5 ardışık mesaj)
  → Fallback sistemi (timeout → statik fısıltı)
  → Maliyet tracking (her test çağrısının maliyeti)
  Araç: Manuel + otomatik kalite skoru

KATMAN 4 — E2E TESTLERİ:
  → Oyun oluşturma → 1 tur oynama → sonuç kontrolü
  → Multiplayer: 2 oyuncu → emir → çözümleme
  → Disconnect senaryoları
  Araç: Playwright

KATMAN 5 — DENGE TESTLERİ:
  → 100 turlu simülasyon (NPC vs NPC, 4 farklı strateji)
  → Ekonomi dengesi: fiyat stabilitesi, enflasyon kontrolü
  → Savaş dengesi: her taktik seçilme oranı (hedef: %25-40 aralığı)
  → Deneyim dengesi: uzmanlaşma baskısı çalışıyor mu?
  → Zafer dengesi: her oyun tarzı kazanabiliyor mu?
  Araç: Custom simülasyon scripti (packages/engine/)
```

## 13.2 Playtest Planı

```
FAZ 1 SONU (Hafta 11):
  → 5 kişiye demo oynattır
  → Geri bildirim formu: anlaşılırlık, eğlence, süre
  → "Bir tur daha" testi: kaç tur oynadılar?
  
FAZ 2 SONU (Hafta 19):
  → 10 kişiye tam singleplayer oynattır
  → Görev zinciri testi: ipuçları fark ediliyor mu?
  → Trivia testi: "vay be" tepkisi alıyor mu?
  → LLM kalitesi: fısıltılar anlamsız mı?

FAZ 3 SONU (Hafta 24):
  → 4 kişilik 10+ multiplayer oturum
  → Diplomasi testi: ihanet anı dramatik mi?
  → Koalisyon testi: organik oluşuyor mu?
  → Kingmaker testi: zayıf oyuncu önemli mi?
```

---

# BÖLÜM 14: MALİYET & ÖLÇEKLEME

## 14.1 Aylık Maliyet Tablosu

```
100 DAU (Günlük Aktif Oyuncu) SENARYOSu:
  Altyapı:
    → Vercel (frontend): $0 (hobby) veya $20/ay (pro)
    → Railway (backend): $5-20/ay
    → PostgreSQL: $0-15/ay (Railway veya Supabase)
    → Redis: $0-10/ay (Upstash free tier)
    → Domain + DNS: $15/yıl
  
  LLM:
    → 50 SP oturum/gün × $0.40 = $20/gün
    → 20 MP oturum/gün × $0.41 = $8.20/gün
    → Toplam: ~$850/ay
  
  TOPLAM 100 DAU: ~$900/ay

1,000 DAU SENARYOsu:
  → LLM: ~$8,500/ay
  → Altyapı: ~$100/ay
  → TOPLAM: ~$8,600/ay → Freemium model gerekli

10,000 DAU SENARYOsu:
  → LLM: ~$85,000/ay → Açık kaynak model (Llama) veya agresif cache
  → Self-hosted LLM: ~$3,000-5,000/ay (GPU sunucu)
  → TOPLAM: $5,000-10,000/ay (self-hosted ile)
```

## 14.2 Maliyet Düşürme Stratejisi

```
KISA VADE (Faz 1-2):
  → Haiku/mini model kullan
  → Redis cache: aynı prompt → aynı cevap (%20-30 cache hit)
  → Trivia'ları statik JSON'dan çek
  → Rate limit: oyuncu başına 10 LLM çağrı/tur

ORTA VADE (Faz 3):
  → Batch API kullanımı (paralel çağrı indirimi)
  → Statik fısıltı havuzu genişlet (%50 statik, %50 LLM)
  → Prompt token optimizasyonu (gereksiz bağlam azalt)

UZUN VADE (1000+ DAU):
  → Self-hosted Llama 3 / Mistral (GPU sunucu)
  → Fine-tuned model (Mare Nostrum Türkçe stilinde)
  → Freemium: günde 1 ücretsiz oturum, sonraki ücretli
```

---

# BÖLÜM 15: KRİTİK DÜZELTMELERİN ENTEGRASYONU

> Kaynak: `mare_nostrum_mechanics_review.md`

## 15.1 Kritik Düzeltmeler (Alfa Öncesi Zorunlu)

```
✅ ENTEGRE EDİLDİ — Bu plandaki ilgili bölümlere işlenmiş:

1. LÜBNAN SEDİRİ ÜRETİM KAYNAĞI EKSİK
   → Düzeltme: Beyrut ikinci üretim olarak "Lübnan Sediri [Savaş]" eklendi
   → Bölüm 10.1'de yansıtıldı

2. AÇLIK/DOYMA ÖLÇEKLEMESI (6+ oyuncu)
   → Düzeltme: Oyuncu sayısına göre 3 kademeli ölçekleme
   → Bölüm 10.2'de algoritma güncellendi

3. MANEVRA TAKTİĞİ ÖDÜLSüZ
   → Düzeltme: İstihbarat ödülü + moral kırıcı + 2. tur zorlama
   → Bölüm 11.3'te yansıtıldı

4. KABOTAJ 2. TUR OYUNCU DURUMU
   → Düzeltme: Transit modu — Fondaco yok, deniz gözlemi, küçük olay
   → Bölüm 4 Sprint 4'te tanımlandı

5. KAÇAK MAL RİSK/ÖDÜL DENGESİ
   → Düzeltme: 3-5x → 2-3x, yakalanma cezası: 2 tur hapis + 200 altın
   → Bölüm 10.3'te yansıtıldı

6. MELTEM ZAR ALT SINIRI (Snowball Önlemi)
   → Düzeltme: 3-6 kaldırıldı, CAP = 2-6 (+ beraberliklerde kazanma)
   → Bölüm 11.2 ve 12.3'te yansıtıldı

7. DB ŞEMASI EKSİKLİKLERİ
   → city_relations tablosu eklendi
   → combat_tactic orders'tan çıkarılıp combat_encounters'a taşındı
   → Bölüm 7'de tam şema güncellendi

8. SÖYLENTİ YAYMA MALİYETİ
   → 10 altın → 25 altın artırıldı
   → Bölüm 9.2'de yansıtıldı

9. DİSCONNECT HANDLING KURALLARI
   → Tam kurallar belirlendi (AFK → autopilot → çıkarma)
   → Bölüm 6 Sprint 11'de yansıtıldı

10. EVENT SIKLIĞI
    → Küçük event: 1-3 → 3-5 tura yükseltildi
    → Bölüm 5 Sprint 6'da yansıtıldı
```

## 15.2 Önemli Düzeltmeler (Beta Öncesi)

```
1. MELTEM OTOMATİK +1 KALDIRILDI
   → Denize çıkmak otomatik Meltem kazandırmaz
   → Sadece aktif deneyimler: fırtına, savaş, kaçış
   → Bölüm 12.1'de yansıtıldı

2. KARAKA SAVUNMA BONUSU EKLENDİ
   → Ateş taktiğinde +1 ("ağır yük koruması")
   → Kaybettiğinde kargonun %50'si kurtarılabilir
   → Bölüm 11.2 ve 11.3'te yansıtıldı

3. RAGUSA TRANSİT VERGİSİ
   → %10 ekstra ticaret vergisi
   → Bölüm 10.3'te not edildi

4. GEMİ FİYATLARI NETLEŞTİRİLDİ
   → Feluka: 100, Karaka: 300, Kadırga: 500 altın
   → Değiştirme: yeni fiyat - eski fiyatın %50'si
   → Tamir: gemi fiyatının %25'i

5. ÜN KAYBETME KOŞULLARI NETLEŞTİRİLDİ
   → Her ün için net "5 tur uyarı, 8 tur kayıp" kuralı
   → Çelişen eylem kuralları eklendi
   → Bölüm 12.4'te detaylandırıldı

6. KADIRGA YAVAŞLIĞI NETLEŞTİRİLDİ
   → Kabotaj'da 1 ekstra tur (toplam 3 tur)
   → "Savaş makinesi ama lojistik kabus" teması

7. GENERALİST DEZAVANTAJI
   → %25 altı havuzlarda fırsatlar TAMAMEN kaçırılır (hard gate)
   → Bölüm 12.2'de yansıtıldı

8. FONDACO TIMER
   → İlk 5 tur: %50 uzatılmış (7dk → 10.5dk)
   → Bölüm 6 Sprint 10'da yansıtıldı

9. ZAFER FORMÜLÜ DENGESİ
   → Çeşitlilik çarpanı: tek tip söylenti < çeşitli söylentiler
   → Gizlilik bonusu: az söylenti + çok ün = ekstra puan

10. SÖYLENTİ ÇARPITMASI
    → LLM değil, ŞABLON BAZLI (tutarlılık garantisi)
    → Bölüm 9.1'de detaylandırıldı
```

---

# BÖLÜM 16: AÇIK SORULAR & GELECEK YOL HARİTASI

## 16.1 Açık Tasarım Soruları

```
□ HARİTA GÖRSELİ: Oyuncu referans haritaları, grafik dil (pixel art? ilustrasyon?)
□ SES/MÜZİK: Akdeniz ortaçağ atmosferi, liman ambiansları
□ MOBİL UYUMLULUK: PWA yeterli mi? Native app gerekli mi?
□ TURNuVA MODU: Ranked multiplayer? ELO sistemi?
□ SEZON GEÇİŞ HIZI: Kaç turda yaz→kış? (Önerilen: 5 tur)
□ DÖNEM GEÇİŞ HIZI: Kaç turda yüzyıl değişimi? (Önerilen: 15-20 tur)
□ RAGUSA DENGESİ: %10 vergi yeterli mi? Uzun vadede "kimse gitmiyor" mu olur?
□ TRABLUS ERİŞİMİ: İzolasyonu avantaj mı dezavantaj mı?
□ BEYRUT-İSTANBUL UZUN KABOTAJ: 3 tur çok mu?
□ SAF MERAK ZİNCİRİ: 7 sır tam detaylandırılmamış (ek doküman gerekli)
```

## 16.2 Gelecek Geliştirmeler (Post-Beta)

```
□ CUSTOM ART: Her liman için özel ilustrasyon
□ YEREL LLM: Llama/Mistral self-hosted (maliyet düşürme)
□ FINE-TUNED MODEL: Mare Nostrum Türkçe stilinde eğitilmiş model
□ YENİ GÖREV ZİNCİRLERİ: Post-beta DLC
□ YENİ LİMANLAR: Karadeniz, Atlantik genişleme
□ SPECTATOR MODU: Canlı izleyici desteği
□ EVENT EDİTÖRÜ: Oyuncu tarafından yaratılan event'ler
□ MOD DESTEĞİ: Farklı dönem/harita modları
□ NATIVE MOBİL: React Native veya Flutter
□ RANKED SİSTEMİ: ELO + sezonluk turnuvalar
```

## 16.3 Başarı Metrikleri

```
FAZ 1 BAŞARISI:
  → Tek tur 7-12 dakikada oynanıyor mu?
  → LLM kahvehane <3 sn cevap veriyor mu?
  → Savaş tatmin edici mi (taktik seçimi anlamlı mı)?
  → Pazar anlaşılıyor mu (●●●○○ yeterli mi)?

FAZ 2 BAŞARISI:
  → "Bir tur daha" testi: 5 kişiye oynattığında ortalama 15+ tur?
  → Görev ipuçları fark ediliyor mu?
  → ☽ Trivia "vay be" tepkisi alıyor mu?
  → LLM maliyeti: oturum başına < $0.50?

FAZ 3 BAŞARISI:
  → 4 oyunculu oturum pürüzsüz bitiyor mu?
  → İhanet anı dramatik mi (oyuncular tepki veriyor mu)?
  → Koalisyon oluşuyor mu (organik)?
  → Disconnect sorunsuz yönetiliyor mu?
```

---

# ZAFER FORMÜLÜ

```
PUAN = (aktif söylenti sayısı × yayılma genişliği × çeşitlilik çarpanı)
     + (ün sayısı × 10)
     + efsanevi başarım bonusu

ÇEŞİTLİLİK ÇARPANI:
  → Tek tip söylenti (hep ticaret): × 1.0
  → 2 tip söylenti (ticaret + savaş): × 1.3
  → 3+ tip söylenti: × 1.5

EFSANEVİ BAŞARIMLAR:
  → Tüm Akdeniz'i gez: 5 puan
  → Korsan Avcısı: 10 puan
  → Tekelci: 10 puan
  → Büyük İhanet (ve hayatta kalma): 15 puan
  → Hayalet: 15 puan
  → Herkesin Arkadaşı: 20 puan
  → Barış Elçisi: 20 puan
  → Veba Kahramanı: 10 puan (event-bağımlı, daha az puan)
```

---

# EĞlENCE KONTROL LİSTESİ

```
✅ 30 saniyede açıklanabilir mi?        → EVET (3 karar: nereye/nasıl/niyet)
✅ Her tur sürpriz var mı?               → EVET (karşılaşma belirsizliği)
✅ Spreadsheet gerekiyor mu?             → HAYIR (●●●○○, ünler, hisler)
✅ İhanet anı dramatik mi?               → EVET (konvoy tuzağı, Zehir, Kuşatma)
✅ Saldırmadan saldırabilir misin?       → EVET (Zehir, Kuşatma, Duman)
✅ Savaşta karar var mı?                 → EVET (Pruva/Ateş/Manevra + Kaçış)
✅ Ticaret ilginç mi?                    → EVET (menşe, açlık, ilk gelen, bilgi)
✅ Tarih öğretiyor mu?                   → EVET (☽ trivia, merak uyandırıcı)
✅ Singleplayer hikayesi var mı?         → EVET (4 köken, görev zinciri, NPC dram)
✅ Multiplayer sosyal gerilimi var mı?   → EVET (Diplomacy DNA'sı)
✅ Her oyun tarzı viable mı?             → EVET (tüccar, korsan, diplomat, gölge)
✅ Kaybeden bile önemli mi?              → EVET (kingmaker)
✅ "Bir tur daha" hissi var mı?          → TEST EDİLMELİ (Faz 2 sonu)
```

---

*"En iyi plan, ilk temastan sağ çıkan plandır. Bu plan da değişecek — ama değişimin yönünü bilmek, değişimi yönetmektir."*

*"Akdeniz bir ders kitabı değil, bir hikaye. Ve en iyi hikayeler, dinleyenin 'gerçekten mi?!' dediği anlarda doğar."*

*"Her eklenen mekanik bu filtreyi geçmelidir: 'Bu, oyuncunun turda verdiği 3 karardan birini daha ilginç yapıyor mu? Yapmıyorsa, çıkar.'"*
