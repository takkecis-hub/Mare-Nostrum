# MARE NOSTRUM — Kapsamlı Mekanik İnceleme & Öneriler
## Tüm Sistemlerin Detaylı Review'u

> 📝 **İnceleme Tarihi:** Nisan 2026
> **İncelenen Dokümanlar:** Master v3 + 8 modüler çalışma dokümanı
> **Yaklaşım:** Her mekanik sistem ayrı ayrı incelenmiş, tutarsızlıklar, eksikler, denge sorunları ve iyileştirme önerileri listelenmiştir.

---

# İÇİNDEKİLER

1. [Çekirdek Döngü & Tur Yapısı](#1-çekirdek-döngü--tur-yapısı)
2. [Ekonomi & Menşe Sistemi](#2-ekonomi--menşe-sistemi)
3. [Savaş & Taktik Sistemi](#3-savaş--taktik-sistemi)
4. [Görünmez Deneyim Sistemi](#4-görünmez-deneyim-sistemi)
5. [Çatışma Spektrumu (Demir/Zehir/Kuşatma)](#5-çatışma-spektrumu)
6. [Söylenti & Dedikodu Sistemi](#6-söylenti--dedikodu-sistemi)
7. [Harita & Rota Tasarımı](#7-harita--rota-tasarımı)
8. [Ün & Zafer Sistemi](#8-ün--zafer-sistemi)
9. [Gemi Sistemi](#9-gemi-sistemi)
10. [Singleplayer & Görev Zincirleri](#10-singleplayer--görev-zincirleri)
11. [LLM Entegrasyonu](#11-llm-entegrasyonu)
12. [Event Sistemi](#12-event-sistemi)
13. [Multiplayer & Teknik Mimari](#13-multiplayer--teknik-mimari)
14. [Genel Tasarım Tutarsızlıkları](#14-genel-tasarım-tutarsızlıkları)
15. [Özet: Kritik, Önemli, İyi Olan](#15-özet)

---

# 1. ÇEKİRDEK DÖNGÜ & TUR YAPISI

## ✅ İyi Olan
- **"En fazla 3 karar"** manifestosu oyuncunun bilişsel yükünü düşürmekte harika bir kısıt. Nereye/Nasıl/Niyet üçlüsü son derece zarif.
- Fondaco (liman) → Rüzgâr (deniz) iki fazlı yapı, sezgisel ve öğrenmesi kolay.
- "Spreadsheet açan kaybeder" felsefesi tüm tasarıma tutarlı biçimde işlenmiş.

## ⚠️ Sorunlar & Öneriler

### 1.1 — Fondaco Fazında Karar Yükü Aslında 3'ten Fazla
**Sorun:** Fondaco'da yapılabilecekler: Kahvehane (4 alt aksiyon), Pazar (al/sat), Müzakere (chat), Tersane (tamir/değiştir). Bunların hepsi opsiyonel olsa da, bir turda kahvehanede söylenti yayıp, pazarda mal alıp, NPC'ye mesaj atıp, emir veren oyuncu **minimum 6-7 mikro karar** veriyor.

**Öneri:** Fondaco fazında bir **aksiyon limiti** düşünülmeli. Örneğin: "Fondaco'da en fazla 2 lokasyonu ziyaret edebilirsin + emirlerini verirsin." Bu, seçim yapmayı zorunlu kılar (kahvehaneye mi gidiyorsun pazara mı?) ve her lokasyonu ziyaret etme otomatiğini kırar. Ya da limitleme yerine, her lokasyonun bir **zaman maliyeti** olabilir — timer-based sistemde bu doğal olarak kısıtlar.

### 1.2 — Fondaco Timer Süresi (7 dk) Yeterli mi?
**Sorun:** Multiplayer'da 7 dakika Fondaco süresi öneriliyor. Ancak kahvehanede fısıltıları okuma + söylenti yayma + pazarda al/sat + NPC mesajı okuma/yazma + emir verme — özellikle ilk 5 turda tüm bunlar 7 dakikada zor.

**Öneri:** İlk 5 tur için **uzatılmış Fondaco timer** (10 dk), sonraki turlar 7 dk. Ya da adaptif timer: çok aksiyonlu turda otomatik uzama. Ama "hız baskısı" da tasarımın bir parçasıysa, bu bilinçli olarak not edilmeli.

### 1.3 — "Kabotaj" 2 Tur Seyahat = Oyuncunun 1 Turu "Boş" Geçmesi
**Sorun:** Kabotaj 2 tur sürüyor. İkinci turda oyuncu ne yapıyor? Denizde mi? Fondaco'ya giremez mi? Bu açıkça tanımlanmamış.

**Öneri:** Kabotaj ikinci turunda oyuncunun durumunu netleştirin:
- **Seçenek A:** İkinci turda "transit" durumunda — Fondaco yok, sadece denizde gözlem (Duman benzeri pasif bilgi toplama).
- **Seçenek B:** İkinci turda arada bir transit liman/demirleme noktası — minimal Fondaco (sadece kahvehane, pazar yok).
- Bu "boş tur" hissini azaltmak için, ikinci turda küçük bir olay (denizde balıkçıyla karşılaşma, yüzen enkaz, vb.) tetiklenebilir.

---

# 2. EKONOMİ & MENŞE SİSTEMİ

## ✅ İyi Olan
- **Menşe sistemi** ticaret ikilemine derinlik katıyor — "aynı rota her zaman çalışmaz" sorunu zarif şekilde çözülmüş.
- **Açlık/doyma mekaniği** doğal fiyat dengesini sağlıyor.
- **Beş nokta fiyat göstergesi** (●●●○○) spreadsheet'i öldürmekte etkili.
- Bilgi = para konsepti, sosyal etkileşimi doğal hale getiriyor.

## ⚠️ Sorunlar & Öneriler

### 2.1 — Açlık/Doyma Hız Dengesi Kritik
**Sorun:** "Bir oyuncu getirirse açlık 2 kademe düşer, iki oyuncu getirirse DİBE düşer." Bu çok agresif. 2 oyunculu bir partide bile fiyatlar çok hızlı çökebilir. 6-8 oyunculu multiplayer'da birkaç turda tüm pazarlar doyma noktasına ulaşabilir.

**Öneri:** Doyma hızını oyuncu sayısına göre ölçeklendirin:
- 2 oyuncu: 1 getirirse -1, 2 getirirse -3
- 4 oyuncu: 1 getirirse -1, 2 getirirse -2, 3+ getirirse DİBE
- 8 oyuncu: doyma daha yavaş, toparlanma daha hızlı

### 2.2 — İlk Gelen Bonusu Feluka'yı Çok Güçlü Yapabilir
**Sorun:** Fortuna rotasıyla hızlı gelen oyuncu daha iyi fiyat alıyor. Feluka zaten "hızlı" gemi. Feluka + Fortuna = "her zaman ilk gel" meta'sı oluşabilir. Karaka'nın toplu alım indirimi bu dengeyi yeterince karşılıyor mu?

**Öneri:** İlk gelen bonusunun büyüklüğünü kargo miktarına ters orantılı yapın: çok az kargo getiren ilk gelen, az bonus alır. Çok kargo getiren (Karaka) ilk gelse bile yüksek hacimle doyurmaya başlar. Bu, Feluka'nın "hız" avantajını Karaka'nın "hacim" avantajıyla daha dengeli kılar.

### 2.3 — Ragusa "Transit Liman" Çok Güvenli
**Sorun:** Ragusa hiçbir şey üretmez ama hep normal fiyat, nötr, ekstra fısıltı, kimseyi Kem Göz yapmaz. Her oyuncunun "güvenli liman" olarak Ragusa'ya çekilme eğilimi = Ragusa çok kalabalık ve çok güvenli. Risk/ödül dengesi bozulabilir.

**Öneri:** Ragusa'nın avantajlarına bir maliyet ekleyin:
- "Transit vergisi" — Ragusa'da alışveriş yapınca %10 ekstra vergi.
- Ya da: çok fazla trafik olunca Ragusa'nın "nötr" statüsü gerilim altına girsin — belli bir eşikten sonra Ragusa da taraf tutmaya başlasın (event olarak).

### 2.4 — Commenda İhanet Mekanizmasında "Sonsuz Güven Döngüsü" Riski
**Sorun:** Commenda'da ihanet → Akrep ünü. Ama oyun başlarken (ilk 5 tur), kimsenin ünü yokken, ihanet etmenin maliyeti çok düşük. Oyuncu erken dönemde birkaç commenda ihaneti yapıp zenginleşebilir, sonra "temiz" oynayabilir.

**Öneri:** İhanet söylentilerinin **zamana bağlı güçlenme** mekanizması: ilk ihanet hafif söylenti, ikinci ihanet çok güçlü söylenti, üçüncü ihanet kalıcı "Akrep" ünü. Ve "Akrep" ününün commenda teklifini tamamen engellemesi değil, sadece çok kötü şartlarda teklif gelmesi (yüksek faiz, düşük kâr payı).

### 2.5 — Kaçak Mal Kâr Çarpanı (3-5x) Çok Yüksek
**Sorun:** Yasak malın 3-5x normal fiyatla satılması, Simsar ağırlığı yüksek oyuncuyu (%3 yakalanma!) neredeyse risksiz bir şekilde çok zengin yapabilir. Simsar odaklı oyun tarzı ekonomik olarak dominant olabilir.

**Öneri:** Kaçak mal kâr çarpanını 2-3x'e düşürün. Ya da yakalanma cezasını artırın: yakalanınca sadece müsadere değil, 2 tur hapis (oyundan çıkma) + büyük para cezası. Risk/ödül oranını "yüksek risk, yüksek ödül" olarak koruyun ama "düşük risk, aşırı ödül" olmasın.

### 2.6 — Menşe Tablosunda "Lübnan Sediri" Eksik
**Sorun:** Venedik "Lübnan Sediri" arzuluyor, İskenderiye "Lübnan Sediri" arzuluyor. Ancak hiçbir limanın "Lübnan Sediri" ürettiği yazmıyor. Beyrut "Halep Sabunu" üretiyor.

**Öneri:** Beyrut'un üretim listesine "Lübnan Sediri [Savaş]" ekleyin. Ya da İstanbul/Beyrut'un ikincil üretimi olarak ekleyin. Aksi halde arzulanan bir mal hiç piyasaya giremez.

---

# 3. SAVAŞ & TAKTİK SİSTEMİ

## ✅ İyi Olan
- **Pruva/Ateş/Manevra** taş-kağıt-makas dinamiği, basit ama derin. Harika isim seçimleri.
- **Gemi sinerjileri** (Feluka → Manevra +1, Kadırga → Pruva +1) sınıf farklılaşmasını güçlendiriyor.
- Bilgi bazlı taktik tahmini (rakibin gemisine bakarak taktik tahmin etme) meta-oyun katmanı ekliyor.

## ⚠️ Sorunlar & Öneriler

### 3.1 — Manevra ile Kazanmak "Ganimet Yok" = Manevra Hiç Seçilmeyebilir
**Sorun:** Pruva ile kazanırsan tüm kargo + gemi, Ateş ile kazanırsan %35 kargo. Manevra ile kazanırsan... hiçbir şey (sadece düşman 1 tur oyalanır veya 2. tur savaş). Kara Bayrak niyetli oyuncunun Manevra seçmesi için hiçbir ekonomik teşvik yok.

**Öneri:** Manevra kazananına küçük bir ödül ekleyin:
- **İstihbarat ödülü:** Düşmanın kargosunu, altınını ve bir sonraki emrini görürsün (Simsar +2 deneyim).
- **Taktik avantaj:** 2. savaş turuna girersen +2 bonus yerine +3 bonus.
- **Moral kırıcı:** Düşman bir sonraki turda savaşa girerse -1 moral penaltısı (korkmuş etkisi).
- Bu, Manevra'yı "bilgi toplama + avantaj oluşturma" taktiğine dönüştürür — korsan olmayan savunmacı oyuncu için ideal.

### 3.2 — Savaş Tamamen Zar + Bonus = Karaka Savunan Oyuncu Çaresiz
**Sorun:** Karaka (güç 2, hiçbir taktikte bonus yok) vs Kadırga (güç 3, Pruva'da +1). Kadırga Pruva seçerse 3+1+2 = 6 + zar. Karaka en iyi ihtimalle 2+2 = 4 + zar. Karaka neredeyse her zaman kaybeder.

**Öneri:** Karaka'ya savunma odaklı bir pasif bonus verin:
- **"Ağır Yük"**: Saldırıya uğradığında Ateş taktiğinde +1 savunma bonusu (kargo kalkan gibi).
- Veya: Karaka savaşta kaybettiğinde kargonun %50'sini kurtarma şansı (büyük ambar = saklama alanı).
- Böylece Karaka "kaybetsen bile tamamen ezilemezsin" temasıyla tutarlı olur.

### 3.3 — Savunan Tarafın Taktik Seçimi Belgelenmemiş
**Sorun:** Savaşta "saldıran ve savunan gizlice taktik seçer" deniyor, ama savunanın **kaçış seçeneği** ayrıca var mı? Manevra = kaçış mı? Yoksa Manevra taktik olarak seçilip kazanırsa mı kaçılır? Savunan tarafın "savaşmayı reddetme" hakkı var mı?

**Öneri:** Savunanın seçeneklerini netleştirin:
- **Savaş Kabul (3 taktik)**: Pruva/Ateş/Manevra aynı kurallarla.
- **Kaçış Denemesi**: Savaşa girmeden kaçmaya çalış. Başarı hız karşılaştırmasına bağlı (Feluka > Kadırga). Meltem deneyimiyle bonus. Başarısız olursa saldıran +1 bonus ile savaş başlar. Bu, savaştan kaçmayı meşru bir opsiyon yaparak tüccar oyun tarzını korur.

### 3.4 — "Beraberliklerde Meltem Ağırlıklı Kazanır" = Snowball
**Sorun:** Meltem ağırlığı yüksekse zar alt sınırı 3-6, beraberliklerde sen kazanırsın, fırtına hasarı minimum. Bu, erken dönemde savaşa yatırım yapan oyuncunun katlanarak güçlenmesine (snowball) yol açar. Geç oyunda yeni rakip bu oyuncuyla başa çıkamaz.

**Öneri:** Meltem avantajlarına bir tavan (cap) koyun. Zar alt sınırı en fazla 2-6 olsun (3-6 çok güçlü). Beraberliklerde kazanma yerine, beraberliklerde **taktik seçme hakkı** (yeniden taktik değiştirip 2. tur) daha dengeli olur.

---

# 4. GÖRÜNMEZ DENEYİM SİSTEMİ

## ✅ İyi Olan
- **Oran bazlı sistem** uzmanlaşma baskısı yaratıyor — mükemmel tasarım.
- "Oyuncu hisseder ama ölçemez" felsefesi çok güçlü ve LLM entegrasyonuyla doğal çalışıyor.
- 4 havuzun her birinin farklı "hissetme" yolu (fiyat göstergesi, zar aralığı, NPC sıcaklığı, kargo görünürlüğü) çok iyi düşünülmüş.

## ⚠️ Sorunlar & Öneriler

### 4.1 — "Her Şeyi Yapan Hiçbir Alanda Derin Olamaz" Gerçekten Doğru mu?
**Sorun:** Oran bazlı sistem "uzmanlaşma baskısı" yaratıyor. Ama toplam puan arttıkça oranlar stabilize oluyor. 200 turda: Meltem 60, Terazi 50, Mürekkep 50, Simsar 40 = toplam 200. Meltem oranı %30 — "orta" seviye. Bu oyuncu her alanda "orta" — ama hiçbir alanda "çok yüksek" değil. Sorun: bu oyuncu hâlâ güçlü çünkü toplam deneyimi çok yüksek ve her alanda minimum avantajları var.

**Öneri:** "Generalist" oyun tarzının da belirgin dezavantajları olmalı:
- Oran %25'in altında olan havuzlarda **negatif etki** (ceza değil, fırsatları kaçırma): "%20 Simsar oranı ile kahvehanede gizli fısıltıları ASLA duyamazsın" gibi hard gate'ler.
- Veya: Ün kazanmak için minimum %35 oran gereksinimi, generaliste hiçbir ün gelmez. Bu yeterince vurgulanmış ama pratikte test edilmeli.

### 4.2 — Deneyim Kazanım Hızları Dengesiz
**Sorun:** Eylem başına deneyim puanları:
- Denize çıkmak: Meltem +1 (HER TUR otomatik)
- Mal alıp satmak: Terazi +1
- Aynı turda 2+ oyuncuyla mesajlaşmak: Mürekkep +1
- Kaçakçılık (başarılı): Simsar +2

Meltem her tur otomatik +1 aldığı için doğal olarak en hızlı büyüyen havuz olacak. Herkes otomatik olarak "biraz denizci" olacak. Simsar ise en zor büyüyen (kaçakçılık riskli, avlanma emri vermek gerekli).

**Öneri:** Meltem'in "denize çıktı" otomatik +1'ini kaldırın veya +0.5 yapın. Meltem puanı sadece aktif deniz olaylarından gelsin (fırtına, savaş, kaçış). Böylece "denize çıkıp hiçbir şey yaşamadan limana varan" oyuncu Meltem kazanmaz — deneyim YAŞANARAK kazanılır.

### 4.3 — Mürekkep Multiplayer'da, Simsar Singleplayer'da Zayıf
**Sorun:** Mürekkep puanı multiplayer'da çok hızlı büyür (sürekli mesajlaşma, müzakere). Singleplayer'da ise NPC mesajları daha az = Mürekkep yavaş büyür. Simsar tersi: singleplayer'da NPC'ler daha kolay manipüle edilir, multiplayer'da gerçek oyuncuları gözetlemek zor.

**Öneri:** Mod-spesifik deneyim dengeleme:
- **Singleplayer:** NPC etkileşimlerinden Mürekkep +2 (artırılmış), kaçakçılık yakalanma oranları biraz artırılmış (Simsar dengelemesi).
- **Multiplayer:** Mesajlaşma Mürekkep'i her 2 mesajda +1'e düşürülsün (spam önleme + denge).

---

# 5. ÇATIŞMA SPEKTRUMU

## ✅ İyi Olan
- **Demir/Zehir/Kuşatma** üçlüsü oyuna muazzam derinlik katıyor. "Saldırı sadece kılıç değil" felsefesi oyunun en güçlü yönü.
- **Duman niyeti** "hiçbir şey yapmama kararı" olarak stratejik değer taşıması çok yaratıcı.
- Üç saldırı türünü kombine etme senaryosu (Ali vs Beren) oyunun potansiyelini mükemmel gösteriyor.

## ⚠️ Sorunlar & Öneriler

### 5.1 — Zehir Saldırısının Kaynağını Bulmak Çok Zor
**Sorun:** Söylenti yayan oyuncunun kimliği gizli kalabiliyor. İzi Sürmek başarı oranı Simsar %60+ bile olsa sadece %60. Bu, Zehir saldırısını neredeyse cezasız yapıyor. 10 altınlık yatırımla rakibini 3-4 tur saf dışı bırakmak çok ucuz.

**Öneri:**
- Söylenti yayma maliyetini artırın: 10 altın → 25 altın (daha anlamlı yatırım).
- Söylenti kaynağının bulunma olasılığını artırın: söylenti yayılan her liman, kaynağı bulmaya +5% şans eklesin. 5 limana yayılmış söylenti = %25 bonus.
- **Tekrarlayan söylenti cezası:** Aynı oyuncu kısa sürede (5 tur) 3+ söylenti yayarsa, kahvehanedeki NPC'ler "Bu adam çok fısıldıyor" diye kendi hakkında söylenti üretsin.

### 5.2 — Kuşatma Saldırısı Çok Sermaye Gerektiriyor = Sadece Zenginler Yapabilir
**Sorun:** Stok ablukası "bir limandaki tüm malı satın al" gerektiriyor (400+ altın). Oyun başında herkes 200 altınla başlıyor. Kuşatma saldırısı fiilen sadece oyunun orta-geç döneminde ve sadece zengin oyunculara açık. Bu, "her oyun tarzı viable" manifestosuyla çelişiyor.

**Öneri:** Küçük ölçekli kuşatma opsiyonları ekleyin:
- **"Kısa Stok"**: Tüm stoku değil, stokun %50'sini al. Daha ucuz ama etkisi kısmi.
- **"Bilgi Blokajı"**: Bir limanın piyasa bilgisini manipüle et (kahvehanede yanlış fısıltı yaydır). Maliyet düşük, etki dolaylı.
- Bu, Kuşatma'yı oyunun her aşamasında erişilebilir kılar.

### 5.3 — Duman Niyetiyle "Borç Yaratma" Mekanik Olarak Tanımsız
**Sorun:** Duman senaryosunda "Can sana borçlu hisseder" deniyor. Ama bu mekanik bir etki mi yoksa tamamen rol yapma mı? Multiplayer'da tamamen sosyal (oyuncu isterse borçlu hissetmez). Singleplayer'da NPC'nin "borçluluk" durumu nasıl izleniyor?

**Öneri:**
- **Singleplayer:** NPC'lere bir "borç sayacı" ekleyin. Oyuncu bir NPC'ye iyilik yaptığında (saldırmadı, bilgi paylaştı, yardım etti), NPC'nin borç sayacı artar. Borç yeterince yüksekse, NPC oyuncuya iyilik yapma eğilimi gösterir (indirimli bilgi, konvoy teklifi, savaşta taraf değiştirme).
- **Multiplayer:** Duman'ın "gördüğün ama saldırmadığın" durumu, hedef oyuncuya otomatik bildirim olarak gitsin: "Yolda [oyuncu adı] seni gördü ama saldırmadı." Bu, borç duygusunu mekanik olarak tetikler.

---

# 6. SÖYLENTİ & DEDİKODU SİSTEMİ

## ✅ İyi Olan
- Söylentinin otomatik üretilmesi, yayılması ve çarpıtılması gerçekçi ve dinamik bir dünya yaratıyor.
- Söylenti savunmasının 4 seçenekli olması (Yalanla, Kaynak Bul, Yoksay, Karşı Söylenti) zengin.
- Söylenti → Şehir İlişkisi bağlantısı temiz ve anlaşılır.

## ⚠️ Sorunlar & Öneriler

### 6.1 — Söylenti Çarpıtması Kontrolsüz Olabilir
**Sorun:** "Söylenti yayıldıkça çarpıtılır — seni seven limanlar olumluya, sevmeyen limanlar olumsuza çevirir." Peki çarpıtmanın sınırı ne? "Büyük savaş kazandı" söylentisi, düşman limanda "katliam yaptı" mı oluyor? Eğer LLM çarpıtıyorsa, kontrol dışı sonuçlar üretebilir.

**Öneri:** Çarpıtmayı LLM'e bırakmak yerine **şablon bazlı çarpıtma** kullanın:
- Her söylenti tipinin "olumlu versiyonu" ve "olumsuz versiyonu" önceden tanımlı olsun.
- "Büyük savaş kazandı" → sevende "kahraman" / sevmeyende "saldırgan"
- "Çok ticaret yaptı" → sevende "zengin tüccar" / sevmeyende "piyasa manipülatörü"
- Bu, tutarlılığı garanti eder ve LLM hata riskini azaltır.

### 6.2 — Söylenti Ömrü (5-8 Tur) Belirsiz
**Sorun:** "5-8 tur sonra zayıflar" deniyor ama kesin formül yok. Büyük olaylar "kalıcı" oluyor — ama kalıcılığın eşiği ne? Savaş mı, ticaret mi, ihanet mi? Bu subjektif bırakılmış.

**Öneri:** Net söylenti ömrü kuralları tanımlayın:
- **Küçük söylenti** (ticaret, sıradan karşılaşma): 3-4 tur ömür
- **Orta söylenti** (savaş, kaçakçılık): 5-6 tur
- **Büyük söylenti** (ihanet, büyük hazine, mega event): 8-10 tur
- **Kalıcı söylenti**: Sadece 3+ aynı tipteki söylenti birikirse "ün"e dönüşür → kalıcı
- Rakamlar kağıt prototipte test edilmeli.

### 6.3 — İttifak Bulaşması Çok Otomatik
**Sorun:** "Bir güçle Tanıdık Yüz olursan, düşmanlarıyla her 3 turda 1 kademe düşüş." Bu tamamen otomatik ve oyuncunun kontrolü dışında. Osmanlı'yla dost olan oyuncu, hiçbir şey yapmasa bile Venedik'te düşüyor. Bu, oyuncuyu "sürekli ilişki tamiri" moduna sokabilir.

**Öneri:** İttifak bulaşmasını "otomatik düşüş" yerine "risk artışı" olarak yeniden tasarlayın:
- Düşman güçle otomatik düşmek yerine, söylenti mekanizmasıyla bağlantılı olsun: "Osmanlı dostu" söylentisi Venedik'te yayılınca ETKİLİ olsun, yayılmazsa etkisiz.
- Bu, oyuncuya "düşmanlık yönetimi" alanında aktif karar verme şansı tanır (söylentiyi bastırma, çift taraflı diplomasi).

---

# 7. HARİTA & ROTA TASARIMI

## ✅ İyi Olan
- **15 liman, 28 rota, 3 darboğaz** — dengeli yapı. Her bölgenin kişiliği var.
- **Darboğaz = drama jeneratörü** mükemmel. %70-80 karşılaşma garantisi gerilim yaratır.
- Her limanın kendine özgü karakteri, üretimi ve siyasi durumu çok iyi düşünülmüş.
- ASCII harita son derece faydalı referans.

## ⚠️ Sorunlar & Öneriler

### 7.1 — Güney Akdeniz (Berber Kıyısı) Çok İzole
**Sorun:** Trablus sadece 3 bağlantıya sahip: İskenderiye (Fortuna), Tunus (Kabotaj), Cezayir (Fortuna). İki Fortuna rota (riskli) ve bir Kabotaj (yavaş). Trablus'a gitmek hem riskli hem yavaş = kimse gitmek istemez. Orada Sahra Altını var ama erişim zorluğu çok yüksek.

**Öneri:**
- Trablus ↔ Tunus'u Kabotaj'dan Tramontana'ya yükseltin (1 tur, normal risk).
- Ya da Trablus'a bir "çöl rotası" özel mekaniği ekleyin: "Trablus'a ilk gelen oyuncu ekstra bonus alır" (nadir mal bonusu) çünkü çok az oyuncu gidiyor.
- Trablus'un izolasyonu da avantaj olabilir: "kimse gelmiyor" = pazar her zaman AÇ = her zaman iyi fiyat.

### 7.2 — Malta'nın Rota Bağlantıları Kısıtlı
**Sorun:** Malta: Palermo (Kabotaj), Tunus (Tramontana), Girit (Fortuna). Batı'ya hiç doğrudan bağlantı yok. Malta "savaşçı üs" ama savaşacak hedeflere ulaşmak için Palermo/Tunus üzerinden geçmesi gerekiyor. Bu, Malta'yı bir "dead end" yapabilir.

**Öneri:** Malta ↔ Cezayir Fortuna rotası ekleyin. Bu, Malta Şövalyeleri (Hristiyan) ile Cezayir Korsanları (Müslüman) arasındaki tarihsel gerilimi mekanik olarak yansıtır ve Malta'ya stratejik değer katar.

### 7.3 — Darboğaz Alternatiflerinin Dengesi
**Sorun:** Her darboğazın bir alternatifi var:
- Sicilya Boğazı → Cenova ↔ Tunus Fortuna (riskli ama 1 tur)
- Ege Kapısı → Ragusa ↔ İstanbul Fortuna (riskli)
- Otranto → Cenova üzerinden (Kabotaj, 2 tur)

Ancak Fortuna alternatifleri %20 fırtına riski + 1 tur = darboğazdan geçmekle neredeyse aynı. Darboğazda %75 karşılaşma ama karşılaşma her zaman kötü değil (Tanıdık Yüz isen geçersin). Alternatifler yeterince cazip mi?

**Öneri:** Alternatif rotaların cazibesini artırın:
- Fortuna alternatifleriyle giden oyuncuya %15 erken varış şansı (zaten var) + darboğaz bilgisi (darboğazda kimin olduğunu göremezsin ama alternatifle gidince bilgi toplarsın).
- Ya da darboğaz karşılaşma oranını %80+'ye çıkarıp riski artırın — bu, alternatif arayışını doğal olarak güçlendirir.

### 7.4 — Beyrut ↔ İstanbul Kabotaj "Çok Uzun" Ama Kaç Tur?
**Sorun:** Beyrut ↔ İstanbul Kabotaj olarak tanımlanmış ve "uzun" denmiş. Kabotaj = 2 tur. Ama "uzun Kabotaj" 3 tur mu? Bu netleştirilmemiş.

**Öneri:** Tüm rotaların tur süresini açıkça tablo halinde yazın. "Uzun Kabotaj = 3 tur" gibi özel durumlar varsa bunları belirtin.

---

# 8. ÜN & ZAFER SİSTEMİ

## ✅ İyi Olan
- Ün = deneyim + söylenti kombinasyonu — hem yapman hem bilinmen lazım. Mükemmel tasarım.
- Maximum 3 ün kuralı, uzmanlaşma baskısıyla tutarlı.
- "Efsane Ol" zafer koşulu tematik ve ölçülebilir.

## ⚠️ Sorunlar & Öneriler

### 8.1 — Zafer Formülü Söylenti Spam'ını Ödüllendiriyor
**Sorun:** `PUAN = (aktif söylenti sayısı × yayılma genişliği) + (ün sayısı × 10)`. Söylenti sayısı puanı doğrudan etkiliyor. Çok savaşan, çok ticaret yapan, çok entrika çeviren oyuncu = çok söylenti = yüksek puan. Ama bu "aktif" oyuncuyu ödüllerken, "sessiz ama etkili" (Hayalet Pala tarzı) oyuncuyu cezalandırıyor.

**Öneri:**
- Söylenti kalitesini puanlamaya dahil edin: büyük söylentiler (savaş, hazine) daha çok puan, küçük söylentiler az puan.
- "Gizlilik bonusu" ekleyin: çok az söylentisi olan ama 2+ ünü olan oyuncu bonus puan alsın.
- Ya da zafer koşulunu çoğaltın: "En Ünlü Efsane" (söylenti odaklı) + "Gölge Efsane" (en az söylentiyle en çok ün) + "Zengin Efsane" (en çok altın + ün).

### 8.2 — Ün Kaybetme Koşulları Belirsiz
**Sorun:** "Kaybedilebilir (5 tur kullanmama veya çelişen eylemler)" deniyor ama detaylar yok. Hangi eylem hangi ünü kaybettirir? 5 tur hiç savaşmamak "Demir Pruva"yı kaybettirir mi? Ticaret yapmamak "Altın Parmak"ı kaybettirir mi?

**Öneri:** Her ün için net "sürdürme koşulları" tanımlayın:
- **Altın Parmak:** Son 5 turda en az 2 ticaret. Yoksa kaybedersin.
- **Demir Pruva:** Son 5 turda en az 1 savaş. Yoksa kaybedersin.
- **İpek Dil:** Son 5 turda en az 2 diplomatik etkileşim. Yoksa kaybedersin.
- **Hayalet Pala:** Hakkında 2+ negatif söylenti birikirse veya yakalanırsan kaybedersin.
- **Akrep:** Kaybetmez (kalıcı damga).

### 8.3 — "Efsanevi Başarımlar" Listesi Dengesiz
**Sorun:** Efsanevi başarımlar: "Tüm Akdeniz'i gez, Büyük İhanet, Barış Elçisi, Veba Kahramanı, Korsan Avcısı, Hayalet, Tekelci, Herkesin Arkadaşı." Bunların bazıları kolay (Tüm Akdeniz'i gez = 15 liman, yeterli turda herkes yapar), bazıları çok zor (Veba Kahramanı = event'e bağlı, kontrol dışı).

**Öneri:** Başarımları zorluk seviyesine göre puanlayın:
- Kolay (5 puan): Tüm Akdeniz'i gez
- Orta (10 puan): Korsan Avcısı, Tekelci
- Zor (15 puan): Büyük İhanet (ve hayatta kalma), Hayalet
- Efsanevi (20 puan): Herkesin Arkadaşı, Barış Elçisi
- Event-bağımlı olanlar daha az puan versin (oyuncu kontrolü dışında).

---

# 9. GEMİ SİSTEMİ

## ✅ İyi Olan
- Üç gemi, net farklılaşma: Feluka (hız), Karaka (kargo), Kadırga (güç). Basit ama etkili.
- "Tek gemi" kuralı karmaşıklığı düşük tutuyor.
- Gemi durumu (Hazır → Yaralı → Batık) basit ve vurucu.

## ⚠️ Sorunlar & Öneriler

### 9.1 — Gemi Değiştirmenin Maliyeti ve Zamanlaması Belirsiz
**Sorun:** "Tersanede gemi değiştirme" var ama fiyatlar belirtilmemiş. Feluka → Karaka ne kadar? Kadırga'dan Feluka'ya "downgrade" yapılabilir mi (para iadesiyle)?

**Öneri:** Net gemi fiyatları tanımlayın:
- Feluka: 100 altın (başlangıç gemisi)
- Karaka: 300 altın
- Kadırga: 400 altın
- Değiştirme: eski geminin %50'si geri + yeni gemi fiyatı. Feluka → Karaka = 300 - 50 = 250 altın.
- Bazı limanlarda indirim: Venedik (Arsenal) %20 indirim, Barselona Kadırga'da %20 indirim.

### 9.2 — Gemi Tamir Süresi (1 Tur) Çok Kısa veya Uzun Olabilir
**Sorun:** Yaralı gemi 1 tur tamirle düzeliyor. Bu, savaşın maliyetini düşürüyor — kaybet, 1 tur tamir, devam et. Öte yandan, 1 tur "hiçbir şey yapamama" bazı oyuncular için çok uzun hissedebilir.

**Öneri:**
- Tamiri 1 tur tutun ama ek maliyet ekleyin: tamir masrafı = gemi değerinin %25'i.
- **Acil tamir** opsiyonu: 2x maliyet ama aynı turda tamirle (Fondaco'da parayı ödeyip hemen devam et). Bu, zengin oyuncuya hız avantajı, fakir oyuncuya 1 tur ceza verir.

### 9.3 — Kadırga'nın "Yavaş" Olması Tanımlanmamış
**Sorun:** Kadırga "yavaş" deniyor ama mekanik etkisi ne? Tramontana rotasında herkes 1 tur, Kabotaj'da herkes 2 tur. Kadırga'nın yavaşlığı nereden geliyor?

**Öneri:** Kadırga'ya "Fortuna rotasını kullanamaz" kısıtlaması ekleyin. Kadırga ağır, açık deniz rotasına çıkamaz. Sadece Tramontana ve Kabotaj. Bu, Kadırga'yı güçlü ama rota kısıtlı yapar. Veya: Kadırga Fortuna'da %40 fırtına riski (normal %20 yerine).

---

# 10. SİNGLEPLAYER & GÖREV ZİNCİRLERİ

## ✅ İyi Olan
- **4 köken hikayesi** birbirinden çok farklı: Hazine (macera), Şeref (entrika), İntikam (aksiyon), Merak (keşif). Mükemmel çeşitlilik.
- Her aşamada **çoklu yol** (Demir/Mürekkep/Simsar/Zehir) ile ilerleyebilme, oyun tarzı esnekliğini koruyor.
- **⚓ görev ipucu** sistemi (kahvehanede belirme, 3 tur içinde kaybolma, sonra farklı biçimde dönme) zorlama olmadan yönlendirme sağlıyor.
- **☽ Tarihsel trivia** entegrasyonu harika — eğitici ama asla didaktik değil.

## ⚠️ Sorunlar & Öneriler

### 10.1 — Görev Zincirleri Multiplayer'da Ne Oluyor?
**Sorun:** Görev zincirleri tamamen singleplayer olarak tasarlanmış. Ama manifesto "singleplayer ve multiplayer aynı oyun" diyor. Multiplayer'da kişisel görev zinciri var mı? Yoksa multiplayer'da görev yok mu?

**Öneri:**
- **Seçenek A (Önerilen):** Multiplayer'da görev zinciri yok — multiplayer'ın dramayı zaten oyuncular üretiyor.
- **Seçenek B:** Multiplayer'da da hafif görev zinciri var ama rekabetçi: "İlk hazineyi bulan oyuncu bonus puan alır." Bu, yarış dinamiği ekler ama karmaşıklık artırır.
- Her iki durumda da bu karar açıkça dokümante edilmeli.

### 10.2 — Görev NPC'leri ve Normal NPC'ler Arası Etkileşim
**Sorun:** Kayıp Hazine zincirinde "Korsan Reis Hamid" görev özel NPC'si olarak geliyor. Ama mevcut NPC'ler (Yorgos, Fatma, Raşid) de zincire dahil oluyor. Normal NPC'ler görev zincirinden bağımsız olarak zaten kendi motivasyonlarıyla hareket ediyorlar. Bu iki katman nasıl etkileşiyor?

**Öneri:**
- Görev NPC'leri (Hamid, Yakup, Nuri Usta) sadece görev sırasında aktif olsun, görev dışında kaybolsunlar.
- Normal NPC'lerin görev zincirindeki rolleri **opsiyonel yardım** olarak kalmalı — görev ilerlemesi için zorunlu olmamalı.
- LLM'e giden prompt'ta "bu NPC şu anda görev zincirinin X aşamasında — davranışını buna göre ayarla" bağlamı eklenebilir.

### 10.3 — "Saf Merak" Zinciri Çok Az Detaylandırılmış
**Sorun:** Diğer 3 zincir (Kayıp Hazine, Baba'nın Şerefi, İntikam) çok detaylı senaryolarla yazılmış. "Saf Merak" zinciri ise sadece özet olarak geçiyor ("7 sır keşif zinciri"). Quest chains dokümanında tam senaryosu eksik.

**Öneri:** "Saf Merak" zincirini diğerleri kadar detaylandırın. Önerilen yapı:
- 7 Akdeniz sırrını keşfetme (her biri farklı limanda, her biri bir ☽ trivia)
- Her sır keşfi farklı deneyim havuzunu test etsin
- Final: "Akdeniz Atlası" tamamlama → özel "Kaşif" ünü
- Bu zincir Pusula niyetini doğrudan ödüllendirmeli.

---

# 11. LLM ENTEGRASYONU

## ✅ İyi Olan
- **LLM sadece metin üretir, mekanik etkilemez** — kritik doğru karar. Deterministik oyun motoru + narratif LLM katmanı.
- Maliyet modeli detaylı ve gerçekçi ($0.37/oturum singleplayer).
- Deneyim profilini LLM'e "kelime olarak" geçirme (sayı değil) — zarif.

## ⚠️ Sorunlar & Öneriler

### 11.1 — LLM Tutarlılık Sorunu
**Sorun:** LLM her çağrıda farklı çıktı üretir. Aynı NPC, aynı durumda farklı turda farklı kişilik gösterebilir. "Kaptan Yorgos" bazen sert, bazen yumuşak konuşabilir. Bu, karakter tutarlılığını bozar.

**Öneri:**
- Her NPC için **karakter şablonu** oluşturun ve her LLM çağrısında ilk mesaj olarak geçirin.
- NPC'nin son 3 mesajını "chat history" olarak LLM'e verin — bağlam tutarlılığı.
- Kritik diyaloglar (görev zincirleri) için daha güçlü model (Claude Sonnet/GPT-4o), günlük fısıltılar için hafif model (Haiku/mini) kullanın.
- NPC diyaloglarında **ton tutarlılığını** kontrol eden bir post-processing katmanı düşünün.

### 11.2 — LLM Gecikme Sorunu (Multiplayer)
**Sorun:** Multiplayer'da 4-8 oyuncunun kahvehane fısıltıları aynı anda üretilmeli. Paralel çağrılar gecikme yaratabilir. 3 saniye hedeflenmiş ama LLM API'leri rate limit altında.

**Öneri:**
- **Ön-üretim:** Tur başlamadan ÖNCE tüm fısıltıları üretip cache'leyin.
- **Fallback sistemi:** LLM cevap vermezse statik fısıltı havuzundan çek.
- **Trivia'ları statik yapın:** ☽ trivia'lar LLM'e ihtiyaç duymaz — JSON dosyasından çekilebilir (zaten önerilmiş, pekiştiriyorum).
- Batch API kullanımı (destekleniyorsa) önemli maliyet ve latency düşüşü sağlar.

### 11.3 — LLM Maliyeti Ölçeklenme Sorunu
**Sorun:** $0.37/singleplayer oturum ve $0.41/multiplayer oturum hesaplanmış. 1000 günlük aktif kullanıcı × 1 oturum/gün = $370-410/gün = $11,000-12,300/ay. Ücretsiz oyun modelinde bu sürdürülemez.

**Öneri:**
- **Freemium model:** Günde 1 ücretsiz oturum, sonraki oturumlar ücretli veya reklam destekli.
- **LLM çağrı azaltma:** Statik fısıltı havuzu (%50) + LLM dinamik fısıltılar (%50) karışımı.
- **Yerel model desteği:** İleride Llama/Mistral gibi açık kaynak modeller ile self-hosted opsiyon.

---

# 12. EVENT SİSTEMİ

## ✅ İyi Olan
- Tarihsel event'ler (Kara Veba, İstanbul Fethi, İnebahtı) oyuna epik boyut katıyor.
- Event + Trivia kombinasyonu eğitici ve atmosferik.
- 4 tetikleyici tipi (zamansal, koşullu, rastgele, zincir) esneklik sağlıyor.

## ⚠️ Sorunlar & Öneriler

### 12.1 — Dönemsel Değişimlerin Oyun Süresiyle Uyumu
**Sorun:** 8 dönem (11.-18. yy) tanımlanmış. 20-40 turlu bir oyunda 8 dönem = her 2.5-5 turda bir dönem değişimi. Bu çok hızlı — oyuncu bir döneme alışmadan yeni dönem başlıyor.

**Öneri:**
- Oyun başlangıcında **dönem seçimi** yaptırın: "Bu oyun hangi yüzyılda geçiyor?" 
- Her oyun 1-2 yüzyılı kapsasın (3-4 dönem maximum).
- Ya da: 40 turlu tam oyunda bile en fazla 2-3 dönem değişimi olsun (her 15-20 turda bir).

### 12.2 — Event Sıklığı Çok Yüksek Olabilir
**Sorun:** "Küçük event: 1-3 turda, Orta: 5-10 turda." Yani HER tur en az 1 küçük event var. Bu, event yorgunluğu yaratabilir — "yine mi event" hissi.

**Öneri:** Küçük event sıklığını 3-5 tura çekin. "Her tur sürpriz" felsefesi event dışında da sağlanabilir (karşılaşma belirsizliği, pazar değişimi, söylenti). Event'ler nadir ama etkili olmalı.

### 12.3 — Liman Kapanma Event'inin Etkisi Çok Sert
**Sorun:** Savaş/veba event'inde liman kapanıyor. O limanda olan oyuncu mahsur mu kalıyor? Oraya gitmekte olan oyuncu ne yapıyor?

**Öneri:**
- Liman kapanma 1 tur önceden **uyarı** olarak gelsin (kahvehane fısıltısı: "Marsilya'da sorun var, dikkat").
- Limanda mahsur kalan oyuncu: çıkabilir ama alım satım yapamaz.
- Yolda olan oyuncu: otomatik olarak en yakın açık limana yönlendirilsin.

---

# 13. MULTIPLAYER & TEKNİK MİMARİ

## ✅ İyi Olan
- Emir gizliliği + eş zamanlı çözümleme, Diplomacy DNA'sını taşıyor.
- WebSocket bazlı real-time mimari uygun seçim.
- DB şeması temiz ve genişletilebilir.

## ⚠️ Sorunlar & Öneriler

### 13.1 — Disconnect Handling Belirsiz
**Sorun:** "Disconnect sorunsuz yönetiliyor" deniyor ama mekanik tanımı yok. Oyuncu düşerse ne olur? Emir vermeden mi devam eder? NPC olarak mı oynar? 5 dakika beklenir mi?

**Öneri:**
- **Kısa disconnect (< 2 dk):** Bekleme + otomatik "Duman" emri (sessiz geçiş).
- **Uzun disconnect (2-5 dk):** NPC moduna geçiş (LLM karar verir).
- **Kalıcı disconnect (> 5 dk):** Oyuncu çıktı sayılır, gemisi NPC olarak devam eder veya limanda bekler.
- Turnuva/ranked modda daha sıkı kurallar (forfeit).

### 13.2 — Cheating Önlemleri Yetersiz Tanımlanmış
**Sorun:** "Emir gizliliği" ve "çözümleme tamamen server-side" deniyor. Ama oyuncular Discord/telefonda iletişim kurarak "açık kanal dışı" bilgi paylaşabilir.

**Öneri:**
- Bu bir board game tasarımı — "metagaming" her zaman mümkündür ve tamamen engellenemez. Bu, Diplomacy'de de aynıdır.
- Daha kritik olan teknik cheating: packet sniffing, API manipulation, vb. Bunlar için server-side validation yeterli.
- Dokümana "metagaming policy" notu ekleyin: "Oyun dışı iletişim oyunun ruhuna aykırı ama teknik olarak engellenemez."

### 13.3 — DB Şemasında `city_relations` Tablosu Eksik
**Sorun:** Şehir ilişkileri (Tanıdık Yüz / Yabancı / Kem Göz) oyunun temel mekaniği ama DB şemasında buna karşılık gelen bir tablo yok.

**Öneri:** Aşağıdaki tabloyu ekleyin:
```sql
CREATE TABLE city_relations (
  player_id UUID REFERENCES players,
  port_id VARCHAR(50) REFERENCES ports,
  relation VARCHAR(20) DEFAULT 'yabanci', -- 'tanidik_yuz', 'yabanci', 'kem_goz'
  last_change_turn INTEGER
);
```

### 13.4 — `orders` Tablosunda `combat_tactic` Erken Tanımlanmış
**Sorun:** Emir verilirken `combat_tactic` da seçiliyor ama savaş olup olmayacağı emir verilirken belli değil. Taktik seçimi savaş BAŞLADIĞINDA yapılmalı.

**Öneri:** `combat_tactic` sütununu `orders` tablosundan çıkarıp ayrı bir `combat_encounters` tablosuna taşıyın:
```sql
CREATE TABLE combat_encounters (
  id UUID PRIMARY KEY,
  game_id UUID REFERENCES games,
  turn INTEGER,
  attacker_id UUID REFERENCES players,
  defender_id UUID REFERENCES players,
  attacker_tactic VARCHAR(20),
  defender_tactic VARCHAR(20),
  result JSONB -- kazanan, ganimet, hasar
);
```

---

# 14. GENEL TASARIM TUTARSIZLIKLARI

### 14.1 — Malta Menşe Tablosunda Var, Harita Bölümünde Geç Ekleniyor
Master dokümanın menşe tablosunda Malta (Şövalye Zırhı) var ama master dokümanın ilk liman listesinde 14 liman sayılıyor. Harita dokümanında 15. liman olarak "bağımsız" statüde. Tutarlılık için her yerde 15 liman belirtilmeli.

### 14.2 — "Otranto Darboğazı" vs "Venedik ↔ Ragusa Tramontana"
Rota tablosunda Venedik ↔ Ragusa = Tramontana + OTRANTO darboğazı. Ama darboğaz bölümünde "Otranto = Ragusa ↔ Venedik" deniyor. Yön tutarlı olmalı — her iki yerde de aynı format.

### 14.3 — NPC Sayısı: Master "3-4", Combat Narrative "4 detaylı"
Master doküman "3-4 derin karakter" diyor, combat narrative doküman 4 detaylı NPC profili (Yorgos, Fatma, Raşid, Don Enrique) çıkarıyor. Kesin sayı belirlenmeli.

### 14.4 — "Lübnan Sediri" Üretim Kaynağı Eksik (Tekrar)
Venedik ve İskenderiye "Lübnan Sediri" arzuluyor ama hiçbir liman üretmiyor. Bu kritik bir ekonomi boşluğu.

### 14.5 — Sezon Sistemi Tur Bazında mı Takvim Bazında mı?
Master dokümanda "yaz/kış" sezonu var ama sezonların tur bazında nasıl dönüştüğü (kaç turda bir mevsim değişir?) belirtilmemiş.

---

# 15. ÖZET

## 🔴 KRİTİK (Oyun dengesini veya çalışabilirliği doğrudan etkiler)
1. **Lübnan Sediri üretim kaynağı eksik** — ekonomi boşluğu
2. **Açlık/doyma hızı oyuncu sayısına göre ölçeklenmeli** — 6+ oyuncuda kırılır
3. **Manevra taktiği ödülsüz** — hiç seçilmeyebilir
4. **Kabotaj 2. tur oyuncu durumu tanımsız** — kural boşluğu
5. **Kaçak mal 3-5x + Simsar %3 yakalanma = bozuk ekonomi** riski
6. **DB şemasında city_relations tablosu eksik**
7. **combat_tactic orders tablosunda yanlış yerde**

## 🟡 ÖNEMLİ (Oyun deneyimini önemli ölçüde iyileştirir)
1. Fondaco fazında aksiyon limiti veya zaman maliyeti eklenmeli
2. Meltem otomatik +1 deneyimi kaldırılmalı veya azaltılmalı
3. Söylenti yayma maliyeti artırılmalı (10 → 25 altın)
4. Zar alt sınırı 3-6 çok güçlü — 2-6 tavanla sınırlanmalı
5. Ragusa'ya transit vergisi eklenmeli
6. Karaka'ya savunma bonusu eklenmeli
7. Trablus erişilebilirliği artırılmalı
8. Dönemsel değişim hızı yavaşlatılmalı
9. Ün kaybetme koşulları netleştirilmeli
10. Gemi fiyatları ve değiştirme maliyetleri tanımlanmalı
11. Disconnect handling kuralları belirlenmeli

## 🟢 ÇOK İYİ OLAN (Tasarımın güçlü yönleri)
1. "En fazla 3 karar" manifestosu — tüm tasarıma tutarlı biçimde işlenmiş
2. Görünmez deneyim sistemi — oran bazlı, hissedilen ama ölçülemeyen
3. Çatışma spektrumu (Demir/Zehir/Kuşatma) — oyunun en özgün yönü
4. Menşe sistemi + açlık/doyma — ticaret ikilemleri sürekli taze
5. Duman niyeti — "hiçbir şey yapmama" kararının stratejik değeri
6. ☽ Tarihsel trivia entegrasyonu — eğitici ama didaktik değil
7. LLM entegrasyonu mimarisi — deterministik motor + narratif katman
8. Disco Elysium esinli isimlendirme — Meltem, Terazi, Mürekkep, Simsar zarif ve tematik
9. Görev zincirlerinde çoklu yol — her oyun tarzı ilerleyebilir
10. "Bilgi = Para" ekonomi felsefesi — sosyal etkileşimi doğal kılıyor

---

*"Her eklenen mekanik bu filtreyi geçmelidir: 'Bu, oyuncunun turda verdiği 3 karardan birini daha ilginç yapıyor mu?' Bu review da aynı filtreyi uygulamıştır."*
