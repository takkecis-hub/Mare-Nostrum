> 🔧 **WIP / ÇALIŞMA DOKÜMANI** — Bu doküman modüler bir çalışma parçasıdır. Güncel konsolide versiyon için → `MARE_NOSTRUM_MASTER_v3.md` dosyasına bakınız.

---

# MARE NOSTRUM — Savaş Taktiği & Singleplayer Anlatı Sistemi
## Demir'in İki Yüzü ve Tarih'in Fısıltısı

---

# KISIM I: SAVAŞ TAKTİK SEÇİMİ

## Sorun

Mevcut savaş: Gemi gücü + Ün bonusu + Zar. 3 saniyede çözülür ama savaş SIRASINDA oyuncunun HİÇBİR kararı yok. Zar atılır, biter. Savaşçı oyun tarzı sıkıcı.

## Çözüm: Tek Bir Taktik Seçimi — "Pruva mı, Kürek mi, Yelken mi?"

Savaş başlamadan ÖNCE her iki taraf (saldıran ve savunan) gizlice taktik seçer. Taş-kağıt-makas dinamiği ama tematik:

```
┌─ SAVAŞ TAKTİĞİ ─────────────────────────────────┐
│                                                    │
│  Düşmanla karşılaştın! Taktiğini seç:             │
│                                                    │
│  ⚔️ PRUVA (Bordalama)                              │
│     Burnunu düşmana çevir, yan yana gel, atla.     │
│     Gemini riske atarsın ama düşman gemisini        │
│     BÜTÜN olarak ele geçirirsin.                   │
│                                                    │
│  🔥 ATEŞ (Uzak savaş)                              │
│     Mesafe koru, ok ve ateş at.                    │
│     Düşman gemisine hasar ver, kargosunu denize     │
│     dök. Güvenli ama ganimet azalır.               │
│                                                    │
│  💨 MANEVRA (Kaçınma ve konum)                      │
│     Rüzgârı kullan, pozisyon al, düşmanı yorar.    │
│     Zaman kazanırsın — ya kaçarsın ya da            │
│     düşmanı tuzağa çekersin.                       │
│                                                    │
└────────────────────────────────────────────────────┘
```

## Taş-Kağıt-Makas Dengesi

```
PRUVA > ATEŞ
  Bordalamacı mesafeyi kapatırsa okçunun işi biter.
  Pruva seçen +2 bonus.

ATEŞ > MANEVRA
  Manevra yapan yavaşlar, ateşçi onu vurur.
  Ateş seçen +2 bonus.

MANEVRA > PRUVA
  Bordalamacı düz gelir, manevraci onu atlatıp arkasına geçer.
  Manevra seçen +2 bonus.

AYNI TAKTİK: Bonus yok, düz güç karşılaştırması.
```

## Revize Savaş Formülü

```
GÜÇ = Gemi değeri + Ün bonusu + Taktik bonusu + Zar

  Gemi:     Feluka 1, Karaka 2, Kadırga 3
  Ün:       Demir Pruva +1, Deli Rüzgâr +1, "korkak" söylentisi -1
  Taktik:   Karşı taktiği yenersen +2, aynıysa 0, yenilirsen 0
  Zar:      1-6 (Meltem deneyimine göre alt sınır değişir)

  Toplam karşılaştırma: aynı kurallar (büyük kazanır, eşit berabere)
```

## Taktik + Gemi Sinerjileri

```
FELUKA (hızlı, hafif):
  Manevra'da gizli bonus: +1 ekstra (toplam +3 vs Pruva)
  "Feluka manevrası" — küçük gemi büyük gemiden kaçınmada usta

KARAKA (ağır, çok kargo):
  Hiçbir taktikte özel bonus yok — ticaret gemisi, savaş gemisi değil
  Ama kargo ÇOK olduğu için ganimet de çok: kazanırsan büyük ödül

KADIRGA (savaş gemisi):
  Pruva'da gizli bonus: +1 ekstra (toplam +3 vs Ateş)
  "Kadırga bordalması" — savaş gemisi yakın dövüşte vahşi
```

## Taktik Seçimini İlginç Kılan: Bilgi

Rakibinin hangi taktiği seçeceğini TAHMİN etmeye çalışırsın:

```
İPUÇLARI:
  → Rakibin Feluka kullanıyorsa: muhtemelen Manevra (hızlı gemi, kaçınma)
  → Rakibin Kadırga kullanıyorsa: muhtemelen Pruva (savaş gemisi, bordalama)
  → Rakibin Karaka kullanıyorsa: muhtemelen Ateş (mesafe koruma, kargo koruma)
  → AMA: akıllı oyuncu bunu bilir ve TAM TERSİNİ yapar

  → Rakibin "Demir Pruva" ünlüyse: büyük ihtimal Pruva → sen Manevra seç
  → AMA: Demir Pruva ünlü oyuncu bunu bilir ve Ateş seçebilir
  → Meta-oyun başladı — Diplomacy'nin ruhundaki blöf burada da var
```

## Savaş Sonucu — Taktiğe Göre Ganimet

```
PRUVA İLE KAZANIRSAN:
  → Düşman gemisini ELE GEÇİREBİLİRSİN (tüm kargo + gemiyi satma opsiyonu)
  → Ama kendi gemin de hasar alır (%50 şans)

ATEŞ İLE KAZANIRSAN:
  → Düşman kargosunun %30'u denize döküldü (yok oldu)
  → Kalan %70'in yarısını alırsın
  → Senin gemin hasarsız

MANEVRA İLE KAZANIRSAN:
  → Düşman gemisini ele geçirmezsin ama tam kaçış hakkın var
  → Kargo transferi yok — ama düşman 1 tur "oyalanmış" olur
  → Veya: pozisyon avantajıyla İKİNCİ BİR SAVAŞ TURUNA zorlarsın
    (bu sefer sen +1 bonus ile başlarsın)
```

---

# KISIM II: SİNGLEPLAYER ANLATI SİSTEMİ

## Felsefe: "Assassin's Creed'in Tarih Merakı + CK3'ün Kişisel Draması"

Singleplayer'ın multiplayer'dan farkı ANLATICI olması. LLM sadece NPC oynamaz, aynı zamanda TARİH ÖĞRETİR — ama ders vermez, merak uyandırır. Oyuncu "vay be, bunu bilmiyordum" diye düşünmeli.

## 2.1 Oyun Başlangıcı: Kişisel Hikaye Tohumu

Oyun başlarken LLM oyuncuya bir "köken hikayesi" sorar:

```
┌─ KÖKENİN ─────────────────────────────────────────────┐
│                                                         │
│  Akdeniz'e ilk adımını atıyorsun. Kim olduğunu          │
│  sen seçmiyorsun — Akdeniz seçiyor.                     │
│                                                         │
│  Nereden geliyorsun?                                    │
│    ○ Venedik — tüccar ailesinin küçük oğlu              │
│    ○ Cezayir — esir alınıp kaçmış bir denizci           │
│    ○ İskenderiye — çökmüş bir tüccar hanedanının torunu │
│    ○ Ragusa — kimsesiz bir öksüz, limanlarda büyümüş    │
│    ○ Rastgele — Akdeniz karar versin                    │
│                                                         │
│  Seni denize iten ne?                                   │
│    ○ Kayıp bir hazine söylentisi                        │
│    ○ Babanın batırdığı şerefi kurtarmak                 │
│    ○ Bir düşmandan intikam                              │
│    ○ Saf merak — dünyanın ucunu görmek                  │
│    ○ Rastgele — kader karar versin                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

Bu seçimler OYUN MEKANİĞİNİ değiştirmez (herkes aynı Feluka + 200 altınla başlar). Ama LLM'in anlatı çerçevesini belirler. "Kayıp hazine" seçen oyuncu, oyun boyunca ara sıra hazine ipuçları duyar. "İntikam" seçen oyuncunun düşmanı NPC'lerden biri olarak ortaya çıkar.

## 2.2 Kişisel Görev Zinciri

Köken hikayesine bağlı, oyun boyunca ilerleyen kişisel görev zinciri:

```
KAYIP HAZİNE ZİNCİRİ:
  Tur 3:  Kahvehanede: "Yaşlı bir gemici, Girit açıklarında bir batığın
           yerini bildiğini söyledi. Ama konuşmak için güven istiyor."
           → Girit'e git, yaşlı gemiciyle konuş (LLM diyalog)

  Tur 8:  Gemici bir harita parçası veriyor. İkinci parça İstanbul'da,
           bir antikacıda.
           → İstanbul'a git, antikacıyı bul

  Tur 15: Antikacı: "Haritanın son parçası, bir Venedik asilzadesinde.
           Ama o bunu satmaz — çalmanız lazım."
           → Venedik'te entrika görevi (Simsar deneyimi testi)

  Tur 22: Harita tamamlandı. Batık, Kıbrıs açıklarında.
           "Keşif" niyetiyle Kıbrıs rotasına çık.
           → Hazine bulundu! Büyük altın ödülü + "Efsane" ünü yaklaşır.
           → Ama dikkat: hazine haberi söylenti olarak yayılır.
           → Korsanlar peşinde.

BABA'NIN ŞEREFİ ZİNCİRİ:
  Tur 5:  Babanın eski ortağını bul (NPC Fatma). Gerçeği öğren.
  Tur 12: Babanı batıran asıl suçlu: NPC Don Enrique. Ama güçlü.
  Tur 20: Don Enrique'yi yenmek için koalisyon kur veya Zehir kullan.
  Tur 28: Ailenin adı temize çıktı — veya intikam aldın.

İNTİKAM ZİNCİRİ:
  Tur 1:  Düşmanın rastgele bir NPC olarak belirlenir.
  Her 5 turda: Düşmanın hakkında bilgi parçası.
  Oyun ortası: Düşmanla yüzleşme fırsatı.
  Final: Öldürmek mi, affetmek mi? (ikisi de farklı ün verir)
```

## 2.3 Tarihsel Trivia Sistemi — "Biliyor Muydun?"

Oyunun en özgün singleplayer özelliği: **tarih, oyunun dokusuna işlenmiş.** Oyuncu ders almaz ama her tur bir tarihsel detay öğrenir — kahvehane fısıltısı, event duyurusu veya NPC diyalogu yoluyla.

### Kahvehane Trivia'ları

Her kahvehanede 3 fısıltıdan biri BAZEN (her 3-4 turda bir) gerçek tarihsel trivia olur:

```
VENEDİK KAHVEHANESİ:
  "Yaşlı bir tüccar anlatıyor: Venedik Arsenal'inde günde bir gemi
   inşa ediyorlarmış. Kral Henri bizzat gelip görmüş, inanamadım demiş.
   16.000 işçi çalışıyormuş — dünyanın en büyük fabrikası."

   [!] Gerçek: Venedik Arsenal'i, Sanayi Devrimi öncesi dünyanın
   en büyük endüstriyel kompleksiydi. 1104'te kuruldu.

İSTANBUL KAHVEHANESİ:
  "Bir derviş fısıldıyor: Fatih Sultan Mehmed kuşatmada gemilerini
   karadan yürütmüş. Evet, KARADAN. Galata tepesinin üzerinden
   Haliç'e indirmiş. Düşman bunu görünce aklını kaçırmış."

   [!] Gerçek: 1453 kuşatmasında Osmanlı, 67 gemiyi Galata tepesi
   üzerinden karadan çekerek Haliç'e indirdi.

İSKENDERİYE KAHVEHANESİ:
  "Mısırlı bir âlim: Baharat yolu denilen şey aslında bir zincir.
   Hindistan'dan Arap gemiciler Aden'e, Aden'den Mısır'a, Mısır'dan
   biz Venedik'e taşıyoruz. Her halka kendi payını alıyor.
   O yüzden karabiber Avrupa'ya ulaştığında altından pahalı."

   [!] Gerçek: Ortaçağ'da karabiber, ağırlığınca altın değerindeydi.
   "Peppercorn rent" (biber tanesi kira) deyimi İngilizce'ye
   buradan girmiştir.

CEZAYİR KAHVEHANESİ:
  "Yaşlı bir korsan gülüyor: Barbaros denen adam aslında çömlekçinin
   oğluydu. Midilli'de doğdu, çömlek yapardı. Sonra ağabeyi Oruç'la
   denize açıldı. Çömlekçinin oğlu, Akdeniz'in efendisi oldu."

   [!] Gerçek: Barbaros Hayreddin, Midilli'de bir sipahi ile
   Rum annenin oğlu olarak doğdu.

RAGUSA KAHVEHANESİ:
  "Ragusalı bir tüccar: Bizim şehir küçük ama kurnaz. Hem Osmanlı'ya
   hem Venedik'e haraç ödüyoruz. 'Ama bu çifte haraç değil mi?' dersen,
   evet — ama iki efendiye hizmet eden, ikisinden de korunur.
   Buna diplomasi diyoruz."

   [!] Gerçek: Ragusa, yüzyıllar boyunca Osmanlı'ya ve Venedik'e
   aynı anda haraç ödeyerek bağımsızlığını koruyan tek şehir devleti.

GRİT KAHVEHANESİ:
  "Giritli yaşlı kadın: Rum ateşi denen silahı kimse yapamıyor artık.
   Bizanslılar sırrı o kadar iyi sakladı ki kendi torunları bile
   bilmiyor. Denize düşünce bile yanmaya devam edermiş."

   [!] Gerçek: Bizans'ın "Rum ateşi" (Greek fire) formülü, tarihsel
   kayıtlarda kayıp. Modern bilim hâlâ kesin bileşimini çözemedi.

MARSILYA KAHVEHANESİ:
  "Fransız bir keşiş: Veba geldiğinde Marsilya'yı karantinaya aldılar.
   Ama karantinanın bile bir tarihi var — 'quarantina' İtalyanca
   'kırk gün' demek. Gemiler limana girmeden 40 gün beklerdi.
   40 gün sonra hasta olan ölür, sağlam olan girer."

   [!] Gerçek: "Karantina" kelimesi Venedikçe "quaranta giorni"dan
   (40 gün) gelir. İlk karantina uygulaması 1377'de Ragusa'da başladı.

MALTA KAHVEHANESİ:
  "Bir şövalye: Bilir misin, bizim Malta Şövalyeleri aslında
   Kudüs'te hastane işletiyordu. Haçlı seferleriyle asker olduk.
   Kudüs'ü kaybettik, Rodos'a gittik. Rodos'u da kaybettik,
   Malta'ya geldik. Bir gün Malta'yı da kaybedersek nereye gideriz?"

   [!] Gerçek: Hospitalier Şövalyeleri 1530'da Malta'ya yerleşti.
   1798'de Napolyon tarafından kovuldu. Bugün Roma'da sembolik
   bir devlet olarak hâlâ var.

BARSELONA KAHVEHANESİ:
  "Katalan bir kaptan: 1492'de üç şey oldu — Granada düştü,
   Yahudiler sürgün edildi, Kolomb yelken açtı. Aynı yıl.
   İspanya bir dünyayı kapatırken başka bir dünyayı açtı."

   [!] Gerçek: 1492, dünya tarihinin en yoğun yıllarından.
   Reconquista'nın sonu, Sefarad sürgünü ve Amerika'nın "keşfi"
   aynı yıla denk gelir.

TUNUS KAHVEHANESİ:
  "Tunuslu bir tarihçi: Bu toprakların altında Kartaca yatıyor.
   Romalılar şehri o kadar yıktı ki topraklarına tuz ektiler —
   bir daha hiçbir şey bitmesin diye. Ama biz yine de bittik.
   Çünkü Akdeniz'de hiçbir şey sonsuza kadar ölü kalmaz."

   [!] Gerçek: Roma'nın Kartaca'ya tuz ekmesi muhtemelen efsane
   olsa da, şehrin tamamen yıkılması tarihsel gerçek (MÖ 146).

TRABLUS KAHVEHANESİ:
  "Çölden gelen bir tüccar: Sahra'yı geçmek 40 gün sürer.
   Suyun bittiği yerde develer de durur. Ama altın kervanları
   durmamalı — çünkü altın beklemez. Bir kervan 12.000 deve
   taşırmış. 12.000! Sen kaç deve gördün hayatında?"

   [!] Gerçek: Mansa Musa'nın 1324 Hac kervanı tahminen
   60.000 kişi ve 12.000 köleden oluşuyordu. Kahire'de
   harcadığı altın, altın fiyatını 10 yıl boyunca düşürdü.

KIBRIS KAHVEHANESİ:
  "Kıbrıslı bir şeker tüccarı: Avrupa'nın bal dışında bildiği
   tek tatlı Kıbrıs şekeriydi. Haçlılar şeker kamışını buradan
   öğrendi. Bir avuç şeker, bir avuç gümüş ederdi."

   [!] Gerçek: Haçlı seferleri Avrupa'ya şeker kamışını tanıttı.
   Ortaçağ'da şeker eczanelerde satılan lüks bir ilaçtı.

BEYRUT KAHVEHANESİ:
  "Beyrut'lu bir kâtip: Biliyor musun, alfabe burada doğdu.
   Fenikeliler harfleri icat etti. Sonra Yunanlılar çaldı,
   Romalılar çaldı, Araplar kendi versiyonunu yaptı.
   Şimdi herkes yazıyor — ama patent bende."

   [!] Gerçek: Fenike alfabesi (MÖ 1050 civarı), neredeyse
   tüm modern alfabelerin atasıdır.
```

### Trivia Görünüm Formatı

```
┌─ İSTANBUL KAHVEHANESİ ─────────────────────────────────┐
│                                                          │
│  "İstanbul'da ipek fiyatı yükseliyor."                   │
│                                                          │
│  "Batı rotasında donanma devriyesi yoğunlaşmış."         │
│                                                          │
│  ☽ "Bir derviş fısıldıyor: Fatih gemilerini              │
│     karadan yürütmüş... Galata tepesinden Haliç'e        │
│     indirmiş. Düşman bunu görünce delirmiş."             │
│     ─────────────────────────────────────                │
│     [!] 1453: Osmanlı, 67 gemiyi kara üzerinden          │
│         Haliç'e indirerek kuşatmayı kazandı.             │
│                                                          │
│  [Kahve Falı] [Rüzgâr Ek] [Ateşe Su] [İzi Sür] [Çık]   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**☽ sembolü:** Trivia fısıltısını normal fısıltıdan ayırır. Oyuncu bunu "bonus bilgi" olarak görür. Mekanik etkisi yok ama atmosfer ve tarihsel derinlik katar.

## 2.4 Event Trivia Entegrasyonu

Mega event'ler artık tarihsel detaylarla zenginleştirilmiş:

### Kara Veba Event'i (Güncellenen)

```
LLM EVENT DUYURUSU:
  "Messina'dan gelen gemiler ölüm taşıyor. Gemicilerin vücutları
   siyah şişliklerle kaplı — onlara 'tanrının parmak izleri' diyorlar.
   Cesetleri denize atsalar da hastalık yayılıyor."

   ☽ BILIYOR MUYDUN?
   Kara Veba Kafkasya'dan İtalyan ticaret gemileriyle geldi.
   1347'de Cenova'nın Kırım'daki Kefe kolonisini kuşatan
   Moğollar, veba bulaşmış cesetleri mancınıkla surların
   içine fırlattı — tarihin ilk biyolojik savaşı.
   Kaçan Ceneviz gemicileri hastalığı Messina'ya taşıdı.
   3 yılda Avrupa nüfusunun %30-60'ı öldü.
```

### Konstantinopolis'in Fethi (Güncellenen)

```
LLM EVENT DUYURUSU:
  "Toplar gürledi ve bin yıllık surlar çatladı. Bizans'ın son
   imparatoru, XI. Konstantinos, zırhını giyip surların üzerinde
   savaşarak öldü. Bir imparatorluğun son nefesi."

   ☽ BILIYOR MUYDUN?
   Kuşatmada kullanılan devasa top "Şahi" (veya "Basilica"),
   Macar mühendis Urban tarafından döküldü. Urban önce
   Bizans'a teklif götürdü ama Bizans parasız olduğu için
   reddetti. Osmanlı kabul etti. Ironik: Bizans'ı yıkan
   silahı, Bizans'ın reddettiği adam yaptı.
```

### İnebahtı Deniz Savaşı (Güncellenen)

```
LLM EVENT DUYURUSU:
  "Batı'dan büyük haber — Kutsal İttifak donanması Osmanlı'yı
   İnebahtı'da yendi. 200'den fazla gemi battı. Akdeniz'in
   en kanlı günü."

   ☽ BILIYOR MUYDUN?
   İnebahtı'da savaşanlardan biri de İspanyol yazar Miguel de
   Cervantes'ti. Sol elini kaybetti — ama sağ eliyle Don
   Quijote'u yazdı. Kendisi bu savaşı "tarihin en büyük
   olayı" diye tanımladı.

   Bir başka gerçek: Osmanlı, İnebahtı'dan sadece 6 ay sonra
   donanmasını yeniden inşa etti. Sadrazam Sokullu'nun
   Venedik elçisine sözü ünlüdür: "Biz Kıbrıs'ı alarak
   kolunuzu kestik. Siz donanmamızı yenerek sakalımızı
   tıraş ettiniz. Kol yerine yenisi gelmez, sakal yeniden çıkar."
```

### Haçlı Seferi Çağrısı (Güncellenen)

```
LLM EVENT DUYURUSU:
  "Papa'nın sesi tüm Hristiyan dünyada yankılanıyor:
   'Deus Vult! — Tanrı böyle istiyor!' Binlerce şövalye
   ve köylü Kudüs'e yürümek için yola çıkıyor."

   ☽ BILIYOR MUYDUN?
   Birinci Haçlı Seferi'nde (1096) halk ordusunun bir kısmı
   Kudüs'e varmadan önce Almanya'daki Yahudi topluluklarını
   katletti — "önce yakındaki kafiri temizleyelim" diye.
   Bu, Avrupa'nın en erken organize pogromlarından biriydi.

   Ve ironik bir detay: Haçlılar Kudüs'ü aldıklarında (1099),
   şehirdeki Müslüman, Yahudi VE Hristiyan sivilleri
   ayırt etmeden katlettiler. Şehrin Doğu Hristiyanları da
   Haçlılardan zarar gördü.
```

### Yeni Dünya Gümüşü (Ekonomik Event)

```
LLM EVENT DUYURUSU:
  "İspanya'dan garip haberler — Yeni Dünya'dan o kadar çok
   gümüş geliyor ki İspanyol reali artık eskisi kadar değerli
   değil. Fiyatlar her yerde yükseliyor."

   ☽ BILIYOR MUYDUN?
   Potosí gümüş madeni (bugünkü Bolivya) tek başına dünya
   gümüş üretiminin yarısını karşılıyordu. İspanyollar
   madende 8 milyon yerli işçinin öldüğünü tahmin ediyor.
   "Potosí kadar zengin" deyimi İspanyolca'ya buradan girdi.
   Ama ironik biçimde gümüş İspanya'yı zenginleştirmedi —
   enflasyon patladı, İspanya 6 kez iflas etti (1557-1647).
```

### Venedik Camcılığı (Küçük Event)

```
LLM FISIILTISI (Venedik'te, rastgele):
  "Bir Murano camcısı alçak sesle: Biliyor musun, bizi bu
   adaya sürgün ettiler. 1291'de tüm cam fırınlarını Venedik'ten
   Murano'ya taşıdılar. 'Yangın riski' dediler ama asıl sebebi:
   sırlarımızı kaçırmamızı engellemek. Adadan kaçan camcı,
   ölümle cezalandırılır. Ben burada mahkumum — ama altın
   kafeste bir mahkum."

   [!] Gerçek: Venedik 1291'de cam üretimini Murano adasına
   taşıdı. Camcılar fiilen mahkumdu — ama aynı zamanda
   Venedik'in en zengin zanaatkarlarıydı.
```

## 2.5 NPC Derinleştirme

NPC'ler artık sadece ticaret botları değil, hikaye karakterleri:

### NPC Profil Şablonu

```
LLM'E GİDEN NPC YARATMA PROMPTİ:

  "Oyunun başında 4 NPC yarat. Her biri için:
   1. İsim (dönemine ve kökenine uygun)
   2. Köken şehir ve backstory (2 cümle)
   3. Gizli motivasyon (oyuncunun başta bilmediği)
   4. Tarihsel gönderme (gerçek bir kişi veya olaydan esinlenme)
   5. Başlangıç gemisi ve ünü
   6. Konuşma tarzı (kısa örnekle)

   DÖNEM: [oyunun başlangıç dönemi]
   OYUNCUNUN KÖKENİ: [oyuncunun seçimi]"
```

### Örnek NPC Seti (13. yy)

```
KAPTAN YORGOS — "Giritli Kurt"
  Köken: Girit, eski Bizans denizci ailesi. Konstantinopolis'in
  Latinler tarafından yağmalanmasını (1204) unutmamış.
  Gizli motivasyon: Latinlere intikam. Venedikli her tüccar düşmanı.
  Tarihsel gönderme: Bizans amirali Alexios Strategopoulos'tan esinlenme
  (1261'de Konstantinopolis'i geri alan komutan).
  Gemi: Kadırga. Ün: [Demir Pruva].
  Konuşma: Sert, kısa, kızgın. "Latinler her şeyi çaldı.
  Bir gün geri alacağız."

  ☽ NPC TRIVIA (oyun ilerledikçe paylaşır):
  "Biliyor musun, 1204'te Haçlılar Konstantinopolis'i yağmaladığında
   Ayasofya'nın altın mozaiklerini kazıyıp erittiler. At sırtında
   kiliseye girip içki içtiler. Bunu yapan Hristiyan'dı, kafir değil."

FATMA HATUN — "İskenderiye'nin Kızı"
  Köken: İskenderiye, Memlük dönemi. Baharat tüccarı ailesinden.
  Kadın olarak denizde ticaret yapması olağandışı ama başarılı.
  Gizli motivasyon: Baharat tekelini ele geçirmek. Sessiz ama acımasız.
  Tarihsel gönderme: Şecerüddür'den esinlenme (Memlük sultanlarının
  annesi olan güçlü kadınlar).
  Gemi: Karaka. Ün: [Altın Parmak].
  Konuşma: Kibar, hesaplı, her kelimesi tartılmış.
  "Baharat yolu 3000 yıldır akar. Ben sadece yatağını biraz değiştiriyorum."

  ☽ NPC TRIVIA:
  "Bilir misin, Memlükler aslında köle demek. Çocukken köle olarak
   alındılar, asker olarak yetiştirildiler, sonra sultanlığı ele
   geçirdiler. Köle olan adam sultan oldu. Akdeniz'de her şey mümkün."

DON ENRIQUE — "Katalan Şahin"
  Köken: Barselona, küçük Katalan soylusu. Toprak mirası yok,
  denizde şans arıyor. Haçlı idealizmiyle büyümüş ama gerçekçi.
  Gizli motivasyon: Kendi deniz beyliğini kurmak. Bir ada, bir kale.
  Tarihsel gönderme: Roger de Flor ve Katalan Kumpanyası'ndan esinlenme
  (Bizans'ta paralı askerlik yapan Katalan maceraperestler).
  Gemi: Kadırga. Ün: [Deli Rüzgâr].
  Konuşma: Gösterişli, romantik, bazen saçma cesur.
  "Babam diyordu ki 'toprak mirasını bekleyenlere, deniz miras verir.'"

  ☽ NPC TRIVIA:
  "Katalan Kumpanyası'nı duydun mu? 6000 paralı asker, Bizans'a
   hizmet etmeye gitti. Ama Bizans maaşlarını ödemeyince, tüm
   Mora'yı yakıp yıktılar. Sonra Atina'yı fethettiler ve 70 yıl
   boyunca Akropolis'te oturdular. 6000 çılgın Katalan."

SİMSAR RAŞİD — "Ragusa'nın Gölgesi"
  Köken: Ragusa, kimliği belirsiz. Arap mı, Yahudi mi, Rum mu —
  kendisi bile söylemiyor. Her dili konuşur, her limanda tanıdığı var.
  Gizli motivasyon: Bilgi imparatorluğu. Her sırrı bilmek, her sırrı satmak.
  Tarihsel gönderme: Benjamin de Tudela'dan esinlenme (12. yy Yahudi
  gezgini, tüm Akdeniz'i dolaşıp kayıt tuttu).
  Gemi: Feluka. Ün: [Hayalet Pala].
  Konuşma: Gizemli, çok dilli, her cümlede bir bilmece.
  "Bilgi altından değerlidir. Çünkü altını çalarlar ama bilgiyi
   çaldığını bile fark etmezsin."

  ☽ NPC TRIVIA:
  "Benjamin de Tudela diye bir Yahudi gezgin, 1165'te yola çıktı.
   Barselona'dan Bağdat'a kadar her şehri ziyaret etti. Her yerdeki
   Yahudi topluluğunu, nüfusunu, ticaretini kayıt etti. İlk iş
   istihbaratçısı belki de oydu."
```

## 2.6 10 Tur Anlatı Özeti (Genişletilmiş)

Her 10 turda LLM kapsamlı kişisel özet yapar:

```
LLM PROMPT:
  "Oyuncunun son 10 turluk hikayesini dramatik bir şekilde özetle.
   Dahil et: önemli olaylar, NPC ilişkileri, ün değişimleri,
   kişisel görev ilerlemesi, ve 1 tarihsel perspektif.
   3-4 paragraf. Sonunda 1 stratejik soru sor."

ÖRNEK ÇIKTI:

  ═══════════════════════════════════════════════════
  ☽ 10. TUR — KAPTANlN GÜNLÜĞÜ

  On tur geçti. Küçük bir Feluka'yla başladın, şimdi bir
  Karaka'nın güvertesinde duruyorsun. Venedik seni Tanıdık Yüz
  olarak karşılıyor — Murano camını İstanbul'a taşıdığın için
  minnettarlar. İstanbul'da ise Yabancı'sın hâlâ — ama Doğu
  İpeği'nin değerini öğrendin.

  Yorgos seni Girit'te buldu. Sert konuştu ama teklifi ciddiydi:
  "Venedik konvoyuna birlikte saldıralım." Reddettin — şimdilik.
  Ama Yorgos unutmaz. Fatma ise sessizce İskenderiye-Venedik
  baharatını domine ediyor. Altın Parmak ünü ona yakışıyor.

  Kahvehanede duyduğun söylenti doğruymuş: Kıbrıs'ta tuz kıtlığı
  var. İlk giden vurgun vuracak. Ama Kıbrıs yolu Ege Kapısı'ndan
  geçiyor ve Osmanlı devriyesi yoğun.

  ☽ Biliyor muydun: Bu dönemde (1204 sonrası) Akdeniz'in en
  güvenli rotası Ragusa üzerindendi. Ragusalılar hem Venedik'e
  hem Osmanlı'ya haraç ödeyerek tüm taraflarla iyi geçinirdi.
  Sen de Ragusa stratejisini düşünmeli misin?

  → SORU: Yorgos'un teklifi hâlâ masada. Venedik'le ilişkin
  güçlü ama Yorgos'un intikam ateşi seni de yakabilir.
  Onunla ittifak kuracak mısın, yoksa kendi yoluna mı devam?
  ═══════════════════════════════════════════════════
```

## 2.7 Tarihsel Dönem Geçiş Anlatıları

Her yüzyıl değişiminde özel anlatı:

```
11. → 12. YY GEÇİŞİ:
  "Bir çağ kapanıyor, bir çağ açılıyor. Haçlılar Kudüs'e ulaştı.
   Doğu'nun kapıları ardına kadar açıldı — baharat, ipek, bilgi,
   ve kan aktı. Sen bu yeni dünyanın neresinde duracaksın?"

   ☽ Biliyor muydun: Haçlı seferleri Avrupa'ya sadece baharat
   getirmedi. Cebir, felsefe, tıp, kâğıt yapımı, pusula...
   İslam dünyasının birikimleri Avrupa'ya Haçlı seferleriyle
   aktarıldı. İronik biçimde, savaş kültür taşıdı.

14. → 15. YY GEÇİŞİ:
  "Veba geçti ama izleri kalıcı. Nüfus yarıya düştü ama hayatta
   kalanlar zenginleşti. Sanatçılar yeni bir dünya hayal ediyor —
   buna Rönesans diyecekler. Sen bu yeniden doğuşun neresindeysin?"

   ☽ Biliyor muydun: Kara Veba'nın en ironik sonucu: hayatta
   kalan köylüler az oldukları için pazarlık gücü kazandı.
   Toprak sahipleri işçi bulamayınca ücretler fırladı. Veba,
   Avrupa'da feodalizmin çöküşünü hızlandırdı.
```

---

# KISIM III: GÜNCELLENMİŞ EVENT LİSTESİ (TRİVİA İLE)

Her event artık ☽ trivia taşıyor. İşte güncellenmiş örnek event'ler:

```
EVENT: BÜYÜK AKDENIZ FIRTINASI
  Duyuru: "Denizciler fısıldıyor: bu mevsim deniz öfkeli.
  Güneyde fırtınalar art arda geliyor."

  ☽ Biliyor muydun: Ortaçağ denizcileri hava tahminini
  rüzgâr yönü, bulut şekli ve deniz renginden yapardı.
  Akdeniz'de "Sirocco" (güney rüzgârı) Sahra'dan kum taşır
  ve gökyüzünü kırmızıya boyar — bu fırtına habercisiydi.

EVENT: HÜKÜMDAR DEĞİŞİMİ (İstanbul)
  Duyuru: "Sultan öldü. Sarayda veraset kavgası başladı.
  Yeni sultanın kim olacağını kimse bilmiyor."

  ☽ Biliyor muydun: Osmanlı'da veraset savaşını kazanan
  şehzade, kardeşlerini boğdururdu. Buna "kardeş katli"
  denirdi ve yasaldı — I. Mehmed'in kanunnamesine göre
  "devletin selameti için" gerekliydi. En çok kurban veren
  III. Mehmed'di: 19 kardeşini öldürttü.

EVENT: YAHUDİ SÜRGÜNÜ (1492)
  Duyuru: "İspanya'dan binlerce Yahudi kaçıyor. Gemiler dolu,
  altınları var, bilgileri var, gidecek yer arıyorlar."

  ☽ Biliyor muydun: Osmanlı Sultan II. Bayezid, Yahudi
  göçmenleri memnuniyetle karşıladı. Rivayete göre şöyle
  dedi: "Ferdinand'a akıllı diyorlar — ülkesini fakirleştirip
  benimkini zenginleştiren adama mı akıllı denir?"
  Selanik, 20. yüzyıla kadar çoğunluğu Yahudi bir şehir olarak kaldı.

  İkilem:
  A) Göçmenlere yardım et (taşıma işi) → itibar + gelir
  B) Göçmenlerin mallarını ucuza kap → kısa vadeli kâr ama ahlaki bedel
  C) Osmanlı'ya göçmen bilgisi sat → diplomatik avantaj

EVENT: KAHVE'NİN KEŞFİ
  Duyuru: "Yemen'den garip bir içecek geliyor. Ona 'kahve'
  diyorlar. İçenler uyumuyormuş. Ulemanın bir kısmı haram
  diyor, bir kısmı helal."

  ☽ Biliyor muydun: Kahve ilk olarak Sufi dervişlerin
  gece ibadetlerinde uyanık kalmak için kullanıldı.
  Osmanlı'da kahvehaneler "mekteb-i irfan" (bilgi okulu)
  olarak anıldı — ama sultanlar kahvehaneleri siyasi muhalefet
  yuvası olarak gördüğü için birkaç kez yasakladı.
  Kahve Avrupa'ya ulaştığında Papa VIII. Clement tadına
  baktı ve "bu kadar lezzetli bir şey kafir içeceği olamaz,
  vaftiz edelim" dedi.
```

---

# ENTEGRASYON: TÜM SİSTEMLER BİRLİKTE

```
SINGLEPLAYER BİR TUR:

  FONDACO:
    1. Kahvehane → 3 fısıltı (biri ☽ trivia olabilir)
       + kişisel görev ipucu (varsa)
    2. NPC mesajı (LLM) → teklif, tehdit, bilgi veya hikaye
    3. Pazar → menşe mal al/sat (açlık/doyma mekaniği)
    4. Şehir yöneticisi (opsiyonel) → görev, kontrat

  EMİR:
    Nereye + Nasıl + Niyet (4 seçenek)

  RÜZGÂR:
    1. Hava + karşılaşma çözümü
    2. Savaş varsa: taktik seçimi (Pruva/Ateş/Manevra)
    3. Savaş çözümü
    4. Ticaret çözümü (açlık/doyma + ilk gelen)
    5. Söylenti üretimi
    6. Deneyim güncelleme (sessiz)
    7. Ün kontrolü (sessiz)

  ANLATICI (LLM):
    → Tur sonu kısa yorum (1-2 cümle)
    → Her 10 turda kapsamlı özet
    → Event anında dramatik duyuru + ☽ trivia
    → NPC'lerin kendi trivia'ları (karakter gelişimiyle)
```

---

*"Akdeniz bir ders kitabı değil, bir hikaye. Ve en iyi hikayeler, dinleyenin 'gerçekten mi?!' dediği anlarda doğar."*
