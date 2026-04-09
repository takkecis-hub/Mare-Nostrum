# Ekonomi Sistemi

> Ana referans: [`mare_nostrum_master_v3.md`](../../mare_nostrum_master_v3.md) — Bölüm 6  
> Detaylı çalışma belgesi: [`mare_nostrum_economy.md`](../../mare_nostrum_economy.md)

---

## Tasarım Hedefi

Ticareti savaş kadar heyecanlı, diplomasi kadar sosyal yapmak — ama hâlâ **spreadsheet'siz**.

> Sabit rota sorunu: "Her zaman İskenderiye → Marsilya" artık çalışmıyor çünkü herkes aynı şeyi yaparsa Marsilya'da baharat bollaşır ve fiyat çöker.

---

## Menşe Sistemi

### Temel İlke

3 mal kategorisi (Yemek, Lüks, Savaş) korunuyor. Ama artık her liman belirli bir malın **menşe** (köken) kaynağı. Aynı kategorideki mallar farklı değerde — çünkü nereden geldiğine göre fiyatı değişiyor.

```
Lüks kategorisi:
  İskenderiye'den → "Mısır Baharatı"     (Marsilya'da çok değerli)
  Venedik'ten     → "Murano Camı"        (İstanbul'da çok değerli)
  İstanbul'dan    → "Doğu İpeği"         (Batı'da çok değerli)
  Cenova'dan      → "Ligurya Mercanı"    (Tunus'ta değerli)
  Trablus'tan     → "Sahra Altını"       (her yerde değerli)
```

### Menşe Tablosu — 15 Liman

> **Not:** Aşağıdaki tablo `mockup/data/ports.json` ve `mockup/data/goods.json` dosyalarındaki güncel veriyi yansıtır. 17 menşe mal mevcuttur (7 yemek, 6 lüks, 4 savaş).

| Liman | Üretir (ucuz al) | Arzular (pahalı sat) |
|-------|-----------------|---------------------|
| **Barselona** | Katalan Demiri [Savaş] | Doğu İpeği [Lüks] |
| **Marsilya** | Provence Şarabı [Yemek] | Mısır Baharatları [Lüks] |
| **Cenova** | Ligurya Mercanı [Lüks] | Sicilya Buğdayı [Yemek] |
| **Venedik** | Murano Camı [Lüks] | Lübnan Sediri [Savaş] |
| **Palermo** | Sicilya Buğdayı [Yemek] | Katalan Demiri [Savaş] |
| **Ragusa** | Ragusa Tuzu [Yemek] | Ligurya Mercanı [Lüks] |
| **Malta** | Malta Çeliği [Savaş] | Tunus Zeytinyağı [Yemek] |
| **İstanbul** | Doğu İpeği [Lüks] | Ragusa Tuzu [Yemek] |
| **Girit** | Girit Zeytinyağı [Yemek] | Malta Çeliği [Savaş] |
| **Kıbrıs** | Kıbrıs Tuzu [Yemek] | Murano Camı [Lüks] |
| **Beyrut** | Lübnan Sediri [Savaş] | Osmanlı Silahı [Savaş] |
| **İskenderiye** | Mısır Baharatları [Lüks] | Sahra Altını [Lüks] |
| **Trablus** | Sahra Altını [Lüks] | Kıbrıs Tuzu [Yemek] |
| **Tunus** | Tunus Zeytinyağı [Yemek] | Girit Zeytinyağı [Yemek] |
| **Cezayir** | Osmanlı Silahı [Savaş] | Provence Şarabı [Yemek] |

**Kural:** Bir limanın ürettiği malı o limanda satmak KÖTÜ fiyat. Bir limanın arzuladığı malı satmak ÇOK İYİ fiyat.

**Ragusa özel:** Transit liman. Hiçbir şey üretmez ama her şey orta fiyat. Değeri bilgi akışı ve nötr statüde. Transit vergisi: alışverişlerde %10 ekstra.

---

## Dinamik Fiyat: Açlık / Doyma Mekaniği

> **Uygulama durumu:** Port doyma (saturation) sistemi `mockup/packages/engine/src/economy.ts` ve `turn-resolver.ts` dosyalarında uygulanmıştır. Her teslimat, fiyatı %15 azaltır (minimum %40). Doyma her 3 turda 1 birim çürür.

### Nasıl Çalışır

Her limanın her menşe mal için bir **açlık seviyesi** vardır:

```
AÇ     → ●●●●● fiyat (uzun süredir mal gelmemiş)
NORMAL  → ●●●○○ fiyat (düzenli geliyor)
TOK     → ●○○○○ fiyat (çok fazla gelmiş)
```

### Doyma Hızı (Oyuncu Sayısına Göre)

| Oyuncu Sayısı | 1 getirirse | 2 getirirse | 3+ getirirse |
|---------------|-------------|-------------|--------------|
| 2 oyuncu | -1 | -3 | DİBE |
| 4 oyuncu | -1 | -2 | DİBE |
| 6+ oyuncu | -1 | -1 | -2 (4+: DİBE) |

Kimse getirmezse açlık her tur +1 artar. Çok oyunculu partide toparlanma da daha hızlı.

> **Sonuç:** Kârlı rota = herkesin bildiği rota = kalabalık rota = kârsız rota. Gerçekten kâr etmek için kimsenin bilmediği açlığı bulmalısın (bilgi avantajı) veya diğerlerini yanlış yöne yönlendirmelisin ([söylenti silahı](dedikodu-soylenti.md)).

---

## Fiyat Gösterimi

Rakam yok. Beş nokta sistemi:

```
●●●●●  →  Çok pahalı
●●●●○  →  Pahalı
●●●○○  →  Normal
●●○○○  →  Ucuz
●○○○○  →  Çok ucuz
```

[Terazi](deneyim-sistemi.md) deneyimi arttıkça fiyat görünürlüğü artar:

| Terazi Seviyesi | Gördüklerin |
|-----------------|-------------|
| Düşük | Sadece üretim/talep bilgisi |
| Orta | Bulunduğun limandaki açlık seviyesi |
| Yüksek | Komşu limanların açlık durumu + tahmini değer |
| Çok yüksek | Tüm limanlar haritası (1 tur eski bilgi) |

---

## İlk Gelen Bonusu

Aynı turda aynı limana aynı malı getiren oyunculardan **hızlı olan** iyi fiyat, **yavaş olan** kötü fiyat alır.

- Fortuna (hızlı ama riskli) = ilk gelme şansı
- **Önemli:** İlk gelen bonusu kargo miktarıyla ters orantılı — az kargo getiren ilk gelen az bonus alır. Bu, Feluka hız meta'sını kırar.

---

## Sezon Etkisi

| Mevsim | Ticaret Koşulları |
|--------|------------------|
| **Yaz** | Trafik yoğun, yemek ucuz, lüks pahalı |
| **Kış** | Fırtına riski yüksek, yemek pahalı, ama kışın denize çıkan "aç pazarlarda" vurgun vurur |

---

## Şehir Kontratları

LLM şehir yöneticisi sabit gelir garantili görevler teklif eder:
- **Mürekkep** deneyimi yüksek oyunculara daha iyi teklif gelir
- Kontratı bozarsan ceza + itibar düşüşü

---

## Commenda

Venedik kökenli ortaklık sistemi:

- **Yatırımcı** sermaye koyar
- **Tüccar** denize çıkar  
- Kâr paylaşımı serbest anlaşmayla belirlenir
- İhanet her zaman mümkün — ama söylenti üretir

**İhanet cezası zamana göre ağırlaşır:**
1. İhanet → Hafif söylenti (3 tur)
2. İhanet → Güçlü söylenti (6+ tur)
3. İhanet → Kalıcı [Akrep](un-sistemi.md) ünü

---

## Kaçak Mal

Bazı mallar bazı limanlarda yasaktır:

- **Yakalanma riski:** [Simsar](deneyim-sistemi.md) deneyimine bağlı (%40 → %3)
- **Yasak mal fiyatı:** 2–3× normal fiyat
- **Yakalanma cezası:** 2 tur hapis + 200 altın para cezası

---

## Piyasa Söylenti Silahı

Kahvehanede yanlış fiyat bilgisi yayılabilir:

```
"Marsilya'da baharat tavan yaptı"
→ Herkes Marsilya'ya koşar → fiyat çöker
→ Söylentiyi yayan belki de İstanbul'a gidiyor
```

Sahte piyasa söylentisi riski: birisi o limana gidip yalan olduğunu görürse, "sahte bilgi yayıyor" söylentisi doğar → Terazi itibarı yıkılır.

Detaylı → [Dedikodu & Söylenti](dedikodu-soylenti.md)

---

## Bağlantılı Sayfalar

- [Harita & Limanlar](harita-limanlar.md) — 15 limanın detaylı profili
- [Görünmez Deneyim Sistemi](deneyim-sistemi.md) — Terazi havuzu
- [Dedikodu & Söylenti](dedikodu-soylenti.md) — Piyasa söylentisi silahı
- [Çatışma Spektrumu](catisma-spektrumu.md) — Kuşatma: ekonomik saldırı
