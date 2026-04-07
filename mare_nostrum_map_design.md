> 🔧 **WIP / ÇALIŞMA DOKÜMANI** — Bu doküman modüler bir çalışma parçasıdır. Güncel konsolide versiyon için → `mare_nostrum_master_v3.md` dosyasına bakınız.

---

# MARE NOSTRUM — Harita Tasarımı
## Limanlar, Rotalar, Darboğazlar ve Bölgesel Dinamikler

---

# BÖLÜM 1: TASARIM PRENSİPLERİ

Harita, oyunun fiziksel iskeletidir. Kötü harita = kötü oyun. Harita tasarımının üç kanunu:

**Kanun 1: Herkes karşılaşmalı ama herkes her zaman değil.**
Çok az rota = herkes her tur çarpışır = sosyal ilişki kurmaya vakit yok. Çok fazla rota = kimse kimseyi bulamaz = sıkıcı. Tatlı nokta: her tur EN AZ 1 karşılaşma olasılığı %60-70.

**Kanun 2: Darboğazlar drama üretir.**
Gerçek Akdeniz'de Sicilya Boğazı, Çanakkale, Cebelitarık doğal darboğazdır. Oyunda da darboğazlar = "karşılaşma garantili" noktalar. Buralarda korsan pusular, donanma devriyeleri, tüccar kalabalığı oluşur. Darboğazdan geçmek ikilem: kısa yol ama riskli.

**Kanun 3: Her bölgenin kişiliği olmalı.**
Batı Akdeniz, Doğu Akdeniz, Orta Akdeniz — her biri farklı ticaret malı, farklı siyasi güç, farklı tehlike. Oyuncu "ben Doğu tüccarıyım" veya "ben Batı korsanıyım" diyebilmeli.

---

# BÖLÜM 2: LİMAN TASARIMI

## 2.1 Liman Listesi (15 Liman)

15 liman, 4 bölgeye dağılmış. Her bölgede 3-4 liman.

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│    Marsilya ─── Cenova ─── Venedik                         │
│      │            │           │                            │
│   Barselona    Palermo     Ragusa                          │
│      │          │    \       │                             │
│      └── Tunus ─┘     Girit ── İstanbul                   │
│           │              │        │                        │
│        Cezayir      Kıbrıs ── Beyrut                      │
│           │              │                                 │
│        Trablus     İskenderiye                             │
│                                                            │
│   [Darboğaz: Sicilya Boğazı = Palermo-Tunus arası]        │
│   [Darboğaz: Ege Kapısı = Girit-İstanbul arası]           │
│   [Darboğaz: Otranto = Ragusa-Venedik arası]              │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## 2.2 Liman Detayları

### BATI AKDENİZ — "Frenk Denizi"

**1. Barselona** — *Aragon'un Pençesi*
```
Bölge:     Batı Akdeniz
Güç:       Aragon / İspanya
Karakter:  Askeri ve ticari güç. Reconquista ruhu.

Ucuz mal:  Savaş (İberya demiri, Katalan kılıçları)
Pahalı mal: Lüks (baharat, ipek — Doğu'dan çok uzak)

Özel:      Batı Akdeniz'in askeri üssü. Savaş gemisi (Kadırga) burada ucuz.
           İspanya birleşmesinden (1492) sonra süper güç limanı olur.

Bağlantılar: Marsilya (Tramontana), Tunus (Fortuna)
```

**2. Marsilya** — *Provence'ın Kapısı*
```
Bölge:     Batı Akdeniz
Güç:       Fransa
Karakter:  Lüks talep merkezi. Fransız sarayı her şeyin en iyisini ister.

Ucuz mal:  Yemek (Provence zeytinyağı, şarap)
Pahalı mal: Lüks (Doğu baharatı, ipek — çok yüksek fiyat)

Özel:      Lüks malın en pahalı satıldığı liman.
           Ama Fransa'nın iç savaşları döneminde liman kapanabilir.

Bağlantılar: Barselona (Kabotaj), Cenova (Tramontana)
```

**3. Cenova** — *La Superba (Görkemli)*
```
Bölge:     Batı-Orta Akdeniz geçişi
Güç:       Cenova Cumhuriyeti
Karakter:  Bankacılık merkezi. Kredi kolay, faiz yüksek.

Ucuz mal:  Lüks (Cenova ipeği, Ligurya mercanı)
Pahalı mal: Yemek (dağlık arazi, tarım zayıf)

Özel:      Bankacılık: burada kredi alabilirsin (borç mekaniği).
           Venedik'in ebedi rakibi — ikisiyle aynı anda "Tanıdık Yüz" olmak zor.
           Cam ve kuyumculuk üretimi var.

Bağlantılar: Marsilya (Tramontana), Venedik (Kabotaj), Palermo (Fortuna)
```

### ORTA AKDENİZ — "Ara Deniz"

**4. Venedik** — *La Serenissima (En Dingin)*
```
Bölge:     Orta Akdeniz (kuzey)
Güç:       Venedik Cumhuriyeti
Karakter:  Ticaret imparatorluğunun kalbi. Arsenal — dünyanın en büyük tersanesi.

Ucuz mal:  Lüks (Murano camı — Venedik tekeli)
Pahalı mal: Yemek (lagünde tarım yok), Savaş (kereste azlığı)

Özel:      Gemi tamiri en ucuz (Arsenal). Cam sadece buradan çıkar.
           Ege ve Doğu rotalarının Avrupa'ya çıkış kapısı.
           Fondaco dei Turchi: Osmanlı tüccarlarına özel han (diplomatik köprü).

Bağlantılar: Cenova (Kabotaj), Ragusa (Tramontana), İstanbul (Fortuna — uzun ama doğrudan)
```

**5. Palermo** — *Üç Dinin Kavşağı*
```
Bölge:     Orta Akdeniz (güney)
Güç:       Norman → Hohenstaufen → Aragon (dönemsel)
Karakter:  Sicilya — Akdeniz'in tam ortası. Tahıl ambarı.

Ucuz mal:  Yemek (Sicilya buğdayı — Akdeniz'in ekmeği)
Pahalı mal: Savaş (ada, demir kaynağı yok)

Özel:      Sicilya Boğazı darboğazının bir ucunda.
           Doğu-Batı geçişinin zorunlu durağı.
           Kış mevsiminde tahıl fiyatı çok düşük (hasat).

Bağlantılar: Cenova (Fortuna), Tunus (DARBOĞAZ — Sicilya Boğazı), 
             Ragusa (Kabotaj), Girit (Fortuna)
```

**6. Ragusa (Dubrovnik)** — *Küçük Ama Kurnaz*
```
Bölge:     Orta Akdeniz (doğu kıyı)
Güç:       Ragusa Cumhuriyeti (bağımsız)
Karakter:  Nötr bölge. Herkesin dostu, kimsenin müttefiki.

Ucuz mal:  (Özel üretim yok — ama hepsi mevcut, orta fiyat)
Pahalı mal: (Hiçbir şey aşırı pahalı değil)

Özel:      NÖTR LİMAN: Ragusa hiçbir oyuncuyu "Kem Göz" yapmaz (başlangıçta).
           Bilgi merkezi: kahvehanede HER ZAMAN 1 ekstra fısıltı.
           Diplomatik sığınak: "Kem Göz" olan oyuncular burada güvende.
           Herkesin ticaret yapabildiği ender limanlardan biri.

Bağlantılar: Venedik (Tramontana), Palermo (Kabotaj), 
             İstanbul (Fortuna), Girit (Tramontana)
```

### DOĞU AKDENİZ — "Şark Denizi"

**7. İstanbul** — *Dünyanın Eşiği*
```
Bölge:     Doğu Akdeniz (kuzey)
Güç:       Bizans → Osmanlı (1453 sonrası)
Karakter:  Mega liman. Doğu ile Batı'nın buluşma noktası.

Ucuz mal:  Lüks (İpek Yolu çıkışı — ipek, baharat, porselen)
Pahalı mal: Savaş (Osmanlı her zaman silah ve kereste ister)

Özel:      Oyunun en büyük pazarı — her mal bulunur.
           Boğazlar kontrolü: Karadeniz'e geçiş Osmanlı izniyle.
           1453 öncesi Bizans: Latin tüccarlara ayrıcalıklı ama kırılgan.
           1453 sonrası Osmanlı: düzenli ama kuralcı.

Bağlantılar: Venedik (Fortuna — uzun), Ragusa (Fortuna), 
             Girit (DARBOĞAZ — Ege Kapısı), Beyrut (Kabotaj)
```

**8. Girit** — *Ortadaki Ada*
```
Bölge:     Doğu Akdeniz (merkez)
Güç:       Venedik → Osmanlı (1669 sonrası)
Karakter:  Stratejik kavşak. Doğu-Batı ve Kuzey-Güney rotalarının kesişimi.

Ucuz mal:  Yemek (Girit zeytinyağı, peynir, şarap)
Pahalı mal: Savaş (ada, kaynak sıkıntısı)

Özel:      Ege Kapısı darboğazının bir ucunda.
           Her yöne 1-2 tur mesafe — mükemmel üs.
           Venedik kontrolünde iken: Latin tüccarlara avantaj.
           Osmanlı fethinden sonra: güç dengesi değişir.
           Korsanlar için ideal pusu noktası.

Bağlantılar: İstanbul (DARBOĞAZ — Ege Kapısı), Palermo (Fortuna), 
             Ragusa (Tramontana), Kıbrıs (Tramontana), İskenderiye (Fortuna)
```

**9. Kıbrıs** — *Haçlı Mirası*
```
Bölge:     Doğu Akdeniz (güneydoğu)
Güç:       Lusignan → Venedik → Osmanlı (1571 sonrası)
Karakter:  Levant ticaretinin kapısı. Stratejik ama savunmasız.

Ucuz mal:  Yemek (Kıbrıs tuzu, şeker kamışı — ortaçağda çok değerli)
Pahalı mal: Lüks (ada, üretim sınırlı)

Özel:      Doğu limanlarına (Beyrut, İskenderiye) yakın — transit merkezi.
           Tuz üretimi: yemek kategorisinde özel değer.
           Haçlı dönemi: Hristiyan tüccarların güvenli limanı.
           Osmanlı fethinden sonra: dengeler değişir.

Bağlantılar: Girit (Tramontana), Beyrut (Kabotaj), İskenderiye (Tramontana)
```

**10. Beyrut** — *Levant'ın Vitrini*
```
Bölge:     Doğu Akdeniz (doğu kıyı)
Güç:       Haçlı → Memlük → Osmanlı (dönemsel)
Karakter:  Levant ticaretinin merkezi. Kara yollarıyla Şam ve Bağdat'a bağlı.

Ucuz mal:  Lüks (Şam ipeği, Halep sabunu, Doğu baharatı — kara yoluyla gelir)
Pahalı mal: Savaş (Levant silah ithal eder)

Özel:      Kara İpek Yolu'nun denize çıkışı.
           Haçlı döneminde: ticaret kolonileri, ayrıcalıklar.
           Memlük/Osmanlı döneminde: düzenli ama vergili.
           İskenderiye'ye alternatif Doğu rotası.

Bağlantılar: İstanbul (Kabotaj — kıyı boyunca, uzun), 
             Kıbrıs (Kabotaj), İskenderiye (Kabotaj)
```

**11. İskenderiye** — *Baharat Tahtı*
```
Bölge:     Güney Akdeniz (doğu)
Güç:       Fatımi → Eyyubi → Memlük → Osmanlı (dönemsel)
Karakter:  Dünyanın baharat başkenti. Kızıldeniz'den gelen her şey buradan geçer.

Ucuz mal:  Lüks (BAHARATTüm çeşit: karanfil, tarçın, karabiber, muskat)
Pahalı mal: Savaş (Mısır kereste ithal eder — ağaç yok)

Özel:      Oyunun EN KARLI lüks kaynağı — ama herkes biliyor.
           Yoğun rekabet: çok oyuncu buraya gelir → fiyat düşer.
           Portekiz'in Hint Okyanusu keşfinden sonra (15. yy): 
           baharat fiyatı yavaşça düşer — tarihsel event.
           Memlük/Osmanlı kuralcı: kaçakçılığa sıfır tolerans.

Bağlantılar: Girit (Fortuna), Kıbrıs (Tramontana), 
             Beyrut (Kabotaj), Trablus (Fortuna — Kuzey Afrika kıyısı boyunca)
```

### GÜNEY AKDENİZ — "Berber Kıyısı"

**12. Trablus** — *Çöl Kapısı*
```
Bölge:     Güney Akdeniz (orta)
Güç:       Yerel hanedanlar → Osmanlı (dönemsel)
Karakter:  Trans-Sahra ticaret yolunun Akdeniz çıkışı.

Ucuz mal:  Lüks (Sahra altını, fildişi, deri — kervan yoluyla)
Pahalı mal: Yemek (çöl, tarım zayıf)

Özel:      Altın kaynağı: Sahra altını buradan Avrupa'ya girer.
           Uzak ve tehlikeli ama kârlı.
           Korsanlık sonrası (16. yy): korsan üssü potansiyeli.

Bağlantılar: İskenderiye (Fortuna), Tunus (Kabotaj), Cezayir (Fortuna)
```

**13. Tunus** — *Afrika'nın Roma'sı*
```
Bölge:     Güney Akdeniz (batı-orta)
Güç:       Hafsid → Osmanlı (dönemsel)
Karakter:  Kuzey Afrika'nın en gelişmiş şehri. Kartaca'nın mirasçısı.

Ucuz mal:  Yemek (Tunus zeytinyağı, tahıl)
Pahalı mal: Lüks (Avrupa lüks malı talebi)

Özel:      Sicilya Boğazı darboğazının diğer ucunda.
           Doğu-Batı geçişinin güney ayağı.
           Palermo'nun karşısı — ikisi arasında yoğun trafik.

Bağlantılar: Palermo (DARBOĞAZ — Sicilya Boğazı), 
             Barselona (Fortuna), Cezayir (Kabotaj), Trablus (Kabotaj)
```

**14. Cezayir** — *Korsanlar Yuvası*
```
Bölge:     Güney Akdeniz (batı)
Güç:       Yerel → Barbaros → Osmanlı eyaleti (dönemsel)
Karakter:  16. yüzyıldan itibaren Akdeniz'in korsan başkenti.

Ucuz mal:  Savaş (korsan ganimetleri, ucuz silah)
Pahalı mal: Yemek (kıyı şeridi dar, tarım az)

Özel:      KORSAN LIMANI: burada "Kara Bayrak" aktiviteleri cezasız.
           Ganimet pazarı: çalıntı mallar %50 indirimli satılır.
           NPC korsanların evi — Kara Bayrak oyuncuları için doğal üs.
           Hristiyan tüccarlara "Kem Göz" — ama rüşvetle "Yabancı" olunabilir.
           Barbaros event'inden sonra (16. yy): Osmanlı bayrağı altında güçlenir.

Bağlantılar: Tunus (Kabotaj), Barselona (Fortuna), Trablus (Fortuna)
```

### BAĞIMSIZ — ÖZEL STATÜ

**15. Malta** — *Kalkan ve Kılıç*
```
Bölge:     Orta Akdeniz (güney merkez)
Güç:       Malta Şövalyeleri (Hospitaller)
Karakter:  Küçük ama silahlanmış ada. Hristiyan korsanlığın merkezi.

Ucuz mal:  Savaş (şövalye silahları, deniz teçhizatı)
Pahalı mal: Yemek (küçük ada, tarım minimal), Lüks (üretim yok)

Özel:      SAVAŞÇI LIMAN: Kadırga burada ucuz. Gemi tamiri ucuz.
           Hristiyan oyuncular için güvenli üs.
           Müslüman tüccarlara "Kem Göz" (Cezayir'in tersi).
           Korsan avı görevleri buradan alınır.
           Küçük ama stratejik konum — Sicilya Boğazı yakını.

Bağlantılar: Palermo (Kabotaj), Tunus (Tramontana), Girit (Fortuna)
```

---

# BÖLÜM 3: ROTA SİSTEMİ

## 3.1 Rota Tipleri (Hatırlatma)

```
TRAMONTANA (Normal):  1 tur seyahat. Standart karşılaşma riski.
KABOTAJ (Kıyı):      2 tur seyahat. Düşük risk, yavaş.
FORTUNA (Açık deniz): 1 tur ama %20 fırtına riski. %15 erken varış şansı.
```

## 3.2 Tam Rota Listesi (28 Rota)

```
#   ROTA                         TİP          DARBOĞAZ?
──────────────────────────────────────────────────────────
    BATI AKDENİZ
1   Barselona ↔ Marsilya         Kabotaj       Hayır
2   Barselona ↔ Tunus            Fortuna       Hayır
3   Barselona ↔ Cezayir          Fortuna       Hayır
4   Marsilya ↔ Cenova            Tramontana    Hayır

    ORTA AKDENİZ
5   Cenova ↔ Venedik             Kabotaj       Hayır
6   Cenova ↔ Palermo             Fortuna       Hayır
7   Venedik ↔ Ragusa             Tramontana    OTRANTO
8   Palermo ↔ Ragusa             Kabotaj       Hayır
9   Palermo ↔ Malta              Kabotaj       Hayır
10  Palermo ↔ Girit              Fortuna       Hayır

    DARBOĞAZLAR
11  Palermo ↔ Tunus              Tramontana    SİCİLYA
12  Malta ↔ Tunus                Tramontana    SİCİLYA
13  Girit ↔ İstanbul             Tramontana    EGE
14  Venedik ↔ İstanbul           Fortuna       Hayır (açık deniz alternatifi)

    DOĞU AKDENİZ
15  Ragusa ↔ İstanbul            Fortuna       Hayır
16  Ragusa ↔ Girit               Tramontana    Hayır
17  Girit ↔ Kıbrıs              Tramontana    Hayır
18  Girit ↔ İskenderiye          Fortuna       Hayır
19  Kıbrıs ↔ Beyrut             Kabotaj       Hayır
20  Kıbrıs ↔ İskenderiye        Tramontana    Hayır
21  İstanbul ↔ Beyrut           Kabotaj       Hayır (kıyı boyunca, uzun)
22  Beyrut ↔ İskenderiye         Kabotaj       Hayır

    GÜNEY AKDENİZ
23  İskenderiye ↔ Trablus        Fortuna       Hayır
24  Trablus ↔ Tunus              Kabotaj       Hayır
25  Trablus ↔ Cezayir            Fortuna       Hayır
26  Tunus ↔ Cezayir              Kabotaj       Hayır

    ÖZEl ROTALAR
27  Malta ↔ Girit                Fortuna       Hayır
28  Cenova ↔ Tunus               Fortuna       Hayır (kestirme, riskli)
```

## 3.3 Rota Haritası (ASCII)

```
                    Marsilya
                   / (K)
            Barselona ── Cenova ────── Venedik
            |    \      / |    (K)      | (T)
            |     \    /  |             Ragusa
            |   (F)(F)(F) |            / |  \
            |       |     |    (K)   /   |   \(F)
         (F)|    Tunus ══ Palermo ─/    |  İstanbul
            |   / | ══╗  / (K)\        |   / (K)
            |  /  |   ║ /      \   (T)|  /
          Cezayir | Malta    (F)\    Girit     
              \   |              \   / | \(T)
            (F)\  |(K)          (T)/  |  Kıbrıs
                Trablus         /     |  / (K)
                    \      (F)/      |  Beyrut
                     \(F)   /        | /  (K)
                      İskenderiye ──/

          (T) = Tramontana    ══ = DARBOĞAZ
          (K) = Kabotaj
          (F) = Fortuna
```

---

# BÖLÜM 4: DARBOĞAZ MEKANİĞİ

## 4.1 Üç Darboğaz

Darboğazlar oyunun drama jeneratörleri. Normal rotalarda karşılaşma olasılığı %30-40. Darboğazlarda %70-80.

### Sicilya Boğazı (Palermo ↔ Tunus, Malta ↔ Tunus)

```
TARİHSEL: Akdeniz'i Doğu ve Batı'ya bölen dar geçit. Antik çağdan beri
  her deniz gücü burayı kontrol etmek ister. Kartaca burada kuruldu.

OYUN ETKİSİ:
  → Doğu'dan Batı'ya (veya tersi) geçmek için MUTLAKA buradan geçersin
  → Alternatif: Cenova ↔ Tunus Fortuna rotası (riskli kestirme)
  → Darboğazda karşılaşma: %75
  → Donanma devriyesi sıklığı: yüksek

DRAMA:
  → Korsanlar burada pusu kurar (Kara Bayrak oyuncuları için ideal)
  → Ticaret konvoyları burada gruplaşır (güvenlik)
  → Savaş dönemlerinde darboğaz kapanabilir (event)

STRATEJİK İKİLEM:
  "İskenderiye'den baharat alıp Marsilya'ya satmak istiyorum.
   Sicilya Boğazı'ndan geçmek zorunlu — ama orada korsan var.
   Konvoy mu kurmalıyım? Kestirme (Cenova-Tunus Fortuna) mı denemeli?
   Yoksa güneyde kalıp Trablus'a mı satmalıyım?"
```

### Ege Kapısı (Girit ↔ İstanbul)

```
TARİHSEL: Ege Denizi'nin girişi. İstanbul'a ulaşmak için Ege'yi
  geçmek zorunlu. Yüzlerce ada, dar geçitler, tehlikeli kayalıklar.
  Osmanlı donanmasının devriye alanı.

OYUN ETKİSİ:
  → İstanbul'a gitmek için MUTLAKA buradan geçersin
  → Alternatif: Ragusa ↔ İstanbul Fortuna (açık deniz, fırtına riski)
     veya Venedik ↔ İstanbul Fortuna (çok uzun, çok riskli)
  → Darboğazda karşılaşma: %70
  → Osmanlı donanması sık devriye gezer

DRAMA:
  → Osmanlı'yla ilişkin "Kem Göz" ise geçiş riskli
  → Osmanlı "Tanıdık Yüz" ise devriye seni korur
  → Venedik-Osmanlı savaşı döneminde: darboğaz savaş alanı

STRATEJİK İKİLEM:
  "İstanbul'da ipek ucuz ama Ege Kapısı'nda Osmanlı devriyesi var.
   Ben Hristiyan tüccarım — sorun çıkabilir.
   Ragusa üzerinden açık denize mi çıksam?
   Yoksa Osmanlı'yla ilişkimi düzeltmeli miyim?"
```

### Otranto Boğazı (Venedik ↔ Ragusa)

```
TARİHSEL: Adriyatik'in girişi. Venedik, bu boğazı "kendi gölü"
  olarak görür. Buradan geçen her gemiyi kontrol eder.

OYUN ETKİSİ:
  → Venedik'e giden EN HIZLI yol
  → Alternatif: Cenova üzerinden kara yolu (Kabotaj, 2 tur)
  → Darboğazda karşılaşma: %65
  → Venedik donanması devriyesi

DRAMA:
  → Venedik'le ilişkin kötüyse geçiş riskli
  → Ama Venedik pazarına erişim çok kârlı
  → Ragusa nötr liman olduğu için herkes Ragusa'da toplanır
    → Otranto, Ragusa'dan Venedik'e giden herkesin geçtiği yer

STRATEJİK İKİLEM:
  "Ragusa'dayım, elim Doğu malıyla dolu. Venedik'e satmalıyım.
   Ama Otranto'da Venedik devriyesi benim kaçak malımı bulabilir.
   Cenova'ya mı gitsem? Daha uzun ama güvenli.
   Ya da Venedik'le ilişkimi düzeltip meşru geçiş mi yapsam?"
```

## 4.2 Darboğaz Kontrol Mekaniği

```
DARBOĞAZDA KARŞILAŞMA TABLOSU:

  Donanma devriyesi (%30):
    → Kontrol eden gücün donanması seni durdurur
    → "Tanıdık Yüz" isen: selam verip geçersin
    → "Yabancı" isen: kargo kontrolü (%20 kaçak bulma)
    → "Kem Göz" isen: %50 gözaltı, kargo müsadere riski

  Başka oyuncu (%40):
    → Normal karşılaşma kuralları

  NPC korsan (%20):
    → Saldırı veya haraç talebi

  Boş geçiş (%10):
    → Şanslısın — kimse yok
```

---

# BÖLÜM 5: BÖLGESEL DİNAMİKLER

## 5.1 Ticaret Akış Haritası

```
TEMEL TİCARET AKIŞI (doğudan batıya):

  İskenderiye/Beyrut → [LÜKS: baharat, ipek]
       ↓
  Girit/Kıbrıs → [transit, depolama]
       ↓
  İstanbul → [LÜKS: ipek yolu malları]
       ↓                    ↓
  Venedik → [LÜKS işleme]   Ragusa → [transit]
       ↓                    ↓
  Cenova → [bankacılık]     ↓
       ↓                    ↓
  Marsilya ← ← ← ← ← ← ← ←
  [EN YÜKSEK LÜKS FİYATI]

KARŞI AKIŞ (batıdan doğuya):

  Barselona/Cenova → [SAVAŞ: silah, demir]
       ↓
  Tunus/Cezayir → [transit, korsanlık]
       ↓
  İstanbul/Beyrut → [SAVAŞ malı talebi]

YAN AKIŞLAR:

  Sicilya → [YEMEK: tahıl] → her yöne
  Cezayir → [SAVAŞ: ganimet] → ucuz mal
  Trablus → [LÜKS: altın] → kuzeye
```

## 5.2 Bölge Kişilikleri

```
BATI AKDENİZ — "Güvenli ama Rekabetli"
  → Az korsan (erken dönem), yoğun ticaret
  → Lüks fiyat yüksek ama herkes buraya taşır → rekabet
  → Yeni başlayanlar için uygun: düşük risk, öğrenme alanı
  → Kişilik: "burjuva" — para kazanılır ama heyecan az

ORTA AKDENİZ — "Kavşak"
  → Herkes buradan geçer → karşılaşma bol
  → Darboğazlar drama üretir
  → Ragusa: nötr buluşma noktası, bilgi merkezi
  → Kişilik: "kaotik" — her şey olabilir

DOĞU AKDENİZ — "Zengin ama Tehlikeli"
  → En kârlı rotalar ama en yoğun siyasi gerilim
  → Osmanlı/Memlük kuralları sıkı
  → Haçlı-Müslüman gerilimi ticaret fırsatı ve riski
  → Kişilik: "egzotik" — büyük ödüller, büyük riskler

GÜNEY AKDENİZ — "Gölgeler"
  → Korsanlık merkezi (özellikle 16. yy sonrası)
  → Kaçak ticaret, ganimet pazarı
  → Resmi devletlerin kontrolü zayıf
  → Kişilik: "kanunsuz" — kurallar burada gevşek
```

---

# BÖLÜM 6: DÖNEMSEL HARİTA DEĞİŞİMLERİ

Harita sabit değil — tarihsel event'lerle değişir:

## 6.1 Kontrol Değişimleri

```
11. YY: Palermo = Norman / İstanbul = Bizans / İskenderiye = Fatımi
12. YY: Beyrut = Haçlı (ticaret kolonileri) / Kıbrıs = Lusignan
13. YY: İstanbul = Latin İmparatorluğu (1204-1261), sonra tekrar Bizans
        Beyrut = Memlük (1291 sonrası, Haçlı devletleri düşer)
14. YY: Osmanlı Balkanlar'da yükselir, henüz denizci değil
15. YY: İstanbul = Osmanlı (1453!) / Kıbrıs = Venedik
16. YY: Kıbrıs = Osmanlı (1571) / Cezayir = Osmanlı eyaleti (Barbaros)
17. YY: Girit = Osmanlı (1669) 
18. YY: Malta hâlâ Şövalyeler / Cebelitarık İngiliz (yeni darboğaz)
```

## 6.2 Kontrol Değişiminin Etkisi

Bir liman el değiştirdiğinde:
```
→ Tüm oyuncuların o limandaki söylentileri SİFIRLANIR
→ Herkes "Yabancı" olarak başlar (yeni yönetimle)
→ Liman uzmanlığı DEĞİŞEBİLİR
  (Osmanlı İstanbul'u → Savaş malı talebi artar)
→ Yeni ittifak bulaşması kuralları
→ 2-3 tur "geçiş kaos dönemi" → fiyatlar çılgınca dalgalanır
```

---

# BÖLÜM 7: OYUNCU SAYISINA GÖRE ÖLÇEKLEME

```
2-3 OYUNCU:
  → Tam harita, ama NPC tüccar/korsan sayısı artar
  → Karşılaşma olasılığı: NPC'ler sayesinde korunur
  → LLM NPC'ler daha aktif (daha çok mesaj, daha çok teklif)

4-5 OYUNCU (İDEAL):
  → Tam harita, az NPC
  → Her 2 turda en az 1 oyuncu-oyuncu karşılaşması
  → Darboğazlarda yoğunluk yeterli

6-8 OYUNCU:
  → Tam harita, NPC az veya yok
  → Darboğazlarda trafik sıkışıklığı → daha çok drama
  → Koalisyon dinamiği daha zengin
  → Fondaco (liman fazı) süresi uzatılabilir (10-12 dk)
```

---

# BÖLÜM 8: BAŞLANGIÇ KONUMLARI

Oyuncular oyun başında ev limanı seçer. Seçim serbest ama bazı limanlar başlangıç için uygun değil (çok uzak, çok tehlikeli).

```
BAŞLANGIÇ LİMANLARI (önerilen):

  Yeni başlayan:   Venedik, Cenova, Ragusa
                   (güvenli, merkezi, ticaret kolay)

  Orta seviye:     Barselona, Palermo, İstanbul
                   (güçlü ama rekabetli)

  İleri seviye:    Cezayir, Trablus, Beyrut
                   (riskli, uzak ama ödüllü)

  Tüm limanlar seçilebilir — yukarıdaki sadece öneri.

BAŞLANGIÇ PAKETİ (herkes aynı):
  → 1 Feluka (kayık)
  → 200 altın
  → Sıfır ün, sıfır söylenti
  → Ev limanında "Tanıdık Yüz" statüsü
  → Diğer tüm limanlarda "Yabancı"
```

---

# BÖLÜM 9: HARİTA TASARIM TESTLERİ

## 9.1 Mesafe Testi

```
EN KISA YOLLAR (tur sayısı):

  Venedik → İskenderiye:
    Tramontana: Venedik → Ragusa → Girit → İskenderiye = 3 tur (1+1+Fortuna)
    Fortuna: Venedik → İstanbul → [Kabotaj Beyrut 2 tur] → İskenderiye = 4 tur
    En kısa: 3 tur, darboğaz geçişi yok ama Fortuna riski

  Barselona → İstanbul:
    Kıyı: Barselona → Marsilya → Cenova → Venedik → Ragusa → İstanbul = 6+ tur
    Ortadan: Barselona → Tunus → Palermo → Girit → İstanbul = 4 tur
    (ama 2 darboğaz: Sicilya + Ege)
    
  Cezayir → Beyrut:
    Güney: Cezayir → Trablus → İskenderiye → Beyrut = 4 tur (Kabotaj'la)
    Kuzey: Cezayir → Tunus → Palermo → Girit → Kıbrıs → Beyrut = 5 tur

  SONUÇ: En uzak iki liman arası 4-6 tur. Makul.
  Komşu limanlar arası 1-2 tur. İdeal.
```

## 9.2 Darboğaz Testi

```
DARBOĞAZLARDAN KAÇINILABİLİR Mİ?

  Sicilya Boğazı'ndan kaçınma:
    → Cenova ↔ Tunus Fortuna rotası (kestirme, riskli)
    → Var: evet, ama Fortuna riski

  Ege Kapısı'ndan kaçınma:
    → Ragusa ↔ İstanbul Fortuna (açık deniz)
    → Venedik ↔ İstanbul Fortuna (çok uzun)
    → Var: evet, ama Fortuna riski

  Otranto'dan kaçınma:
    → Cenova üzerinden Kabotaj (2 tur fazla)
    → Var: evet, ama zaman maliyeti

  SONUÇ: Her darboğazın alternatifi var ama alternatif her zaman
  ya daha riskli ya daha yavaş. Darboğaz = kısa ama riskli kararı.
  İKİLEM ÇALIŞIYOR.
```

## 9.3 Karşılaşma Testi

```
4 OYUNCU SENARYOSU:

  Ali: Venedik'te, İskenderiye'ye gidecek
  Beren: Cenova'da, İstanbul'a gidecek  
  Can: Cezayir'de, avlanma niyetiyle Sicilya Boğazı'na gidecek
  Deniz: İstanbul'da, Venedik'e gidecek

  Ali'nin rotası: Venedik → Ragusa (tur 1) → Girit (tur 2)
  Beren'in rotası: Cenova → Palermo (Fortuna, tur 1) → Girit (Fortuna, tur 2)
  Can'ın rotası: Cezayir → Tunus (Kabotaj, tur 1-2)
  Deniz'in rotası: İstanbul → Girit (Ege Kapısı, tur 1) → Ragusa (tur 2)

  KARŞILAŞMALAR:
  Tur 1: Deniz, Ege Kapısı'nda (darboğaz). Tek başına — %70 NPC karşılaşma.
  Tur 2: Ali ve Beren, ikisi de Girit'e varıyor! Aynı limanda buluşma.
         Deniz, Ragusa'ya varıyor — Ali'nin tur 1'de geçtiği liman.
         Karşılaşma yok ama Ali'nin söylentisi Ragusa'da.

  SONUÇ: 2 turda 1 doğrudan karşılaşma (Girit'te) + 
         1 dolaylı bilgi alışverişi (Ragusa söylentileri).
         4 oyuncu için UYGUN yoğunluk.
```

---

*"Harita, oyunun sessiz anlatıcısıdır. Her rota bir hikaye, her darboğaz bir ikilem, her liman bir karakter. Oyuncu haritaya baktığında Akdeniz'i görmelidir — sadece noktalar ve çizgiler değil."*
