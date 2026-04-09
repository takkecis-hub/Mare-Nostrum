> 🔧 **WIP / ÇALIŞMA DOKÜMANI** — Bu doküman modüler bir çalışma parçasıdır. Güncel konsolide versiyon için → `mare_nostrum_master_v3.md` dosyasına bakınız.

---

# MARE NOSTRUM — Ekonomi Derinleştirme
## Terazi'nin Gördüğü Dünya

> **Uygulama Notu (Güncel):** Aşağıdaki temel mekaniklerin engine uygulaması tamamlanmıştır:
> - ✅ **Menşe sistemi** — Her limanın ürettiği/arzuladığı özel mallar (`ports.json`, `goods.json`)
> - ✅ **Fiyat bant sistemi** — ucuz (30₳), normal (40₳), pahali (50₳) alış maliyeti + satış çarpanı (`purchaseCostForGood`, `basePriceMultiplier`)
> - ✅ **Port doyma mekaniği** — Her teslimat fiyatı %15 düşürür, min %40, 3 turda 1 çürüme (`saturationMultiplier`)
> - ✅ **Mevsim etkisi** — Yaz: yemek ×0.85 / lüks ×1.2, Kış: yemek ×1.3 / lüks ×0.85 (`seasonMultiplier`)
> - ✅ **Kabotaj bonusu** — 2 turda teslim edilen mallarda ×1.25 satış bonusu (`KABOTAJ_TRADE_BONUS`)
> - ✅ **priceIndicator farklılaşması** — Yemek=1, Lüks=2-3, Savaş=2-3 (`goods.json`)
> - ⬜ Kaçak mal, Commenda, Kontratlar, İlk gelen bonusu, Ragusa transit vergisi — henüz uygulanmadı

---

# SORUN TEŞHİSİ

Mevcut ekonomi: 3 kategori (Yemek, Lüks, Savaş), ok bazlı fiyat trendleri (↑↓→). Sorun: 5 turdan sonra herkes "İskenderiye'den lüks al, Marsilya'ya sat" formülünü çözüyor. Optimal rota sabit, karar yok, ikilem yok, ticaret sıkıcı.

**Hedef:** Ticareti, savaş kadar heyecanlı ve diplomasi kadar sosyal yapmak — ama hâlâ spreadsheet'siz.

---

# ÇÖZÜM: MENŞE SİSTEMİ — "Nereden Geldiği Önemli"

## Temel Fikir

3 kategori kalıyor (Yemek, Lüks, Savaş). Ama artık her liman belirli bir malın MENŞE kaynağı. Aynı kategorideki mallar farklı değerde — çünkü nereden geldiğine göre fiyatı değişiyor.

```
LÜKS kategorisi:
  İskenderiye'den aldığın lüks = "Mısır Baharatı"
  Venedik'ten aldığın lüks = "Murano Camı"
  İstanbul'dan aldığın lüks = "Doğu İpeği"
  Cenova'dan aldığın lüks = "Ligurya Mercanı"
  Trablus'tan aldığın lüks = "Sahra Altını"

Hepsi "Lüks" ama Mısır Baharatı Marsilya'da ÇOK değerli,
Venedik'te ORTA değerli (çünkü zaten bol).
Murano Camı İstanbul'da ÇOK değerli, Cenova'da DÜŞÜK değerli
(çünkü rakip mal).
```

## Oyuncuya Nasıl Görünüyor

Pazar ekranı artık şöyle:

```
┌─ VENEDİK PAZARI ───────────────────────────────────────┐
│                                                         │
│  KARGONDA:                                              │
│    Mısır Baharatı ×8   [Lüks]                           │
│      burada: ●●●○○ (orta değer)                         │
│      ▲ Marsilya'da çok değerli diye söylentiler var      │
│                                                         │
│  ALINABİLİR:                                            │
│    Murano Camı  [Lüks]  ●●○○○ (ucuz — bol stok)        │
│    Adriyatik Tuzu [Yemek] ●●●○○ (normal)               │
│                                                         │
│  Altın: 840    Kargo boşluk: 7                          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Dikkat:** Rakam yok. Beş nokta sistemi: ●●●●● = çok pahalı, ●○○○○ = çok ucuz. Kesin fiyat göremiyorsun — sadece "ucuz mu pahalı mı" hissiyatını alıyorsun. Terazi deneyimi yükseldikçe noktaların yanında ipuçları belirir.

## Neden Çalışıyor

**İkilem yaratıyor:** Venedik'te Murano Camı ucuz ama nereye satacaksın? İstanbul'da değerli ama Ege Kapısı darboğazından geçmen lazım. Cenova'da yakın ama orada zaten cam var, fiyat düşük. Cezayir'de belki iyi fiyat alırsın ama yol uzun ve korsan riski var. HER SATIŞ BİR İKİLEM.

**Sabit rota sorunu çözülüyor:** "Her zaman İskenderiye → Marsilya" artık çalışmıyor çünkü herkes aynı şeyi yaparsa Marsilya'da baharat bollaşır ve fiyat düşer. Ama Murano Camı alıp İstanbul'a götüren oyuncu başka bir şey deniyor. Yollar çeşitlenir.

**Bilgi asimetrisi artıyor:** "Marsilya'da baharat çok değerli" — ama bu hâlâ doğru mu? Geçen tur 3 oyuncu baharat götürdüyse artık değerli değil. Bunu ancak kahvehanede duyarsın veya başka oyuncudan öğrenirsin.

---

# MENŞE TABLOSU

Her limanın ürettiği ve özellikle talep ettiği menşe mallar:

```
LİMAN          ÜRETİR (ucuz al)              ARZULAR (pahalı sat)
─────────────────────────────────────────────────────────────────
Barselona      Katalan Demiri [Savaş]         Doğu İpeği [Lüks]
Marsilya       Provence Şarabı [Yemek]        Mısır Baharatı [Lüks]
Cenova         Ligurya Mercanı [Lüks]         Sicilya Buğdayı [Yemek]
Venedik        Murano Camı [Lüks]             Lübnan Sediri [Savaş]
Palermo        Sicilya Buğdayı [Yemek]        Murano Camı [Lüks]
Ragusa         (üretmez — transit)            Her şey normal fiyat
Malta          Şövalye Zırhı [Savaş]         Sicilya Buğdayı [Yemek]
İstanbul       Doğu İpeği [Lüks]             Katalan Demiri [Savaş]
Girit          Girit Zeytinyağı [Yemek]       Doğu İpeği [Lüks]
Kıbrıs         Kıbrıs Tuzu [Yemek]           Mısır Baharatı [Lüks]
Beyrut         Halep Sabunu [Lüks], Lübnan Sediri [Savaş]   Katalan Demiri [Savaş]
İskenderiye    Mısır Baharatı [Lüks]          Lübnan Sediri [Savaş]
Trablus        Sahra Altını [Lüks]            Provence Şarabı [Yemek]
Tunus          Tunus Zeytinyağı [Yemek]       Ligurya Mercanı [Lüks]
Cezayir        Ganimet Silahı [Savaş]         Provence Şarabı [Yemek]
```

**Kural:** Bir limanın ürettiği malı o limanda satmak KÖTÜ fiyat. Bir limanın arzuladığı malı satmak ÇOK İYİ fiyat. Diğer mallar ORTA fiyat.

**Ragusa özel:** Ragusa hiçbir şey üretmez ama transit liman. Her şey normal fiyat — ne çok ucuz ne çok pahalı. Ragusa'nın değeri bilgi ve nötr statüsünde.

**Ragusa transit vergisi:** Ragusa'da alışveriş yapınca %10 ekstra vergi uygulanır. Nötr statünün bedeli. Çok fazla trafik olunca (3+ oyuncu aynı turda) Ragusa'nın nötr statüsü gerilim altına girer — event olarak taraf tutmaya başlayabilir.

---

# DİNAMİK FİYAT: NEDEN AYNI ROTA HEP ÇALIŞMAZ

## Doyma Mekaniği

```
HER LİMANIN HER MENŞE MAL İÇİN "AÇLIK" SEVİYESİ VAR:

  AÇ     → ●●●●● fiyat (çok pahalı — bu mal uzun süredir gelmemiş)
  NORMAL  → ●●●○○ fiyat (standart — düzenli geliyor)
  TOK     → ●○○○○ fiyat (ucuz — çok fazla gelmiş, stok dolu)

AÇLIK NASIL DEĞİŞİR:
  → Her tur hiçbir oyuncu o malı getirmezse: açlık +1 artar
  → Doyma hızı OYUNCU SAYISINA göre ölçeklenir:
    2 oyuncu: 1 getirirse -1, 2 getirirse -3
    4 oyuncu: 1 getirirse -1, 2 getirirse -2, 3+ getirirse DİBE
    6+ oyuncu: 1 getirirse -1, 2 getirirse -1, 3 getirirse -2, 4+ getirirse DİBE
  → Toparlanma hızı (kimse getirmezse açlık artışı) oyuncu sayısı arttıkça hızlanır

  Yani: 5 tur boyunca kimse Marsilya'ya baharat götürmezse,
  Marsilya baharata AÇ — fiyat tavan yapar.
  Ama bunu duyan 3 oyuncu aynı anda baharat götürürse,
  fiyat DİBE vurur — hepsi zarar eder.
```

**Bu, ticaretin SOSYAL oyun olmasını sağlıyor.** Kârlı rota = herkesin bildiği rota = kalabalık rota = kârsız rota. Gerçekten kâr etmek için ya kimsenin bilmediği açlığı bulmalısın (bilgi avantajı), ya da diğerlerini yanlış yöne yönlendirmelisin (söylenti silahı).

## Fiyat Görünürlüğü (Terazi Deneyimine Bağlı)

```
TERAZİ DÜŞÜK:
  Pazar ekranında sadece üretim/talep bilgisi görürsün:
    "Venedik cam üretir. İstanbul cam arzular."
  Ama güncel açlık seviyesini BİLEMEZSİN.
  Kahvehanede duyduklarına güvenmek zorundasın.

TERAZİ ORTA:
  Bulunduğun limandaki açlık seviyesini görürsün:
    "Venedik'te cam stoku: TOK"
    "Venedik'te baharat açlığı: AÇ"
  Ama uzak limanları hâlâ bilemezsin.

TERAZİ YÜKSEK:
  Bulunduğun limanda + komşu limanlarda açlık seviyesini görürsün.
  Ve kargondaki malın hedef limandaki TAHMİNİ değerini görürsün:
    "Mısır Baharatı → Marsilya'da muhtemelen ●●●●○"
    (ama garanti değil — birileri senden önce ulaşmış olabilir)

TERAZİ ÇOK YÜKSEK:
  Tüm limanların açlık durumunu bir haritada görürsün.
  "Piyasa haritası" açılır — hangi liman neye aç, neye tok.
  AMA: bu bilgi 1 tur ESKİ. Şu anki durumu yine bilemezsin.
  (Çünkü bu turda başka oyuncular da mal taşıyor.)
```

---

# DEDİKODU RÜZGÂRI VE EKONOMİ

## Söylenti Silahı Olarak Piyasa Bilgisi

Kahvehanede duyulan piyasa fısıltıları artık çok daha anlamlı:

```
"İstanbul'da ipek stoku tükendi, aç pazar"
  → Bu doğruysa: ipek götüren vurgun vurur
  → Bu yalansa: ipek götüren zarara girer
  → Kim söyledi? Neden söyledi?

"Marsilya'da baharat tavan yaptı"
  → Herkes Marsilya'ya koşar → fiyat çöker
  → Söylentiyi yayan oyuncu belki de Marsilya'ya GİTMİYOR
  → Herkesi Marsilya'ya yönlendirip kendisi İstanbul'a gidiyor
```

**Rüzgâr Ek (söylenti yayma) artık EKONOMİK SİLAH olarak da kullanılıyor:**

```
┌─ FISILDA (Piyasa) ─────────────────────────────────────┐
│                                                         │
│  NE SÖYLÜYORSUN?                                        │
│    ○ "[menşe mal] fiyatı [liman]'da fırladı"            │
│    ○ "[menşe mal] stoku [liman]'da tükendi"             │
│    ○ "[liman]'da ambargo/kıtlık var"                    │
│    ○ "[liman]'a büyük kervan geliyor, fiyat düşecek"   │
│                                                         │
│  MALİYET: 10 altın                                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Sahte Piyasa Söylentisinin Riski

Sahte piyasa söylentisi yaymak riskli: bir oyuncu o limana gidip söylentinin yalan olduğunu görürse, "şu oyuncu sahte piyasa bilgisi yayıyor" söylentisi doğar. Bu, Terazi itibarını yıkar — bir daha piyasa bilgisi paylaştığında kimse inanmaz.

Ama doğru piyasa bilgisi paylaşmak da riskli: bilgiyi paylaştığın oyuncu seninle aynı rotaya yönelir ve fiyatı düşürür. Bilgiyi SATMAK daha akıllıca — altın karşılığı.

---

# ÖZEL TİCARET MEKANİKLERİ

## 1. İlk Gelen Alır (Yarış Mekaniği)

```
KURAL: Aynı turda aynı limana aynı malı satan iki oyuncu varsa,
       HIZLI olan (Fortuna rotası veya daha yakın liman) daha iyi fiyat alır.
       İkinci gelen düşük fiyat alır.
       Üçüncü gelen dip fiyat alır.

NEDEN ÖNEMLİ: Bu, rota seçimini ilginç kılar.
  Fortuna (hızlı ama riskli) = ilk gelme şansı yüksek → iyi fiyat
  Kabotaj (yavaş ama güvenli) = geç gelme → fiyat düşmüş olabilir
  Tramontana (normal) = orta risk, orta fırsat

  Ve bu, bilgi asimetrisini ödüllendiriyor:
  Rakibinin nereye gittiğini biliyorsan, ondan ÖNCE varabileceğin
  bir rota seçersin. Veya farklı bir limana yönelirsin.

KARGO-BONUS DENGESİ:
  → İlk gelen bonusunun büyüklüğü kargo miktarına TERS orantılı
  → Az kargo getiren ilk gelen = küçük bonus (Feluka hız avantajını sınırlar)
  → Çok kargo getiren ilk gelen = büyük bonus (Karaka hacim avantajını ödüllendirir)
  → Bu, Feluka + Fortuna = "her zaman ilk gel" meta'sını kırar
```

## 2. Toplu Alım İndirimi

```
KURAL: Bir limandan ÇOK mal alırsan birim fiyat düşer.
       Az alırsan birim fiyat yüksek kalır.

  1-3 birim:  Normal fiyat
  4-7 birim:  %10 indirim
  8+ birim:   %20 indirim

NEDEN ÖNEMLİ: Büyük gemi (Karaka) avantaj kazanır — çok taşır,
  toplu alır, ucuza mal eder. Ama büyük kargo = büyük hedef.
  Korsanlar büyük gemileri sever.

  Küçük gemi (Feluka) az taşır ama hızlı ve çevik.
  Daha az kâr ama daha az risk.
```

## 3. Şehir Kontratları

```
LLM şehir yöneticisi ÖZEL KONTRAT teklif edebilir:

  "3 tur boyunca bize Katalan Demiri getirirsen,
   her birimi normal fiyatın %30 üstüne alırız.
   Ama 3 turda bir kez bile getirmezsen kontrat bozulur
   ve ceza olarak 100 altın ödersin."

MEKANİK:
  → Kontrat SABİT gelir garantisi — fiyat dalgalanmasından korunursun
  → AMA: o rotaya bağlanırsın, esnekliğini kaybedersin
  → Kontratı bozarsan: para cezası + itibar düşüşü
  → Kontratı tamamlarsan: bonus ödeme + "Mühürlü Söz" ününe katkı

TERAZİ ETKİSİ:
  → Terazi deneyimi yüksek oyuncuya daha iyi kontratlar teklif edilir
  → Terazi çok yüksekse: kontrat şartlarını MÜZAKİRE edebilirsin
    ("4 tur yerine 3 tur olsun" veya "fiyatı %40 üstü yapalım")
```

## 4. Kaçak Mal (Ambargo Ekonomisi)

```
BAZI MALLAR BAZI LİMANLARDA YASAK:

  Savaş malı → savaş döneminde düşman limana satmak YASAK
  Lüks mal → Haçlı döneminde Müslüman limana satmak GÜNAH
  Belirli menşe → Venedik malı Cenova'ya yasak (ticaret savaşı)

KAÇAK TİCARET:
  → Yasak malı satabilirsin ama KAÇAKÇILIK mekaniği devreye girer
  → Yakalanma riski: Simsar deneyimine bağlı
    Simsar düşük: %40 yakalanma
    Simsar yüksek: %3 yakalanma
  → Yakalanırsan: mal müsadere + para cezası + "Kem Göz" riski
    + 2 tur hapis (liman dışına çıkamama) + büyük para cezası (200 altın)
  → Yakalanmazsan: DEVASA kâr (yasak mal 2-3x normal fiyat)

AMBARGO EVENT'İ:
  → Savaş event'i ambargo tetikler
  → Ambargolu mallar yasal piyasadan çekilir → fiyat fırlar
  → Kaçakçılar altın çağ yaşar
  → Ama donanma devriyeleri de artar → yakalanma riski artar
```

## 5. Commenda — Netleştirilmiş Mekanik

```
COMMENDA NASIL ÇALIŞIR:

  1. ANLAŞMA: Yatırımcı ve tüccar bir limanda buluşur.
     Yatırımcı X altın verir. Kâr payı kararlaştırılır (serbest).

  2. YOLCULUK: Tüccar denize çıkar, mal alır, başka limanda satar.
     Yatırımcı limanda bekler.

  3. DÖNÜŞ: Tüccar aynı limana döner (veya mesaj yoluyla bildirir).
     Toplam kâr hesaplanır. Anlaşılan oranda bölüşülür.

  4. VEYA İHANET: Tüccar parayı alıp KAÇAR.
     → Otomatik söylenti: "[isim] ortağının parasını çaldı"
     → Yatırımcı tüm yatırımını kaybeder
     → Tüccar kısa vadede zenginleşir ama "Akrep" ünü yaklaşır

İHANET ZAMANA BAĞLI GÜÇLENME:
  → İlk ihanet: hafif söylenti (3 turda kaybolur)
  → İkinci ihanet: çok güçlü söylenti (6+ tur)
  → Üçüncü ihanet: kalıcı "Akrep" ünü
  → "Akrep" ünü commenda teklifini tamamen engellemez —
    ama çok kötü şartlarda gelir (yüksek faiz, düşük kâr payı)

COMMENDA'YI İLGİNÇ YAPAN:
  → Tüccar, yatırımcının parasıyla DAHA BÜYÜK ticaret yapabilir
    (toplu alım indirimi, daha pahalı mal, daha uzak rota)
  → Yatırımcı, kendi gemisi olmadan da PARA KAZANIR
  → Risk paylaşımı: tüccar battığında yatırımcı da kaybeder
  → Güven testi: commenda = "sana X altın veriyorum, geri getir"
    Bu, oyuncular arası ilişkinin EN SOMUT testi
```

---

# SEZONLARİN EKONOMİYE ETKİSİ

```
YAZ SEZONU:
  → Denizcilik sezonu — trafik yoğun, fiyatlar rekabetçi
  → Yemek ucuz (hasat dönemi)
  → Lüks talebi yüksek (saraylar festival yapıyor)
  → Karşılaşma olasılığı yüksek

KIŞ SEZONU:
  → Fırtına riski yüksek, trafik az
  → Yemek pahalı (stoklar azalıyor)
  → Lüks talebi düşük
  → Karşılaşma olasılığı düşük (kimse denize çıkmak istemiyor)
  → KIŞ CESARET ÖDÜLÜ: kışın denize çıkıp ticaret yapan
    oyuncu aç pazarlara ulaşır → yüksek kâr
    Ama fırtına riski... ikilem!
```

---

# PARA BİRİMİ — OLMAMASI GEREKEN DETAY

Eski tasarımda "döviz kuru" fikri vardı. ÇIKARILDI. Tek para birimi: Altın. Neden? Döviz kuru spreadsheet demek. Altın evrensel — basit, net, ikilem yaratmıyor.

Ama dönemsel ENFLASYON event'i olabilir:

```
EVENT: "YENİ DÜNYA GÜMÜŞÜ" (16. yy)
  → Tüm fiyatlar %30 artar (enflasyon)
  → Nakit tutan oyuncular değer kaybeder
  → Mal tutan oyuncular değer kazanır
  → 1 turluk kaos — sonra yeni normal

Bu, enflasyonu basit bir EVENT olarak ele alıyor, sürekli bir
mekanik olarak değil. Basit, vurucu, bir kere yaşanır.
```

---

# KÂR HESABI — OYUNCUYA NASIL GÖRÜNüYOR

Oyuncu asla detaylı kâr hesabı görmez. Gördüğü:

```
┌─ İSKENDERİYE'DE SATIŞ ────────────────────────┐
│                                                  │
│  Mısır Baharatı ×8 sattın                        │
│                                                  │
│  Pazar durumu: AÇ PAZAR! ●●●●●                  │
│  İlk gelen bonusu: evet!                         │
│                                                  │
│  Kazanç: 520 altın                               │
│  (aldığın fiyat: 180 altın)                      │
│                                                  │
│  NET KÂR: +340 altın ★★★ Mükemmel tur!          │
│                                                  │
│  Söylenti doğdu:                                 │
│  "İskenderiye'de büyük baharat satışı yapıldı"   │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Yıldız sistemi:** ★ = idare eder, ★★ = iyi, ★★★ = mükemmel, ★★★★ = efsanevi. Oyuncu detaylı marjin hesabı değil, HİS bazlı geri bildirim alıyor.

---

# EKONOMİNİN SOSYAL KATMANI

## Bilgi = Para

```
EN DEĞERLI KAYNAK MAL DEĞİL, BİLGİDİR:

  "İstanbul'da ipek stoku tükendi" = bu bilgi 100+ altın değerinde
  Çünkü bilen oyuncu ipek götürüp vurgun vurur.

  Bilgiyi SATMAK doğrudan ticaret kadar kârlı:
  → "Sana İstanbul piyasa bilgisi vereyim, 80 altın"
  → Alıcı bilgiyi kullanıp 300 altın kâr eder
  → İkisi de kazanır — ama alıcı bilgiye güvenmek zorunda

  VE BİLGİ BOZULUR:
  → Bilgi 1 tur geçerliliğini korur
  → 2. turda %50 hâlâ doğru
  → 3. turda muhtemelen eskimiş
  → Bu, sürekli taze bilgi ihtiyacı yaratır
```

## Piyasa Manipülasyonu

```
İLERİ STRATEJİ (Terazi + Mürekkep yüksek oyuncular için):

  STOK ABLUKASI:
  → Bir limandaki tüm üretimi satın al → rakipler o malı bulamaz
  → Maliyeti yüksek ama etkili

  FİYAT ÇÖKERTME:
  → Rakibinin hedef limanına aynı maldan bol götür → fiyat çöker
  → Sen zarar edersin ama rakip DAHA ÇOK zarar eder

  SAHTE TREND:
  → "İstanbul'da ipek çok pahalı" söylentisi yay
  → Herkes İstanbul'a koşar → sen boşalan İskenderiye'ye gidersin
  → Söylenti yalanlanırsa itibar kaybı

  AMBARGO FIRSATÇILIĞI:
  → Savaş event'inde ambargo ilan edilince yasak malı stokla
  → Kaçak olarak sat → 2-3x kâr
  → Yakalanma riski + söylenti riski
```

---

# TERAZİ DENEYİMİNİN TAM ETKİ TABLOSU

```
TERAZİ SEVİYE    OYUNCU NE HİSSEDER
──────────────────────────────────────────────────────────
%0-15            Pazar ekranında sadece kategori ve menşe görür.
(Deniz adamı)    Fiyat noktaları belirsiz (●??○○).
                 "Bu mal pahalı mı ucuz mu bilmiyorum."
                 Kahvehanede piyasa fısıltısı duyMAZ.

%16-30           Fiyat noktaları netleşir (●●●○○).
(Ara sıra         Bulunduğu limanda açlık durumunu görür.
 ticaret yapan)   "Burada baharat AÇ, burada cam TOK."
                  Kahvehanede 1 piyasa fısıltısı duyar.

%31-45           Komşu limanların açlık durumunu görür.
(Tüccar)         Kargodaki malın hedef limandaki TAHMİNİ değeri.
                 Toplu alım indirimi fark edilir hale gelir.
                 Kahvehanede 2 piyasa fısıltısı.
                 Şehir kontratı teklif edilir.

%46-60           Tüm limanların açlık haritası (1 tur eski).
(Usta Tüccar)    Sahte piyasa söylentilerini fark etme (%50 şans).
                 Kontrat şartlarını müzakere edebilir.
                 Kahvehanede 3 piyasa fısıltısı (biri gizli bilgi).

%61+             Piyasa haritası anlık (çok az gecikme).
(Altın Parmak)   Sahte piyasa söylentilerine neredeyse bağışık.
                 Toplu alım indirimi daha yüksek.
                 Şehirler en iyi kontratları sunar.
                 "Piyasa Fısıltısı": rakip oyuncunun son ticaret
                 detayını görürsün (ne sattı, nerede, ne kadara).
```

---

# ENTEGRE SENARYO: EKONOMİK SAVAŞ

```
DURUM: Ali (Altın Parmak ünlü, Terazi %55) vs Beren (Demir Pruva ünlü)
  İkisi de İstanbul-Venedik ipek rotasında çalışıyor.

TUR 12:
  Ali, Terazi deneyimi sayesinde görüyor:
  "Venedik'te Doğu İpeği açlığı: ÇOK AÇ (5 turda kimse getirmemiş)"
  Vurgun fırsatı!

  Ama Ali aynı zamanda Beren'in de İstanbul'da olduğunu biliyor
  (geçen tur İstanbul kahvehanesinde gördü).
  Beren de ipek alacak mı?

  ALİ'NİN SEÇENEKLERİ:

  A) HIZLI GİT: Fortuna rotasıyla (Venedik-İstanbul doğrudan)
     İlk gelen bonusu kazanır ama Fortuna riski (fırtına).

  B) BEREN'İ YANILT: Kahvehanede fısılda:
     "Duydum ki Cenova'da ipek çok pahalıymış"
     Beren Cenova'ya yönelirse Venedik Ali'nin olur.
     Ama Beren Terazi düşük — piyasa söylentisine inanır mı?

  C) BEREN'LE ANLAŞ: "Sen bu tur git, ben gelecek tur gideyim.
     Böylece ikimiz de iyi fiyat alırız."
     Ama Beren sözünde durur mu?

  D) FARKLI ROTA: Venedik yerine Marsilya'ya ipek götür.
     Marsilya'da ipek fiyatı belirsiz ama rekabet yok.

TUR 13: Ali Fortuna'yı seçti, Beren de Tramontana'yı seçti.
  İkisi de Venedik'e gidiyor!
  Ali Fortuna ile bir tur erken varır mı? %50 şans...
  → Ali şanslı — erken vardı! İlk gelen bonusu Ali'nin.
  → Beren de aynı turda varıyor ama "ikinci gelen" — fiyat düştü.

  SONUÇ:
  Ali: 8 ipek × AÇ pazar + ilk gelen = 480 altın ★★★★
  Beren: 6 ipek × DOYMUŞ pazar + ikinci gelen = 180 altın ★
  Beren öfkeli — ama Ali'nin hatası yok, sadece daha hızlıydı.

  AMA: "İstanbul'dan iki tüccar Venedik'e ipek getirdi" söylentisi yayılıyor.
  Gelecek tur Venedik'te ipek TOK olacak — Ali de Beren de başka yol bulmalı.
```

---

# ÖZET: ESKİ vs YENİ EKONOMİ

```
                    ESKİ                    YENİ
Mal çeşidi          3 kategori              3 kategori + menşe (15 mal)
Fiyat görünümü      ↑↓→ okları              ●●●○○ noktalar + açlık durumu
Sabit rota sorunu   Var (her zaman İsk→Mar)  Yok (doyma + ilk gelen + söylenti)
Bilgi değeri         Düşük                   Çok yüksek (bilgi = para)
Sosyal etkileşim    Düşük                   Yüksek (piyasa söylentisi, commenda)
Spreadsheet riski   Orta                    Düşük (noktalar, eski bilgi, belirsizlik)
Terazi etkisi       Zayıf                   Güçlü (her seviyede yeni görünürlük)
İkilem              Az                      Her satış bir ikilem
Korsan-tüccar       Ayrı dünyalar           İç içe (büyük kargo = büyük hedef)
Event etkisi        Yüzeysel               Derin (ambargo, enflasyon, kıtlık)
```

---

*"Terazi iki şeyi tartar: malın ağırlığını ve insanın açgözlülüğünü. Hangisi daha ağır basarsa, o kazanır."*
