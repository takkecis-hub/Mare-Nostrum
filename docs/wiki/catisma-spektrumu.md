# Çatışma Spektrumu

> Ana referans: [`mare_nostrum_master_v3.md`](../../mare_nostrum_master_v3.md) — Bölüm 5  
> Detaylı çalışma belgesi: [`mare_nostrum_conflict_spectrum.md`](../../mare_nostrum_conflict_spectrum.md)

---

## Üç Boyutlu Çatışma

Rakibinizi yenmek için gemisini batırmanıza gerek yoktur. Çatışma üç katmanlı çalışır:

```
┌─────────────────────────────────────────────────────┐
│              ÇATIŞMA SPEKTRUMU                       │
│                                                     │
│  DEMİR            ZEHİR            KUŞATMA           │
│  (denizde)       (limanda)        (piyasada)         │
│                                                     │
│  Saldırı         Söylenti         Fiyat              │
│  Yağma           İhbar            manipülasyonu      │
│  Abluka          Karalama         Stok savaşı        │
│  Fidye           İtibar yıkımı    Rota blokajı       │
│                                                     │
│  ← GÜRÜLTÜLÜ          SESSİZ →                       │
│  ← RİSKLİ             GÜVENLİ →                     │
│  ← ANLIK              YAVAŞ →                        │
└─────────────────────────────────────────────────────┘
```

| Tip | İsim | Arena | Hız | Risk |
|-----|------|-------|-----|------|
| **Fiziksel** | Demir | Denizde | Anında | Yüksek |
| **Sosyal** | Zehir | Limanda / Kahvehanede | 2–3 tur | Düşük |
| **Ekonomik** | Kuşatma | Piyasada | Orta | Orta |

En yıkıcı strateji üçünü kombine eder.

---

## Demir Saldırısı (Fiziksel)

Detaylı mekanik → [Savaş Taktiği](savas-taktig.md)

### Demir vs Zehir Karşılaştırması

| | Demir | Zehir |
|---|---|---|
| Etki süresi | Anlık | 2–3 tur |
| Kargo çalma | ✅ | ❌ |
| Kendi hasar riski | ✅ | ❌ |
| Kaynak gizliliği | ❌ (herkes bilir) | ✅ (kaynağı gizli kalabilir) |
| Hedef sayısı | 1 kişi | Hedefin TÜM ilişkileri |

---

## Zehir Saldırısı: Dedikodu Savaşı

[Kahvehane](cekirdek-dongu.md#kahvehane) artık hem bilgi merkezi hem **silah fabrikasıdır**.

### Rüzgâr Ek (Söylenti Yayma) — Şablon Seçimleri

Maliyet: **25 altın**

```
KİM HAKKINDA?   Kendim / [oyuncu seç] / Genel

NE SÖYLÜYORSUN?
  "... çok zengin / güçlü"     (gözdağı)
  "... zayıf / parasız"        (küçümseme)
  "... korsan / kaçakçı"       (suçlama)
  "... güvenilmez / ihanetçi"  (karalama)
  "... cömert / kahraman"      (övgü)
  "... şu güçle gizlice çalışıyor" (ifşa)
  "[mal] fiyatı [liman]'da fırlıyor" (piyasa)
```

> **Neden şablon bazlı?** Serbest metin LLM gecikme ve tutarsızlık riski yaratır. Şablon hızlı, net ve mekanik sonucu önceden tanımlıdır.

**Tekrarlayan söylenti cezası:** Aynı oyuncu 5 tur içinde 3+ söylenti yayarsa, kahvehane NPC'leri "Bu adam çok fısıldıyor" söylentisi üretir.

### Söylenti Çarpıtması

Söylenti yayıldıkça alıcı limanın ilişki durumuna göre çarpıtılır:

| Eylem | Sevenin yorumu | Sevmeyenin yorumu |
|-------|----------------|-------------------|
| Büyük savaş kazandı | "Kahraman" | "Saldırgan" |
| Çok ticaret yaptı | "Zengin tüccar" | "Piyasa manipülatörü" |
| İhanet etti | "Stratejist" | "Hain" |
| Cömertlik gösterdi | "Aziz" | "Gösteriş" |

### Somut Senaryo: Söylenti Saldırısının Gücü

```
TUR 10: Beren, İstanbul'da başarılı ticaret yapıyor.
        Osmanlı onu "Tanıdık Yüz" olarak görüyor.

TUR 11: Ali, Venedik kahvehanesinde fısıldıyor:
        "Beren Osmanlı casusu."  → Maliyet: 25 altın

TUR 12: Söylenti Venedik'te yayılıyor.
        Venedik, Beren'i Yabancı'dan Kem Göz'e düşürüyor.

TUR 13: Söylenti Cenova ve Ragusa'ya ulaşıyor.
        Beren Hristiyan limanlarında sorun yaşıyor.

TUR 14: Beren: "Senin Osmanlı casusu olduğun söyleniyor — NE?!"
        → Beren 2-3 tur harcayıp söylentiyi çürütmek zorunda
        → Bu sürede ticaret yapamaz
        → Ali İstanbul rotasını devralır

SONUÇ: Ali tek fısıltıyla, kılıç çekmeden, Beren'i
       3-4 tur boyunca saf dışı bıraktı.
```

### Söylenti Savunması

4 seçenek:

| Seçenek | Gereksinim | Başarı | Başarısız |
|---------|-----------|--------|-----------|
| **Ateşe Su** (çürüt) | Mürekkep %70 / %30 | Söylenti o limanda ölür | "İnkârı daha da şüpheli" → söylenti güçlenir |
| **İzi Sürmek** (kaynak bul) | Simsar %60 / %20 | Kaynağı öğrenir, karşı saldırı imkânı | Hiçbir şey bulamazsın |
| **Yoksay** | — | Söylenti doğal ömrüne bırakılır | Bazıları kalıcı ün'e dönüşür |
| **Karşı Söylenti** | Tahmini doğruysa | Karşılıklı söylenti savaşı | Yanlış kişiyi hedef alırsan iki düşman kazanırsın |

### Söylenti Ömrü

| Boyut | Ömür |
|-------|------|
| Küçük (sıradan ticaret) | 3–4 tur |
| Orta (savaş, kaçakçılık) | 5–6 tur |
| Büyük (ihanet, mega event) | 8–10 tur |
| Kalıcı | 3+ aynı tip söylenti → **ün**'e dönüşür |

---

## Kuşatma Saldırısı: Sessiz Yıkım

### Fiyat Sabotajı

```
Rakibinin gittiği limanı biliyorsan:
→ Ondan önce o limana var, aynı malı sat
→ Fiyat düşer → rakibin kârı erir
GEREKLİ: Rakibinin rotasını bilmek
  (kahvehane fısıltısı, bilgi ticareti, söylenti)
```

### Stok Ablukası

```
Bir limandaki kritik malı tamamen satın al:
→ Rakip o malı alamaz
→ Çok sermaye gerektirir (400+ altın)
→ Ama fiziksel risk sıfır
→ Malı rakibe 2 katı fiyata teklif edebilirsin
```

### Kısa Stok Varyantı (Düşük Sermaye)

Tüm stok yerine stokun %50'sini satın alma — 200 altın yeterli. Etki kısmi ama erişilebilir.

### Rota Korkutması

```
Belirli rotada korsan söylentisi yayarsın
→ O rotadan kimse geçmek istemez
→ Sen o rotayı tek başına kullanırsın
RİSK: Birisi o rotaya girip korsan olmadığını
görürse, "sahte söylenti" ifşası → tüm
söylentilerine güven düşer
```

---

## Duman: Saldırmamanın Gücü

[Duman niyeti](terimler-sozluk.md), aktif saldırı yapmamak üzerine kurulu — ama bu güçsüz olmak değildir.

### Borç Yaratma

```
Yolda Can ile karşılaştın. Kara Bayrak niyetindeydin.
Can'ı yenebilirdin — ama saldırmadın.
Can bunu biliyor.

Sonra: "O gün seni rahat bıraktım.
       Şimdi bana İskenderiye'deki bilgiyi ver."
→ Can hayır diyemez.
```

**Singleplayer:** NPC'lerde borç sayacı (+1 her iyilikte). Sayaç 3+ olunca NPC iyilik yapar.  
**Multiplayer:** Duman + görmezden gelme → hedefe otomatik bildirim: "Seni gördü ama saldırmadı."

### Gizlilik Koruma

```
Yasak kargo taşıyorsun. Yolda donanma devriyesi var.
Duman niyetinde → donanma seni görmez
(Tramontana + Duman = düşük görünürlük)

Kervan niyetinde olsaydın: durdurulup kontrol edilirdin.
```

### Bilgi Toplama

```
İki oyuncunun konvoyunu görüyorsun.
Duman seçtiğin için onlar seni görmeyebilir (Simsar'a bağlı)
Ama sen ONLARI görürsün:
  → Kim kimle konvoy kurmuş (ittifak bilgisi)
  → Hangi yöne gidiyorlar (rota bilgisi)
  → Ne kadar kargo taşıyorlar (ticaret bilgisi)
Bu bilgiyi kendine saklayabilir, satabilir veya şehre verebilirsin.
```

### Deneyim Katkısı

```
Duman + birini gördün ama saldırmadın   → Mürekkep +1
Duman + gözlemledin                      → Simsar +1
Duman + donanmayı atlattın              → Simsar +2
Duman + kimseyle karşılaşmadın          → etkisi yok
```

---

## Entegre Senaryo: Üç Saldırı Türünün Kombinasyonu

```
HEDEF: Beren'i İstanbul ticaret rotasından kovmak.

ADIM 1 — ZEHİR (Tur 10):
  "Beren Osmanlı casusu." → Hristiyan limanlar şüpheleniyor.

ADIM 2 — KUŞATMA (Tur 11):
  İstanbul'a Beren'den önce varıp ipek stokunu satın al.
  Beren ipek bulamaz, boş dönmek zorunda.

ADIM 3 — BEKLEME (Tur 12):
  Duman seç. Beren'in zayıflamasını izle.
  Para azalıyor, itibar düşüyor.

ADIM 4 — DEMİR (Tur 13, OPSİYONEL):
  Beren zayıflamış. Saldırabilirsin.
  Ama belki gerek yok — Beren zaten rotayı bırakıyor.

SONUÇ:
  Kullanılan: 25 altın (söylenti) + 300 altın (stok) + sabır
  Fiziksel saldırı: SIFIR. Risk: MİNİMUM.
```

---

## Bağlantılı Sayfalar

- [Savaş Taktiği](savas-taktig.md) — Demir saldırısı detayları
- [Dedikodu & Söylenti](dedikodu-soylenti.md) — Söylenti mekanizması
- [Ekonomi Sistemi](ekonomi.md) — Kuşatma için gerekli menşe/fiyat bilgisi
- [Görünmez Deneyim Sistemi](deneyim-sistemi.md) — Mürekkep ve Simsar avantajları
- [Çekirdek Döngü](cekirdek-dongu.md) — Duman niyeti
