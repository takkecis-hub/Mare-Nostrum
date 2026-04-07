# Görünmez Deneyim Sistemi

> Ana referans: [`mare_nostrum_master_v3.md`](../../mare_nostrum_master_v3.md) — Bölüm 4  
> Detaylı çalışma belgesi: [`mare_nostrum_experience_system.md`](../../mare_nostrum_experience_system.md)

---

## Felsefe

> *"En iyi skill sistemi, oyuncunun farkında olmadığı skill sistemidir."*

Oyuncu hiçbir zaman "Ticaret: 47" görmez. Hiçbir zaman "skill puanım arttı" bildirimi almaz. Ama oyun her şeyi izler — sessizce. Ve oyuncunun geçmiş deneyimleri oyunun ona nasıl davrandığını değiştirir.

**Oyuncu farkı HISSEDER ama ÖLÇEMEZ.** Spreadsheet imkânsız, içgüdü ödüllendirilir.

---

## Dört Gizli Havuz

| Havuz | Tematik İsim | Alan |
|-------|-------------|------|
| **Meltem** | Ege'nin mevsimlik rüzgârı | Fırtına, savaş, denizcilik, kaçış |
| **Terazi** | Tüccarın sembolü ve adalet aracı | Ticaret, fiyat, pazarlık, stok |
| **Mürekkep** | Fermanların ve antlaşmaların maddesi | Müzakere, diplomasi, söylenti yönetimi |
| **Simsar** | Arapça karanlık aracı | Kaçakçılık, casusluk, bilgi toplama |

---

## Eylem-Havuz Eşleştirmesi

| Eylem | Havuz | Miktar |
|-------|-------|--------|
| Fırtınada hayatta kaldı | Meltem | +3 |
| Savaşa girdi | Meltem | +2 |
| Kaçış denemesi yaptı | Meltem | +1 |
| Mal alıp sattı | Terazi | +1 |
| Farklı limanda ticaret yaptı | Terazi | +1 |
| 2+ oyuncuyla mesajlaştı | Mürekkep | +1 |
| Şehir yöneticisiyle görüştü | Mürekkep | +2 |
| Söylenti yaydı veya çürüttü | Mürekkep | +1 |
| Commenda veya konvoy anlaştı | Mürekkep | +1 |
| Kaçakçılık yaptı (başarılı) | Simsar | +2 |
| Kaçakçılık yaptı (yakalandı) | Simsar | +1 |
| Sahte söylenti yaydı | Simsar | +1 |
| Birinin kargosunu gözetledi | Simsar | +1 |
| Avlanma emri verdi | Simsar | +1 |

> Denize çıkmak artık otomatik Meltem vermez — deneyim **yaşanarak** kazanılır.

---

## Oran Bazlı Sistem

Toplam puan değil, **havuzlar arası oran** belirleyicidir:

```
Meltem oranı = Meltem / (Meltem + Terazi + Mürekkep + Simsar)

Oyuncu A: Meltem 80, Terazi 20, Mürekkep 30, Simsar 10
→ Meltem oranı = 80/140 = %57 → Denizci ağırlıklı

Oyuncu B: Meltem 30, Terazi 90, Mürekkep 50, Simsar 20
→ Terazi oranı = 90/190 = %47 → Tüccar ağırlıklı
```

---

## Generalist Dezavantajı

Oran **%25'in altında** kalan havuzlarda oyuncu belirli fırsatları **tamamen kaçırır**:

| Havuz %25 Altı | Kayıp |
|----------------|-------|
| Meltem | Fırtına öncesi uyarı ASLA duyulmaz |
| Terazi | Sahte piyasa söylentileri ASLA fark edilemez |
| Mürekkep | Şehir yöneticisinin gizli bilgileri ASLA duyulamaz |
| Simsar | Kahvehanede gizli fısıltılar ASLA duyulamaz |

**Ün için minimum oran:** %35 — her şeyi yapan generalist oyuncuya hiçbir ün gelmez.

---

## Hissedilen Etkiler

### Kahvehane Fısıltıları

Aynı kahvehanede iki oyuncu farklı şeyler duyar:

| Profil | Örnek Fısıltılar |
|--------|-----------------|
| Meltem ağırlıklı | "Ege'de üç günlük fırtına bekleniyor" / "Girit açıklarında Osmanlı devriye var" |
| Terazi ağırlıklı | "İskenderiye'den baharat az, fiyat fırlayacak" / "Cenovalılar İstanbul'da cam stoku yapıyor" |
| Mürekkep ağırlıklı | "Venedik Doju Osmanlı'yla gizli müzakere yürütüyor" / "Korsan Can hakkında ihbar gelmiş" |
| Simsar ağırlıklı | "Gümrükçüler bu hafta gevşek" / "Doğu rotasında donanma yok" |

### Pazar (Terazi Etkisi)

| Terazi Oranı | Pazar Görünümü |
|--------------|----------------|
| %0–20 | Sadece ok yönleri (↑↓→) |
| %21–40 | Ok gücü hissedilir (↑↑ vs ↑) |
| %41–60 | Sahte trendler fark edilir; şehir yöneticisi daha iyi fiyat verir |
| %61+ | Grafik benzeri ipuçları; sahte söylentilere bağışık; ticaret tekelleri |

### Savaş (Meltem Etkisi)

| Meltem Oranı | Savaş / Deniz Etkisi |
|--------------|----------------------|
| %0–20 | Zar 1–6, fırtına hasarı %30 |
| %21–40 | Zar alt sınırı 2, hasar %25 |
| %41–60 | Zar 2–6 + beraberliklerde kazanma, hasar %15 |
| %61+ | Zar 3–6 (üst sınır), fırtına hasarı minimum, kısayol şansı |

> **Not:** Meltem avantajı tavan'a sahiptir — zar alt sınırı en fazla 2-6 olabilir (3-6 kaldırıldı; snowball engeli).

### Diplomasi (Mürekkep Etkisi)

| Mürekkep Oranı | Sosyal Etkisi |
|----------------|---------------|
| %0–20 | Şehir yöneticisi kısa ve soğuk |
| %21–40 | Yönetici sıcaklaşır, ara ara ipucu verir |
| %41–60 | Uzun konuşma, sırlar paylaşır; ittifak bulaşması yarı hızda |
| %61+ | Görev seçenekleri; barış aracılığı; başkalarının söylentilerini duyar |

### Gölge (Simsar Etkisi)

| Simsar Oranı | Gölge Etkisi |
|--------------|-------------|
| %0–20 | Kaçakçılık riski %40 |
| %21–40 | Risk %25; aynı limandaki gemi tipini görürsün |
| %41–60 | Risk %10; sahte söylentiler çürütülemez |
| %61+ | Risk %3; son emirleri bilirsin; Hayalet Pala ünü kolay |

---

## Ün Sistemi ile Entegrasyon

Ün kazanmak için iki koşul: **deneyim oranı + söylenti**:

| Ün | Koşul |
|----|-------|
| Altın Parmak | Terazi %35+ VE 3+ ticaret söylentisi |
| Demir Pruva | Meltem %35+ VE 2+ savaş söylentisi |
| İpek Dil | Mürekkep %35+ VE 2+ diplomasi söylentisi |
| Hayalet Pala | Simsar %30+ VE hakkında olumsuz söylenti AZ |
| Mühürlü Söz | Mürekkep %25+ VE hiç ihanet söylentisi yok |
| Akrep | 3+ ihanet söylentisi (havuz fark etmez) |

Detaylı → [Ün Sistemi](un-sistemi.md)

---

## Deneyim "Çürümesi"

Havuzlar büyür ama **oran değişir**. Aktif olmadığın alanda oran düşer:

```
Çok ticaret yaptın → Terazi büyüyor
Ama savaşmıyorsun → Meltem büyümüyor
Terazi oranı artarken Meltem oranı DÜŞÜYOR

Oyuncunun hissi: "Eskiden fırtınalarda çok iyiydim,
                  son zamanlarda biraz paslandım gibi."
```

---

## Mod-Özel Denge Ayarları

| Mod | Mürekkep | Simsar |
|-----|---------|--------|
| Singleplayer | NPC etkileşiminde +2 (MP oyuncu mesajlaşmasını telafi) | Yakalanma %5 artırılmış |
| Multiplayer | Her 2 mesajda +1 (spam önleme) | Standart |

---

## NPC Deneyim Profilleri (Singleplayer)

LLM NPC'lerinin de deneyim profili vardır:

| NPC | Profil | Davranış |
|-----|--------|---------|
| **Kaptan Yorgos** | Meltem %55, Simsar %20 | Denizci, savaşçı; ticaret kararlarında hata yapar |
| **Fatma Hatun** | Terazi %60, Mürekkep %25 | Saf tüccar; korsana karşı savunmasız; ortaklık arar |

---

## Oyuncuya Görünen Tek Şey: Ünler

```
┌─ KAPTAN PROFİLİ ────────────────────┐
│  İsim: [oyuncu adı]                  │
│  Gemi: Tüccar gemisi                 │
│  Altın: 1,240                        │
│                                      │
│  Ünler:                              │
│    ★ Altın Parmak                    │
│    ★ İpek Dil                        │
│    ☆ (boş — 3. ün kazanılmamış)     │
│                                      │
│  Son söylentiler (hakkımda):         │
│    "İskenderiye'de büyük vurgun"     │
│    "Venedik Doju'nun güvendiği biri" │
└──────────────────────────────────────┘
```

---

## Bağlantılı Sayfalar

- [Ün Sistemi](un-sistemi.md) — Ünlerin kazanma koşulları
- [Dedikodu & Söylenti](dedikodu-soylenti.md) — Söylenti + deneyim birleşimi
- [Savaş Taktiği](savas-taktig.md) — Meltem'in savaş etkisi
- [Ekonomi Sistemi](ekonomi.md) — Terazi'nin pazar etkisi
- [LLM Entegrasyonu](llm-entegrasyon.md) — Profil → Prompt dönüşümü
