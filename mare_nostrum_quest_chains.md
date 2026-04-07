# MARE NOSTRUM — Singleplayer Görev Zincirleri
## Dört Köken Hikayesinin Tam Senaryosu

> 🔧 WIP — Aktif çalışma dokümanı. Master referans: `mare_nostrum_master_v3.md`

---

# GENEL MİMARİ

## Görev Zinciri Kuralları

1. **Kişisel görev zinciri ASLA zorunlu değil.** Oyuncu isterse tamamen yoksayabilir, serbest ticaret/korsanlık yapabilir. Görev ipuçları kahvehanede FIRSILTI olarak gelir — oyuncu fark etmezse veya ilgilenmezse geçer.

2. **Her zincir 5 aşama, ~25-30 turda tamamlanır.** Her aşama 4-6 tur arası. Ama oyuncu hızlı oynayıp 15 turda bitirebilir veya yavaş oynayıp 40 turda bitirebilir.

3. **Her aşamada EN AZ 2 yol var.** Tek çözüm yok. Savaşla da, diplomatik yolla da, Zehir'le de, Kuşatma ile de ilerleyebilirsin.

4. **NPC'ler görev zincirine dahil.** Her zincirde en az 2 NPC kritik rol oynar. NPC'lerin kendi motivasyonları zincirle çakışır veya çelişir.

5. **Tarihsel trivia zincirin dokusuna işlenmiş.** Her aşamada en az 1 ☽ trivia. Görev ilerledikçe tarihsel derinlik artar.

6. **Zincirin sonu ÜN verir.** Her zincirin finali özel bir ün veya mevcut bir ünü güçlendirir.

## Görev İpucu Formatı

Görev ipuçları kahvehanede özel sembolle görünür:

```
┌─ VENEDİK KAHVEHANESİ ─────────────────────────────────┐
│                                                         │
│  "İstanbul'da ipek fiyatı yükseliyor."                  │
│                                                         │
│  "Batı rotasında fırtına haberi var."                   │
│                                                         │
│  ⚓ "Yaşlı bir gemici seni arıyor. 'Babanı tanırdım'   │
│     diyor. Tersanede bekliyor."                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**⚓ sembolü** = kişisel görev ipucu. Oyuncu tıklarsa görev ilerler. Tıklamazsa bir sonraki turda tekrar çıkar (3 tur boyunca). 3 turda ilgilenmezse ipucu kaybolur — ama görev ölmez, birkaç tur sonra farklı bir ipucuyla geri gelir.

---

# KÖKen 1: KAYIP HAZİNE
## "Denizin Altındaki Miras"

### Tema ve Ruh

Oyuncu bir söylentiyi takip eder: Akdeniz'in dibinde, yüzyıllardır unutulmuş bir hazine yatıyor. Bir batık gemi, bir kayıp filo, bir gömülü kasa — ne olduğu başta belirsiz. Zincir ilerledikçe hazinenin ne olduğu netleşir ve asıl soru ortaya çıkar: hazineyi bulduktan sonra ne yapacaksın?

**Tarihsel ilham:** Gerçek Akdeniz batıkları — Uluburun batığı (MÖ 14. yy, dünyanın en zengin antik batığı), Antikythera batığı (dünyanın ilk analog bilgisayarı), ve yüzlerce Venedik/Osmanlı ticaret gemisi batığı.

### Aşama 1: Fısıltı (Tur 3-6)

**Tetikleyici:** Oyuncunun ev limanında, 3. turda kahvehanede:

```
⚓ "Köşedeki sarhoş gemici masana çöküyor:
   'Ben gördüm... Girit açıklarında... ay ışığında denizin dibi
   parlıyordu. Altın gibi. Ama kimse inanmıyor bana.
   Sen... sen farklı görünüyorsun. İnan bana.'"
```

**Oyuncu seçenekleri:**
- **[Dinle]** → Gemici devam eder: "Bir harita var. Parçalanmış. Üç parça. Biri bende. Ama beleşe vermem — 50 altın."
- **[Kovala]** → Görev kaybolur, 5 tur sonra farklı limanda farklı NPC'yle geri gelir.

**[Dinle] sonrası:**
- **50 altın öde** → Harita Parçası 1 alınır. Gemici: "İkinci parça İstanbul'da, Kapalıçarşı'da bir antikacıda. Üçüncüsü... bilmiyorum. Ama antikacı bilir."
- **Pazarlık et (Terazi kontrolü)** → Terazi %30+: 30 altına indirirsin. Altı: 50 altın.
- **Zorla al (Demir)** → Gemiciyi korkutursun, harita parçasını alırsın. Ama söylenti: "Yaşlı gemiciyi soydu." İtibar hasarı.

```
☽ BILIYOR MUYDUN?
Uluburun batığı (Türkiye, MÖ 1300 civarı) keşfedildiğinde içinden
10 ton bakır, 1 ton kalay, Mısır altınları, fildişi ve dünyanın
en eski kitabı (balmumu tablet) çıktı. Tek bir gemide, bir
imparatorluğun serveti yatıyordu.
```

### Aşama 2: Antikacı (Tur 7-12)

**Tetikleyici:** İstanbul'a varış.

```
⚓ "Kapalıçarşı'nın en karanlık köşesinde, toz kaplı bir dükkân.
   Yaşlı antikacı seni süzüyor: 'Harita parçası arayan bir yüz daha.
   Sen kaçıncısın bilmiyorum. Ama parçayı hâlâ satmadım — çünkü
   kimse bedelini ödeyemedi.'"
```

**Antikacı ile diyalog (LLM):**

```
LLM PROMPT:
  "Sen İstanbul Kapalıçarşı'da yaşlı bir antikacısın. Adın Yakup.
   Rum Ortodoks, ailesi 1204'te Latinlerin yağmasından kurtulmuş.
   Harita parçasını satabilirsin ama bedelini yüksek tutuyorsun.
   Altın değil — bir IYILIK istiyorsun.
   Oyuncu sana geldi. 3 mesaj alışverişi. Gizemli ve hesaplı konuş."

YAKUP'UN TEKLİFİ (LLM üretir, çerçeve):
  "Altın istemiyorum. İstanbul'da altın bol.
   Benim istediğim: Venedik'ten bir şey getir.
   Ayasofya'dan çalınan bir emanet var — küçük bir ikon, Meryem Ana.
   1204'te Latinler çaldı. Şimdi Venedik'te bir kilisenin bodrumunda.
   Bana getir, harita parçası senin."
```

**Oyuncu seçenekleri:**
- **Kabul et** → Venedik'e dön, ikonu bul (Aşama 2B)
- **Altınla ikna et (Terazi kontrolü)** → Terazi %45+: 300 altınla razı olur. Altı: reddeder.
- **Çal (Simsar kontrolü)** → Simsar %40+: antikacının dikkatini dağıtıp parçayı çalarsın. Söylenti riski.
- **Bilgi teklif et (Mürekkep)** → Mürekkep %35+: "Venedik'in gizli planları hakkında bilgim var" ile takas.

**Aşama 2B — Venedik'te İkon Arayışı (opsiyonel, kabul ettiyse):**

```
⚓ Venedik'te: "San Marco yakınlarında küçük bir kilise. Bodrumda
   eski Bizans emanetleri saklanıyormuş. Ama kilise papazı
   bu emanetleri kimseye göstermiyor."

SEÇENEKLER:
  A) Papazla konuş (Mürekkep kontrolü) → İkna et, ikonu al
  B) Gece baskını (Simsar kontrolü) → Çal, kaç
  C) Venedik Doju'na ihbar et: "Kilisede çalıntı Bizans malı var"
     → Doj soruşturma açar, ikon müsadere edilir, sen aradan alırsın
     (karmaşık ama kimseyi kızdırmazsın)
```

```
☽ BILIYOR MUYDUN?
1204'te Haçlılar Konstantinopolis'i yağmaladığında, Ayasofya'nın
altın ve gümüş eşyalarını eritip sikke bastılar. Dört bronz at
heykeli (antik Roma eseri) söküldü ve Venedik'e götürüldü —
San Marco Bazilikası'nın cephesinde hâlâ duruyorlar.
Bizans, tarihsel kayıplarını hiç unutmadı.
```

### Aşama 3: Üçüncü Parça (Tur 13-18)

**Tetikleyici:** Harita Parçası 2 alındıktan sonra, herhangi bir kahvehanede:

```
⚓ "Antikacı Yakup'un verdiği notta yazıyor:
   'Üçüncü parça, sahip değiştirmiş. Son duyan, Cezayir'de
   Korsan Reis Hamid'in elinde olduğunu söyledi.
   Dikkatli ol — Hamid kolay adam değil.'"
```

**Burada NPC devreye girer.** Korsan Reis Hamid, oyunun NPC'lerinden biri DEĞİL — görev özel NPC'si. Ama mevcut NPC'ler yardım edebilir:

- **Kaptan Yorgos:** "Hamid'i tanırım. Deli bir adam. Ama saygı duyduğu biri var — kendisini savaşta yenen biri. Ona yenilmezsen konuşmaz bile."
- **Simsar Raşid:** "Hamid'in bir zayıf noktası var — annesi Tunus'ta hasta. Ona ilaç götürürsen yumuşar."
- **Fatma Hatun:** "Hamid bana borçlu. İstersen aracılık yaparım — ama komisyonum var."

**Oyuncu seçenekleri (çoklu yol):**

```
YOL A — DEMİR: Hamid'i denizde bul ve yen.
  → Cezayir açıklarında "Kara Bayrak" niyetiyle avlan
  → Hamid ile karşılaşma (%60 şans, 2 tur dene)
  → Savaş: Hamid güçlü (Kadırga, güç 3+2 ün = 5 + zar)
  → Kazanırsan: harita parçasını ganimet olarak alırsın
  → Kaybedersen: fidye öder, tekrar denersin (ama Hamid artık seni biliyor)

YOL B — MÜREKKEP: Fatma aracılığıyla müzakere.
  → Fatma'ya 100 altın komisyon
  → Fatma, Hamid'le görüşür (1 tur bekle)
  → Hamid'in talebi: "Bana 3 birim Savaş malı getir, harita senin"
  → Silah kaçakçılığı! Yasal yoldan da getirebilirsin (Cezayir'de savaş malı ucuz zaten)

YOL C — SİMSAR: Hamid'in annesine ilaç.
  → Tunus'a git, ilaç al (Yemek kategorisi, özel menşe)
  → Tunus'tan Cezayir'e geç
  → Hamid: "Anneme yardım eden adama hayır diyemem." Harita parçası senin.
  → Bonus: Hamid artık sana borçlu, gelecekte yardım edebilir

YOL D — ZEHİR: Hamid'in düşmanlarına bilgi sat.
  → Malta Şövalyelerine: "Hamid'in rotasını biliyorum"
  → Şövalyeler Hamid'e saldırır, Hamid zayıflar
  → Zayıflamış Hamid'den haritayı al (ya satın al ya zorla)
  → AMA: Cezayir'de "Hamid'i sattın" söylentisi yayılır → Berber Kıyısı'nda Kem Göz
```

```
☽ BILIYOR MUYDUN?
Kuzey Afrika korsanları arasında en ünlüsü Turgut Reis,
aslında bir çiftçinin oğluydu. Esir alınıp kürekçi yapıldı,
kaçtı, korsan oldu, sonunda Osmanlı amirali oldu. Hayatı
boyunca 30'dan fazla kale ve liman fethetti. 1565'te Malta
kuşatmasında öldü — son sözü: "Malta'yı aldık mı?"
(Almamışlardı.)
```

### Aşama 4: Harita Tamamlandı (Tur 19-24)

**Tetikleyici:** 3 parça birleştirildiğinde:

```
⚓ "Üç parçayı birleştirdin. Harita netleşiyor:
   Girit'in güneybatısında, Gavdos adası açıklarında
   bir batık gemi. Haritada bir not: 'Roma'nın kayıp filosu.
   Fırtınada battı. MÖ 67. Altın, gümüş, Mısır tahılı.'"
```

**Batığa ulaşmak için:**
- Girit'e git
- "Pusula" niyetiyle Gavdos rotasına çık (özel rota, sadece haritayla açılır)
- Meltem kontrolü: deneyimin yüksekse batığı bulursun (%70). Düşükse boş dönersin (%30) — tekrar dene.

**Batıkta ne var:**

```
BULUNTU (zar):
  1-2: Küçük hazine (300 altın değerinde antika)
  3-4: Orta hazine (600 altın + tarihi eser)
  5-6: Büyük hazine (1000 altın + efsanevi eser)

  Meltem %50+ ise: zara +1 bonus
```

**AMA:** Hazineyi buldun. Şimdi ne olacak?

```
⚓ "Hazineyi gemiye yükledin. Ama Girit kahvehanesinde
   herkes konuşuyor: 'Gavdos'ta birisi batık bulmuş.'
   Söylenti yayılıyor. HERKES senin peşinde."
```

**Otomatik söylenti:** "Gavdos'ta büyük hazine bulundu." Bu söylenti TÜM Akdeniz'e yayılır. Korsanlar, NPC'ler ve belki diğer oyuncular (multiplayer'da) seni avlar.

### Aşama 5: Hazineyle Ne Yaparsın? (Tur 25-30)

**Final ikilemi — 4 yol:**

```
YOL A — SAT VE ZENGİNLEŞ:
  → En yakın büyük limana git (Venedik, İstanbul, İskenderiye)
  → Hazineyi sat → büyük altın ödülü
  → Söylenti: "Büyük hazineyi bulup sattı" → Altın Parmak ününe katkı
  → Basit ama herkes peşinde — limana ulaşmak kolay değil

YOL B — MÜZeYE BAĞIŞLA:
  → Konstantinopolis (Bizans/Osmanlı) veya Venedik'e bağışla
  → Altın ödülü düşük ama İTİBAR devasa
  → Bağışladığın şehirle kalıcı Tanıdık Yüz + özel kontrat
  → Söylenti: "Hazineyi bağışladı, cömert adam" → Açık El ünü
  → Singleplayer'da LLM dramatik sahne yazar

YOL C — GİZLE VE PARÇA PARÇA SAT:
  → Hazineyi bir limanda depola (Ragusa güvenli — nötr)
  → Her tur küçük parçalar halinde sat → söylenti yavaş yayılır
  → Simsar kontrolü: gizli satış başarı oranı
  → Uzun vadede EN ÇOK kazandıran ama 10+ tur sürer
  → Söylenti: "Gizemli bir tüccar antika satıyor" → Hayalet Pala ünü

YOL D — HAZİNEYİ SİLAH OLARAK KULLAN:
  → Hazinedeki tarihi eseri siyasi koz olarak kullan
  → Örn: Roma dönemine ait bir ferman veya mühür
  → Bunu bir şehir devletine sun: "Bu eser sizin toprak hakkınızı kanıtlıyor"
  → Şehir devleti sana BÜYÜK iyilik borçlu olur
  → Söylenti: "Tarihi değiştiren adamm" → İpek Dil ünü
  → En karmaşık ama en ödüllü diplomatik yol
```

```
☽ BILIYOR MUYDUN?
MÖ 67'de Roma, Akdeniz'deki korsanlık sorununu çözmek için
Pompeius'a olağanüstü yetkiler verdi. Pompeius 3 ayda tüm
Akdeniz'i temizledi — 800 korsan gemisi yakaladı, 20.000
korsanı esir aldı. Tarihsel kaynaklara göre "deniz 40 yıldır
ilk kez güvenliydi." Ama temizleme sırasında kaybolan Roma
gemileri de vardı — senin bulduğun belki onlardan biri.
```

---

# KÖKEN 2: BABANIN ŞEREFİ
## "Mürekkeple Yazılmış Yalan"

### Tema ve Ruh

Oyuncunun babası bir zamanlar saygın bir tüccardı — ama iflas etti, adı lekelendi, ailesini yıkıma sürükledi. Oyuncu bu yıkımın arkasında bir komplo olduğuna inanıyor. Zincir ilerledikçe komplo çözülür: babayı batıran kişi(ler) ortaya çıkar. Ama gerçek her zaman beklediğin gibi değildir.

**Tarihsel ilham:** Bardi ve Peruzzi bankacılık krizi (1343-1346), Venedik ticaret entrikaları, ve Akdeniz'de aile intikamlarının yüzyıllar sürmesi geleneği.

### Aşama 1: Babanın Hayaleti (Tur 3-6)

**Tetikleyici:** Ev limanında:

```
⚓ "Tersanede yaşlı bir adam seni tanıdı:
   'Sen [baba adı]'nın oğlu/kızı değil misin?
   Babanı tanırdım. İyi adamdı. Batışı onun suçu değildi.
   Gel, sana bir şey göstereyim.'"
```

**Yaşlı adam (Nuri Usta — tersane ustası):**

```
LLM PROMPT:
  "Sen yaşlı bir tersane ustasısın. Oyuncunun babasının eski
   arkadaşıydın. Babanın batışında şüpheli şeyler gördün ama
   konuşmaktan korktun. Şimdi yaşlısın, ölümün yakın, vicdan
   azabı çekiyorsun. Kısa ve duygusal konuş."

NURİ USTA'NIN ANLATTIKLARI:
  "Baban bir commenda anlaşması yapmıştı — büyük bir iş.
   İpek yükü, İstanbul'dan Venedik'e. Ama yük limana hiç ulaşmadı.
   Baban, yükü korsanlara kaptırdığını söyledi. Ortağı [NPC ismi]
   buna inanmadı — babamı hırsızlıkla suçladı. Mahkeme babanı
   mahkum etti. Ama ben... ben o gece tersanedeyken babanın
   gemisinde garip adamlar gördüm. Ortağının adamları."
```

**İpucu:** Babanın eski ortağı — bu, mevcut NPC'lerden biri. Oyuncunun başlangıç limanına göre değişir:
- Venedik başlangıç → ortak: Don Enrique (Katalan Şahin)
- İskenderiye başlangıç → ortak: Fatma Hatun
- Cezayir başlangıç → ortak: Kaptan Yorgos
- Ragusa başlangıç → ortak: Simsar Raşid

Bu, NPC'yle ilişkiyi kişisel yapar — oyunun başından beri tanıdığın biri babanın düşmanı çıkıyor.

**Oyuncu seçenekleri:**
- **[Araştır]** → Nuri Usta'dan detay al. Aşama 2'ye geç.
- **[Unut]** → "Geçmişi karıştırmak istemiyorum." Görev dondurulur (ama 10 tur sonra geri gelir — hayalet kolay kolay bırakmaz).

```
☽ BILIYOR MUYDUN?
Ortaçağ Venedik'te ticaret davasları "Quarantia" (Kırk Kişilik Kurul)
tarafından yargılanırdı. Ama mahkeme genellikle zengin tüccarların
lehine karar verirdi — çünkü yargıçların çoğu zengin tüccar ailesindendi.
"Adalet" ile "güç" arasındaki çizgi çok inceydi.
```

### Aşama 2: Ortağın İzi (Tur 7-12)

**Tetikleyici:** Nuri Usta'nın ipucuyla ortağın limanına git.

```
⚓ "[Ortak NPC]'in ev limanına vardın. Onu bulmak kolay —
   herkes tanıyor. Ama seninle konuşmak isteyecek mi?"
```

**Burada oyunun NPC sistemi devreye giriyor.** Ortak NPC zaten oyunda var — oyuncu onunla daha önce ticaret yapmış, konuşmuş, belki ittifak bile kurmuş olabilir. Şimdi öğreniyor ki bu kişi babasını batırmış olabilir.

**Ortakla yüzleşme (LLM diyalog):**

```
LLM PROMPT:
  "Sen [NPC ismi]sin. Oyuncunun babası senin eski ortağındı.
   Gerçek: babayı sen batırdın. Commenda yükünü kendin çaldın,
   suçu babaya attın. Ama bunu kabul etmeyeceksin.
   Oyuncu seni sorguluyor. 3 mesaj alışverişi.
   İlk seferinde inkâr et. Basarsa çelişkiye düş."
```

**Ortağın savunması:** "Baban iyi bir adam değildi. Yükü korsanlara sattı, parayı kumarda yedi. Ben kurbanım, o değil."

**Oyuncu seçenekleri:**
- **İnan** → Görev farklı yöne gider (belki baban gerçekten suçluydu? Aşama 3B)
- **İnanma, kanıt ara** → Aşama 3A (soruşturma devam)
- **Doğrudan suçla** → Ortak reddeder, ilişki -40. Ama söylenti yayabilirsin.
- **Sessiz kal, gözlemle** → Ortağı izle, Simsar deneyimi kazan, bilgi topla

### Aşama 3A: Soruşturma (Tur 13-18)

**Kanıt toplama — 3 parça:**

```
KANIT 1 — Gümrük Kayıtları:
  → [Ortağın limanı]'nda gümrük kayıtlarını incele
  → Mürekkep kontrolü: %35+ → eski kayıtlara erişim
  → Bulgu: babanın yükü limana "ulaşmadı" yazıyor AMA
    aynı gün ortağın deposuna "menşesiz ipek" girişi var
  → Bu tek başına kanıt değil ama şüpheli

KANIT 2 — Eski Mürettebat:
  → Babanın eski gemicilerinden birini bul (Ragusa'da yaşıyor)
  → Ragusa'ya git, kahvehanede sor
  → Gemici: "O gece bizi karaya çıkardılar. 'Gemi bakıma girecek' dediler.
    Sabah gemi gitmişti. Ortağın adamlarıyla."
  → Simsar kontrolü: gemicinin söylediklerini doğrula

KANIT 3 — Ortağın Sırrı:
  → Ortağın hesaplarını araştır (Cenova bankası kayıtları)
  → Cenova'ya git, bankacılarla konuş (Terazi kontrolü veya rüşvet)
  → Bulgu: ortağın, babanın batışından 1 ay sonra büyük bir
    yatırım yaptığı — "nereden geldi bu para?"
```

**3 kanıttan 2'sini topladığında:**

```
⚓ "Elinde yeterli kanıt var. Ama bu kanıtlarla ne yapacaksın?
   Mahkemeye mi gideceksin, yoksa kendi adaletini mi sağlayacaksın?"
```

### Aşama 3B: Baban Gerçekten Suçlu muydu? (Alternatif Yol)

Ortağa inanmayı seçtiysen:

```
⚓ "Bir gece rüya görüyorsun — babanın yüzü. Ama net değil.
   Belki ortak doğru söylüyordur. Belki baban mükemmel değildi.
   Ragusa'daki eski gemici başka bir şey söyleyebilir."
```

→ Ragusa'ya git, gemiciyle konuş
→ Gemici: "Baban iyi adamdı ama... zayıftı. Kumar oynardı. Ama yükü ÇALMADI. Buna eminim."
→ Gerçek ortada: baban zayıf ama masum. Ortak fırsatçı ama katil değil.
→ Bu yol daha az dramatik ama daha GERÇEKÇI — ve oyuncuya farklı bir ikilem sunuyor: "Zayıf ama masum babanın adını mı kurtaracaksın, yoksa geçmişi bırakıp kendi yoluna mı gideceksin?"

```
☽ BILIYOR MUYDUN?
1343'te Floransa'nın Bardi ve Peruzzi bankaları iflas etti —
İngiltere Kralı III. Edward borçlarını ödemedi. Bu, Avrupa'nın
ilk büyük finansal kriziydi. Yüzlerce tüccar ailesi bir gecede
iflas etti. Bazıları masumdu — sadece yanlış bankaya para yatırmışlardı.
"İflas" kelimesi İtalyanca "banca rotta"dan (kırık tezgâh) gelir.
```

### Aşama 4: Adalet (Tur 19-24)

**3A yolundan geldiysen (kanıtlar var):**

```
YOL A — RESMİ ADALET (Mürekkep):
  → Kanıtları şehir devletine sun
  → Mürekkep %45+ ve şehirde Tanıdık Yüz → mahkeme açılır
  → Mahkeme süreci: 2 tur. Ortak savunma yapar (LLM diyalog).
  → Kazanırsan: ortak cezalandırılır, babanın adı temize çıkar
  → Kaybedersen: "iftira" suçlaması — SEN cezalandırılırsın

YOL B — HALKA AÇIKLA (Zehir):
  → Kanıtları söylenti olarak yay
  → "Şu adam ortağını batırdı, kanıtlar var" → Rüzgâr Ek
  → Resmi mahkeme yok ama ortağın itibarı çöker
  → Ortak artık kimseyle iş yapamaz — ekonomik ölüm
  → Sen ceza almazsın ama "intikamcı" söylentisi yayılır

YOL C — KİŞİSEL HESAPLAŞMA (Demir):
  → Ortağı denizde bul ve yüzleş
  → Savaş: ortağı yen → kargosuna el koy + haritasını al
  → Babanın çalınan yükünün "karşılığını" geri alırsın
  → Söylenti: "Babasının intikamını aldı" → Demir Pruva veya Deli Rüzgâr ünü

YOL D — AFFET (Mürekkep + yüksek Açık El):
  → Ortakla yüzleş ama affet
  → "Biliyorum ne yaptığını. Ama geçmişte kalmaya bırakıyorum."
  → Ortak şok olur — borçlu hisseder
  → Uzun vadede: ortak sana sadık müttefik olur (vicdan azabı)
  → Söylenti: "Babasının katilini affetti" → Mühürlü Söz ünü (en zor ama en güçlü)
```

### Aşama 5: Miras (Tur 25-30)

Hangi yolu seçtiysen, final:

```
⚓ "Babanın hikayesi sona erdi — ama seninki devam ediyor.
   Limanda bir mektup bekliyor. Babanın el yazısı.
   Ölmeden önce yazmış, Nuri Usta'ya emanet etmiş."

MEKTUP (LLM üretir):
  "Evladım, bunu okuyorsan demek ki denize çıktın.
   Ben başaramadım ama sen başarabilirsin.
   Akdeniz zalim bir deniz — ama adil.
   Herkese hak ettiğini verir.
   Tek isteğim: benim hatalarımı tekrarlama.
   Ve unutma: bir tüccarın en değerli malı, sözüdür."
```

**Final ödülü:** Babanın eski ticaret rotasına özel erişim — 5 tur boyunca belirli bir rotada %20 fiyat avantajı (babanın eski kontratlarının mirası).

```
☽ BILIYOR MUYDUN?
Akdeniz'de ticaret aileleri arasında kan davaları yüzyıllar sürerdi.
Cenova'nın iki büyük ailesi, Doria ve Fieschi, 200 yıl boyunca
birbirini öldürdü. Venedik bunu engellemek için "Onlar Konseyi"
(Consiglio dei Dieci) adlı gizli polis örgütü kurdu — anonim
ihbar kutularıyla şüphelileri izlerdi. Kutular "bocca del leone"
(aslan ağzı) şeklindeydi ve hâlâ Venedik'te görülebilir.
```

---

# KÖKEN 3: İNTİKAM
## "Akrep'in Kuyruğu"

### Tema ve Ruh

Oyuncunun geçmişinde bir düşman var — kim olduğu başta belirsiz, oyuncu sadece "bana kötülük yapan birinden intikam istiyorum" seçer. Zincir ilerledikçe düşmanın kimliği netleşir, motivasyonu anlaşılır, ve asıl soru ortaya çıkar: intikam seni mi yok eder, onu mu?

**Tarihsel ilham:** Akdeniz'in intikam kültürü — vendetta geleneği, kan davaları, ve "göz göze, diş dişe" adalet anlayışı.

### Aşama 1: Yara İzi (Tur 2-5)

**Tetikleyici:** Oyunun 2. turunda, deniz fazında otomatik:

```
⚓ "Denizde bir gemi gördün. Yelkenindeki arma tanıdık —
   o armayı rüyalarında görüyorsun. Çocukken seni esir alan,
   aileni dağıtan, hayatını mahveden adamın arması.
   Gemi uzaklaştı. Ama artık biliyorsun: O DA bu denizde."
```

**Düşmanın kimliği:** Oyuncunun köken şehrine göre düşman belirlenir:
- Venedik kökenli → Düşman: Kuzey Afrika'lı korsan kaptanı
- Cezayir kökenli → Düşman: Malta Şövalyelerinden biri
- İskenderiye kökenli → Düşman: Venedikli tüccar lordunun casusu
- Ragusa kökenli → Düşman: Cenevizli paralı asker

Düşman oyunun NPC'lerinden biri DEĞİL — özel görev NPC'si. Ama NPC'ler düşman hakkında bilgi verebilir.

### Aşama 2: İz Sürme (Tur 6-10)

```
⚓ Farklı limanlarda düşman hakkında bilgi parçaları duyarsın:

  Liman 1: "O armayı taşıyan gemiyi [liman adı]'da gördüler."
  Liman 2: "O adam artık zengin. Büyük bir konağı varmış."
  Liman 3: "[NPC ismi] onu tanıyormuş. Sor bakalım."
```

**NPC etkileşimi:**

- **Yorgos:** "O adamı tanıyorum. Benim de onunla hesabım var. İttifak kuralım."
  → İttifak kurarsan: Yorgos savaşta yardım eder ama kendi intikamını da ister — ganimet paylaşımı sorunu.

- **Raşid:** "Sana onun rotasını, alışkanlıklarını, zayıf noktasını satabilirim. 200 altın."
  → Bilgi satın alırsan: düşmanın nerede olduğunu, ne taşıdığını ve kime bağlı olduğunu öğrenirsin.

### Aşama 3: Yüzleşme (Tur 11-16)

```
⚓ "Onu buldun. [Liman adı]'da, kahvehanede oturuyor.
   Seni görmedi — veya görüp umursamadı.
   Ne yapacaksın?"
```

**İlk karşılaşma — 4 seçenek:**

```
A) YÜZÜNE SÖYLE:
   → Açık kanalda: "Seni tanıyorum. Bana ne yaptığını biliyorum."
   → Düşman şaşırır (veya şaşırmaz)
   → LLM diyalog: düşman kendini savunur
   → Düşmanın versiyonu farklı olabilir — belki haklıdır?

B) SESSİZ İZLE:
   → Duman niyetiyle takip et
   → Simsar kontrolü: düşmanın rotasını, kargosunu, müttefiklerini öğren
   → Bilgiyle silahlan, doğru anı bekle

C) HEMEN SALDIRI:
   → Düşman limandan çıkınca, denizde Kara Bayrak
   → Savaş: düşman güçlü (tecrübeli NPC, güç 4-5)
   → Kazanırsan: düşman tutsak, fidye veya öldürme kararı
   → Kaybedirsen: düşman seni tanır, artık O DA senin peşinde

D) ZEHİR:
   → Düşman hakkında söylenti yay: "Bu adam esir taciri / hırsız / hain"
   → Düşmanın itibarını çökert
   → Düşman limanlarda sorun yaşamaya başlar
   → Ama düşman kaynağı araştırırsa SENİ bulur
```

```
☽ BILIYOR MUYDUN?
Akdeniz'de "vendetta" (kan davası) sadece İtalyan geleneği değildi.
Osmanlı'da "kan bedeli" (diyet), Kuzey Afrika'da kabile intikamı,
Yunan adalarında nesiller arası kan davası yaygındı.
Korsika'da vendetta o kadar kurumsallaşmıştı ki ailelerin
"intikam defteri" vardı — kimin kimi öldürmesi gerektiği
nesiller boyunca kayıt altında tutulurdu.
```

### Aşama 4: Gerçeğin Rengi (Tur 17-22)

Düşmanla karşılaştıktan sonra, zincirin kritik dönüm noktası:

```
⚓ "Düşmanından bir mektup geldi (veya tutsak ettin ve konuştu):

   'Sen [oyuncu ismi]. Seni hatırlıyorum. Ama hikayeyi yanlış biliyorsun.
    Ben emir aldım. Beni gönderen [üst düzey güç ismi].
    Ben de bir piondüm. Asıl düşmanın ben değilim.'"
```

**Dönüm noktası:** Düşman aslında bir aracı. Asıl sorumluluk bir şehir devletinin, bir loncının veya bir NPC'nin. Bu, zinciri kişisel intikamdan SİSTEMİK adalete taşıyor.

**Oyuncu seçenekleri:**

```
A) "YALAN SÖYLÜYOR" → Düşmana odaklan, intikamı tamamla
   → Demir veya Zehir ile düşmanı bitir
   → Tatmin edici ama belki yanlış hedef

B) "BELKİ DOĞRU SÖYLÜYORDÜR" → Asıl kaynağı araştır
   → Mürekkep + Simsar kontrolü: 2-3 tur soruşturma
   → Gerçek ortaya çıkar: bir şehir devletinin gizli politikası,
     bir loncanın çıkar savaşı, veya bir NPC'nin büyük oyunu
   → Hikaye büyür, kişisel intikam siyasi entrikaya dönüşür

C) "FARKETMEZ, İKİSİNİ DE BATIRIRIM" → Hem düşmanı hem kaynağı hedef al
   → En zor yol: çok düşman, çok cephe
   → Ama en dramatik: Akdeniz'i sarsan intikam

D) "BIRAK. YETER." → İntikamı bırak
   → Düşmanı serbest bırak veya barış yap
   → "İntikam beni yiyip bitirmeden bırakıyorum"
   → Söylenti: "Düşmanını affetti" → Mühürlü Söz veya İpek Dil
```

```
☽ BILIYOR MUYDUN?
Haçlı seferleri sırasında birçok "kişisel intikam" aslında
devlet politikasının parçasıydı. Venedik, Dördüncü Haçlı Seferi'ni
(1204) Konstantinopolis'e yönlendirdi — görünürde "kutsal savaş"
ama gerçekte 1182 katliamının intikamı ve ticaret tekelini ele
geçirme planı. Kişisel nefret, devlet çıkarıyla birleşince
tarih değişti.
```

### Aşama 5: İntikamın Bedeli (Tur 23-28)

**Her yolun finali:**

```
İNTİKAM ALDINSA:
  → "İntikamın tadı nasıl? Acı mı, tatlı mı?
     Düşmanın yok artık. Ama sen de eskisi gibi değilsin.
     Akrep kuyruğunu salladı — zehir hedefe ulaştı.
     Ama akrep de zehirinden bir damla yuttu."
  → Bonus: Demir Pruva veya Akrep ünü (hangisi uygunsa)
  → Maliyet: intikam sırasında kazandığın düşmanlar

AFFETTIYSEN:
  → "Bıraktın. En zor olanı yaptın.
     Düşmanın hâlâ orada bir yerde. Ama artık gölge değil.
     Akdeniz büyük, iki kişiye de yeter."
  → Bonus: Mühürlü Söz ünü + eski düşmanla "soğuk barış"
  → Düşman NPC gelecekte sürpriz yardımda bulunabilir

SİSTEMİ ÇÖKERTTIYSEN:
  → "Bir taşı yerinden oynattın ve çığ koptu.
     Şehir devleti sarsıldı, lonca dağıldı, güç dengesi değişti.
     Sen küçük bir tüccardın — şimdi herkes adını biliyor."
  → Bonus: büyük söylenti patlaması → Efsane'ye yaklaşma
  → Maliyet: güçlü düşmanlar, istikrarsız ortam
```

---

# KÖKEN 4: SAF MERAK
## "Dünyanın Ucundaki Fener"

### Tema ve Ruh

Diğer üç köken kişisel drama üzerine kurulu. Bu köken farklı: oyuncu saf merakla denize çıkmış. Hazine aramıyor, intikam istemiyor, şeref kurtarmıyor. Sadece görmek, bilmek, keşfetmek istiyor. Bu zincir, Akdeniz'i bir OKUL olarak kullanıyor — her aşamada oyuncu yeni bir şey keşfeder ve tarihsel trivia zincirin MERKEZİNDE.

**Tarihsel ilham:** Ibn Battuta (14. yy gezgin, 120.000 km yolculuk), Benjamin de Tudela (12. yy Yahudi gezgin), Marco Polo, ve Akdeniz'in keşfedilmemiş köşeleri.

### Aşama 1: İlk Ufuk (Tur 3-6)

```
⚓ "Kahvehanede yaşlı bir gezgin, haritasını açıyor:
   'Ben 40 yıl boyunca bu denizi gezdim. Her limanı gördüm.
   Her dili öğrendim. Her yemeği tattım. Ve hâlâ bilmediğim
   şeyler var. Sana bir şey söyleyeyim mi?
   Bu denizin 7 sırrı var. 7'sini de bulan adam...
   Efsane olur.'"
```

**7 Sır Sistemi:** Bu zincir 7 mini-görevden oluşuyor (diğer zincirlerin 5 aşamasına karşılık). Her sır farklı bir limanda, farklı bir deneyim gerektiriyor. Sıralar SERBEST — istediğin sırada bulabilirsin.

### 7 Sır

```
SIR 1: "Meltemin Şarkısı" — DENİZ SIRRI
  Liman: Girit
  İpucu: "Giritli balıkçılar gece denizde garip bir ses duyduklarını
          söylüyor. Meltem belirli bir yönden estiğinde, kayalıklar
          şarkı söylüyormuş."
  Görev: Girit'ten Pusula niyetiyle çık, güneybatı rotasında "keşif"
  Meltem kontrolü: %30+ → sesi duyarsın
  Bulgu: Kayalıklar arasında doğal bir rüzgâr tüneli. Ses buradan.
         Antik Yunanlılar buna "Siren'lerin Şarkısı" dermiş.

  ☽ BILIYOR MUYDUN?
  Antik Yunan'da "Siren" deniz canavarı değil, kuş-kadın meleziydi.
  Homeros'un Odysseia'sında Odysseus, Sirenlerin şarkısını duymak
  için kendini direğe bağlattı. Mürettebatın kulaklarını mumla
  tıkadı. Gerçekte "Siren sesleri" muhtemelen rüzgârın kayalık
  geçitlerde çıkardığı doğal rezonans sesiydi.

SIR 2: "Terazinin Sıfır Noktası" — TİCARET SIRRI
  Liman: İstanbul (Kapalıçarşı)
  İpucu: "Kapalıçarşı'da eski bir terazi var. Altından yapılmış.
          Üzerinde ne Arapça ne Latince ne Yunanca — bilnmeyen
          bir dilde yazı var."
  Görev: İstanbul'da Kahve Falı seç, "eski terazi" hakkında sor
  Terazi kontrolü: %25+ → antikacı seni teraziye götürür
  Bulgu: Terazi Fenike yapımı, MÖ 1000 civarı. Yazı Fenike alfabesi.
         Akdeniz ticaretinin en eski aracı.

  ☽ BILIYOR MUYDUN?
  Fenikeliler sadece alfabe değil, standart ağırlık ve ölçü
  sistemini de yaydı. "Shekel" (ağırlık birimi) Fenike kökenli.
  Fenike tüccarları İngiltere'ye kadar gidip kalay aldı —
  MÖ 1000'de Akdeniz dışına çıkan ilk denizciler.

SIR 3: "Mürekkebin Hatırladığı" — DİPLOMASİ SIRRI
  Liman: İskenderiye (Büyük Kütüphane kalıntıları)
  İpucu: "İskenderiye'de yaşlı bir âlim, eski papirüsler üzerinde
          çalışıyor. Büyük Kütüphane'den kalan son parçalar
          onun elindeymiş."
  Görev: İskenderiye'de şehir yöneticisiyle görüş, âlime erişim iste
  Mürekkep kontrolü: %35+ → âlim seni kabul eder
  Bulgu: Papirüste antik bir ticaret anlaşması — MÖ 3. yy,
         Ptolemaios hanedanı ile Kartaca arası. Diplomasinin yazılı hali.

  ☽ BILIYOR MUYDUN?
  İskenderiye Kütüphanesi'nin nasıl yok olduğu hâlâ tartışmalı.
  Sezar'ın yangını, Hristiyan fanatikler, Müslüman fethi —
  üçü de suçlanmış ama muhtemelen yüzyıllar boyunca yavaş yavaş
  ihmal edildi. 400.000-700.000 papirüs rulosu barındırdığı
  tahmin ediliyor — insanlık tarihinin en büyük bilgi kaybı.

SIR 4: "Simsarın Anahtarı" — GİZEM SIRRI
  Liman: Ragusa
  İpucu: "Ragusa'nın surlarının altında gizli bir tünel sistemi
          varmış. Şehrin kuruluşundan beri var. İçeride ne olduğunu
          kimse bilmiyor — veya bilenler söylemiyor."
  Görev: Ragusa'da İzi Sürmek aksiyonu, "tünel" hakkında araştır
  Simsar kontrolü: %40+ → bir gece tünele girersin
  Bulgu: Tüneller, Ragusa'nın yüzyıllardır kullandığı GİZLİ
         TİCARET YOLU. Surların altından denize açılıyor.
         Ambargo dönemlerinde bile ticaret devam ediyormuş.

  ☽ BILIYOR MUYDUN?
  Ragusa (Dubrovnik) gerçekten gizli tünellere sahip. Şehrin
  su kemerleri ve kanalizasyon sistemi, kuşatma sırasında
  kaçış ve gizli ikmal için de kullanılırdı. 1667 depreminde
  tünellerin bir kısmı çöktü ama bir kısmı hâlâ duruyor.

SIR 5: "Kadırganın Ruhu" — SAVAŞ SIRRI
  Liman: Malta veya Venedik Arsenal
  İpucu: "Tersanede gemi yapan bir usta, kadırgaların içine
          gizli mesajlar kazıdığını söylüyor. 'Gemi ruhu'
          diye bir gelenek varmış."
  Görev: Tersaneye git, ustaya sor
  Meltem kontrolü: %20+ → usta seni geminin iç kısmına götürür
  Bulgu: Kadırgaların omurgasına dua, lanet ve isim kazınırmış.
         Bir kadırganın omurgasında 200 yıllık bir savaş tarihi
         yazılı — her savaşın tarihi, her kaptanın adı.

  ☽ BILIYOR MUYDUN?
  Venedik Arsenal'inde gemi inşası sırasında her gemi bir
  "madrina" (vaftiz annesi) tarafından kutsanırdı. Geminin
  pruvasına bir altın sikke gömülürdü — "deniz tanrılarına
  rüşvet." Bu gelenek Roma döneminden kalma ve günümüzde bile
  gemi inşaatında sikke geleneği devam ediyor.

SIR 6: "Ateşin Hafızası" — KAYIP BİLGİ
  Liman: Girit veya İstanbul
  İpucu: "Bir simyacı, Rum Ateşi'nin formülünü yeniden keşfettiğini
          iddia ediyor. Saçma bir iddia — ama ya doğruysa?"
  Görev: Simyacıyı bul (LLM diyalog — yarı deli, yarı dahi)
  Mürekkep veya Simsar kontrolü: simyacıyı ikna et veya izle
  Bulgu: Formül muhtemelen yanlış ama simyacının laboratuvarında
         Bizans dönemine ait şifreli bir el yazması var.
         El yazması, Rum Ateşi değil ama CAMCILIK sırlarını içeriyor.

  ☽ BILIYOR MUYDUN?
  Rum Ateşi (Greek Fire) muhtemelen ham petrol bazlı bir silah.
  Suyla söndürülemezdi — su ile temas edince daha çok yanardı.
  Bizans bu silahı 7. yüzyıldan 12. yüzyıla kadar kullandı.
  Formül o kadar gizli tutuldu ki imparatorlar bile tam
  bilmiyordu — sadece "kalafonçu" (ateşçi) lonca üyeleri bilirdi.

SIR 7: "Efsane'nin Kaynağı" — SON SIR
  Liman: herhangi — ama ancak diğer 6 sırrı bulduktan sonra açılır
  İpucu: "6 sırrı buldun. Yaşlı gezgin haklıymış — bu denizin
          gizleri var. Ama 7. sır farklı. 7. sırrı deniz değil,
          SEN yaratıyorsun."
  Görev: yok — otomatik
  Bulgu: 7. sır sensin. Senin hikayen. 6 sırrı bulan adam,
         Akdeniz'in yaşayan efsanesi oldun.

  ☽ FINAL TRIVIA:
  "Akdeniz, Arapça'da 'Bahr al-Abyad al-Mutawassit' — Ortadaki
   Beyaz Deniz. Türkçe'de 'Akdeniz' — Beyaz Deniz. Latince'de
   'Mare Nostrum' — Bizim Deniz. Her millet ona kendi adını verdi
   ama hepsi aynı şeyi kastetdi: bu deniz BİZİM.
   Ve şimdi bu deniz SENİN hikayen."
```

### Final Ödülü

7 sırrı tamamlayan oyuncu:
- **"Gezgin" özel ünü** (sadece bu zincirle kazanılır) — tüm limanlarda otomatik Tanıdık Yüz
- Büyük söylenti: "Bu adam Akdeniz'in 7 sırrını bulmuş" → Efsane'ye büyük katkı
- Kahvehanede artık HER ZAMAN 1 ekstra fısıltı duyar (kalıcı bonus)

---

# ZİNCİRLER ARASI ETKİLEŞİM

## NPC Çakışmaları

```
Yorgos: Hazine zincirinde yardımcı olabilir (Hamid'i tanıyor)
        İntikam zincirinde müttefik olabilir
        Baba zincirinde düşman olabilir (eğer o ortaksa)

Fatma:  Hazine zincirinde aracı (Hamid'le bağlantı)
        Baba zincirinde düşman olabilir (eğer o ortaksa)
        Merak zincirinde İskenderiye sırrına erişim sağlar

Enrique: Baba zincirinde düşman olabilir
         İntikam zincirinde bilgi kaynağı (askeri bağlantılar)
         Hazine zincirinde Demir yol yardımcısı

Raşid:  HER zincirde bilgi satıcısı (doğal rolü)
        Merak zincirinde Ragusa sırrına erişim
        İntikam zincirinde düşmanın izini sürmede yardımcı
```

## Zincir + Event Etkileşimi

```
KARA VEBA event'i sırasında aktif görev varsa:
  → Görev NPC'leri veba bölgesinde ise erişilemez olabilir
  → "Antikacı Yakup vebaya yakalandı — 3 tur bekle veya ilaç götür"
  → Bu, kişisel görevle dünya event'ini birleştiriyor

SAVAŞ event'i sırasında:
  → Düşman NPC savaşa katılmış olabilir → konum değişir
  → Hazine bölgesi savaş alanı olabilir → erişim zorlaşır
  → Ama kaostan faydalanabilirsin (herkes savaşla meşgulken sen hazineyi alırsın)
```

---

# OYUNCUYA GÖRÜNEN GÖREV TAKIP EKRANI

```
┌─ KİŞİSEL YOLCULUK ───────────────────────────────┐
│                                                     │
│  ⚓ KAYIP HAZİNE                                    │
│     Aşama: Antikacı Yakup'un iyiliğini yap         │
│     İpucu: Venedik'te Bizans ikonu bul              │
│     ● ● ○ ○ ○  (2/5 aşama tamamlandı)              │
│                                                     │
│  Son gelişme:                                       │
│  "Yakup ikonu istiyor. Venedik'e dönmelisin."       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

Basit, temiz, spoiler vermeyen. Oyuncu nerede olduğunu bilir ama sonraki aşamayı bilmez.

---

*"Herkesin bir hikayesi var. Akdeniz sadece sahne — oyuncu yazar, deniz yönetir, rüzgâr sayfaları çevirir."*
