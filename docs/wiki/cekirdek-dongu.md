# Çekirdek Döngü

> Ana referans: [`mare_nostrum_master_v3.md`](../../mare_nostrum_master_v3.md) — Bölüm 2

---

## Tur Yapısı: İki Faz

Her tur iki ana fazdan oluşur:

```
┌──────────────────────────────────────────┐
│               BİR TUR                    │
│                                          │
│  ┌──────────────┐    ┌────────────────┐  │
│  │   FONDACO    │ →  │    RÜZGÂR     │  │
│  │  (konuş,    │    │  (emirler     │  │
│  │   duy,      │    │   açılır,     │  │
│  │   hazırlan) │    │   çözümleme)  │  │
│  │  5-10 dk    │    │   otomatik    │  │
│  └──────────────┘    └────────────────┘  │
└──────────────────────────────────────────┘
```

---

## Fondaco (Liman Fazı)

Oyuncu limandayken aşağıdaki aksiyonları gerçekleştirebilir (hepsi **opsiyonel**, sabit sıra yok). Bir turda en fazla **3 aksiyona** vakit vardır.

### Kahvehane

Her tur 3 fısıltı görünür. Fısıltılar oyuncunun [deneyim profiline](deneyim-sistemi.md) göre farklılaşır — aynı kahvehanede iki oyuncu farklı şeyler duyar.

4 aksiyon mevcut:

| Aksiyon | Maliyet | Açıklama |
|---------|---------|----------|
| **Kahve Falı** | Ücretsiz | Pasif bilgi toplama |
| **Rüzgâr Ek** | 25 altın | Söylenti yay |
| **Ateşe Su** | Ücretsiz | Hakkındaki söylentiyi çürüt |
| **İzi Sürmek** | Ücretsiz | Söylentinin kaynağını araştır |

Her 3-4 turda biri ☽ tarihsel trivia içerebilir (singleplayer'da). Detaylı bilgi → [Dedikodu & Söylenti](dedikodu-soylenti.md)

### Pazar

- Menşe mal al/sat
- Fiyatlar **beş nokta** göstergesiyle (●●●○○) gösterilir — rakam yok
- [Terazi](deneyim-sistemi.md) deneyimi yükseldikçe fiyat ipuçları artar
- Detaylı bilgi → [Ekonomi Sistemi](ekonomi.md)

### Müzakere

- **Multiplayer:** Açık kanal (herkes görür) + özel kanal
- **Singleplayer:** LLM NPC mesajları, teklifler, tehditler

### Tersane

- Gemi tamiri (Yaralı → Denize Hazır)
- Gemi değiştirme (fiyat farkı ödeyerek)
- Detaylı bilgi → [Gemi Sistemi](gemi-sistemi.md)

### Fondaco Sınırlamaları

- İlk 5 tur: Fondaco süresi %50 uzatılmış (yeni oyuncular için öğrenme)
- Her aksiyon zaman maliyetli — tur başına **en fazla 3 aksiyona** vakit var
- Bu kısıt analiz felcini engeller: Kahvehane mi? Pazar mı?

---

## Emir: Üç Seçim

Fondaco'nun sonunda oyuncu üç seçim yapar:

```
NEREYE?   [haritadan liman seç]
NASIL?    Tramontana / Kabotaj / Fortuna
NİYET?    Kervan / Kara Bayrak / Pusula / Duman
```

**4 niyet × 3 rota = 12 stratejik kombinasyon.**

### Niyetlerin Karşılaştırması

> **Uygulama durumu:** Deneyim katkıları `mockup/packages/engine/src/experience.ts` dosyasındaki `applyExperienceGain` fonksiyonunda tanımlıdır.

| Niyet | Özellik | Deneyim Katkısı | Miktar |
|-------|---------|-----------------|--------|
| **Kervan** | Limanda al/sat, yolda muhatap ol | Terazi | +2 |
| **Kara Bayrak** | Yolda rastladığına saldır | Meltem | +2 |
| **Pusula** | Bilgi topla, kimseyle muhatap olma | Mürekkep | +1 |
| **Duman** | Görünmez kal, gözlemle, karışma | Simsar | +2 |

### Rota Kombinasyonları

| Kombinasyon | Strateji |
|-------------|----------|
| Tramontana + Kervan | Standart tüccar yolculuğu |
| Tramontana + Kara Bayrak | Korsan — herkes görür |
| Kabotaj + Duman | Hayalet geçiş — neredeyse görünmez |
| Fortuna + Kara Bayrak | Açık deniz korsanı — büyük av, büyük risk |
| Fortuna + Duman | Hızlı ve gizli geçiş — en zor, en güçlü |

---

## Rüzgâr (Deniz Fazı): Otomatik Çözümleme

> **Uygulama durumu:** Tur çözümlemesi `mockup/packages/engine/src/turn-resolver.ts` dosyasında uygulanmıştır. Çok turlu transit (kabotaj), port doyma çürümesi ve mevsim geçişi dahildir.

Emirler verildikten sonra Rüzgâr fazı **deterministik** biçimde çözümlenir:

```
1. Transit kontrol (çok turlu rota devam ediyor mu?)
2. Emir doğrulama (rota geçerli mi?)
3. Çok turlu rota başlatma (kabotaj/uzun_kabotaj)
4. Savaş varsa → taktik çözümleme (Pruva / Ateş / Manevra + d6 zar)
5. Hareket (hedefe taşınma)
6. Deneyim güncelleme (niyet bazlı, sessiz)
7. Ticaret çözümü (Kervan niyetinde → otomatik satış + port doyma)
8. Söylenti üretimi ve rota boyunca yayılma
9. Ün kontrolü (oran eşikleri + söylenti sayısı)
10. Ün çürüme kontrolü (pasiflik + çelişki)
11. Mevsim geçişi (her 4 turda yaz ↔ kış)
12. Port doyma çürümesi (her 3 turda -1)
```

> Oyun motoru ve söylenti motoru deterministiktir — LLM'e bağlı değildir. LLM sadece metin üretir, mekanik etkilemez.

---

## Karşılaşma Mantığı

Denizde başka bir oyuncu/NPC ile karşılaşıldığında her iki tarafın **niyeti** sonucu belirler:

| Taraf A \ Taraf B | Kervan | Kara Bayrak | Pusula | Duman |
|---|---|---|---|---|
| **Kervan** | Ticaret teklifi | Saldırı riski | Geçiş | Geçiş |
| **Kara Bayrak** | Saldırı | Savaş | Saldırı | Saldırı |
| **Pusula** | Gözlem | Kaçma/gözlem | Karşılıklı gözlem | Gözlem |
| **Duman** | Sessiz geçiş | Borç yaratma* | Gözlem | Sessiz geçiş |

*Duman ile Kara Bayrak'ı geçip saldırmamak → [borç yaratma mekanizması](catisma-spektrumu.md#duman-saldırmamanın-gücü)

---

## Temel Karar İkilemi

Her tur oyuncu kaçınılmaz bir ikilemle yüz yüze gelir:

```
Kahvehane mi?    → Bilgi ama zaman kaybı
Pazar mı?        → Para ama bilgi kaybı
Her ikisi?       → 3. aksiyona vakit kalmaz
```

```
Tramontana mı?   → Güvenli ama sıradan
Fortuna mı?      → Hızlı ve ilk gelen avantajı, ama risk
Kabotaj mı?      → Güvenli ama 2 tur (1 tur "kayıp")
```

---

## Bağlantılı Sayfalar

- [Terimler & Sözlük](terimler-sozluk.md) — Fondaco, Rüzgâr, niyet terimleri
- [Ekonomi Sistemi](ekonomi.md) — Pazar ve ticaret mekaniği
- [Dedikodu & Söylenti](dedikodu-soylenti.md) — Kahvehane aksiyonları
- [Çatışma Spektrumu](catisma-spektrumu.md) — Karşılaşma kararları
- [Savaş Taktiği](savas-taktig.md) — Rüzgâr fazında savaş çözümleme
- [Görünmez Deneyim Sistemi](deneyim-sistemi.md) — Deneyim birikimi
