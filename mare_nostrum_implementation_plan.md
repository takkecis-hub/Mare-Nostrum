# MARE NOSTRUM — İmplementasyon Planı
## Tasarımdan Ürüne Yol Haritası

> ✅ AKTİF DOKÜMAN — Master referans: `mare_nostrum_master_v3.md`

---

# BÖLÜM 1: STRATEJİK KARARLAR

## 1.1 Temel Soru: Bu Oyunu Kim Yapıyor?

Üç senaryo var, her biri farklı plan gerektirir:

```
SENARYO A — Solo Geliştirici (veya 1-2 kişi):
  → 6-12 ay, sıkı MVP, tek platform (web)
  → LLM maliyeti dikkatli yönetilmeli
  → Grafik minimal, mekanik odaklı
  → İlk hedef: oynanabilir singleplayer demo

SENARYO B — Küçük Ekip (3-5 kişi):
  → 4-8 ay, daha hızlı, web + mobil
  → Dedicated backend developer + frontend + game designer
  → LLM entegrasyonu daha sofistike
  → İlk hedef: multiplayer alpha

SENARYO C — Stüdyo / Funded Proje:
  → 3-6 ay agresif timeline
  → Tam ekip: backend, frontend, UI/UX, LLM engineer, QA
  → Custom art, ses, müzik
  → İlk hedef: closed beta
```

**Plan bu dokümanda Senaryo A odaklı yazılmıştır** (en kısıtlı durum). Daha büyük ekip varsa fazlar sıkıştırılabilir veya paralel çalıştırılabilir.

## 1.2 Teknoloji Stack Kararları

```
┌─ ÖNERİLEN STACK ──────────────────────────────────────┐
│                                                        │
│  CLIENT:                                               │
│    Framework:  React (veya Next.js)                    │
│    Neden:      Komponent bazlı, hızlı prototipleme,    │
│                web + mobil (PWA) tek codebase           │
│    Harita:     Canvas/SVG veya Pixi.js                 │
│    State:      Zustand veya Redux                      │
│    Realtime:   Socket.io (multiplayer için)             │
│                                                        │
│  SERVER:                                               │
│    Runtime:    Node.js (veya Python FastAPI)            │
│    Neden:      LLM API çağrıları async, JS/Python      │
│                her ikisi de uygun                       │
│    Database:   PostgreSQL (oyun durumu)                 │
│                Redis (oturum, gerçek zamanlı durum)     │
│    Realtime:   Socket.io server                        │
│                                                        │
│  LLM:                                                  │
│    API:        Anthropic Claude API (veya OpenAI)       │
│    Kullanım:   Kahvehane, şehir yöneticisi, NPC,       │
│                event anlatıcısı                         │
│    Maliyet:    ~$0.01-0.05 / LLM çağrısı               │
│    Cache:      Sık kullanılan promptlar cache'lenir     │
│                                                        │
│  DEPLOYMENT:                                           │
│    Hosting:    Vercel (frontend) + Railway/Fly.io       │
│                (backend) veya tek VPS                   │
│    DB:         Supabase (PostgreSQL hosted)             │
│                                                        │
│  ALTERNATİF STACK (daha basit):                        │
│    Tek parça:  Next.js full-stack + Supabase            │
│    Neden:      Daha az infra yönetimi, hızlı başlangıç │
│    Dezavantaj: Ölçeklenme zorluğu (sonra refactor)     │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## 1.3 Alternatif: Oyun Motoru Kullanmak?

```
Unity / Godot / Unreal → HAYIR (şu aşamada)

NEDEN:
  → Mare Nostrum metin ağırlıklı, tur bazlı, harita + UI odaklı
  → AAA grafik gerekmiyor
  → LLM entegrasyonu web stack'te çok daha kolay
  → Multiplayer WebSocket'le çözülebilir
  → Mobil erişim PWA ile sağlanır

NE ZAMAN DÜŞÜNÜLÜR:
  → Oyun başarılıysa ve dedicated mobil app istenirse
  → 3D harita istenirse
  → Performans sorunları çıkarsa (çok oyunculu büyük oturumlar)
```

---

# BÖLÜM 2: GELİŞTİRME FAZLARI

## Genel Bakış

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
│  Toplam: ~20-26 hafta (5-6 ay)                        │
│                                                       │
└───────────────────────────────────────────────────────┘
```

---

## FAZ 0: TEMEL (Hafta 1-3)

**Hedef:** Tek bir satır kod yazmadan önce, kağıt üzerinde tam bir tur oyna + teknik altyapıyı kur.

### 0.1 Kağıt Prototip (Hafta 1)

```
NE YAPILIR:
  → GDD'deki kurallarla gerçek bir "kağıt oyun" oyna
  → 1 kişi oyuncu, 1 kişi "LLM" (yani kahvehane fısıltılarını,
    NPC'leri, şehir yöneticisini sen oyna)
  → 5 tur oyna, not al:
    - Tur ne kadar sürdü?
    - Hangi kararlar ilginçti, hangileri sıkıcıydı?
    - Ekonomi çalışıyor mu? (menşe mal, açlık/doyma)
    - Savaş tatmin edici mi? (Pruva/Ateş/Manevra)
    - Söylenti sistemi anlaşılıyor mu?

ÇIKTI:
  → Mekanik düzeltme listesi (GDD güncelleme)
  → Denge sorunları listesi
  → "Bu çalışıyor / bu çalışmıyor" raporu
```

### 0.2 Teknik Altyapı (Hafta 2-3)

```
NE YAPILIR:
  → Repo oluştur, proje yapısı kur
  → Temel veri modelleri tanımla (TypeScript/Python)
  → LLM API bağlantısı test et (basit prompt → cevap)
  → Veritabanı şeması oluştur
  → Basit bir "hello world" client + server çalıştır

VERİ MODELLERİ:
  
  Player {
    id, name, gold, ship_type, ship_status,
    cargo: [{item, quantity, origin}],
    current_port, renown: [string],
    rumors_about: [{text, spread, age}]
  }
  
  Port {
    id, name, region, produces, desires,
    hunger: {item: level},
    controller, relation_to: {player: level}
  }
  
  Route {
    id, from_port, to_port, type (tramontana/kabotaj/fortuna),
    is_chokepoint, encounter_chance
  }
  
  GameState {
    turn, season, era, active_events,
    players: [Player], ports: [Port],
    rumors: [{text, origin_port, current_ports, age, about}],
    hidden_experience: {player: {meltem, terazi, murekkep, simsar}}
  }

LLM TEST:
  → Kahvehane prompt'u gönder, 3 fısıltı al
  → Şehir yöneticisi prompt'u gönder, 1 diyalog al
  → Gecikme ve maliyet ölç
  → Token optimizasyonu: minimum prompt ile maximum kalite
```

**Faz 0 Çıktısı:** Çalışan dev environment + kağıt prototip notları + LLM performans baseline.

---

## FAZ 1: ÇEKİRDEK DEMO (Hafta 4-11)

**Hedef:** Tek turlu, singleplayer, oynanabilir demo. Bir oyuncu, 1 tur: Fondaco → Emir → Rüzgâr. LLM kahvehane çalışıyor, NPC'ler mesaj atıyor, savaş çözülüyor.

### Sprint 1: Harita + Liman (Hafta 4-5)

```
GÖREVLER:
  □ Harita render (Canvas/SVG — 15 liman, 28 rota, 3 darboğaz)
  □ Liman tıklama → liman detay ekranı
  □ Oyuncu konumu haritada gösterme
  □ Rota tipleri görsel ayrım (Tramontana/Kabotaj/Fortuna)
  □ Darboğaz vurgulama

KABUL KRİTERİ:
  → Harita ekranda görünüyor
  → 15 liman tıklanabilir, isim ve alt başlık görünüyor
  → Rotalar çizgi olarak görünüyor, tip ayrımı var
```

### Sprint 2: Fondaco — Kahvehane + Pazar (Hafta 5-6)

```
GÖREVLER:
  □ Kahvehane ekranı: 3 fısıltı gösterimi
  □ LLM entegrasyonu: kahvehane prompt → 3 fısıltı
  □ Kahve Falı aksiyonu (ekstra bilgi)
  □ Pazar ekranı: menşe mal listesi, ●●●○○ fiyat göstergesi
  □ Al/sat mekaniği (kargo yönetimi)
  □ Altın gösterimi

KABUL KRİTERİ:
  → Kahvehaneye girince LLM 3 fısıltı üretiyor (<3sn)
  → Pazar ekranında mal alınıp satılabiliyor
  → Altın güncelleniyor
```

### Sprint 3: Fondaco — Müzakere + Emir (Hafta 6-7)

```
GÖREVLER:
  □ NPC mesaj paneli (singleplayer): LLM NPC mesajları
  □ 4 NPC oluşturma (LLM ile oyun başı)
  □ NPC mesaj gösterimi ve cevaplama
  □ Emir ekranı: Nereye + Nasıl + Niyet seçimi
  □ Emir kilitleme mekanığı

KABUL KRİTERİ:
  → En az 1 NPC mesaj atıyor (LLM)
  → Emir verilebiliyor (3 seçim)
  → Emir kilitlenince Rüzgâr fazına geçiş
```

### Sprint 4: Rüzgâr — Çözümleme Motoru (Hafta 7-9)

```
GÖREVLER:
  □ Hareket çözümleme (oyuncu + NPC'ler eş zamanlı hareket)
  □ Fırtına kontrolü (mevsim + zar)
  □ Karşılaşma kontrolü (aynı rotada kim var?)
  □ Niyet çözümü (Kervan vs Kara Bayrak vs Pusula vs Duman)
  □ Savaş sistemi (taktik seçimi + güç hesabı + zar)
  □ Savaş sonuç ekranı
  □ Ticaret çözümü (açlık/doyma + ilk gelen bonusu)
  □ Ticaret sonuç ekranı (●●●●● + ★★★ geri bildirim)

KABUL KRİTERİ:
  → Emir verildiğinde çözümleme çalışıyor
  → Karşılaşma oluyorsa savaş ekranı çıkıyor
  → Taktik seçimi yapılıyor (Pruva/Ateş/Manevra)
  → Limana varıldığında ticaret çözülüyor
  → Sonuç ekranı gösteriliyor
```

### Sprint 5: Söylenti + Deneyim (Hafta 9-11)

```
GÖREVLER:
  □ Söylenti üretimi (eylem → otomatik söylenti)
  □ Söylenti yayılma (tur sonunda komşu limanlara)
  □ Söylenti UI: liman girişinde "hakkında bilinenler"
  □ Rüzgâr Ek (söylenti yayma aksiyonu)
  □ Gizli deneyim havuzları (Meltem/Terazi/Mürekkep/Simsar)
  □ Deneyim birikimi (eylem → havuz +)
  □ Oran hesaplama
  □ Kahvehane fısıltılarını deneyime göre filtreleme
  □ Ün sistemi (koşul kontrolü + kazanım bildirimi)
  □ Oyuncu profil ekranı (ünler + söylentiler)

KABUL KRİTERİ:
  → Savaş yapınca söylenti üretiliyor
  → Söylenti sonraki turda komşu limanlarda görünüyor
  → Deneyim birikimi çalışıyor (debug ekranında kontrol)
  → Yeterli deneyim + söylenti → ün kazanılıyor
  → Kahvehane fısıltıları deneyime göre farklılaşıyor
```

**Faz 1 Çıktısı:** 3-5 tur oynanabilir singleplayer demo. Tek oyuncu + 4 NPC. Fondaco → Emir → Rüzgâr döngüsü çalışıyor. LLM kahvehane ve NPC'ler aktif.

### Faz 1 Milestone Demo Akışı

```
1. Oyun başlar → Harita görünür, oyuncu Venedik'te
2. Fondaco:
   - Kahvehane: LLM 3 fısıltı üretir
   - Pazar: Murano Camı ucuz, Lüks yükle
   - NPC Fatma mesaj atar: "İskenderiye'de baharat pahalı, birlikte gidelim mi?"
3. Emir: İskenderiye, Tramontana, Kervan
4. Rüzgâr:
   - Hareket çözülür
   - Girit açıklarında NPC Yorgos ile karşılaşma (Kara Bayrak!)
   - Savaş: Pruva/Ateş/Manevra seçimi → çözüm
   - Savaştan kurtulursan İskenderiye'ye varış
   - Ticaret: Murano Camı sat → ●●●●○ fiyat → ★★★ tur!
5. Söylenti: "Girit'te savaş oldu" yayılır
6. Deneyim: Meltem +2, Terazi +1
7. Yeni tur başlar → Fondaco (İskenderiye)
```

---

## FAZ 2: TAM SINGLEPLAYER OYUN (Hafta 12-19)

**Hedef:** 20-40 turlu tam singleplayer deneyim. Görev zincirleri, event'ler, dönemler, trivia, anlatı.

### Sprint 6: Event Sistemi (Hafta 12-13)

```
GÖREVLER:
  □ Event motoru (tetikleyici türleri: zamansal, koşullu, rastgele, zincir)
  □ Event veri yapısı ve 20-30 temel event tanımı
  □ Event duyuru ekranı (LLM dramatik duyuru + ☽ trivia)
  □ Event mekanik etkileri (liman kapanma, fiyat şoku, savaş ilanı)
  □ Mega event özel UI (Kara Veba yayılma haritası vb.)
  □ Mevsim sistemi (yaz/kış etkisi)

KABUL KRİTERİ:
  → Belirli turda tarihsel event tetikleniyor
  → Rastgele event'ler çalışıyor (fırtına, piyasa şoku)
  → Event LLM duyurusu + trivia gösteriliyor
  → Event mekanik etkisi uygulanıyor (fiyat değişimi vb.)
```

### Sprint 7: Görev Zincirleri (Hafta 14-16)

```
GÖREVLER:
  □ Köken seçim ekranı (4 köken + "rastgele")
  □ Görev motoru (aşama takibi, tetikleyiciler, dallanma)
  □ ⚓ görev ipucu gösterimi (kahvehanede)
  □ Görev özel NPC'leri (Yakup, Hamid, Nuri Usta vb.)
  □ Görev özel LLM diyalogları
  □ Görev dallanma seçenekleri UI
  □ 4 görev zincirinin tam implementasyonu
  □ Görev takip ekranı

KABUL KRİTERİ:
  → Oyun başında köken seçilebiliyor
  → Görev ipuçları kahvehanede görünüyor
  → Görev NPC'leriyle LLM diyalog çalışıyor
  → Görev dallanıyor (oyuncu seçimine göre)
  → En az 1 görev zinciri baştan sona oynanabiliyor
```

### Sprint 8: Anlatı + Trivia (Hafta 17-18)

```
GÖREVLER:
  □ 10 tur özeti (LLM "Kaptanın Günlüğü")
  □ Dönem geçiş anlatıları
  □ ☽ Trivia sistemi (liman bazlı trivia havuzları)
  □ Trivia gösterim UI (☽ sembol + [!] kutusu)
  □ NPC trivia paylaşımı (NPC diyaloglarında)
  □ Şehir yöneticisi LLM diyalogu (Mürekkep deneyimine göre)

KABUL KRİTERİ:
  → Her 10 turda LLM özet yazıyor
  → Kahvehanede trivia görünüyor (her 3-4 turda)
  → Event duyurularında trivia var
  → Şehir yöneticisiyle LLM diyalog çalışıyor
```

### Sprint 9: Denge + Cilalama (Hafta 18-19)

```
GÖREVLER:
  □ Menşe mal fiyat dengesi (20 tur simülasyon)
  □ Açlık/doyma hız ayarı
  □ Savaş zar aralıkları dengesi
  □ NPC zorluk dengesi (çok kolay/çok zor?)
  □ LLM prompt optimizasyonu (token azaltma, kalite koruma)
  □ LLM cache sistemi (tekrarlayan promptlar)
  □ Performans optimizasyonu (yükleme süreleri)
  □ UI/UX cilalama (animasyonlar, geçişler)

KABUL KRİTERİ:
  → 20 turlu oyun pürüzsüz oynanıyor
  → LLM çağrıları <3sn
  → Ekonomi dengeli (her oyun tarzı viable)
  → Savaş tatmin edici
```

**Faz 2 Çıktısı:** Tam singleplayer oyun. 20-40 tur, 4 köken hikayesi, event'ler, trivia, NPC'ler, anlatı. "Bir tur daha" testi yapılabilir.

---

## FAZ 3: MULTIPLAYER + LANSMAN (Hafta 20-26)

**Hedef:** 2-8 oyunculu multiplayer, beta test, lansman hazırlığı.

### Sprint 10: Multiplayer Altyapı (Hafta 20-22)

```
GÖREVLER:
  □ WebSocket sunucu (Socket.io)
  □ Oda oluşturma / katılma sistemi
  □ Eş zamanlı emir sistemi (tüm oyuncular kilitleyince çözüm)
  □ Fondaco zamanlayıcısı (7 dk countdown)
  □ Açık kanal chat
  □ Özel kanal chat (ikili mesajlaşma)
  □ Oyuncu listesi ve durum gösterimi
  □ Oyuncular arası commenda mekaniği
  □ Konvoy emir koordinasyonu
  □ Multiplayer savaş (oyuncu vs oyuncu taktik seçimi)
  □ Lobby sistemi (oyun ayarları: tur sayısı, dönem, oyuncu sayısı)

KABUL KRİTERİ:
  → 2 oyuncu aynı oyuna girebiliyor
  → Chat çalışıyor (açık + özel)
  → Emir sistemi eş zamanlı çalışıyor
  → Savaş oyuncu vs oyuncu çözülüyor
```

### Sprint 11: Multiplayer Denge + Test (Hafta 23-24)

```
GÖREVLER:
  □ 4 oyunculu playtest (en az 10 oturum)
  □ Zamanlayıcı dengesi (Fondaco süresi yeterli mi?)
  □ Ekonomi dengesi (multiplayer'da fiyatlar çalışıyor mu?)
  □ Söylenti yayılma hızı (multiplayer'da)
  □ NPC sayısı ayarı (oyuncu sayısına göre)
  □ Kingmaker dinamiği testi
  □ Koalisyon dinamiği testi
  □ Cheating önlemleri (emir gizliliği)
  □ Disconnect handling (oyuncu düşerse ne olur?)

KABUL KRİTERİ:
  → 4 oyunculu 20 turlu oyun pürüzsüz bitiyor
  → Hiçbir oyuncu "sıkıldım" demiyor (hedef)
  → Ekonomi ve savaş dengeli
  → Disconnect sorunsuz yönetiliyor
```

### Sprint 12: Lansman Hazırlığı (Hafta 25-26)

```
GÖREVLER:
  □ Landing page
  □ Hesap sistemi (basit: email + şifre veya OAuth)
  □ Oyun geçmişi kaydı (istatistikler)
  □ Davet sistemi (arkadaşını çağır)
  □ Tutorial / onboarding (ilk 3 tur rehberli)
  □ Bug fix sprint
  □ Performans testi (kaç eş zamanlı oyun?)
  □ LLM maliyet projeksiyonu (kullanıcı başına)

KABUL KRİTERİ:
  → Yeni oyuncu 5 dakikada oyuna başlayabiliyor
  → Oyun stabil (crash yok, data loss yok)
  → LLM maliyeti kullanıcı başına < $0.50/oturum
```

## Disconnect Handling Kuralları

```
OYUNCUNUN BAĞLANTISI KOPARSA:
  → Fondaco fazında:
    - 2 dakika bekleme süresi (otomatik reconnect)
    - 2 dk sonra: oyuncu "AFK" olarak işaretlenir
    - AFK oyuncunun emri: "aynı limanda kal + Duman niyeti" (pasif)
    - 3 tur AFK → NPC autopilot devralır (basit ticaret mantığıyla)
    - 5 tur AFK → oyuncu otomatik çıkarılır, NPC kalır

  → Rüzgâr fazında:
    - Emir kilitlenmişse: normal çözümleme devam eder
    - Emir kilitlenmemişse: varsayılan emir uygulanır (aynı liman + Duman)
    - Savaşta disconnect: savunan Manevra seçmiş kabul edilir

  → Reconnect:
    - Oyuncu geri geldiğinde: son durum özetini görür
    - NPC autopilot'un yaptıklarını iptal edemez
```

## Metagaming ve Adil Oyun Politikası

```
EMİR GİZLİLİĞİ:
  → Emirler SUNUCU TARAFINDA şifrelenir, çözümleme anına kadar
    hiçbir client'a gönderilmez
  → Browser devtools ile emir gözetlenemez
  → API rate limiting: saniyede max 10 istek (bot koruması)

CHAT SINIRLARI:
  → Fondaco fazı dışında chat kapalı (Rüzgâr fazında mesaj yok)
  → Özel mesajlar loglanır (şikayet durumunda inceleme için)
  → Emoji/GIF yerine şablon mesajlar opsiyonu (hızlı iletişim)

3. PARTI İLETİŞİM:
  → Discord/Zoom kullanımı engellenemez ama emir gizliliği
    korunduğu sürece avantaj sınırlı
  → Bilgi asimetrisi mekanikleri (farklı kahvehane fısıltıları)
    3. parti iletişimi bile tam avantaja çevirmez
```

---

# BÖLÜM 3: LLM MALİYET MODELİ

## 3.1 Çağrı Başına Maliyet Tahmini

```
KAHVEHANE FISILTISI:
  Input: ~300 token (prompt: liman durumu, deneyim profili, event'ler)
  Output: ~100 token (3 kısa cümle)
  Maliyet: ~$0.002 / çağrı (Claude Haiku veya GPT-4o-mini)
  Sıklık: her tur, her oyuncu → 1 çağrı/tur/oyuncu

ŞEHİR YÖNETİCİSİ DİYALOG:
  Input: ~500 token (prompt: şehir durumu, oyuncu söylentileri, deneyim)
  Output: ~150 token (kısa diyalog)
  Maliyet: ~$0.004 / çağrı
  Sıklık: oyuncuların %30'u her turda → 0.3 çağrı/tur/oyuncu

NPC MESAJI (singleplayer):
  Input: ~400 token (NPC profili, oyuncu durumu, motivasyon)
  Output: ~80 token (kısa mesaj)
  Maliyet: ~$0.003 / çağrı
  Sıklık: 2-3 NPC mesajı/tur → 2.5 çağrı/tur

EVENT DUYURUSU:
  Input: ~300 token (event detayı, oyuncu durumu)
  Output: ~120 token (dramatik duyuru + trivia)
  Maliyet: ~$0.003 / çağrı
  Sıklık: her 3-5 turda → 0.25 çağrı/tur

10 TUR ÖZETİ:
  Input: ~800 token (son 10 tur özeti, NPC ilişkileri)
  Output: ~300 token (Kaptanın Günlüğü)
  Maliyet: ~$0.008 / çağrı
  Sıklık: her 10 turda → 0.1 çağrı/tur
```

## 3.2 Oturum Başına Toplam

```
SINGLEPLAYER (30 turlu oturum):
  Kahvehane: 30 × $0.002 = $0.06
  Şehir yöneticisi: 9 × $0.004 = $0.036
  NPC mesaj: 75 × $0.003 = $0.225
  Event: 8 × $0.003 = $0.024
  10 tur özeti: 3 × $0.008 = $0.024
  ────────────────────
  TOPLAM: ~$0.37 / singleplayer oturum

MULTIPLAYER (30 turlu, 4 oyuncu):
  Kahvehane: 120 × $0.002 = $0.24
  Şehir yöneticisi: 36 × $0.004 = $0.144
  Event: 8 × $0.003 = $0.024
  ────────────────────
  TOPLAM: ~$0.41 / multiplayer oturum (NPC yok)

MALİYET OPTİMİZASYONU:
  → Sık tekrarlayan promptları cache'le (aynı liman + aynı profil)
  → Trivia'ları statik JSON'dan çek (LLM gerekmez)
  → Küçük model kullan (Haiku/mini) — kalite yeterli
  → Batch çağrı (tüm oyuncuların kahvehane promptlarını tek seferde)
```

## 3.3 LLM Tutarlılık ve Performans

```
TUTARLILIK (Review 11.1):
  → NPC kişilik kartları: her NPC için sabit 5-7 maddelik kişilik
    tanımı, her prompt'a otomatik eklenir
  → Söylenti geçmişi: son 5 turun söylenti özeti prompt'a dahil
  → Önbellek anahtarı: liman + deneyim profili + tur = aynı
    fısıltıyı ikinci kez üretmez

GECIKME (Review 11.2):
  → Fondaco fazı başlarken TÜM kahvehane promptları paralel gönderilir
  → Oyuncu kahvehaneye girene kadar cevap hazır olur
  → Timeout: 5 saniye sonra fallback (JSON'dan statik fısıltı)
  → Streaming yanıt: uzun NPC diyaloglarında token'lar canlı gösterilir

MALİYET ÖLÇEKLEME (Review 11.3):
  → 100 günlük aktif oyuncu (DAU) senaryosu:
    - Günde ~50 singleplayer oturum × $0.37 = $18.50/gün
    - Günde ~20 multiplayer oturum × $0.41 = $8.20/gün
    - Toplam: ~$800/ay (yönetilebilir)
  → 10.000 DAU senaryosunda: ~$80.000/ay → freemium model gerekli
  → Maliyet düşürme stratejisi: Claude Haiku + agresif cache + batch
```

---

# BÖLÜM 4: VERİTABANI ŞEMASI

```sql
-- Ana tablolar

CREATE TABLE games (
  id UUID PRIMARY KEY,
  status VARCHAR(20), -- 'lobby', 'active', 'finished'
  turn INTEGER DEFAULT 0,
  season VARCHAR(10), -- 'summer', 'winter'
  era VARCHAR(20), -- '11th_century', '12th_century'...
  settings JSONB, -- max_turns, player_count, start_era
  created_at TIMESTAMP
);

CREATE TABLE players (
  id UUID PRIMARY KEY,
  game_id UUID REFERENCES games,
  user_id UUID,
  name VARCHAR(100),
  gold INTEGER DEFAULT 200,
  ship_type VARCHAR(20) DEFAULT 'feluka',
  ship_status VARCHAR(20) DEFAULT 'ready',
  current_port_id VARCHAR(50),
  home_port_id VARCHAR(50),
  cargo JSONB DEFAULT '[]',
  renown JSONB DEFAULT '[]', -- ["altin_parmak", "ipek_dil"]
  origin_story VARCHAR(50), -- singleplayer quest chain
  quest_stage INTEGER DEFAULT 0
);

CREATE TABLE hidden_experience (
  player_id UUID REFERENCES players,
  meltem INTEGER DEFAULT 0,
  terazi INTEGER DEFAULT 0,
  murekkep INTEGER DEFAULT 0,
  simsar INTEGER DEFAULT 0
);

CREATE TABLE ports (
  id VARCHAR(50) PRIMARY KEY,
  game_id UUID REFERENCES games,
  name VARCHAR(100),
  region VARCHAR(50),
  controller VARCHAR(100),
  produces VARCHAR(50), -- menşe mal
  desires VARCHAR(50),
  hunger JSONB -- {item: level} her menşe mal için açlık
);

CREATE TABLE routes (
  id VARCHAR(50) PRIMARY KEY,
  from_port VARCHAR(50),
  to_port VARCHAR(50),
  route_type VARCHAR(20), -- tramontana, kabotaj, fortuna
  is_chokepoint BOOLEAN DEFAULT FALSE
);

CREATE TABLE orders (
  id UUID PRIMARY KEY,
  game_id UUID REFERENCES games,
  player_id UUID REFERENCES players,
  turn INTEGER,
  destination_port VARCHAR(50),
  route_type VARCHAR(20),
  intent VARCHAR(20), -- kervan, kara_bayrak, pusula, duman
  -- combat_tactic artık combat_encounters tablosunda (savaş SIRASINDA seçilir)
  locked BOOLEAN DEFAULT FALSE
);

-- Savaş taktiği orders tablosundan ayrıldı — savaş SIRASINDA seçilir, emir SIRASINda değil
CREATE TABLE combat_encounters (
  id UUID PRIMARY KEY,
  game_id UUID REFERENCES games,
  turn INTEGER,
  attacker_id UUID REFERENCES players,
  defender_id UUID REFERENCES players,
  attacker_tactic VARCHAR(20), -- pruva, ates, manevra
  defender_tactic VARCHAR(20), -- pruva, ates, manevra, kacis
  attacker_power INTEGER,
  defender_power INTEGER,
  result VARCHAR(20), -- 'attacker_wins', 'defender_wins', 'draw', 'escape'
  loot JSONB, -- el değiştiren kargo
  route_id VARCHAR(50) REFERENCES routes,
  created_at TIMESTAMP
);

CREATE TABLE city_relations (
  id UUID PRIMARY KEY,
  game_id UUID REFERENCES games,
  player_id UUID REFERENCES players,
  port_id VARCHAR(50) REFERENCES ports,
  relation_level VARCHAR(20) DEFAULT 'yabanci', -- 'tanidik_yuz', 'yabanci', 'kem_goz'
  relation_score INTEGER DEFAULT 0, -- -100 to +100 arası detaylı skor
  last_visit_turn INTEGER,
  active_rumors_about INTEGER DEFAULT 0 -- bu limandaki aktif söylenti sayısı
);

CREATE TABLE rumors (
  id UUID PRIMARY KEY,
  game_id UUID REFERENCES games,
  text TEXT,
  about_player UUID, -- NULL ise genel söylenti
  about_type VARCHAR(30), -- combat, trade, betrayal, market...
  origin_port VARCHAR(50),
  current_ports JSONB, -- hangi limanlara yayılmış
  age INTEGER DEFAULT 0, -- kaç tur oldu
  strength INTEGER DEFAULT 100 -- zayıflama
);

CREATE TABLE events (
  id UUID PRIMARY KEY,
  game_id UUID REFERENCES games,
  turn_triggered INTEGER,
  event_type VARCHAR(50),
  affected_ports JSONB,
  duration INTEGER,
  effects JSONB
);

CREATE TABLE messages (
  id UUID PRIMARY KEY,
  game_id UUID REFERENCES games,
  from_player UUID,
  to_player UUID, -- NULL ise açık kanal
  text TEXT,
  turn INTEGER,
  channel VARCHAR(20) -- 'public', 'private'
);

CREATE TABLE quest_progress (
  player_id UUID REFERENCES players,
  chain VARCHAR(50), -- 'treasure', 'honor', 'revenge', 'curiosity'
  current_stage INTEGER,
  branch VARCHAR(50), -- hangi dalda
  data JSONB -- aşamaya özel veriler
);
```

---

# BÖLÜM 5: KRİTİK TEKNİK KARARLAR

## 5.1 Eş Zamanlı Emir Sistemi

```
MULTIPLAYER'DA EMİR AKIŞI:

  1. Fondaco başlar → zamanlayıcı (7 dk)
  2. Her oyuncu emrini girer (client tarafında)
  3. "Kilitle" butonuna basar → server'a gönderilir
  4. Server, tüm oyuncuların kilitlemesini bekler
     VEYA zamanlayıcı dolarsa → kilitlemeyenler "bekleme" emri alır
  5. Tüm emirler toplandığında → server çözümleme yapar
  6. Sonuçlar tüm oyunculara broadcast edilir

  TEKNİK:
  → WebSocket ile real-time durum paylaşımı
  → "Kimin kilitlediği" tüm oyunculara gösterilir (baskı elementi)
  → Emir içeriği GÖSTERILMEZ — sadece "kilitledi" bilgisi
  → Çözümleme tamamen server-side (hile önlemi)
```

## 5.2 LLM Çağrı Mimarisi

```
LLM ÇAĞRI AKIŞI:

  1. Tur başlar
  2. Server, tüm oyuncuların kahvehane promptlarını BATCH oluşturur
  3. Paralel LLM çağrıları (Promise.all / asyncio.gather)
  4. Sonuçlar cache'e yazılır
  5. Client kahvehane ekranını açınca cache'ten okur

  CACHE STRATEJİSİ:
  → Aynı liman + aynı deneyim profili + aynı event → aynı fısıltılar
  → Cache key: `{port_id}:{experience_profile_hash}:{active_events_hash}`
  → TTL: 1 tur (tur değişince cache temizlenir)

  FALLBACK:
  → LLM çağrısı başarısız olursa → statik fısıltı havuzundan çek
  → Her liman için 20-30 hazır fısıltı template'i
  → Oyuncu farkı çok az hisseder
```

## 5.3 Söylenti Yayılma Algoritması

```python
def spread_rumors(game_state):
    for rumor in game_state.active_rumors:
        rumor.age += 1
        rumor.strength -= 15  # her tur %15 zayıfla
        
        if rumor.strength <= 0:
            game_state.remove_rumor(rumor)
            continue
        
        for port in rumor.current_ports:
            for route in port.connected_routes:
                neighbor = route.other_port(port)
                if neighbor not in rumor.current_ports:
                    # yayılma şansı: rota tipine göre
                    chance = {
                        'tramontana': 0.8,
                        'kabotaj': 0.5,
                        'fortuna': 0.6
                    }[route.type]
                    
                    if random() < chance:
                        # çarpıtma: limanın oyuncuya bakışına göre
                        distorted = distort_rumor(
                            rumor, neighbor, game_state
                        )
                        distorted.current_ports.append(neighbor)
```

---

# BÖLÜM 6: RİSK YÖNETİMİ

```
RİSK 1: LLM Tutarsızlığı
  Olasılık: YÜKSEK
  Etki: ORTA (singleplayer deneyimini bozar)
  Çözüm: Template + LLM hibrit sistem.
    %70 sabit mekanik bilgi, %30 LLM renklendirme.
    Fallback statik havuz her zaman hazır.

RİSK 2: LLM Maliyeti Kontrolden Çıkması
  Olasılık: ORTA
  Etki: YÜKSEK (finansal)
  Çözüm: Agresif cache, küçük model, token limiti.
    Rate limiting: oyuncu başına max 10 LLM çağrısı/tur.
    Maliyet dashboard: gerçek zamanlı izleme.

RİSK 3: Multiplayer Senkronizasyon Sorunları
  Olasılık: ORTA
  Etki: YÜKSEK (oyun kırılır)
  Çözüm: Server-authoritative mimari.
    Tüm game state server'da, client sadece görüntüler.
    Optimistic UI + server doğrulama.

RİSK 4: Ekonomi Dengesizliği
  Olasılık: YÜKSEK (ilk denemede kesin)
  Etki: ORTA (oyun sıkıcılaşır)
  Çözüm: Erken ve sık playtest.
    Kağıt prototip (Faz 0), dijital prototip (Faz 1 sonu),
    tam oyun testi (Faz 2 sonu).
    Hot-fix yapılabilir parametre sistemi (config dosyası).

RİSK 5: "Bir Tur Daha" Hissi Oluşmaması
  Olasılık: ORTA
  Etki: ÇOK YÜKSEK (oyunun ölümü)
  Çözüm: Her tur sonunda "cliffhanger" elementi.
    → Söylenti: "ne olacak?" merakı
    → NPC mesajı: "sana bir teklifim var" (sonraki tur)
    → Event haberi: "yaklaşan fırtına" (beklenti)
    → Görev ipucu: "antikacı seni bekliyor" (merak)
```

---

# BÖLÜM 7: PROJE TAKVİMİ ÖZET

```
HAFTA  HEDEF                         ÇIKTI
─────────────────────────────────────────────────────
1      Kağıt prototip                 Mekanik test raporu
2-3    Teknik altyapı                 Dev environment, DB, LLM bağlantı
4-5    Harita + Liman UI              Görsel harita, tıklanabilir limanlar
5-6    Kahvehane + Pazar              LLM fısıltılar, al/sat mekaniği
6-7    NPC + Emir sistemi             NPC mesajlar, 3 seçimli emir
7-9    Rüzgâr çözümleme              Hareket, savaş, ticaret motoru
9-11   Söylenti + Deneyim + Ün       Tam singleplayer döngü ✓
       ─── FAZ 1 TAMAMLANDI: TEK TURLU DEMO ───
12-13  Event sistemi                  Tarihsel + rastgele eventler
14-16  Görev zincirleri               4 köken hikayesi oynanabilir
17-18  Anlatı + Trivia                Kaptanın Günlüğü, ☽ trivia
18-19  Denge + Cilalama               20 turlu pürüzsüz oyun
       ─── FAZ 2 TAMAMLANDI: TAM SİNGLEPLAYER ───
20-22  Multiplayer altyapı            2-8 oyunculu oturumlar
23-24  MP denge + test                Playtested multiplayer
25-26  Lansman hazırlığı              Tutorial, landing page, beta
       ─── FAZ 3 TAMAMLANDI: BETA LANSMAN ───
```

---

# BÖLÜM 8: BAŞARI METRİKLERİ

```
FAZ 1 BAŞARISI:
  → Tek tur 7-12 dakikada oynanıyor mu?
  → LLM kahvehane <3 sn cevap veriyor mu?
  → Savaş tatmin edici mi (taktik seçimi anlamlı mı)?
  → Pazar anlaşılıyor mu (●●●○○ yeterli mi)?

FAZ 2 BAŞARISI:
  → "Bir tur daha" testi: 5 kişiye oynattığında ortalama kaç tur oynuyor?
    Hedef: 15+ tur (oyuncu kendi bırakana kadar)
  → Görev zinciri testi: oyuncu görev ipuçlarını fark ediyor mu?
  → Trivia testi: oyuncu "vay be" diyor mu?
  → LLM maliyeti: oturum başına < $0.50?

FAZ 3 BAŞARISI:
  → 4 oyunculu oturum pürüzsüz bitiyor mu?
  → İhanet anı dramatik mi (oyuncular tepki veriyor mu)?
  → Koalisyon oluşuyor mu (organik)?
  → Disconnect sorunsuz yönetiliyor mu?
```

---

*"En iyi plan, ilk temastan sağ çıkan plandır. Bu plan da değişecek — ama değişimin yönünü bilmek, değişimi yönetmektir."*
