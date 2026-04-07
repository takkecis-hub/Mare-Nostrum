# MARE NOSTRUM — Master Oyun Tasarım Dokümanı
## Versiyon 3.0 — Konsolide Final Referans

> ✅ **AKTİF DOKÜMAN** — Bu, Mare Nostrum'un tek geçerli tasarım referansıdır.
> Tüm önceki dokümanlar OUTDATED veya WIP olarak işaretlenmiştir.
> Son güncelleme: Nisan 2026

---

# DOKÜMAN HARİTASI

Bu master doküman, aşağıdaki modüler çalışma dokümanlarının konsolide edilmiş halidir. Detaylı bilgi için ilgili modüle bakılabilir:

| # | Modül Dosyası | Durum | İçerik |
|---|---|---|---|
| 1 | `mare_nostrum_naming_review.md` | 🔧 WIP | Yaratıcı isimlendirme tablosu + v2 review |
| 2 | `mare_nostrum_experience_system.md` | 🔧 WIP | Görünmez deneyim sistemi detayları |
| 3 | `mare_nostrum_conflict_spectrum.md` | 🔧 WIP | Çatışma spektrumu (Demir/Zehir/Kuşatma) |
| 4 | `mare_nostrum_map_design.md` | 🔧 WIP | Harita tasarımı, 15 liman, 28 rota, 3 darboğaz |
| 5 | `mare_nostrum_economy.md` | 🔧 WIP | Menşe sistemi, açlık/doyma, Terazi deneyimi |
| 6 | `mare_nostrum_combat_narrative.md` | 🔧 WIP | Savaş taktiği + singleplayer anlatı + tarihsel trivia |
| 7 | `mare_nostrum_quest_chains.md` | 🔧 WIP | 4 köken hikayesi tam senaryo (Kayıp Hazine, Baba'nın Şerefi, İntikam, Saf Merak) |
| 8 | `mare_nostrum_implementation_plan.md` | 🔧 WIP | Teknik implementasyon planı, stack, fazlar, maliyet, DB şeması |
| 9 | `mare_nostrum_mechanics_review.md` | ✅ TAMAMLANDI | Mekanik review — tüm modüllere uygulanan denge önerileri |
| 10 | `akdeniz_events.md` | ⚠️ OUTDATED | 92 event'lik ham tarihsel kaynak listesi (hâlâ referans) |

**Eskimiş dokümanlar (sadece arşiv):**
`akdeniz_game_mechanics.md`, `akdeniz_player_relations.md`, `mare_nostrum_v2.md`, `mare_nostrum_master_gdd.md` — v1/v2 tasarım süreci, artık geçersiz.

---

# BÖLÜM 0: TASARIM MANİFESTOSU

Bu oyun üç dakikada öğretilir, üç saat sonra hâlâ "bir tur daha" dedirtir.

**Tasarım kuralları:**
1. Oyuncunun turda vereceği karar sayısı: EN FAZLA ÜÇ
2. Her karar bir ikilem olmalı — doğru cevap olmamalı
3. Sürpriz anı olmayan tur, başarısız turdur
4. Spreadsheet açan oyuncu kaybeder — içgüdü kazanır
5. Singleplayer ve multiplayer AYNI oyun — iki ayrı mod değil
6. En tehlikeli silah kılıç değil, fısıltıdır

**Oyun özeti:**
Akdeniz'de bir geminin var. Her tur bir yere gidiyorsun, bir şey yapıyorsun. Yolda kimi bulacağını bilmiyorsun. Limanda kimi bulacağını bilmiyorsun. Seni tanıyanlar hakkında hikayeler anlatıyor. Hikayeler seni kurtarır ya da batırır. Kılıcınla bir gemiyi batırırsın; fısıltınla bir imparatorluğu batırırsın.

**Dönem:** 11.–18. yüzyıl, Akdeniz havzası.
**Oyuncu:** 1 (singleplayer + LLM) veya 2–8 (multiplayer).
**Tur süresi:** 7–12 dakika. Toplam oturum: 20–40 tur (2–5 saat).

---

# BÖLÜM 1: SÖZLÜK — TÜM TERİMLER

> Kaynak modül: `mare_nostrum_naming_review.md`

Tüm mekanikler Disco Elysium esinli, Akdeniz tarihinden gönderme yapan isimler taşır:

### Gizli Deneyim Havuzları
| Oyun İsmi | Eski İsim | Açıklama | Gönderme |
|---|---|---|---|
| **Meltem** | Deniz | Fırtına, savaş, denizcilik deneyimi | Ege'nin mevsimlik rüzgârı |
| **Terazi** | Pazar | Ticaret, fiyat, pazarlık deneyimi | Tüccar sembolü, adalet ve hile aracı |
| **Mürekkep** | Divan | Müzakere, diplomasi, söylenti yönetimi | Ferman, anlaşma, idam kararı |
| **Simsar** | Gölge | Kaçakçılık, casusluk, gizli operasyonlar | Arapça semsâr, karanlık aracı |

### Ünler
| Oyun İsmi | Eski İsim | Bonus | Gönderme |
|---|---|---|---|
| **Altın Parmak** | Usta Tüccar | Fiyat trendlerini net görür | Midas dokunuşu |
| **Demir Pruva** | Savaşçı | Savaşta +1 güç | Kırılmaz gemi burnu |
| **İpek Dil** | Diplomat | Şehirler sıcak, fidyede avantaj | Yılanı deliğinden çıkaran |
| **Hayalet Pala** | Gizli Operatör | Kaçakçılık riski düşük | Görünmez ama her yerde |
| **Mühürlü Söz** | Güvenilir | Commenda sık gelir, kredi | Yüzü mühür yerine geçen |
| **Akrep** | İhanetçi | Anlaşma gelmez ama tehdit güçlü | Sessiz, öldürücü |
| **Açık El** | Cömert | Mürettebat ucuz, mülteciler sığınır | Eli açık, herkese dağıtan |
| **Deli Rüzgâr** | Cesur | Tehlikeli görevler açılır | Vento pazzo |

### Tur Fazları ve Niyetler
| Oyun İsmi | Eski İsim | Açıklama |
|---|---|---|
| **Fondaco** | Liman Fazı | Konuş, duy, al-sat, hazırlan |
| **Rüzgâr** | Deniz Fazı | Emirler açılır, çözümleme |
| **Kervan** | Ticaret niyeti | Mal taşı, limanda al-sat |
| **Kara Bayrak** | Avlanma niyeti | Yolda rastladığına saldır |
| **Pusula** | Keşif niyeti | Bilgi topla, kimseyle muhatap olma |
| **Duman** | Sessiz geç | Görünmez kal, gözlemle, karışma |

### Rotalar, Gemiler, Çatışma, İlişkiler
| Oyun İsmi | Açıklama |
|---|---|
| **Tramontana** | Normal rota (1 tur) |
| **Kabotaj** | Kıyı rotası (2 tur, güvenli) |
| **Fortuna** | Açık deniz rotası (1 tur, riskli) |
| **Feluka** | Küçük gemi — hızlı, az kargo, güç 1 |
| **Karaka** | Tüccar gemisi — orta hız, çok kargo, güç 2 |
| **Kadırga** | Savaş gemisi — yavaş, az kargo, güç 3 |
| **Demir** | Fiziksel saldırı (kılıç, top) |
| **Zehir** | Sosyal saldırı (söylenti, karalama) |
| **Kuşatma** | Ekonomik saldırı (stok abluka, fiyat sabotajı) |
| **Tanıdık Yüz** | Olumlu şehir ilişkisi |
| **Yabancı** | Nötr şehir ilişkisi |
| **Kem Göz** | Olumsuz şehir ilişkisi |
| **Efsane** | Zafer koşulu — en çok anlatılan isim ol |

### Kahvehane Aksiyonları
| Oyun İsmi | Eski İsim | İşlev |
|---|---|---|
| **Kahve Falı** | Kulak kabart | Pasif bilgi toplama |
| **Rüzgâr Ek** | Söylenti yay | Söylenti silahı |
| **Ateşe Su** | Yalanlat | Söylenti savunması |
| **İzi Sürmek** | Kaynak araştır | Söylenti kaynağını bul |

---

# BÖLÜM 2: ÇEKİRDEK DÖNGÜ

## 2.1 Tur Yapısı: İki Faz

```
┌──────────────────────────────────────────┐
│               BİR TUR                    │
│                                          │
│  ┌──────────────┐    ┌────────────────┐  │
│  │   FONDACO    │ →  │    RÜZGÂR     │  │
│  │  (konuş,    │    │  (emirler     │  │
│  │   duy,      │    │   açılır,     │  │
│  │   hazırlan) │    │   çözümleme)  │  │
│  │  5-10 dk    │    │   otomatik    │  │
│  └──────────────┘    └────────────────┘  │
└──────────────────────────────────────────┘
```

## 2.2 Fondaco (Liman Fazı)

Oyuncu limanda (hepsi opsiyonel, sıra yok):

**Kahvehane** — 3 fısıltı görünür (deneyim profiline göre farklılaşır). 4 aksiyon: Kahve Falı, Rüzgâr Ek, Ateşe Su, İzi Sürmek. Her 3-4 turda biri ☽ tarihsel trivia olabilir (singleplayer'da).

**Pazar** — Menşe mal al/sat. Beş nokta fiyat göstergesi (●●●○○). Terazi deneyimine göre detay artar. Rakam yok.

**Müzakere** — Multiplayer: açık kanal + özel kanal. Singleplayer: LLM NPC mesajları.

**Tersane** — Gemi tamiri, gemi değiştirme.

**Fondaco sınırlamaları:** İlk 5 tur: Fondaco zamanlayıcısı %50 uzatılmış (yeni oyuncular için öğrenme süresi). Her aksiyon zaman maliyetli — tur başına EN FAZLA 3 aksiyona vakit var (Kahvehane + Pazar + 1 ek). Bu, analiz felcini engeller.

## 2.3 Emir: Üç Seçim

```
  NEREYE?   [haritadan liman seç]
  NASIL?    Tramontana / Kabotaj / Fortuna
  NİYET?    Kervan / Kara Bayrak / Pusula / Duman
```

**4 niyet × 3 rota = 12 kombinasyon.** Her biri farklı strateji.

## 2.4 Rüzgâr (Deniz Fazı) — Otomatik Çözümleme

```
1. Hava durumu → fırtına kontrolü
2. Karşılaşma → yolda kimi buldun?
3. Niyet çözümü → çatışma, gözlem veya geçiş
4. Savaş varsa → taktik seçimi (Pruva/Ateş/Manevra)
5. Ticaret çözümü → açlık/doyma + ilk gelen bonusu
6. Söylenti üretimi → otomatik
7. Deneyim güncelleme → sessiz
8. Ün kontrolü → sessiz
```

---

# BÖLÜM 3: DEDİKODU RÜZGÂRI

> Kaynak modül: `mare_nostrum_conflict_spectrum.md`

## 3.1 Söylenti Üretimi

Her önemli eylem tek cümlelik söylenti üretir (savaş, büyük ticaret, kaçakçılık, ihanet, cömertlik, vb).

## 3.2 Söylenti Yayılması

Söylenti kaynak limandan başlar, her tur komşu limanlara yayılır. Çarpıtma ŞABLON BAZLI — her söylenti tipinin 2 versiyonu: seven limanda olumlu, sevmeyende olumsuz. Söylenti ömrü: küçük 3-4 tur, orta 5-6 tur, büyük 8-10 tur. 3+ aynı tip söylenti birikirse ün'e dönüşür (kalıcı).

## 3.3 Söylenti Silahları (Rüzgâr Ek)

Şablon bazlı söylenti yayma — kişi hakkında (gözdağı, suçlama, karalama, övgü, ifşa) veya piyasa hakkında (fiyat manipülasyonu). Maliyet: 25 altın. 5 turda 3+ söylenti yayarsan "çok fısıldıyor" söylentisi doğar.

## 3.4 Söylenti Savunması

4 seçenek: Ateşe Su (çürütme, Mürekkep'e bağlı), İzi Sürmek (kaynak bulma, Simsar'a bağlı), Yoksay (doğal ömrüne bırak), Karşı Söylenti (tahmini saldırgan'a karşı).

## 3.5 Söylenti → Şehir İlişkisi

Şehir devletleri seni söylentilere göre karşılar: **Tanıdık Yüz** (olumlu) / **Yabancı** (nötr) / **Kem Göz** (olumsuz). İttifak bulaşması: artık OTOMATİK değil, SÖYLENTI BAZLI. "Osmanlı dostu" söylentisi yayılınca etkili olur — yayılmazsa etkisi yok. Oyuncu aktif söylenti yönetimiyle (Ateşe Su, karşı söylenti) önleyebilir.

---

# BÖLÜM 4: GÖRÜNMEZ DENEYİM SİSTEMİ

> Kaynak modül: `mare_nostrum_experience_system.md`

## 4.1 Dört Gizli Havuz

Oyuncu görmez, oyun sessizce izler. Meltem (deniz), Terazi (ticaret), Mürekkep (diplomasi), Simsar (gölge). Eylemler otomatik olarak ilgili havuzu doldurur.
Not: Denize çıkmanın otomatik Meltem +1 katkısı kaldırıldı — Meltem sadece aktif deneyimlerle (fırtına, savaş, kaçış) kazanılır. Generalist dezavantajı eklendi: %25 altı havuzlarda belirli fırsatlar tamamen kaçırılır.

## 4.2 Oran Bazlı Etki

Toplam değil, havuzlar arası ORAN belirleyici. Meltem oranı = Meltem / (Meltem + Terazi + Mürekkep + Simsar). Her şeyi yapan hiçbir alanda derin olamaz → doğal uzmanlaşma baskısı ve ortaklık ihtiyacı.

## 4.3 Hissedilen Etkiler

**Kahvehane:** Aynı kahvehanede iki oyuncu farklı şeyler duyar. Meltem ağırlıklı deniz bilgisi, Terazi ağırlıklı piyasa bilgisi, Mürekkep ağırlıklı siyasi bilgi, Simsar ağırlıklı gizli bilgi.

**Pazar:** Terazi arttıkça fiyat göstergeleri netleşir, sahte trendler fark edilir, kontrat müzakeresi açılır.

**Deniz:** Meltem arttıkça savaşta zar alt sınırı yükselir (1-6 → 2-6 → 3-6), fırtına hasarı düşer, kısayol bulma şansı doğar.

**Diplomasi:** Mürekkep arttıkça şehir yöneticileri sıcaklaşır, söylenti yönetimi güçlenir, ittifak bulaşması yavaşlar.

**Gölge:** Simsar arttıkça kaçakçılık yakalanma riski düşer (%40 → %3), başkalarının kargosunu ve emirlerini görürsün.

---

# BÖLÜM 5: ÇATIŞMA SİSTEMİ

> Kaynak modüller: `mare_nostrum_conflict_spectrum.md`, `mare_nostrum_combat_narrative.md`

## 5.1 Çatışma Spektrumu

**Demir** (fiziksel) — gürültülü, riskli, anlık. **Zehir** (sosyal/söylenti) — sessiz, güvenli, yavaş. **Kuşatma** (ekonomik) — sabırlı, dolaylı. Üçü kombine edilebilir.

## 5.2 Fiziksel Çatışma — Taktik Seçimli

Savaş başlamadan HER İKİ TARAF gizlice taktik seçer:

```
  ⚔️ PRUVA (bordalama) — yakın dövüş, gemiyi bütün ele geçir
  🔥 ATEŞ (uzak savaş) — güvenli, az ganimet
  💨 MANEVRA (kaçınma) — pozisyon al, yorar veya kaçırsın
```

**Taş-kağıt-makas:** Pruva > Ateş > Manevra > Pruva. Kazanan taktik +2 bonus.

**Gemi sinerjileri:** Feluka → Manevra'da +1 ekstra. Kadırga → Pruva'da +1 ekstra.

**Güç formülü:** Gemi değeri + Ün bonusu + Taktik bonusu + Zar (Meltem'e göre 1-6 veya 2-6 — üst sınır 2-6, 3-6 kaldırıldı).

**Manevra zaferi ödülü:** Manevra ile kazanan düşmanın kargosunu ve emrini görür (istihbarat), düşmana -1 moral penaltısı verir.

**Savunan taraf kaçış hakkı:** Savunan savaşı kabul etmek zorunda değil — KAÇIŞ seçebilir (hız karşılaştırması).

## 5.3 Duman Niyeti — Saldırmamanın Gücü

Birini görüp saldırmamak: borç yaratır, bilgi toplar, gizliliği korur. Mürekkep ve Simsar havuzunu besler. Pasifist oyuncu da gelişir.
Multiplayer'da hedef oyuncuya "seni gördü ama saldırmadı" bildirimi gider. Singleplayer'da NPC borç sayacı ile izlenir.

## 5.4 Sosyal ve Ekonomik Saldırı

**Zehir:** Rüzgâr Ek ile karalama, suçlama, sahte piyasa bilgisi. Rakibi turlar boyunca saf dışı bırakır.

**Kuşatma:** Fiyat sabotajı (rakipten önce sat), stok ablukası (tüm malı satın al), rota korkutması (sahte korsan söylentisi).

---

# BÖLÜM 6: EKONOMİ SİSTEMİ

> Kaynak modül: `mare_nostrum_economy.md`

## 6.1 Menşe Sistemi

3 kategori (Yemek, Lüks, Savaş) + 15 menşe mal. Her liman kendine özgü mal üretir (ucuz) ve arzular (pahalı):

| Liman | Üretir (ucuz) | Arzular (pahalı) |
|---|---|---|
| Barselona | Katalan Demiri [Savaş] | Doğu İpeği [Lüks] |
| Marsilya | Provence Şarabı [Yemek] | Mısır Baharatı [Lüks] |
| Cenova | Ligurya Mercanı [Lüks] | Sicilya Buğdayı [Yemek] |
| Venedik | Murano Camı [Lüks] | Lübnan Sediri [Savaş] |
| Palermo | Sicilya Buğdayı [Yemek] | Murano Camı [Lüks] |
| Ragusa | (transit — hepsi orta fiyat) | — |
| Malta | Şövalye Zırhı [Savaş] | Sicilya Buğdayı [Yemek] |
| İstanbul | Doğu İpeği [Lüks] | Katalan Demiri [Savaş] |
| Girit | Girit Zeytinyağı [Yemek] | Doğu İpeği [Lüks] |
| Kıbrıs | Kıbrıs Tuzu [Yemek] | Mısır Baharatı [Lüks] |
| Beyrut | Halep Sabunu [Lüks], Lübnan Sediri [Savaş] | Katalan Demiri [Savaş] |
| İskenderiye | Mısır Baharatı [Lüks] | Lübnan Sediri [Savaş] |
| Trablus | Sahra Altını [Lüks] | Provence Şarabı [Yemek] |
| Tunus | Tunus Zeytinyağı [Yemek] | Ligurya Mercanı [Lüks] |
| Cezayir | Ganimet Silahı [Savaş] | Provence Şarabı [Yemek] |

## 6.2 Açlık / Doyma Mekaniği

Her limanın her menşe mala açlık seviyesi var: AÇ (kimse getirmemiş, fiyat tavan) → NORMAL → TOK (çok getirilmiş, fiyat dip). Doyma hızı oyuncu sayısına göre ölçeklenir: 2 oyuncu'da 1 getirme -1, 2 getirme -3. 4 oyuncu'da 1/-1, 2/-2, 3+/DİBE. 6+ oyuncu'da daha yavaş doyma. İlk gelen bonusu kargo miktarıyla ters orantılı (Feluka hız meta'sı kırılır).

**Sabit rota çalışmaz** — herkes aynı rotayı keşfedince fiyat çöker.

## 6.3 İlk Gelen Bonusu

Aynı turda aynı limana aynı malı getiren oyunculardan HIZLI olan iyi fiyat, yavaş olan kötü fiyat alır. Fortuna (hızlı ama riskli) = ilk gelme şansı.

## 6.4 Fiyat Gösterimi

Rakam yok. Beş nokta: ●●●●● (çok pahalı) → ●○○○○ (çok ucuz). Terazi deneyimine göre detay artar.

## 6.5 Şehir Kontratları

LLM şehir yöneticisi sabit gelir garantili kontratlar teklif eder. Bozarsan ceza + itibar düşüşü.

## 6.6 Kaçak Mal

Bazı mallar bazı limanlarda yasak. Kaçakçılık: yakalanma Simsar'a bağlı (%40 → %3). Yasak mal 2-3x normal fiyat. Yakalanma cezası artırıldı: 2 tur hapis + 200 altın para cezası.

## 6.7 Sezon Etkisi

Yaz: trafik yoğun, yemek ucuz, lüks pahalı. Kış: fırtına riski, yemek pahalı, kışın denize çıkan aç pazarlarda vurgun vurur.

## 6.8 Commenda

Yatırımcı sermaye koyar + Tüccar denize çıkar. Kâr paylaşımı serbest anlaşma. İhanet her zaman mümkün — ama söylenti üretir.
İhanet cezası zamana göre ağırlaşır: 1. ihanet hafif söylenti (3 tur), 2. ihanet güçlü söylenti (6+ tur), 3. ihanet kalıcı "Akrep" ünü.

---

# BÖLÜM 7: ÜN SİSTEMİ

## 7.1 Ün Kazanma

İki koşul: yeterli deneyim oranı + yeterli söylenti. Örn: Altın Parmak = Terazi %35+ VE 3+ aktif ticaret söylentisi. Maximum 3 ün. Kaybedilebilir (5 tur kullanmama veya çelişen eylemler).
Ün kaybı kuralları: 5 tur boyunca ünle ilgili eylem yoksa uyarı, 8 tur sonra kayıp. Çelişen eylem (Altın Parmak iken ihanet) anında kaybetme riski.

## 7.2 Oyuncuya Görünen Tek Stat

```
  ★ Altın Parmak
  ★ İpek Dil
  ☆ (boş)
```

Ünler sonuç, deneyim havuzları sebep. Oyuncu sonucu görür, sebebi hisseder ama ölçemez.

---

# BÖLÜM 8: GEMİ SİSTEMİ

Üç gemi, tek gemi kuralı:

| Gemi | Hız | Kargo | Güç | Taktik Sinerjisi |
|---|---|---|---|---|
| **Feluka** | Hızlı | Az | 1 | Manevra'da +1 |
| **Karaka** | Orta | Çok | 2 | Yok (tüccar gemisi) |
| **Kadırga** | Yavaş | Az | 3 | Pruva'da +1 |

Gemi durumu: **Denize Hazır** → **Yaralı** (performans yarı, 1 tur onarım) → **Denizin Dibi** (yeni gemi satın al).

**Karaka savunma bonusu:** Ateş taktiğinde +1 ("ağır yük" koruması). Kaybedildiğinde kargonun %50'si kurtarılabilir.

**Gemi fiyatları ve geçiş maliyeti:**
| İşlem | Maliyet |
|---|---|
| Feluka satın al | 100 altın |
| Karaka satın al | 300 altın |
| Kadırga satın al | 500 altın |
| Gemi değiştirme (eski gemiyi sat) | Yeni fiyat - eski fiyatın %50'si |
| Yaralı gemi tamiri | Gemi fiyatının %25'i |

**Kadırga yavaşlığı:** Kadırga, Kabotaj rotalarında 1 ekstra tur ekler (toplam 3 tur). Tramontana'da normal. Bu, Kadırga'nın "savaş makinesi ama lojistik kabus" temasını güçlendirir.

---

# BÖLÜM 9: HARİTA

> Kaynak modül: `mare_nostrum_map_design.md`

## 9.1 Yapı

15 liman, 4 bölge, 29 rota, 3 darboğaz.

**Bölgeler:** Frenk Denizi (Batı — güvenli, rekabetli), Ara Deniz (Orta — kavşak, kaotik), Şark Denizi (Doğu — zengin, tehlikeli), Berber Kıyısı (Güney — kanunsuz, gölgeler).

## 9.2 Darboğazlar

**Sicilya Boğazı** (Palermo ↔ Tunus): Doğu-Batı geçişi, %75 karşılaşma.
**Ege Kapısı** (Girit ↔ İstanbul): Osmanlı kontrolü, %70 karşılaşma.
**Otranto** (Venedik ↔ Ragusa): Venedik'in kapısı, %65 karşılaşma.

Her darboğazın alternatifi var ama ya daha riskli ya daha yavaş.

## 9.3 Özel Limanlar

**Ragusa:** Nötr — hiçbir oyuncuyu Kem Göz yapmaz. Bilgi merkezi, kahvehanede ekstra fısıltı. Diplomatik sığınak.
Ragusa transit vergisi: %10 ekstra ticaret vergisi (nötralite bedeli).

**Cezayir:** Korsan limanı — Kara Bayrak cezasız. Ganimet pazarı. Hristiyanlara Kem Göz.

**Malta:** Savaşçı — Kadırga ve tamir ucuz. Müslümanlara Kem Göz.

**Malta ↔ Cezayir Fortuna rotası (yeni):** Şövalye vs Korsan gerilimi doğrudan rota bağlantısıyla pekiştirildi.

## 9.4 Başlangıç

Herkes: 1 Feluka + 200 altın + sıfır ün + ev limanında Tanıdık Yüz.

---

# BÖLÜM 10: EVENT SİSTEMİ

> Ham kaynak: `akdeniz_events.md` (92 event, tarihsel referans)

## 10.1 Event Yapısı

Her event: duyuru (LLM, 1-2 cümle) + etki (mekanik değişim) + ikilem (zor seçim) + ☽ trivia (tarihsel detay).

## 10.2 Tetikleyiciler

**Zamansal** (tarihsel), **Koşullu** (oyun durumu), **Rastgele** (her tur zar), **Zincir** (event → event).

## 10.3 Sıklık

Mega (yüzyılda 2-3), Büyük (10-15 turda), Orta (5-10 turda), Küçük (1-3 turda).

## 10.4 Dönemsel Değişimler

8 dönem (11.-18. yy), her birinde farklı güç dengesi, event'ler ve liman kontrolleri. Liman el değiştirdiğinde söylentiler sıfırlanır, 2-3 tur kaos.

---

# BÖLÜM 11: LLM ENTEGRASYONU

## 11.1 Üç Görev

**Görev 1 — Kahvehane fısıltıları:** Her tur, her limanda 3 kısa cümle. Deneyim profiline göre farklılaşır.

**Görev 2 — Şehir yöneticisi:** Opsiyonel, max 3 mesaj alışverişi. Mürekkep deneyimine göre sıcaklık değişir.

**Görev 3 — Event anlatıcısı:** Nadir, dramatik. Mega event'lerde 2-3 cümle + ☽ trivia.

## 11.2 Singleplayer Ek Görevler

**NPC'ler:** 3-4 derin karakter (gizli motivasyon, tarihsel gönderme, kendi trivia'ları). Mesaj atar, teklif/tehdit/bilgi sunar, blöf atar.

**Kişisel görev zinciri:** Oyun başında köken hikayesi seçimi → oyun boyunca ilerleyen kişisel anlatı. 4 tam senaryo: Kayıp Hazine (5 aşama, çoklu yol), Baba'nın Şerefi (komplo çözme, adalet/intikam ikilemi), İntikam (düşman avı, affetme seçeneği), Saf Merak (7 sır keşif zinciri, trivia merkezli). Tam detay → `mare_nostrum_quest_chains.md`
Not: Görev zincirleri SADECE singleplayer'da aktif. Multiplayer'da drama oyunculardan gelir.

**10 tur özeti:** LLM, Kaptanın Günlüğü yazar — kişisel dram + NPC ilişkileri + stratejik soru + tarihsel perspektif.

**Dönem geçiş anlatıları:** Her yüzyıl değişiminde tarihsel bağlam + ☽ trivia.

---

# BÖLÜM 12: TARİHSEL TRİVİA SİSTEMİ

> Kaynak modül: `mare_nostrum_combat_narrative.md`

## 12.1 ☽ Trivia Formatı

Kahvehanede, event duyurularında ve NPC diyaloglarında ☽ sembolüyle işaretli tarihsel bilgiler. Mekanik etkisi yok, atmosfer ve merak uyandırma amaçlı.

## 12.2 Liman Bazlı Trivia Örnekleri

Her limanın kendine özgü trivia havuzu var: Venedik (Arsenal, Murano mahkumları), İstanbul (gemiler karadan yürütüldü), Cezayir (Barbaros çömlekçi), İskenderiye (karabiber altın değerinde), Ragusa (çifte haraç diplomasisi), Malta (Hospitalier gezgin şövalyeler), Marsilya (karantina kelimesinin kökeni), Barselona (1492'nin üç olayı), Girit (Rum ateşi kayıp formül), Beyrut (alfabe burada doğdu), Trablus (Mansa Musa'nın 12.000 devesi), Kıbrıs (şeker kamışı lüks ilaç), Tunus (Kartaca'ya tuz ekmek).

## 12.3 Event Trivia Örnekleri

Kara Veba (biyolojik savaşın ilk örneği), İstanbul fethi (Macar Urban'ın ironisi), İnebahtı (Cervantes'in kolu, Sokullu'nun sakal lafı), Haçlı seferleri (ilk pogromlar), Yeni Dünya gümüşü (Potosí'de 8 milyon ölüm), Yahudi sürgünü (Bayezid'in Ferdinand lafı), kahve (Papa'nın vaftiz etmesi).

---

# BÖLÜM 13: OYUNCU-OYUNCU İLİŞKİLERİ

## 13.1 Temel İlke

Sayısal ilişki sistemi YOK. Güven tamamen oyuncunun kafasında. Mekanik sonuç dolaylı: ihanet → söylenti → ün → şehir ilişkisi.

## 13.2 İş Birliği

**Commenda:** Yatırımcı + tüccar ortaklığı. İhanet her zaman mümkün.
**Konvoy:** Aynı hedefe emir ver. Ortağının gerçekten emir verip vermediğini bilemezsin.
**Bilgi ticareti:** Fısıltı satışı. Bilgi doğru da olabilir yalan da.

## 13.3 Blöf

Güç, bilgi, niyet ve tehdit blöfleri. Emir gizli olduğu için kanıtlanamaz.

## 13.4 Koalisyon

Doğal oluşur ve çöker. Kingmaker dinamiği — zayıf oyuncu bile önemli.

---

# BÖLÜM 14: ZAFER

**"Efsane Ol."** Akdeniz'in en çok anlatılan ismi ol.

```
PUAN = (aktif söylenti sayısı × yayılma genişliği) + (ün sayısı × 10)
```

**Efsanevi başarımlar (bonus puan):** Tüm Akdeniz'i gez, Büyük İhanet, Barış Elçisi, Veba Kahramanı, Korsan Avcısı, Hayalet, Tekelci, Herkesin Arkadaşı.

**Zafer dengesi:** Çeşitlilik çarpanı eklendi — tek tip söylenti (hep ticaret) yerine çeşitli (ticaret + diplomasi + savaş) söylentiye sahip oyuncu bonus puan alır. Efsanevi başarımlar arasında denge: "kolay" başarımlar düşük puan, "zor" başarımlar yüksek puan.

---

# BÖLÜM 15: TEKNİK MİMARİ

```
┌─────────────┐     ┌───────────────────┐
│  Oyuncu UI  │◄───►│   Oyun Sunucu     │
│ (Web/Mobil) │     │ (Durum Yönetimi)  │
└─────────────┘     └───────┬───────────┘
                            │
              ┌─────────────┼──────────────┐
              │             │              │
     ┌────────┴────┐ ┌─────┴──────┐ ┌────┴───────────┐
     │  LLM API    │ │  Oyun      │ │  Söylenti      │
     │ Kahvehane   │ │  Motoru    │ │  Motoru        │
     │ Yönetici    │ │ Emir çözüm │ │ Üretim/yayılma │
     │ Anlatıcı    │ │ Savaş      │ │ Çürüme/ün      │
     │ (SP: NPC)   │ │ Ekonomi    │ │                │
     └─────────────┘ └────────────┘ └────────────────┘
```

Oyun motoru ve söylenti motoru **deterministik** — LLM'e bağlı değil. LLM sadece metin üretir, mekanik etkilemez.

---

# BÖLÜM 16: EĞlENCE KONTROL LİSTESİ

```
✅ 30 saniyede açıklanabilir mi?        → EVET
✅ Her tur sürpriz var mı?               → EVET (karşılaşma belirsizliği)
✅ Spreadsheet gerekiyor mu?             → HAYIR (noktalar, ünler, hisler)
✅ İhanet anı dramatik mi?               → EVET (konvoy tuzağı, Zehir, Kuşatma)
✅ Saldırmadan saldırabilir misin?       → EVET (Zehir, Kuşatma, Duman)
✅ Savaşta karar var mı?                 → EVET (Pruva/Ateş/Manevra)
✅ Ticaret ilginç mi?                    → EVET (menşe, açlık, ilk gelen)
✅ Tarih öğretiyor mu?                   → EVET (☽ trivia, merak uyandırıcı)
✅ Singleplayer hikayesi var mı?         → EVET (köken, görev zinciri, NPC dram)
✅ Multiplayer sosyal gerilimi var mı?   → EVET (Diplomacy DNA'sı)
✅ Her oyun tarzı viable mı?             → EVET (tüccar, korsan, diplomat, gölge)
✅ Kaybeden bile önemli mi?              → EVET (kingmaker)
✅ "Bir tur daha" hissi var mı?          → TEST EDİLMELİ
```

---

# BÖLÜM 17: AÇIK KONULAR VE SONRAKI ADIMLAR

```
✅ İMPLEMENTASYON PLANI — Teknik yol haritası yazıldı → `mare_nostrum_implementation_plan.md`
✅ MEKANİK REVİEW — Tüm sistemler incelendi → `mare_nostrum_mechanics_review.md`
✅ DENGE GÜNCELLEMELERİ — Ekonomi, savaş, deneyim, söylenti denge ayarları uygulandı
□ HARİTA GÖRSELİ — Oyuncu referans haritaları derleyecek, grafik dil belirlenecek
□ PROTOTİP — Fondaco + emir + Rüzgâr çözümleme (minimal teknik demo)
□ LLM PROMPT TESTLERİ — Kahvehane, şehir yöneticisi, NPC tutarlılık testi
□ DENGE TESTİ — Menşe mal fiyatları, açlık hızı, savaş zar aralıkları
□ SES/MÜZİK — Akdeniz ortaçağ atmosferi
✅ SINGLEPLAYER GÖREV ZİNCİRLERİ — 4 köken hikayesi yazıldı → `mare_nostrum_quest_chains.md`
□ EVENT TAKVİMİ — 92 event'in dönemlere tam dağılımı
□ OYUNCU TESTİ — İlk playtest ile "bir tur daha" hissi ölçümü
```

---

*Eklenen her mekanik bu filtreyi geçmelidir: "Bu, oyuncunun turda verdiği 3 karardan birini daha ilginç yapıyor mu? Yapmıyorsa, çıkar."*

*"Akdeniz bir ders kitabı değil, bir hikaye. Ve en iyi hikayeler, dinleyenin 'gerçekten mi?!' dediği anlarda doğar."*
