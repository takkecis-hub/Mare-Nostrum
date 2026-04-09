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

> **Uygulama durumu:** Aşağıdaki formül `mockup/packages/engine/src/combat.ts` dosyasındaki `calculatePower` fonksiyonunu yansıtır.

```
GÜÇ = Temel Güç + Meltem Bonusu + Taktik Bonusu + Zar (d6)

Temel Güç:  Gemi gücü + Gemi dayanıklılığı ÷ 50
  Feluka: 2 + dur/50 | Karaka: 2 + dur/50 | Kadırga: 3 + dur/50

Meltem Bonusu: (Meltem > Terazi ise)
  min(1.0, MeltemOranı × 2) — aksi halde 0

Taktik Bonusu:
  Kadırga + Pruva → +1
  Feluka + Manevra → +1
  Diğer kombinasyonlar → 0

Zar: d6 (1–6), injectable RNG ile deterministik test edilir
```

**Counter sistemi:** Pruva > Ateş > Manevra > Pruva. Karşı taktiği yenersen otomatik kazanırsın (güç fark etmeksizin).

**Kaçış (Kacis):** Oyuncunun gücü ≥ düşman gücü ise kaçış başarılı.

---

## Gemi-Taktik Sinerjileri

> **Uygulama durumu:** Sinerji bonusları `mockup/packages/engine/src/combat.ts` dosyasındaki `calculatePower` fonksiyonunda tanımlıdır.

| Gemi | Özel Sinerji |
|------|-------------|
| **Feluka** | Manevra'da +1 taktik bonusu |
| **Karaka** | Taktik bonusu yok (kargo avantajı) |
| **Kadırga** | Pruva'da +1 taktik bonusu |

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

> **Uygulama durumu:** Kazanma → +20 altın + düşman gücü×2 altın loot. Kaybetme → -30 altın - güç farkı×3 altın, dayanıklılık kaybı -15 - güç farkı×2. Dayanıklılık 0'a düşerse **gemi batması**: Feluka ile respawn + 50 altın, tüm kargo kaybolur.

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

> **Uygulama durumu:** Hasar sistemi `combat.ts`'deki sabitlerle çalışır: COMBAT_LOSS_DURABILITY=15 (temel), güç farkı×2 ekstra. Dayanıklılık 0'a düşerse gemi batması tetiklenir (SHIPWRECK_RESPAWN_GOLD=50 altın + Feluka ile respawn).

| Durum | Etki | İyileştirme |
|-------|------|-------------|
| **Sağlam (100)** | Normal performans | — |
| **Hasarlı (1-99)** | Güç hesabında dur/50 → düşük bonus | Tersanede tamir (4 altın/puan, tersane %25 indirim) |
| **Batık (0)** | Gemi yok — feluka ile respawn | Otomatik: 50 altın + Feluka + boş kargo |

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
