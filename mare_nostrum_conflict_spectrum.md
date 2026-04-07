> 🔧 **WIP / ÇALIŞMA DOKÜMANI** — Bu doküman modüler bir çalışma parçasıdır. Güncel konsolide versiyon için → `mare_nostrum_master_v3.md` dosyasına bakınız.

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
NİYET?  ○ Kervan     → limanda al/sat
        ○ Kara Bayrak → yolda rastladığına saldır
        ○ Pusula     → bilgi topla, kimseyle muhatap olma
        ○ Duman      → yolda kimseyle muhatap olma, dikkat çekme
```

Dördüncü seçenek eklendi: **Duman.** Bu "saldırmama" kararı. Yolda birini görsen bile görmezden gel. Neden önemli? Çünkü bazen EN GÜÇLÜ hamle, hiçbir şey yapmamaktır. Korsanın yanından sessizce geçip raporlamaman, onu borçlu kılar. Rakibini görüp saldırmaman, güven inşa eder. Veya donanma devriyesinin önünde masum görünmen, gizli kargonun güvende kalmasını sağlar.

---

# ÇATIŞMA SPEKTRUMU

Çatışma artık üç katmanlı:

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
│  ← ANLIK              YAVAS →                        │
└─────────────────────────────────────────────────────┘
```

Demir saldırısı gürültülü, riskli ama anlık sonuç verir. Zehir saldırısı sessiz, güvenli ama yavaş işler. Kuşatma saldırısı ikisinin ortası. **Ve birbirini beslerler** — en yıkıcı strateji üçünü kombine eder.

---

# ZEHİR SALDIRISI: DEDİKODU SAVAŞI

## Kahvehanede Yapılabilecekler (Genişletilmiş)

Eski tasarımda kahvehane "bilgi al" yeriydi. Artık kahvehane aynı zamanda **SİLAH FABRİKASI:**

```
┌─ KAHVEHANE ──────────────────────────────────────┐
│                                                    │
│  [Kahve Falı]     → pasif bilgi toplama          │
│  [Rüzgâr Ek]          → söylenti yay                 │
│  [Ateşe Su]         → hakkındaki söylentiyi çürüt  │
│  [İzi Sürmek]      → bir söylentinin kaynağını    │
│                       araştır                      │
│                                                    │
└────────────────────────────────────────────────────┘
```

### Rüzgâr Ek (Söylenti Yayma) — Detaylı

Oyuncu kahvehanede bir söylenti başlatır. Serbest metin değil, şablon seçimi:

```
┌─ RÜZGÂR EK ──────────────────────────────────────────┐
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
│  MALİYET: 25 altın (kahvehanede birileriyle içersin) │
│                                                      │
│  TEKRARLAYAN SÖYLENTİ CEZASI: Aynı oyuncu 5 tur    │
│  içinde 3+ söylenti yayarsa, kahvehanedeki NPC'ler   │
│  "Bu adam çok fısıldıyor" diye kendi hakkında         │
│  söylenti üretir                                      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Söylenti şablon bazlı çünkü:** Serbest metin LLM gerektir, yavaşlatır ve tutarsızlık riski yaratır. Şablon hızlı, net ve mekanik sonucu önceden tanımlı.

### Söylentinin Etkisi (Demir Saldırısıyla Karşılaştırma)

```
DEMİR SALDIRISI:                  SÖYLENTİ SALDIRISI:
  → Anlık sonuç                       → 2-3 tur sonra tam etki
  → Kargo çalarsın                    → Kargo çalamazsın
  → Sen de hasar alabilirsin          → Sana doğrudan risk yok
  → Herkes bilir (savaş söylentisi)   → Kaynağı gizli kalabilir
  → Hedef seni tanır                  → Hedef kimin yaptığını bilemeyebilir
  → 1 kişiye etki eder               → Hedefin TÜM ilişkilerini etkiler
```

## Şablon Bazlı Söylenti Çarpıtması

Söylenti yayıldıkça çarpıtılır — ama LLM'e bırakmak yerine ŞABLON BAZLI:

```
HER SÖYLENTİ TİPİNİN İKİ VERSİYONU:
  "Büyük savaş kazandı"  → sevende "kahraman"   / sevmeyende "saldırgan"
  "Çok ticaret yaptı"    → sevende "zengin tüccar" / sevmeyende "piyasa manipülatörü"
  "İhanet etti"           → sevende "stratejist"  / sevmeyende "hain"
  "Kaçakçılık yaptı"     → sevende "cesur"       / sevmeyende "suçlu"
  "Cömertlik gösterdi"   → sevende "aziz"        / sevmeyende "gösteriş"

Bu, tutarlılığı garanti eder ve LLM hata riskini azaltır.
Söylenti her yeni limana ulaştığında, o limanın ilişki durumuna
göre uygun versiyon seçilir.
```

## Söylenti Ömrü Kuralları

```
KÜÇÜK SÖYLENTİ (ticaret, sıradan karşılaşma):     3-4 tur ömür
ORTA SÖYLENTİ (savaş, kaçakçılık):                 5-6 tur ömür
BÜYÜK SÖYLENTİ (ihanet, büyük hazine, mega event): 8-10 tur ömür
KALICI SÖYLENTİ: Sadece 3+ aynı tipteki söylenti birikirse
                  "ün"e dönüşür → kalıcı

Söylenti ömrünü etkileyen faktörler:
  → Yayılma genişliği arttıkça ömür uzar
  → Çarpıtma çok fazlaysa ömür kısalır
  → Söylenti sahibi aktif olarak çürütürse ömür kısalır
```

**Somut örnek — Söylenti saldırısının gücü:**

```
TUR 10: Beren, İstanbul'da başarılı ticaret yapıyor.
        Osmanlı onu "Tanıdık Yüz" olarak görüyor.

TUR 11: Ali, Venedik kahvehanesinde fısıldıyor:
        "Beren Osmanlı casusu."
        Maliyet: 10 altın. Risk: sıfır (kimse Ali'nin yaptığını bilmez).

TUR 12: Söylenti Venedik'te yayılıyor.
        Venedik, Beren'i "Yabancı"dan "Kem Göz"e düşürüyor.

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

  1. YALANLA (kahvehanede "Ateşe Su" seçeneği)
     → Söylentiyi çürütmeye çalışırsın
     → Başarı: Mürekkep deneyimine bağlı
       - Mürekkep ağırlığı yüksek: %70 çürütme başarısı
       - Mürekkep ağırlığı düşük: %30 başarı
     → Başarılı: söylenti o limanda ölür, sen "masum" çıkarsın
     → Başarısız: "inkâr etmesi daha da şüpheli" etkisi
       → söylenti GÜÇLENIR

  2. KAYNAĞI BUL (kahvehanede "İzi Sürmek" seçeneği)
     → Söylentiyi kimin yaydığını araştırırsın
     → Başarı: Simsar deneyimine bağlı
       - Simsar ağırlığı yüksek: %60 bulma şansı
       - Simsar ağırlığı düşük: %20 bulma şansı
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

# KUŞATMA SALDIRISI: SESSİZ YIKIM

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

## Küçük Ölçekli Kuşatma Opsiyonları

Kuşatma saldırısı çok sermaye gerektirdiği için (400+ altın), oyunun her aşamasında erişilebilir olması için küçük ölçekli seçenekler:

```
"KISA STOK":
  → Tüm stoku değil, stokun %50'sini satın al
  → Daha ucuz (200 altın) ama etkisi kısmi
  → Rakip malı bulabilir ama fiyatı yükselmiş olur

"BİLGİ BLOKAJI":
  → Bir limanın piyasa bilgisini manipüle et
  → Kahvehanede yanlış fısıltı yaydır (piyasa söylentisi)
  → Maliyet düşük (25 altın) ama etki dolaylı
  → Oyuncuları yanlış limanlara yönlendirir
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

# DUMAN: SALDIRMAMANIN GÜCÜ

"Duman" niyetinin stratejik değeri:

## Borç Yaratma

```
SENARYO:
  Yolda Can'la karşılaşıyorsun. Sen "Kara Bayrak" niyetiyle çıkmıştın.
  Can'ı yenebilirsin — gemisi zayıf, kargın yok kaybedecek.
  AMA: saldırmıyorsun. Sessizce geçiyorsun.

  Can BUNU BİLİYOR. Seni gördü, saldırmadığını gördü.
  Artık sana borçlu hissediyor — hayatını bağışladın.

  Gelecekte: "Can, o gün seni rahat bıraktım. Şimdi bana
  İskenderiye'deki bilgiyi ver." → Can hayır diyemez.
```

BORÇ MEKANİĞİ (Singleplayer ve Multiplayer farkı):

  SINGLEPLAYER:
  → NPC'lere bir "borç sayacı" eklenir
  → Oyuncu bir NPC'ye iyilik yaptığında (saldırmadı, bilgi paylaştı,
    yardım etti) NPC'nin borç sayacı +1 artar
  → Borç 3+ olduğunda: NPC iyilik yapma eğilimi gösterir
    (indirimli bilgi, konvoy teklifi, savaşta taraf değiştirme)

  MULTIPLAYER:
  → Duman'ın "gördüğün ama saldırmadığın" durumu, hedef oyuncuya
    OTOMATİK BİLDİRİM olarak gider:
    "Yolda [oyuncu adı] seni gördü ama saldırmadı."
  → Bu, borç duygusunu mekanik olarak tetikler
  → Kararın sonucu oyuncuların sosyal etkileşimine bırakılır

## Gizlilik Koruma

```
SENARYO:
  Yasak kargo taşıyorsun. Yolda donanma devriyesiyle karşılaşıyorsun.
  "Duman" niyetindesin — donanma seni GÖRMEZ
  (Tramontana + Duman = düşük görünürlük).

  "Kervan" niyetinde olsaydın: donanma seni durdurur, kontrol eder.
  "Kara Bayrak" niyetinde olsaydın: donanma seni düşman olarak görür.
  "Duman": gölgede kalırsın.
```

## Bilgi Toplama

```
SENARYO:
  Yolda iki oyuncunun konvoyunu görüyorsun.
  "Duman" seçtiğin için onlar seni GÖRMEYEBİLİR
  (Simsar deneyimine bağlı).

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

"Duman" seçmek Mürekkep ve Simsar havuzuna katkı sağlar:

```
Duman + birini gördün ama saldırmadın   → Mürekkep +1 (diplomatik karar)
Duman + birini gördün ve gözlemlerin     → Simsar +1 (istihbarat)
Duman + donanmayı atlattın               → Simsar +2 (kaçınma ustası)
Duman + kimseyle karşılaşmadın           → etkisi yok (sıradan yolculuk)
```

Bu, SALDIRMAYAN oyuncunun da gelişmesini sağlar. Pasifist tüccar Mürekkep ve Simsar havuzunda derinleşir. Zamanla: kahvehanede daha iyi bilgi duyar, söylentileri daha iyi yönetir, gizli operasyonlarda ustalaşır. Kılıç çekmeden en tehlikeli oyuncu olabilir.

---

## İttifak Bulaşması — Risk Bazlı Sistem

Eski: Bir güçle Tanıdık Yüz olursan, düşmanlarıyla OTOMATİK her 3 turda 1 kademe düşüş.
Yeni: Düşman güçle otomatik düşmek yerine, SÖYLENTI MEKANİZMASIYLA bağlantılı:

```
NASIL ÇALIŞIR:
  → "Osmanlı dostu" söylentisi Venedik'te YAYILINCA etkili olur
  → Söylenti yayılmazsa: etkisi yok (aktif diplomasiyle önlenebilir)
  → Oyuncuya aktif karar verme şansı tanır:
    - Söylentiyi bastırma (Ateşe Su)
    - Çift taraflı diplomasi (her iki güce de iyilik yapma)
    - Karşı söylenti yayma (diğer güce de sadık görünme)
  → Bu, "sürekli otomatik ilişki tamiri" yerine stratejik
    söylenti yönetimi gerektirir
```

---

# ENTEGRE SENARYO: ÜÇ SALDIRI TÜRÜNÜ KOMBINE ETMEK

```
HEDEF: Beren'i İstanbul ticaret rotasından kovmak.
SALDIRGAN: Ali.

ADIM 1 — ZEHİR (Tur 10):
  Ali, Venedik kahvehanesinde fısıldıyor:
  "Beren Osmanlı casusu."
  → Söylenti yayılmaya başlar. Hristiyan limanlar Beren'den şüphelenir.

ADIM 2 — KUŞATMA (Tur 11):
  Ali, İstanbul'a Beren'den önce varıp ipek stokunu satın alır.
  → Beren İstanbul'a geldiğinde ipek bulamaz. Boş dönmek zorunda.

ADIM 3 — BEKLEME (Tur 12):
  Ali saldırmıyor. Duman seçiyor. Beren'in zayıflamasını izliyor.
  → Beren'in parası azalıyor (boş tur), itibarı düşüyor (söylenti).

ADIM 4 — DEMİR (Tur 13, opsiyonel):
  Beren zayıflamış durumda. Ali İSTERSE saldırabilir.
  Ama belki gerek yok — Beren zaten rotayı bırakıyor.

SONUÇ:
  Ali, 3 turda Beren'i İstanbul rotasından kovdu.
  Kullandığı: 10 altın (söylenti) + 300 altın (stok satın alma) + sabır.
  Demir saldırısı: SIFIR. Gemi hasarı: SIFIR. Risk: MİNİMUM.
  Beren ne olduğunu bile tam anlamadı.
```

---

# REVİZE EDİLMİŞ EMİR FORMU

```
┌─ EMİR ──────────────────────────────────────────┐
│                                                   │
│  NEREYE?     [liman seç — haritadan tıkla]        │
│                                                   │
│  NASIL?      ○ Tramontana                        │
│              ○ Kabotaj (yavaş ama güvenli)        │
│              ○ Fortuna (hızlı ama riskli)      │
│                                                   │
│  NİYET?      ○ Kervan                             │
│                (limanda al/sat, yolda muhatap ol)  │
│              ○ Kara Bayrak                            │
│                (yolda rastladığına saldır)          │
│              ○ Pusula                              │
│                (bilgi topla, kimseyle muhatap olma) │
│              ○ Duman                               │
│                (görünmez kal, gözlemle, karışma)    │
│                                                   │
└───────────────────────────────────────────────────┘
```

**4 niyet × 3 rota = 12 kombinasyon.** Her biri farklı strateji:

```
Tramontana + Kervan     = standart tüccar yolculuğu
Tramontana + Kara Bayrak     = korsan, herkes görür
Tramontana + Pusula       = bilgi toplayıcı
Tramontana + Duman  = dikkat çekmeyen yolculuk

Kabotaj + Kervan       = güvenli ama yavaş ticaret
Kabotaj + Kara Bayrak       = kıyı korsanı (küçük avlar)
Kabotaj + Pusula         = kıyı istihbaratı
Kabotaj + Duman    = hayalet (neredeyse görünmez)

Fortuna + Kervan  = hızlı ama riskli ticaret
Fortuna + Kara Bayrak  = açık deniz korsanı (büyük avlar, büyük risk)
Fortuna + Pusula    = uzak keşif
Fortuna + Duman   = hızlı ve gizli geçiş (en zor ama en güçlü)
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
