# Gemi Sistemi

> Ana referans: [`mare_nostrum_master_v3.md`](../../mare_nostrum_master_v3.md) — Bölüm 8  
> Savaş sinerjileri: [`mare_nostrum_combat_narrative.md`](../../mare_nostrum_combat_narrative.md)

---

## Üç Gemi, Tek Gemi Kuralı

Oyuncunun her zaman tek bir gemisi vardır. Kendi oyun stiline göre seçer ve değiştirebilir.

---

## Karşılaştırma Tablosu

> **Uygulama durumu:** Gemi değerleri `mockup/packages/shared/src/types/index.ts` (Ship tipi) ve `mockup/packages/engine/src/combat.ts` (taktik bonusları) dosyalarında tanımlıdır.

| Gemi | Hız | Kargo | Güç | Taktik Sinerjisi | Özel |
|------|-----|-------|-----|-----------------|------|
| **Feluka** | Hızlı | 3 | 2 | Manevra +1 | Kaçış şampiyonu; batışta respawn gemisi |
| **Karaka** | Orta | 5 | 2 | Ateş +1 | Kargo avantajı; savunma odaklı; varsayılan başlangıç gemisi |
| **Kadırga** | Yavaş | Az | 3 | Pruva +1 | Savaş makinesi |

---

## Feluka — *"Korsanın İlk Aşkı"*

> Feluka — Akdeniz'in en eski gemi tipi. Nil'den Cebelitarık'a her yerde var. Korsanın ilk aşkı, kaçakçının en yakın dostu.

**Avantajlar:**
- Fortuna rotasında ilk gelme şansı yüksek
- Manevra taktiğinde +1 bonus
- Kaçış denemesinde en başarılı gemi (Feluka > Kadırga > Karaka hız sırası)
- Kabotaj rotası 2 tur (normal)
- Gemi batışında respawn gemisi (güç 2, kargo 3, dayanıklılık 100)

**Dezavantajlar:**
- Kargo kapasitesi düşük (3) — büyük ticaret yapılamaz
- Güç: 2 — savaşta Kadırga'nın gerisinde

**Uygun oyun stili:** Hızlı tüccar, korsan, bilgi toplayıcı

---

## Karaka — *"Ticaretin Savaş Atı"*

> Karaka (Carrack) — geniş karınlı, ağır yüklü, saygıdeğer. Bir karaka dolusu baharat küçük bir şehrin bir yıllık bütçesidir.

**Avantajlar:**
- Yüksek kargo kapasitesi (5) — Commenda'da ideal
- Güç: 2 — dengeli savunma
- Mockup'ta varsayılan başlangıç gemisi (200 altın + 1 Murano Camı)

**Dezavantajlar:**
- Fortuna rotasında son gelen olma riski yüksek
- Taktik bonusu yok — savaşta uzmanlaşma avantajı sağlamaz

**Uygun oyun stili:** Büyük tüccar, Commenda yatırımcısı

---

## Kadırga — *"Akdeniz'in Savaş Makinesi"*

> Kadırga — Preveze'de, İnebahtı'da, Lepanto'da hep kadırga. Yavaş yüklü ama öfkeliyken fırtına kadar hızlı.

**Avantajlar:**
- En yüksek güç (3)
- Pruva taktiğinde gizli +1 bonus (+3 vs Ateş)
- Malta'da ucuz satın alınır

**Dezavantajlar:**
- Düşük kargo — ticaret için ideal değil
- Kabotaj rotasında **1 ekstra tur** ekler (toplam 3 tur)
- Yavaş — ilk gelen bonusu çok düşük

**Uygun oyun stili:** Korsan, savaşçı, deniz korsanı

---

## Gemi Durumları

> **Uygulama durumu:** Dayanıklılık sistemi `mockup/packages/engine/src/shipyard.ts` ve `combat.ts` dosyalarında uygulanmıştır. Tamir maliyeti: REPAIR_COST_PER_POINT=4 altın/puan, tersane indirimi TERSANE_DISCOUNT=0.75.

| Durum | Etki | İyileştirme |
|-------|------|-------------|
| **Sağlam (100)** | Normal performans | — |
| **Hasarlı (1-99)** | Güç hesabında durability/50 → düşük bonus | Tersanede tamir (4 altın/puan, tersane %25 indirim) |
| **Batık (0)** | Gemi yok — Feluka ile respawn + 50 altın | Otomatik (turn-resolver) |

---

## Fiyatlar ve Geçiş Maliyetleri

| İşlem | Maliyet |
|-------|---------|
| Feluka satın al | 100 altın |
| Karaka satın al | 300 altın |
| Kadırga satın al | 500 altın |
| Gemi değiştirme (eski gemiyi sat) | Yeni fiyat − (eski gemi fiyatının %50'si) |
| Yaralı gemi tamiri | Gemi fiyatının %25'i |

### Örnekler

```
Feluka → Karaka geçişi:
  300 − (100 × 0.5) = 250 altın

Karaka → Kadırga geçişi:
  500 − (300 × 0.5) = 350 altın

Feluka tamiri:
  100 × 0.25 = 25 altın

Karaka tamiri:
  300 × 0.25 = 75 altın
```

---

## Başlangıç Gemisi

> **Uygulama durumu:** Mockup sunucusunda (`server/src/index.ts`) oyuncu **Karaka** (kargo 5, güç 2, dayanıklılık 100) ve 200 altınla başlar. Kargoda 1 adet Murano Camı bulunur.

**Tasarım hedefi:** Herkes Feluka (100 altın değerinde) ve 200 altınla başlar.
**Mevcut mockup:** Karaka ile başlanır — erken ticaret testi için daha geniş kargo kapasitesi sağlanmıştır.

---

## Gemi ve Rota Uyumu

| Gemi \ Rota | Tramontana | Kabotaj | Fortuna |
|-------------|-----------|---------|---------|
| **Feluka** | Normal (1 tur) | Normal (2 tur) | En uygun (hız avantajı) |
| **Karaka** | Normal (1 tur) | Normal (2 tur) | Riskli (yavaş) |
| **Kadırga** | Normal (1 tur) | **Yavaş (3 tur)** | Riskli (çok yavaş) |

---

## Bağlantılı Sayfalar

- [Savaş Taktiği](savas-taktig.md) — Gemi-taktik sinerjileri
- [Harita & Limanlar](harita-limanlar.md) — Tersane limanları (Venedik, Malta)
- [Çekirdek Döngü](cekirdek-dongu.md) — Fondaco / Tersane
- [Ekonomi Sistemi](ekonomi.md) — Kargo kapasitesi ve ticaret hacmi
