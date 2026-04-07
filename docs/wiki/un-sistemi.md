# Ün Sistemi

> Ana referans: [`mare_nostrum_master_v3.md`](../../mare_nostrum_master_v3.md) — Bölüm 7  
> Deneyim entegrasyonu: [`mare_nostrum_experience_system.md`](../../mare_nostrum_experience_system.md)

---

## Felsefe

Ünler oyuncunun **gördüğü tek stat**tır. Deneyim havuzları sebep, ünler sonuçtur. Oyuncu sonucu görür, sebebi **hisseder ama ölçemez**.

---

## Sekiz Ün

| Ün | Koşul | Pasif Bonus |
|----|-------|-------------|
| **Altın Parmak** | Terazi %35+ VE 3+ ticaret söylentisi | Fiyat trendlerini net görür; sahte piyasa söylentilerine bağışık |
| **Demir Pruva** | Meltem %35+ VE 2+ savaş söylentisi | Savaşta +1 güç |
| **İpek Dil** | Mürekkep %35+ VE 2+ diplomasi söylentisi | Şehirler sıcak karşılar; fidyede avantaj |
| **Hayalet Pala** | Simsar %30+ VE hakkında olumsuz söylenti AZ | Kaçakçılık riski minimuma düşer |
| **Mühürlü Söz** | Mürekkep %25+ VE hiç ihanet söylentisi yok | Commenda sık gelir; kredi alınabilir |
| **Akrep** | 3+ ihanet söylentisi (havuz fark etmez) | Anlaşma gelmez ama tehdit çok güçlü |
| **Açık El** | Özel cömertlik eylemleri | Mürettebat ucuz; mülteciler sığınır |
| **Deli Rüzgâr** | Özel cesaret eylemleri | Tehlikeli görevler açılır |

---

## Ün Kazanma Mekanizması

İki koşul **eş zamanlı** sağlanmalıdır:

```
ÜN KAZANMA:
  Deneyim oranı ≥ eşik VEYA söylenti sayısı ≥ eşik
  → HER İKİSİ birlikte olmalı

Örnek — "Demir Pruva":
  Meltem oranı %35+ (yani çok savaşmış)
  VE
  2+ aktif savaş söylentisi (herkes bunu biliyor)
```

### Neden İkisi Birlikte?

- Çok savaşıyorsun ama kimse bilmiyorsa → ün yok
- Herkes seni savaşçı sanıyor ama az savaşmışsın → ün yok
- Bu kural, **kendi hakkında kasıtlı söylenti yaymanın** stratejik değer kazanmasını sağlar

---

## Ün Kaybetme

Ünler kazanıldıktan sonra da kaybedilebilir:

| Kaybetme Nedeni | Detay |
|-----------------|-------|
| Uzun pasiflik | 5 tur boyunca ünle ilgili eylem yok → uyarı; 8 tur sonra ün kaybı |
| Çelişen eylem | Altın Parmak ünlüyken büyük ihanet → anında kaybetme riski |

---

## Maksimum Üç Ün

Oyuncu aynı anda **en fazla 3 ün** taşıyabilir. Bu:
- Uzmanlaşmayı teşvik eder
- Her oyuncunun farklı ün kombinasyonu oluşturmasını sağlar
- "Her şeyde iyi olmak imkânsız" felsefesini pekiştirir

---

## Profil Ekranı

Oyuncuya görünen tek stat ekranı:

```
┌─ KAPTAN PROFİLİ ────────────────────┐
│                                      │
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

## Zafer Koşulu: Efsane

Oyunun zafer koşulu ünlerden değil, **Efsane** olmaktan geçer:

```
PUAN = (aktif söylenti sayısı × yayılma genişliği)
       + (ün sayısı × 10)
```

**Çeşitlilik çarpanı:** Tek tip söylenti (hep ticaret) yerine çeşitli söylentiye (ticaret + diplomasi + savaş) sahip oyuncu bonus puan alır.

### Efsanevi Başarımlar (Bonus Puan)

| Başarım | Koşul | Puan |
|---------|-------|------|
| **Tüm Akdeniz** | 15 limanın hepsini ziyaret et | Yüksek |
| **Büyük İhanet** | Büyük konvoy tuzağı kur | Yüksek |
| **Barış Elçisi** | İki güç arasında arabulucu ol | Orta |
| **Veba Kahramanı** | Kriz döneminde liman kurtar | Orta |
| **Korsan Avcısı** | 5+ korsan gemi yak | Orta |
| **Hayalet** | 10+ tur Duman ile geç | Orta |
| **Tekelci** | Bir malda tekel kur | Orta |
| **Herkesin Arkadaşı** | Tüm şehirlerde Tanıdık Yüz | Orta |

---

## Ün ve Strateji

### Kendi Hakkında Söylenti Yaymak

Ünü hızlandırmak için kendi hakkında söylenti yayılabilir:
- "Ben çok büyük bir savaş kazandım" → savaş söylentisi artar → Meltem oranıyla birleşir → Demir Pruva gelir
- Söylenti yalanlanırsa ün gelmez

### Rakibin Ününü Çürütmek

Rakibin ün koşulu `2+ söylenti` ise:
- O söylentileri çürüterek rakibin ünü için yeterli söylentisi kalmamasını sağlayabilirsin
- [Ateşe Su](dedikodu-soylenti.md#ateşe-su-çürütme) aksiyonu bu amaçla da kullanılabilir

---

## Bağlantılı Sayfalar

- [Görünmez Deneyim Sistemi](deneyim-sistemi.md) — Ünlerin arka planı
- [Dedikodu & Söylenti](dedikodu-soylenti.md) — Söylenti → Ün dönüşümü
- [Çatışma Spektrumu](catisma-spektrumu.md) — Ün üzerinden baskı
- [Terimler & Sözlük](terimler-sozluk.md) — Ün isimleri ve etimolojileri
