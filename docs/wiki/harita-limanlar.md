# Harita & Limanlar

> Ana referans: [`mare_nostrum_master_v3.md`](../../mare_nostrum_master_v3.md) — Bölüm 9  
> Detaylı çalışma belgesi: [`mare_nostrum_map_design.md`](../../mare_nostrum_map_design.md)

---

## Harita Tasarım İlkeleri

1. **Herkes karşılaşmalı ama her zaman değil** — Her tur en az 1 karşılaşma olasılığı %60–70
2. **Darboğazlar drama üretir** — "Karşılaşma garantili" noktalar
3. **Her bölgenin kişiliği olmalı** — Oyuncu "ben Doğu tüccarıyım" diyebilmeli

---

## Harita Genel Yapısı

```
    Marsilya ─── Cenova ─── Venedik
      │            │           │
   Barselona    Palermo     Ragusa
      │          │    \       │
      └── Tunus ─┘     Girit ── İstanbul
           │              │        │
        Cezayir      Kıbrıs ── Beyrut
           │              │
        Trablus     İskenderiye

  [Darboğaz: Sicilya Boğazı — Palermo ↔ Tunus]
  [Darboğaz: Ege Kapısı    — Girit ↔ İstanbul]
  [Darboğaz: Otranto       — Venedik ↔ Ragusa]
```

**Toplam:** 15 liman, 29 rota, 3 darboğaz, 4 bölge

---

## Dört Bölge

| Bölge | İsim | Karakter |
|-------|------|---------|
| Batı | **Frenk Denizi** | Güvenli, rekabetli |
| Orta | **Ara Deniz** | Kavşak, kaotik |
| Doğu | **Şark Denizi** | Zengin, tehlikeli |
| Güney | **Berber Kıyısı** | Kanunsuz, gölgeler |

---

## Darboğazlar

| Darboğaz | Bağlantı | Karşılaşma Oranı | Kontrolör |
|----------|----------|-----------------|-----------|
| **Sicilya Boğazı** | Palermo ↔ Tunus | %75 | Dönemsel |
| **Ege Kapısı** | Girit ↔ İstanbul | %70 | Osmanlı |
| **Otranto** | Venedik ↔ Ragusa | %65 | Venedik |

Her darboğazın alternatif rotası vardır — ama ya daha riskli ya daha yavaş.

---

## Liman Detayları

### Batı Akdeniz — "Frenk Denizi"

#### Barselona — *Aragon'un Pençesi*
| Özellik | Değer |
|---------|-------|
| Güç | Aragon / İspanya |
| Üretir (ucuz) | Katalan Demiri [Savaş] |
| Arzular (pahalı) | Doğu İpeği [Lüks] |
| Özel | Savaş gemisi (Kadırga) ucuz; Batı'nın askeri üssü |
| Bağlantılar | Marsilya (Tramontana), Tunus (Fortuna) |

#### Marsilya — *Provence'ın Kapısı*
| Özellik | Değer |
|---------|-------|
| Güç | Fransa |
| Üretir (ucuz) | Provence Şarabı [Yemek] |
| Arzular (pahalı) | Mısır Baharatı [Lüks] |
| Özel | Lüks malın en pahalı satıldığı liman |
| Bağlantılar | Barselona (Kabotaj), Cenova (Tramontana) |

#### Cenova — *La Superba (Görkemli)*
| Özellik | Değer |
|---------|-------|
| Güç | Cenova Cumhuriyeti |
| Üretir (ucuz) | Ligurya Mercanı [Lüks] |
| Arzular (pahalı) | Sicilya Buğdayı [Yemek] |
| Özel | Bankacılık merkezi — kredi kolay, faiz yüksek; Venedik'in ebedi rakibi |
| Bağlantılar | Marsilya (Tramontana), Venedik (Kabotaj), Palermo (Fortuna) |

---

### Orta Akdeniz — "Ara Deniz"

#### Venedik — *La Serenissima (En Dingin)*
| Özellik | Değer |
|---------|-------|
| Güç | Venedik Cumhuriyeti |
| Üretir (ucuz) | Murano Camı [Lüks] |
| Arzular (pahalı) | Lübnan Sediri [Savaş] |
| Özel | Gemi tamiri en ucuz (Arsenal); cam sadece buradan çıkar; Fondaco dei Turchi |
| Bağlantılar | Cenova (Kabotaj), Ragusa (Tramontana), İstanbul (Fortuna) |

#### Palermo — *Üç Dinin Kavşağı*
| Özellik | Değer |
|---------|-------|
| Güç | Norman → Hohenstaufen → Aragon |
| Üretir (ucuz) | Sicilya Buğdayı [Yemek] |
| Arzular (pahalı) | Murano Camı [Lüks] |
| Özel | Sicilya Boğazı darboğazının bir ucu; kış mevsiminde tahıl çok ucuz |
| Bağlantılar | Cenova (Fortuna), Tunus (**DARBOĞAZ**), Ragusa (Kabotaj), Girit (Fortuna) |

#### Ragusa (Dubrovnik) — *Küçük Ama Kurnaz*
| Özellik | Değer |
|---------|-------|
| Güç | Ragusa Cumhuriyeti (bağımsız) |
| Üretir | *(hiçbir şey — transit liman)* |
| Arzular | Her şey normal fiyat |
| Özel | **NÖTR LİMAN** — hiçbir oyuncuyu Kem Göz yapmaz; kahvehanede her zaman 1 ekstra fısıltı; diplomatik sığınak; transit vergisi %10 |
| Bağlantılar | Venedik (Tramontana), Palermo (Kabotaj), İstanbul (Fortuna), Girit (Tramontana) |

#### Malta — *Şövalyeler Adası*
| Özellik | Değer |
|---------|-------|
| Güç | Hospitalier Şövalyeleri |
| Üretir (ucuz) | Şövalye Zırhı [Savaş] |
| Arzular (pahalı) | Sicilya Buğdayı [Yemek] |
| Özel | Kadırga ve tamir ucuz; Müslümanlara Kem Göz; Malta ↔ Cezayir Fortuna rotası — Şövalye vs Korsan gerilimi |

---

### Doğu Akdeniz — "Şark Denizi"

#### İstanbul — *Dünyanın Eşiği*
| Özellik | Değer |
|---------|-------|
| Güç | Bizans (→ 1453) / Osmanlı (1453+) |
| Üretir (ucuz) | Doğu İpeği [Lüks] |
| Arzular (pahalı) | Katalan Demiri [Savaş] |
| Özel | Oyunun en büyük pazarı; Boğaz kontrolü; 1453'te güç dengesi değişir |
| Bağlantılar | Venedik (Fortuna), Ragusa (Fortuna), Girit (**DARBOĞAZ**), Beyrut (Kabotaj) |

#### Girit — *Ortadaki Ada*
| Özellik | Değer |
|---------|-------|
| Güç | Venedik (→ 1669) / Osmanlı (1669+) |
| Üretir (ucuz) | Girit Zeytinyağı [Yemek] |
| Arzular (pahalı) | Doğu İpeği [Lüks] |
| Özel | Ege Kapısı darboğazının bir ucu; her yöne 1-2 tur mesafe — mükemmel üs; korsanlar için ideal pusu noktası |
| Bağlantılar | İstanbul (**DARBOĞAZ**), Palermo (Fortuna), Ragusa (Tramontana), Kıbrıs (Tramontana) |

#### Kıbrıs — *Haçlı Mirası*
| Özellik | Değer |
|---------|-------|
| Güç | Lusignan → Venedik → Osmanlı (1571+) |
| Üretir (ucuz) | Kıbrıs Tuzu [Yemek] |
| Arzular (pahalı) | Mısır Baharatı [Lüks] |
| Özel | Doğu limanlarına yakın — transit merkezi |
| Bağlantılar | Girit (Tramontana), Beyrut (Kabotaj), İskenderiye (Tramontana) |

#### Beyrut — *Levant'ın Vitrini*
| Özellik | Değer |
|---------|-------|
| Güç | Haçlı → Memlük → Osmanlı |
| Üretir (ucuz) | Halep Sabunu [Lüks], Lübnan Sediri [Savaş] |
| Arzular (pahalı) | Katalan Demiri [Savaş] |
| Özel | Kara İpek Yolu'nun denize çıkışı; İskenderiye'ye alternatif Doğu rotası |
| Bağlantılar | İstanbul (Uzun Kabotaj, 3 tur), Kıbrıs (Kabotaj), İskenderiye (Kabotaj) |

#### İskenderiye — *Baharat Tahtı*
| Özellik | Değer |
|---------|-------|
| Güç | Fatımi → Eyyubi → Memlük → Osmanlı |
| Üretir (ucuz) | Mısır Baharatı [Lüks] — tüm çeşitler |
| Arzular (pahalı) | Lübnan Sediri [Savaş] |
| Özel | Oyunun EN KÂRLI lüks kaynağı — ama herkes biliyor; Portekiz Hint yolu (15. yy): baharat fiyatı yavaşça düşer |
| Bağlantılar | Girit (Fortuna), Kıbrıs (Tramontana), Beyrut (Kabotaj), Trablus (Fortuna) |

---

### Güney Akdeniz — "Berber Kıyısı"

#### Trablus — *Çöl Kapısı*
| Özellik | Değer |
|---------|-------|
| Güç | Haçlı → Osmanlı |
| Üretir (ucuz) | Sahra Altını [Lüks] |
| Arzular (pahalı) | Provence Şarabı [Yemek] |
| Bağlantılar | Cezayir (Kabotaj), İskenderiye (Fortuna), Tunus (Tramontana) |

#### Tunus — *Eski Kartaca'nın Üstüne*
| Özellik | Değer |
|---------|-------|
| Güç | Hafsiler → Osmanlı |
| Üretir (ucuz) | Tunus Zeytinyağı [Yemek] |
| Arzular (pahalı) | Ligurya Mercanı [Lüks] |
| Bağlantılar | Palermo (**DARBOĞAZ**), Cezayir (Kabotaj), Trablus (Tramontana) |

#### Cezayir — *Barbaros'un Evi*
| Özellik | Değer |
|---------|-------|
| Güç | Osmanlı |
| Üretir (ucuz) | Ganimet Silahı [Savaş] |
| Arzular (pahalı) | Provence Şarabı [Yemek] |
| Özel | **KORSAN LİMANI** — Kara Bayrak cezasız; ganimet pazarı; Hristiyanlara Kem Göz |
| Bağlantılar | Tunus (Kabotaj), Trablus (Kabotaj), Barselona (Fortuna), Malta (Fortuna) |

---

## Başlangıç Koşulları

Her oyuncu oyuna şununla başlar:
- 1 **Feluka**
- **200 altın**
- Sıfır ün
- Ev limanında **Tanıdık Yüz**

---

## Bağlantılı Sayfalar

- [Ekonomi Sistemi](ekonomi.md) — Her limanın ticaret profili
- [Çekirdek Döngü](cekirdek-dongu.md) — Rota ve niyet kombinasyonları
- [Gemi Sistemi](gemi-sistemi.md) — Hangi gemi hangi rotada etkili
- [Event Sistemi](event-sistemi.md) — Liman el değiştirmesi, tarihsel dönemler
