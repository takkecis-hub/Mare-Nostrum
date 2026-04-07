# Savaş Taktiği

> Ana referans: [`mare_nostrum_master_v3.md`](../../mare_nostrum_master_v3.md) — Bölüm 5  
> Detaylı çalışma belgesi: [`mare_nostrum_combat_narrative.md`](../../mare_nostrum_combat_narrative.md)

---

## Tasarım Hedefi

Eski savaş sistemi: Gemi gücü + Ün bonusu + Zar. 3 saniyede çözülür, savaş sırasında **hiç karar yoktu**.

Yeni sistem: Savaş başlamadan önce her iki taraf **gizlice** tek bir taktik seçer. Taş-kağıt-makas dinamiği — ama tematik.

---

## Üç Taktik

```
⚔️ PRUVA (Bordalama)
   Gemini düşmana çevir, yan yana gel, atla.
   Gemiyi BÜTÜN olarak ele geçirirsin.
   Ama kendi gemin de hasar alır.

🔥 ATEŞ (Uzak Savaş)
   Mesafe koru, ok ve ateş at.
   Güvenli ama ganimet azalır.

💨 MANEVRA (Kaçınma ve Konum)
   Rüzgârı kullan, pozisyon al, düşmanı yorar.
   Zaman kazan — kaç ya da tuzağa çek.
```

---

## Taş-Kağıt-Makas

```
PRUVA  > ATEŞ     (bordalamacı mesafeyi kapatırsa okçunun işi biter)
ATEŞ   > MANEVRA  (manevra yapan yavaşlar, ateşçi vurur)
MANEVRA > PRUVA   (bordalamacı düz gelir, manevraci arkasına geçer)

AYNI TAKTİK: Bonus yok, düz güç karşılaştırması
```

**Kazanan taktik: +2 bonus**

---

## Güç Formülü

```
GÜÇ = Gemi değeri + Ün bonusu + Taktik bonusu + Zar

Gemi:    Feluka 1 | Karaka 2 | Kadırga 3
Ün:      Demir Pruva +1 | Deli Rüzgâr +1 | "korkak" söylentisi -1
Taktik:  Karşı taktiği yenersen +2, diğer durumlarda 0
Zar:     1–6 (Meltem oranına göre alt sınır değişir, max 2–6)
```

Büyük güç kazanır. Eşitlikte: taktik değiştirme hakkıyla 2. tur.

---

## Gemi-Taktik Sinerjileri

| Gemi | Özel Sinerji |
|------|-------------|
| **Feluka** | Manevra'da gizli +1 ekstra (toplam +3 vs Pruva) |
| **Karaka** | Ateş'te savunma +1 ("Ağır Yük" — kargo kalkan gibi); kaybettiğinde kargonun %50'si kurtarılabilir |
| **Kadırga** | Pruva'da gizli +1 ekstra (toplam +3 vs Ateş) |

---

## Taktik Tahmini: Bilgi Oyunu

Rakibinin ne seçeceğini **tahmin etmeye** çalışırsın:

```
İpuçları:
  → Feluka kullanıyorsa: muhtemelen Manevra
  → Kadırga kullanıyorsa: muhtemelen Pruva
  → Karaka kullanıyorsa: muhtemelen Ateş
  → AMA: akıllı oyuncu bunu bilir ve TAM TERSİNİ yapar
  → Demir Pruva ünlüyse: Pruva beklenir → sen Manevra seç
  → AMA: Demir Pruva ünlü oyuncu bunu bilir ve Ateş seçer
```

Bu, Diplomacy'nin blöf ruhunu savaşa taşır.

---

## Savunan Tarafın Seçenekleri

Saldırıya uğrayan oyuncunun 2 ana seçeneği:

### 1. Savaşı Kabul Et

Pruva / Ateş / Manevra arasından seç. Aynı kurallar geçerli.

### 2. Kaçış Denemesi

Savaşa girmeden kaçmaya çalış.

| Durum | Sonuç |
|-------|-------|
| Feluka vs Kadırga (hızlı gemi kaçıyor) | Başarı şansı yüksek |
| Aynı gemi tipi | Meltem deneyimiyle bonus |
| Başarılı kaçış | Savaş olmaz |
| Başarısız kaçış | Saldıran +1 bonus ile savaş başlar |

---

## Savaş Sonucu: Taktiğe Göre Ganimet

| Kazanma Taktiği | Ganimet |
|-----------------|---------|
| **Pruva** | Düşman gemisini ELE GEÇİREBİLİRSİN (tüm kargo + gemiyi satma opsiyonu); ama kendi gemin hasar alabilir (%50 şans) |
| **Ateş** | Düşman kargosunun %30'u denize döküldü; kalan %70'in yarısını alırsın; kendi gemin hasarsız |
| **Manevra** | Gemi ele geçirilmez; ama düşmanın kargosunu, altınını ve bir sonraki emrini görürsün (Simsar +2); düşmana -1 moral penaltısı |

### Manevra Zaferi Özel Ödülleri

- **İstihbarat:** Düşmanın kargosunu, altınını ve bir sonraki emrini görürsün
- **Taktik avantaj:** 2. savaş turuna girersen +3 bonus (normal +2 yerine)
- **Moral kırıcı:** Düşman bir sonraki turda savaşa girerse -1 moral

---

## Gemi Hasar Sistemi

| Durum | Etki | İyileştirme |
|-------|------|-------------|
| **Denize Hazır** | Normal performans | — |
| **Yaralı** | Tüm performans yarı | 1 tur tersane tamiri (gemi fiyatının %25'i) |
| **Denizin Dibi** | Gemi yok | Yeni gemi satın al |

---

## Kadırga'nın Yavaşlığı

Kadırga Kabotaj rotasında **1 ekstra tur** ekler (toplam 3 tur). Tramontana'da normal.

Bu, Kadırga'nın "savaş makinesi ama lojistik kabus" temasını güçlendirir.

---

## Savaş Kararının İkilemi

```
SALDIRMAK:
  ✓ Kargo çalarsın
  ✓ Rakibi zayıflatırsın
  ✗ Sen de hasar alabilirsin
  ✗ "Saldırgan" söylentisi yayılır
  ✗ Hedef intikam planlar

SALDIRMAMAK (Duman):
  ✓ Risk yok
  ✓ Hedef sana borçlu hisseder
  ✓ Bilgi toplarsın
  ✗ Kargo çalamazsın
  ✗ Rakip güçlenmeye devam eder
```

**Hiçbir seçenek net olarak doğru değil.** → [Çatışma Spektrumu](catisma-spektrumu.md)

---

## Bağlantılı Sayfalar

- [Gemi Sistemi](gemi-sistemi.md) — Feluka / Karaka / Kadırga detayları
- [Görünmez Deneyim Sistemi](deneyim-sistemi.md) — Meltem'in savaş etkisi
- [Çatışma Spektrumu](catisma-spektrumu.md) — Demir vs Zehir vs Kuşatma
- [Ün Sistemi](un-sistemi.md) — Demir Pruva ünü
