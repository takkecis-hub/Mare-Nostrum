> 🔧 **WIP / ÇALIŞMA DOKÜMANI** — Bu doküman modüler bir çalışma parçasıdır. Güncel konsolide versiyon için → `MARE_NOSTRUM_MASTER_v3.md` dosyasına bakınız.

---

# MARE NOSTRUM — Çatışma Spektrumu
## "Saldırı" Sadece Kılıç Değil

---

# TEMEL REVIZYON

v2 tasarımında emir şöyleydi:

```
NİYET?  ○ Ticaret  ○ Avlanma  ○ Keşif
```

Bu yanlış. "Avlanma" = fiziksel saldırı, ve bu oyuncunun seçeneklerini daraltan bir bakış açısı. Bir oyuncuyu bitirmek için gemisini batırmana gerek yok — itibarını batırman yeterli.

**Yeni niyet seçenekleri:**

```
NİYET?  ○ Ticaret    → limanda al/sat
        ○ Avlanma    → yolda rastladığına fiziksel saldır
        ○ Keşif      → bilgi topla, kimseyle muhatap olma
        ○ Sessiz geç → yolda kimseyle muhatap olma, dikkat çekme
```

Dördüncü seçenek eklendi: **Sessiz geç.** Bu "saldırmama" kararı. Yolda birini görsen bile görmezden gel. Neden önemli? Çünkü bazen EN GÜÇLÜ hamle, hiçbir şey yapmamaktır. Korsanın yanından sessizce geçip raporlamaman, onu borçlu kılar. Rakibini görüp saldırmaman, güven inşa eder. Veya donanma devriyesinin önünde masum görünmen, gizli kargonun güvende kalmasını sağlar.

---

# ÇATIŞMA SPEKTRUMU

Çatışma artık üç katmanlı:

```
┌─────────────────────────────────────────────────────┐
│              ÇATIŞMA SPEKTRUMU                       │
│                                                     │
│  FIZIKSEL        SOSYAL           EKONOMIK           │
│  (denizde)       (limanda)        (piyasada)         │
│                                                     │
│  Saldırı         Söylenti         Fiyat              │
│  Yağma           İhbar            manipülasyonu      │
│  Abluka          Karalama         Stok savaşı        │
│  Fidye           İtibar yıkımı    Rota blokajı       │
│                                                     │
│  ← GÜRÜLTÜLÜ          SESSİZ →                       │
│  ← RİSKLİ             GÜVENLİ →                     │
│  ← ANLIK              YAVAS →                        │
└─────────────────────────────────────────────────────┘
```

Fiziksel saldırı gürültülü, riskli ama anlık sonuç verir. Sosyal saldırı sessiz, güvenli ama yavaş işler. Ekonomik saldırı ikisinin ortası. **Ve birbirini beslerler** — en yıkıcı strateji üçünü kombine eder.

---

# SOSYAL SALDIRI: DEDİKODU SAVAŞI

## Kahvehanede Yapılabilecekler (Genişletilmiş)

Eski tasarımda kahvehane "bilgi al" yeriydi. Artık kahvehane aynı zamanda **SİLAH FABRİKASI:**

```
┌─ KAHVEHANE ──────────────────────────────────────┐
│                                                    │
│  [Kulak kabart]     → pasif bilgi toplama          │
│  [Fısılda]          → söylenti yay                 │
│  [Yalanlat]         → hakkındaki söylentiyi çürüt  │
│  [Sorguya çek]      → bir söylentinin kaynağını    │
│                       araştır                      │
│                                                    │
└────────────────────────────────────────────────────┘
```

### Fısılda (Söylenti Yayma) — Detaylı

Oyuncu kahvehanede bir söylenti başlatır. Serbest metin değil, şablon seçimi:

```
┌─ FISILDA ──────────────────────────────────────────┐
│                                                      │
│  KİM HAKKINDA?   ○ Kendim  ○ [oyuncu seç]  ○ Genel │
│                                                      │
│  NE SÖYLÜYORSUN?                                     │
│    ○ "... çok zengin / güçlü"      (gözdağı)        │
│    ○ "... zayıf / parasız"         (küçümseme)      │
│    ○ "... korsan / kaçakçı"        (suçlama)        │
│    ○ "... güvenilmez / ihanetçi"   (karalama)       │
│    ○ "... cömert / kahraman"       (övgü)           │
│    ○ "... şu güçle gizlice çalışıyor" (ifşa)       │
│    ○ "[mal] fiyatı [liman]'da fırlıyor"  (piyasa)  │
│                                                      │
│  MALİYET: 10 altın (kahvehanede birileriyle içersin) │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Söylenti şablon bazlı çünkü:** Serbest metin LLM gerektir, yavaşlatır ve tutarsızlık riski yaratır. Şablon hızlı, net ve mekanik sonucu önceden tanımlı.

### Söylentinin Etkisi (Fiziksel Saldırıyla Karşılaştırma)

```
FİZİKSEL SALDIRI:                  SÖYLENTİ SALDIRISI:
  → Anlık sonuç                       → 2-3 tur sonra tam etki
  → Kargo çalarsın                    → Kargo çalamazsın
  → Sen de hasar alabilirsin          → Sana doğrudan risk yok
  → Herkes bilir (savaş söylentisi)   → Kaynağı gizli kalabilir
  → Hedef seni tanır                  → Hedef kimin yaptığını bilemeyebilir
  → 1 kişiye etki eder               → Hedefin TÜM ilişkilerini etkiler
```

**Somut örnek — Söylenti saldırısının gücü:**

```
TUR 10: Beren, İstanbul'da başarılı ticaret yapıyor.
        Osmanlı onu "Hoşgeldin" olarak görüyor.

TUR 11: Ali, Venedik kahvehanesinde fısıldıyor:
        "Beren Osmanlı casusu."
        Maliyet: 10 altın. Risk: sıfır (kimse Ali'nin yaptığını bilmez).

TUR 12: Söylenti Venedik'te yayılıyor.
        Venedik, Beren'i "Nötr"den "İstenmeyen"e düşürüyor.

TUR 13: Söylenti Cenova'ya ve Ragusa'ya ulaşıyor.
        Beren, Hristiyan limanlarında sorun yaşamaya başlıyor.

TUR 14: Beren kahvehanede duyuyor: "Senin Osmanlı casusu olduğun söyleniyor."
        Beren: "NE?! Kim yaydı bunu?!"
        → Beren şimdi 2-3 tur harcayıp söylentiyi çürütmek zorunda
        → Bu sürede ticaret yapamaz, para kazanamaz
        → Ali bu arada rahatça İstanbul rotasını devralır

SONUÇ: Ali tek bir fısıltıyla, kılıç çekmeden,
       Beren'i 3-4 tur boyunca saf dışı bıraktı.
```

### Söylenti Savunması — Yalanlama

Hakkında kötü söylenti duyan oyuncu ne yapar?

```
SEÇENEKLERİ:

  1. YALANLA (kahvehanede "Yalanlat" seçeneği)
     → Söylentiyi çürütmeye çalışırsın
     → Başarı: DİVAN deneyimine bağlı
       - DİVAN ağırlığı yüksek: %70 çürütme başarısı
       - DİVAN ağırlığı düşük: %30 başarı
     → Başarılı: söylenti o limanda ölür, sen "masum" çıkarsın
     → Başarısız: "inkâr etmesi daha da şüpheli" etkisi
       → söylenti GÜÇLENIR

  2. KAYNAĞI BUL (kahvehanede "Sorguya çek" seçeneği)
     → Söylentiyi kimin yaydığını araştırırsın
     → Başarı: GÖLGE deneyimine bağlı
       - GÖLGE ağırlığı yüksek: %60 bulma şansı
       - GÖLGE ağırlığı düşük: %20 bulma şansı
     → Başarılı: kaynağı öğrenirsin → karşı saldırı, ifşa veya şantaj
     → Başarısız: birşey bulamazsın

  3. YOKSAY
     → Hiçbir şey yapma. Söylenti doğal yayılma hızıyla ilerler.
     → Bazen en iyi strateji: tepki vermemek
     → Bazı söylentiler 5-8 tur sonra kendiliğinden unutulur
     → Ama bazıları kalıcı ünlere dönüşür

  4. KARŞI SÖYLENTI
     → Kaynağı bilmesen bile, saldırganı TAHMİN edip
        ona karşı söylenti yayabilirsin
     → Riskli: yanlış kişiyi hedef alırsan iki düşman kazanırsın
     → Ama doğru kişiyi bulursan: karşılıklı söylenti savaşı başlar
```

---

# EKONOMİK SALDIRI: SESSİZ YIKIM

Fiziksel saldırı gerektirmeyen ekonomik hasar yöntemleri:

## Fiyat Sabotajı

```
NASIL ÇALIŞIR:
  → Rakibinin gittiği limanı BİLİYORSAN
  → Ondan önce o limana varıp aynı malı satarsın
  → Fiyat düşer → rakibin kârı erir

ÖRNEK:
  Ali biliyor ki Beren İskenderiye'ye baharat satmaya gidiyor.
  Ali, Beren'den bir tur önce İskenderiye'ye varıp baharatını satar.
  Fiyat düşer. Beren geldiğinde beklediği kârı bulamaz.

GEREKLİ OLAN: Bilgi. Rakibinin nereye gittiğini bilmek.
  → Kahvehane fısıltılarından
  → Başka oyuncudan (bilgi ticareti)
  → Söylentilerden ("Beren İskenderiye'ye gidiyormuş")
```

## Stok Ablukası

```
NASIL ÇALIŞIR:
  → Bir limandaki kritik malı tamamen satın alırsın
  → Rakibin o malı almasını engellersin
  → Çok sermaye gerektirir ama fiziksel risk sıfır

ÖRNEK:
  Can, Venedik'te tüm cam stokunu satın alır (400 altın).
  Deniz Venedik'e gelip cam almak istiyor ama stok boş.
  Can, camı Deniz'e 2 katı fiyata teklif eder.
  Deniz ya kabul eder ya boş döner.
```

## Rota Korkutması

```
NASIL ÇALIŞIR:
  → Belirli bir rotada korsan olduğu SÖYLENTİSİNİ yayarsın
  → O rotadan kimse geçmek istemez
  → Sen o rotayı TEK BAŞINA kullanırsın

ÖRNEK:
  Ali, batı rotasında "kanlı korsan saldırısı" söylentisi yayar.
  Diğer oyuncular batı rotasından kaçınır.
  Ali, batı rotasını tek başına kullanıp Marsilya'da tekel kurar.
  Aslında hiç korsan yok — tamamen blöf.

RİSK:
  → Birisi o rotaya girip korsan olmadığını görürse
  → "Ali sahte söylenti yaymış" ifşa olur
  → Ali'nin tüm söylentilerine güven düşer
```

---

# SESSİZ GEÇİŞ: SALDIRMAMANIN GÜCÜ

"Sessiz geç" niyetinin stratejik değeri:

## Borç Yaratma

```
SENARYO:
  Yolda Can'la karşılaşıyorsun. Sen "avlanma" niyetiyle çıkmıştın.
  Can'ı yenebilirsin — gemisi zayıf, kargın yok kaybedecek.
  AMA: saldırmıyorsun. Sessizce geçiyorsun.

  Can BUNU BİLİYOR. Seni gördü, saldırmadığını gördü.
  Artık sana borçlu hissediyor — hayatını bağışladın.

  Gelecekte: "Can, o gün seni rahat bıraktım. Şimdi bana
  İskenderiye'deki bilgiyi ver." → Can hayır diyemez.
```

## Gizlilik Koruma

```
SENARYO:
  Yasak kargo taşıyorsun. Yolda donanma devriyesiyle karşılaşıyorsun.
  "Sessiz geç" niyetindesin — donanma seni GÖRMEZ
  (normal rota + sessiz geç = düşük görünürlük).

  "Ticaret" niyetinde olsaydın: donanma seni durdurur, kontrol eder.
  "Avlanma" niyetinde olsaydın: donanma seni düşman olarak görür.
  "Sessiz geç": gölgede kalırsın.
```

## Bilgi Toplama

```
SENARYO:
  Yolda iki oyuncunun konvoyunu görüyorsun.
  "Sessiz geç" seçtiğin için onlar seni GÖRMEYEBİLİR
  (GÖLGE deneyimine bağlı).

  Ama sen ONLARI görürsün:
  → Kim kimle konvoy kurmuş (ittifak bilgisi)
  → Hangi yöne gidiyorlar (rota bilgisi)
  → Ne kadar kargo taşıyorlar (ticaret bilgisi)

  Bu bilgiyi:
  → Kendine saklarsın (stratejik avantaj)
  → Başkasına satarsın (altın)
  → Şehir devletine söylersin (iyilik borcu)
```

---

# SALDIRMAMANIN MEKANİK ETKİSİ

"Sessiz geç" seçmek DİVAN ve GÖLGE havuzuna katkı sağlar:

```
Sessiz geç + birini gördün ama saldırmadın   → DİVAN +1 (diplomatik karar)
Sessiz geç + birini gördün ve gözlemlerin     → GÖLGE +1 (istihbarat)
Sessiz geç + donanmayı atlattın               → GÖLGE +2 (kaçınma ustası)
Sessiz geç + kimseyle karşılaşmadın           → etkisi yok (sıradan yolculuk)
```

Bu, SALDIRMAYAN oyuncunun da gelişmesini sağlar. Pasifist tüccar DİVAN ve GÖLGE havuzunda derinleşir. Zamanla: kahvehanede daha iyi bilgi duyar, söylentileri daha iyi yönetir, gizli operasyonlarda ustalaşır. Kılıç çekmeden en tehlikeli oyuncu olabilir.

---

# ENTEGRE SENARYO: ÜÇ SALDIRI TÜRÜNÜ KOMBINE ETMEK

```
HEDEF: Beren'i İstanbul ticaret rotasından kovmak.
SALDIRGAN: Ali.

ADIM 1 — SOSYAL (Tur 10):
  Ali, Venedik kahvehanesinde fısıldıyor:
  "Beren Osmanlı casusu."
  → Söylenti yayılmaya başlar. Hristiyan limanlar Beren'den şüphelenir.

ADIM 2 — EKONOMİK (Tur 11):
  Ali, İstanbul'a Beren'den önce varıp ipek stokunu satın alır.
  → Beren İstanbul'a geldiğinde ipek bulamaz. Boş dönmek zorunda.

ADIM 3 — BEKLEME (Tur 12):
  Ali saldırmıyor. Sessiz geçiyor. Beren'in zayıflamasını izliyor.
  → Beren'in parası azalıyor (boş tur), itibarı düşüyor (söylenti).

ADIM 4 — FİZİKSEL (Tur 13, opsiyonel):
  Beren zayıflamış durumda. Ali İSTERSE saldırabilir.
  Ama belki gerek yok — Beren zaten rotayı bırakıyor.

SONUÇ:
  Ali, 3 turda Beren'i İstanbul rotasından kovdu.
  Kullandığı: 10 altın (söylenti) + 300 altın (stok satın alma) + sabır.
  Fiziksel saldırı: SIFIR. Gemi hasarı: SIFIR. Risk: MİNİMUM.
  Beren ne olduğunu bile tam anlamadı.
```

---

# REVİZE EDİLMİŞ EMİR FORMU

```
┌─ EMİR ──────────────────────────────────────────┐
│                                                   │
│  NEREYE?     [liman seç — haritadan tıkla]        │
│                                                   │
│  NASIL?      ○ Normal rota                        │
│              ○ Kıyıdan (yavaş ama güvenli)        │
│              ○ Açık deniz (hızlı ama riskli)      │
│                                                   │
│  NİYET?      ○ Ticaret                            │
│                (limanda al/sat, yolda muhatap ol)  │
│              ○ Avlanma                             │
│                (yolda rastladığına saldır)          │
│              ○ Keşif                               │
│                (bilgi topla, kimseyle muhatap olma) │
│              ○ Sessiz geç                          │
│                (görünmez kal, gözlemle, karışma)    │
│                                                   │
└───────────────────────────────────────────────────┘
```

**4 niyet × 3 rota = 12 kombinasyon.** Her biri farklı strateji:

```
Normal + Ticaret     = standart tüccar yolculuğu
Normal + Avlanma     = korsan, herkes görür
Normal + Keşif       = bilgi toplayıcı
Normal + Sessiz geç  = dikkat çekmeyen yolculuk

Kıyı + Ticaret       = güvenli ama yavaş ticaret
Kıyı + Avlanma       = kıyı korsanı (küçük avlar)
Kıyı + Keşif         = kıyı istihbaratı
Kıyı + Sessiz geç    = hayalet (neredeyse görünmez)

Açık deniz + Ticaret  = hızlı ama riskli ticaret
Açık deniz + Avlanma  = açık deniz korsanı (büyük avlar, büyük risk)
Açık deniz + Keşif    = uzak keşif
Açık deniz + Sessiz   = hızlı ve gizli geçiş (en zor ama en güçlü)
```

---

# ÇATIŞMA KARARLARI: HER ZAMAN İKİLEM

Oyunun her çatışma anında oyuncuyu ikilemde bırakan yapısı:

```
BİRİNİ GÖRDÜN, NE YAPIYORSUN?

  SALDIRMAK:
    ✓ Kargo çalarsın
    ✓ Rakibi zayıflatırsın
    ✗ Sen de hasar alabilirsin
    ✗ "Saldırgan" söylentisi yayılır
    ✗ Hedef intikam planlar
    ✗ Şehir devletleri olumsuz bakar

  SALDIRMAMAK:
    ✓ Risk yok
    ✓ Hedef sana borçlu hisseder
    ✓ "Barışçıl" itibarın korunur
    ✓ Bilgi toplarsın (kimi gördün, nereye gidiyor)
    ✗ Kargo çalamazsın
    ✗ Rakip güçlenmeye devam eder
    ✗ Fırsat kaçırırsın

  DEDİKODU İLE SALDIRMAK (sonra, limanda):
    ✓ Fiziksel risk yok
    ✓ Kaynağı gizli kalabilir
    ✓ Hedefin TÜM ilişkilerini etkiler
    ✗ Yavaş (2-3 tur)
    ✗ Çürütülebilir
    ✗ Yanlış hedef seçersen sana döner
    ✗ Doğrudan kargo kazancı yok
```

**Hiçbir seçenek net olarak "doğru" değil.** Her biri farklı şeyi feda eder. Bu, oyunun kalbi — her karar bir ikilem, her ikilem bir hikaye.

---

*"Akdeniz'de en tehlikeli silah kılıç değil, fısıltıdır. Kılıç bir gemiyi batırır. Fısıltı bir imparatorluğu batırır."*
