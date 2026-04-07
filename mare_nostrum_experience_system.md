> 🔧 **WIP / ÇALIŞMA DOKÜMANI** — Bu doküman modüler bir çalışma parçasıdır. Güncel konsolide versiyon için → `mare_nostrum_master_v3.md` dosyasına bakınız.

---

# MARE NOSTRUM — Görünmez Deneyim Sistemi
## "Skill" Değil, "Ne Yaşadıysan O'sun"

---

# FELSEFE

Oyuncu hiçbir zaman bir ekranda "Ticaret: 47" görmez. Hiçbir zaman "skill puanım arttı" bildirimi almaz. Hiçbir zaman "bu aksiyonu yapmak için 60 puan gerekiyor" engeline çarpmaz.

Ama oyun her şeyi izliyor. Sessizce. Ve oyuncunun geçmiş deneyimleri, oyunun ona nasıl davrandığını değiştiriyor — tıpkı gerçek hayattaki gibi. Çok savaşan adam savaşı öğrenir. Çok pazarlık yapan adam fiyatı koklar. Çok gizli iş çeviren adam fısıltıları duyar. Ama hiçbiri bunu bir sayıyla bilmez.

**Oyuncu farkı HISSEDER ama ÖLÇEMEZ.** "Son zamanlarda kahvehanede daha iyi şeyler duyuyorum" der ama nedenini tam bilemez. "Pazarlıkta bir şekilde daha iyi fiyat alıyorum" der ama formülü bilmez. Bu belirsizlik, spreadsheet'i öldürür ve içgüdüyü yaşatır.

---

# MEKANİK: DÖRT GİZLİ HAVUZ

Arka planda dört "deneyim havuzu" var. Oyuncu bunları görmez:

```
  [Meltem]     Fırtına, yolculuk, karşılaşma, kaçış, savaş deneyimi
  [Terazi]     Ticaret, fiyat gözlemi, pazarlık, stok yönetimi deneyimi
  [Mürekkep]     Müzakere, şehir devleti etkileşimi, söylenti yönetimi deneyimi
  [Simsar]     Kaçakçılık, gizli iş, bilgi toplama, sahte söylenti deneyimi
```

Her havuz 0'dan başlar ve oyuncunun eylemleriyle sessizce dolar:

```
EYLEM                              HANGİ HAVUZ    NE KADAR
Denize çıktı (herhangi bir yolculuk)  Meltem       +0 (kaldırıldı — deneyim YAŞANARAK kazanılır)
Fırtınada hayatta kaldı               Meltem       +3
Savaşa girdi (kazansın kaybetsin)     Meltem       +2
Kaçış denemesi yaptı                  Meltem       +1
Mal alıp sattı                        Terazi       +1
Farklı bir limanda ticaret yaptı      Terazi       +1
Aynı turda 2+ oyuncuyla mesajlaştı    Mürekkep     +1
Şehir yöneticisiyle görüştü           Mürekkep     +2
Söylenti yaydı veya çürüttü           Mürekkep     +1
Commenda veya konvoy anlaşması yaptı  Mürekkep     +1
Kaçakçılık yaptı (başarılı)           Simsar       +2
Kaçakçılık yaptı (yakalandı)          Simsar       +1 (başarısızlık da öğretir)
Sahte söylenti yaydı                  Simsar       +1
Birinin kargosunu gözetledi           Simsar       +1
Avlanma emri verdi                    Simsar       +1
```

**Havuzlar SINIRSIZ büyür.** Maximum yok. 200 turda denize çıkmış bir kaptan, Meltem havuzunda 300+ puana ulaşabilir. Bu birikimdir — zaman yatırımı.

**AMA: Oran önemli, toplam değil.** Oyunun baktığı şey "bu oyuncunun deneyimi ne kadar Meltem ağırlıklı?" sorusu:

```
AĞIRLIK HESABI:
  Meltem oranı = Meltem havuzu / (Meltem + Terazi + Mürekkep + Simsar)

  Örnek oyuncu A: Meltem 80, Terazi 20, Mürekkep 30, Simsar 10 = toplam 140
    Meltem oranı = 80/140 = %57 → Denizci ağırlıklı

  Örnek oyuncu B: Meltem 30, Terazi 90, Mürekkep 50, Simsar 20 = toplam 190
    Terazi oranı = 90/190 = %47 → Tüccar ağırlıklı
```

## Generalist Dezavantajları

Oran %25'in altında olan havuzlarda oyuncu belirli fırsatları TAMAMEN KAÇIRIR:

  → Meltem %25 altı: fırtına öncesi uyarı ASLA duyulmaz
  → Terazi %25 altı: sahte piyasa söylentilerini ASLA fark edemezsin
  → Mürekkep %25 altı: şehir yöneticisinin gizli bilgilerini ASLA duyamazsın
  → Simsar %25 altı: kahvehanede gizli fısıltıları ASLA duyamazsın

Ün kazanmak için minimum %35 oran gereksinimi: her şeyi yapan generalist oyuncuya HİÇBİR ün gelmez. Bu, uzmanlaşma baskısını pekiştirir.

---

# ETKİLER: OYUNCU NE HİSSEDER?

## 1. Kahvehane Fısıltıları Değişir

Oyuncunun en yüksek havuzu, kahvehanede DUYDUĞU şeyleri belirler. Aynı kahvehanede iki oyuncu farklı fısıltılar duyar:

```
VENEDIK KAHVEHANESİ, AYNI TUR:

  Meltem ağırlıklı oyuncu duyar:
    "Ege'de üç günlük fırtına bekleniyor."
    "Girit açıklarında Osmanlı devriye gemileri görüldü."
    "Doğu rotasından gelen bir gemici, akıntının değiştiğini söyledi."

  Terazi ağırlıklı oyuncu duyar:
    "İskenderiye'den gelen baharat az, fiyat fırlayacak."
    "Cenovalılar İstanbul'da cam stoku yapıyor."
    "Kış geliyor, tahıl şimdiden pahalanmaya başladı."

  Mürekkep ağırlıklı oyuncu duyar:
    "Venedik Doju'su Osmanlı'yla gizli müzakere yürütüyor."
    "Cenova'yla ittifak söylentileri var."
    "Korsan Can hakkında İstanbul'dan ihbar gelmiş."

  Simsar ağırlıklı oyuncu duyar:
    "Gümrükçüler bu hafta gevşek, kaçakçılık için uygun."
    "Beren'in gemisinde yasak mal olduğunu biri fısıldadı."
    "Doğu rotasında donanma yok — avlanmak isteyenler için açık."
```

**Oyuncu, diğer oyuncunun ne duyduğunu bilmez.** Aynı kahvehane, farklı gerçeklikler. Bu, bilgi ticaretini DOĞAL olarak oluşturur: "Sen ne duydun? Ben şunu duydum" — ama karşı taraf yalan söylüyor olabilir.

**Ve bu LLM'e çok temiz bir şekilde aktarılır:**

```
LLM PROMPT:
  "Bu oyuncunun deneyim profili: Meltem ağırlıklı (%57).
   Bu limandaki mevcut duruma göre 3 fısıltı üret.
   En az 2 tanesi Meltem/güvenlik ile ilgili olsun.
   1 tanesi başka bir alandan sürpriz olabilir."
```

LLM'e "bu oyuncunun Meltem skill'i 47" demiyoruz. "Bu oyuncu denizci ağırlıklı" diyoruz. LLM bunu çok daha iyi yorumlar — doğal dil, doğal çıktı.

## 2. Pazarlık Verimliliği Değişir

Terazi ağırlıklı oyuncu ticarette GİZLİ avantajlar kazanır. Ama oyuncu bunu sayısal olarak görmez:

```
Terazi AĞIRLIĞI DÜŞÜK (%0-20):
  → Pazar ekranında sadece oklar görünür: ↑ ↓ →
  → Fiyat "bir yerden bir yere" oynuyor, nereye gittiğini bilemezsin
  → Şehir yöneticisi sana standart fiyat verir

Terazi AĞIRLIĞI ORTA (%21-40):
  → Okların yanında hafif bir ipucu: ↑↑ (hızlı yükseliyor) vs ↑ (yavaş)
  → Fiyat trendinin GÜCÜNÜ hissedersin
  → Şehir yöneticisi bazen indirim teklif eder

Terazi AĞIRLIĞI YÜKSEK (%41-60):
  → Okların yanında bir renk kodu: yeşil ok = gerçekten yükseliyor,
    sarı ok = belirsiz, kırmızı ok = düşüyor gibi görünüp aslında sabit
  → Sahte trendleri FARK EDERSİN — başka oyuncu "fiyat fırladı" dese bile
    senin ekranında "hmm, pek emin değilim" hissi var
  → Şehir yöneticisi daha iyi görevler ve fiyatlar sunar

Terazi AĞIRLIĞI ÇOK YÜKSEK (%61+):
  → Oklar artık çok detaylı: "bu mal 2 tur sonra düşecek" hissi veren
    görsel ipuçları (grafik trendi gibi ama rakamsız)
  → Sahte söylentilere karşı BAĞIŞIKLIK — piyasa manipülasyonu seni etkilemez
  → Şehir yöneticisi sana özel ticaret tekelleri açar
```

**Oyuncu hiçbir zaman "%47 Terazi ağırlığım var" bilmez.** Sadece "son zamanlarda fiyatları daha iyi okuyorum" hisseder. Ve bu his DOĞRU — çünkü arka planda gerçekten daha iyi bilgi alıyor. Ama ne kadar iyi olduğunu ölçemez. Spreadsheet imkansız.

## 3. Savaş ve Meltem Deneyimi Hissedilir

Meltem ağırlıklı oyuncu denizde daha iyi performans gösterir ama bunu sayısal olarak bilmez:

```
Meltem AĞIRLIĞI DÜŞÜK (%0-20):
  → Savaşta zar normal atılır (1-6)
  → Fırtınada hasar riski standart (%30)
  → Kaçış şansı standart

Meltem AĞIRLIĞI ORTA (%21-40):
  → Savaşta zarın ALT SINIRI yükselir: 2-6 (1 gelme ihtimali yok)
  → Fırtınada hasar riski biraz düşer (%25)
  → Kaçış denemesinde hafif bonus

Meltem AĞIRLIĞI YÜKSEK (%41-60):
  → Savaşta zar: 2-6 + beraberliklerde SEN kazanırsın
  → Fırtınada hasar riski düşük (%15)
  → Kaçış neredeyse garantili (hız eşitse bile)
  → Kahvehanede fırtına uyarısını 1 tur önceden duyarsın

Meltem AĞIRLIĞI ÇOK YÜKSEK (%61+):
  → Savaşta zar: 3-6 (alt sınır 3!)
  → Fırtınada neredeyse hasar almaz
  → Denizde rota kısayolu bulur (1 tur erken varış %20 şans)
  → Kahvehanede TÜM deniz bilgilerini duyar — donanma hareketleri dahil
```

**Oyuncu ne hisseder?** "Eskiden fırtınada çok hasar alıyordum, artık almıyorum. Savaşta da şansım daha iyi gibi." Gerçekten de öyle — ama ne kadar iyi olduğunu bilemez. Rakibinin zar aralığını bilemez. Fırtına hasarını karşılaştıramaz. Sadece HISSEDER.

## 4. Diplomasi ve Mürekkep Deneyimi

Mürekkep ağırlıklı oyuncu sosyal etkileşimlerde avantaj kazanır:

```
Mürekkep AĞIRLIĞI DÜŞÜK (%0-20):
  → Şehir yöneticisi kısa ve soğuk konuşur
  → Söylenti yayma başarı oranı düşük
  → İttifak bulaşması normal hızda

Mürekkep AĞIRLIĞI ORTA (%21-40):
  → Şehir yöneticisi daha sıcak, ara sıra ipucu verir
  → Söylenti yayma daha etkili (daha hızlı yayılır)
  → İttifak bulaşması biraz yavaşlar

Mürekkep AĞIRLIĞI YÜKSEK (%41-60):
  → Şehir yöneticisi seninle uzun konuşur, sırlar paylaşır
  → Söylenti çürütme çok kolay
  → İttifak bulaşması yarı hızda — iki düşman güçle iyi geçinebilirsin
  → Fidye pazarlığında büyük avantaj

Mürekkep AĞIRLIĞI ÇOK YÜKSEK (%61+):
  → Şehir yöneticisi sana GÖREV SEÇENEĞİ sunar (2-3 görev arasından seç)
  → Başka oyuncuların söylentilerini duyarsın (kim ne yaydı)
  → İttifak bulaşması minimum — gerçek diplomat, herkesin arkadaşı
  → Barış aracılığı yapabilirsin (NPC savaşları arasında)
```

**LLM entegrasyonu burada çok zarif:**

```
LLM PROMPT (Mürekkep ağırlıklı oyuncu için):
  "Sen İstanbul valisisin. Bu oyuncu çok deneyimli bir diplomat.
   Ona sıcak davran, bir sır paylaş, 2-3 görev seçeneği sun.
   Kısa ama içerikli konuş."

LLM PROMPT (Mürekkep ağırlığı düşük oyuncu için):
  "Sen İstanbul valisisin. Bu oyuncu tanınmamış biri.
   Kısa ve resmi konuş. Tek bir standart görev teklif et.
   Sır paylaşma."
```

Aynı şehir yöneticisi, farklı oyunculara farklı davranıyor — ve bu tamamen doğal geliyor. LLM bunu mükemmel yapar.

## 5. Simsar Deneyimi

Simsar ağırlıklı oyuncu karanlık işlerde avantaj kazanır:

```
Simsar AĞIRLIĞI DÜŞÜK (%0-20):
  → Kaçakçılık yakalanma riski yüksek (%40)
  → Sahte söylenti kolayca çürütülür
  → Başkalarının kargosunu göremezsin
  → Avlanma emrinde hedefi önceden bilemezsin

Simsar AĞIRLIĞI ORTA (%21-40):
  → Kaçakçılık yakalanma riski düşer (%25)
  → Sahte söylentiler daha inandırıcı
  → Aynı limandaki oyuncuların gemi tipini görürsün
  → Kahvehanede "gizli" fısıltılar duyarsın

Simsar AĞIRLIĞI YÜKSEK (%41-60):
  → Kaçakçılık yakalanma riski düşük (%10)
  → Sahte söylentiler neredeyse çürütülemez
  → Aynı limandaki oyuncuların kargo kategorisini görürsün
    (lüks mü, savaş mı, yemek mi)
  → Avlanma emrinde rotadaki gemilerin GÜCÜNÜ önceden hissedersin
    ("güçlü bir gemi var" veya "kolay av" bilgisi)

Simsar AĞIRLIĞI ÇOK YÜKSEK (%61+):
  → Kaçakçılık neredeyse yakalanmaz (%3)
  → Başkalarının söylenti yaydığını TESPİT EDERSİN
    (kim yaydı, ne yaydı — tam bilgi)
  → Aynı limandaki oyuncuların SON EMRİNİ bilirsin
    (geçen tur nereye gittiler, ne yaptılar)
  → "Hayalet Pala" ünü çok kolay kazanılır
```

---

# ÜN SİSTEMİ İLE ENTEGRASYON

Deneyim havuzları, ün kazanımını da etkiler. Ama dolaylı olarak:

```
ÜN KAZANMA KURALI (oyuncuya görünmez):
  Ün, havuz AĞIRLIĞI + söylenti kombinasyonuyla tetiklenir.

  "ALTIN PARMAK" ünü için:
    → Terazi ağırlığı %35+ VE ticaret söylentisi 3+ aktif
    (Yani çok ticaret yaptın VE herkes bunu biliyor)

  "DEMİR PRUVA" ünü için:
    → Meltem ağırlığı %35+ VE savaş söylentisi 2+ aktif
    (Çok savaştın VE savaşların konuşuluyor)

  "İPEK DİL" ünü için:
    → Mürekkep ağırlığı %35+ VE diplomasi söylentisi 2+ aktif
    (Çok müzakere ettin VE diplomatik başarıların biliniyor)

  "HAYALET PALA" ünü için:
    → Simsar ağırlığı %30+ VE hakkında olumsuz söylenti AZ
    (Çok gizli iş çevirdin AMA yakalanmadın — sessiz kaldın)

  "MÜHÜRLÜ SÖZ" ünü için:
    → Mürekkep ağırlığı %25+ VE hiç ihanet söylentisi yok
    (Diplomasi deneyimin var VE kimse senden şikayet etmemiş)

  "AKREP" ünü için:
    → 3+ ihanet söylentisi aktif (havuz fark etmez)
    (Herkes seni hain olarak biliyor)
```

**Güzel olan:** Ün kazanmak için iki koşul var — deneyim VE itibar. Çok savaşıyorsun ama kimse bilmiyorsa "Demir Pruva" ünü kazanamazsın. Ve tersi: herkes seni savaşçı sanıyor ama aslında 2 savaşa girdin — o zaman da ün gelmez. İkisi birlikte olmalı.

Bu, söylenti manipülasyonuna YENİ BİR BOYUT ekler: ünü HIZLANDIRMAK için kendi hakkında söylenti yaymak stratejik olur. "Ben çok büyük bir savaş kazandım" söylentisi yayarsın → savaş söylentin artar → Meltem deneyiminle birleşir → "Demir Pruva" ünü gelir. Ama söylenti yalanlanırsa, ün de gelmez.

---

# DENEYIM ÇÜRÜMESI

Havuzlar büyür ama ORAN değişir. Aktif olmadığın alanda oranın düşer:

```
NASIL ÇALIŞIR:
  Sen çok ticaret yapıyorsun → Terazi havuzun büyüyor
  Ama savaşmıyorsun → Meltem havuzun büyümüyor
  Terazi oranın artarken Meltem oranın DÜŞÜYOR (oran olarak)

  Bu, aktif çürüme DEĞİL — havuzdan puan silinmez.
  Ama diğer havuzlar büyüdükçe oran küçülür.
  Yani her şeyde iyi olmak İMKANSIZ — bir alanda derinleşmek
  diğer alanları göreceli olarak zayıflatır.
```

**Oyuncunun hissettiği:** "Eskiden fırtınalarda çok iyiydim ama son zamanlarda biraz paslandım gibi." Doğru — Meltem oranın düştü çünkü çok ticaret yaptın. Ama Meltem puanın aynı — sadece oran değişti.

**Bu, uzmanlaşma baskısı yaratır.** Her şeyi yapan oyuncu hiçbir alanda derin olamaz. Ama tek alana yoğunlaşan oyuncu diğer alanlarda kör kalır. İkilem.

**Ve bu ikilem, oyuncu-oyuncu ilişkilerini DOĞAL OLARAK yaratır:** Meltem denizcisi, Terazi tüccarına ihtiyaç duyar (iyi fiyat bilgisi için). Terazi tüccarı, Meltem denizcisine ihtiyaç duyar (güvenli yolculuk için). Simsar operatörü, Mürekkep diplomatına ihtiyaç duyar (söylenti yönetimi için). Ortaklık mekanik olarak zorlanmıyor — DOĞAL olarak ortaya çıkıyor.

---

# MOD-SPESİFİK DENEYİM DENGELEMESİ

Mürekkep multiplayer'da çok hızlı, Simsar singleplayer'da çok kolay büyür. Denge için:

```
SINGLEPLAYER AYARLARI:
  → NPC etkileşimlerinden Mürekkep +2 (artırılmış — MP'deki oyuncu
    mesajlaşmasını telafi eder)
  → Kaçakçılık yakalanma oranları %5 artırılmış (Simsar dengelemesi —
    NPC'ler daha kolay manipüle edildiği için)

MULTIPLAYER AYARLARI:
  → Mesajlaşma Mürekkep'i her 2 mesajda +1'e düşürülmüş
    (spam önleme + denge — her mesaj puan vermez)
  → Kaçakçılık yakalanma oranları standart
    (gerçek oyuncuları gözetlemek zaten zor)
```

---

# SINGLEPLAYER'DA NPC DENEYİM PROFİLLERİ

LLM NPC'lerinin de deneyim profili var ve bu, davranışlarını belirler:

```
KAPTAN YORGOS:
  Meltem %55, Terazi %10, Mürekkep %15, Simsar %20
  → Denizci ve hafif gölgeli — savaşçı korsan, ama diplomasisi zayıf
  → Kahvehanede deniz bilgisi duyar, ticaret bilgisini KAÇIRIR
  → Bu yüzden bazen kötü ticaret kararları verir — oyuncu bundan yararlanabilir

FATMA HATUN:
  Meltem %10, Terazi %60, Mürekkep %25, Simsar %5
  → Saf tüccar — çok iyi fiyat yapar ama savaşta zayıf
  → Korsan saldırısına karşı savunmasız — konvoy korumaya ihtiyaç duyar
  → Oyuncuyla ticaret ortaklığı arar
```

**LLM'e NPC davranışı prompt olarak gider:**

```
"Sen Kaptan Yorgos'sun. Deneyim profilin Meltem ağırlıklı.
 Bu demek ki: denizde güçlüsün ama ticarette zayıfsın.
 Ticaret kararlarında hata yapabilirsin.
 Oyuncunun ticaret bilgisine ihtiyacın var.
 Bu tura karar ver ve oyuncuyla mesajlaşmak istersen yaz."
```

---

# OYUNCUYA GÖRÜNEN TEK ŞEY: ÜN

Oyuncu, deneyim havuzlarını hiçbir zaman sayısal olarak görmez. Gördüğü tek şey ÜNLERİ:

```
┌─ KAPTAN PROFİLİ ────────────────────┐
│                                       │
│  İsim: [oyuncu adı]                  │
│  Gemi: Tüccar gemisi                 │
│  Altın: 1,240                        │
│                                       │
│  Ünler:                              │
│    ★ Altın Parmak                     │
│    ★ İpek Dil                       │
│    ☆ (boş — 3. ün kazanılmamış)      │
│                                       │
│  Son söylentiler (hakkımda):          │
│    "İskenderiye'de büyük vurgun yaptı"│
│    "Venedik Doju'nun güvendiği biri"  │
│                                       │
└───────────────────────────────────────┘
```

**Ünler sonuç, deneyim havuzları sebep.** Oyuncu sonucu görür, sebebi hisseder ama ölçemez. Ve bu tam olarak istediğimiz şey:

- Spreadsheet imkansız (havuzları göremezsin)
- İçgüdü ödüllenir ("çok ticaret yaparsam ticarette daha iyi olurum" sezgisi doğru ama ne kadar iyi olduğunu bilemezsin)
- Uzmanlaşma doğal (her şeyi yapınca hiçbir şeyde derin olamazsın)
- Ortaklık doğal (farklı profillerdeki oyuncular birbirini tamamlar)
- Singleplayer'da NPC'ler tutarlı (profil = davranış)
- LLM entegrasyonu temiz (profil → prompt → doğal çıktı)

---

# ÖZET: ESKİ vs YENİ KARŞILAŞTIRMA

```
                    ESKİ SKİLL SİSTEMİ         YENİ DENEYİM SİSTEMİ
Oyuncuya görünür mü?  Evet (4×100 puan)        Hayır (sadece ünler görünür)
Puan basılır mı?      Evet (eylemle +1)         Hayır (otomatik, arka planda)
Oyuncu optimize        Evet (spreadsheet)        Hayır (ölçemez, hisseder)
  edebilir mi?
Uzmanlaşma nasıl?     Toplam havuz sınırı       Oran bazlı (doğal)
Etkisi ne?             Eşik bonusları (20→yetenek) Gradüel (fark edilmeden artan kalite)
LLM entegrasyonu?     Zor (sayı → davranış)      Kolay (profil kelimesi → prompt)
Oyuncu hissiyatı?     "Stat sheet dolduruyorum"   "Oyun beni tanıyor"
```

*"En iyi skill sistemi, oyuncunun farkında olmadığı skill sistemidir."*
