# Singleplayer Görev Zincirleri

> Ana referans: [`mare_nostrum_master_v3.md`](../../mare_nostrum_master_v3.md) — Bölüm 11  
> Detaylı çalışma belgesi: [`mare_nostrum_quest_chains.md`](../../mare_nostrum_quest_chains.md)

---

## Genel Mimari

Singleplayer'da oyun başlarken oyuncu bir **köken hikayesi** seçer. Bu seçim oyun mekaniğini değiştirmez — herkes aynı Feluka + 200 altınla başlar. Ama **LLM'in anlatı çerçevesini** belirler.

### Görev Zinciri Kuralları

1. **Zorunlu değil** — Tamamen yoksayılabilir. İpuçlar kahvehanede ⚓ sembolüyle gelir.
2. **Her zincir ~5 aşama, ~25-30 tur** — Oyuncu hızlandırıp 15 turda bitirebilir veya 40 turda.
3. **Her aşamada en az 2 yol** — Demir, Mürekkep, Simsar, Zehir ile farklı çözümler.
4. **NPC'ler görev zincirine dahil** — Her zincirde en az 2 NPC kritik rol oynar.
5. **Her zincir ün ile biter** — Özel ün veya mevcut ünü güçlendirir.
6. **Sadece singleplayer'da aktif** — Multiplayer'da drama oyunculardan gelir.

### Görev İpucu Formatı

```
┌─ VENEDİK KAHVEHANESİ ─────────────────────────────────┐
│                                                         │
│  "İstanbul'da ipek fiyatı yükseliyor."                  │
│                                                         │
│  ⚓ "Yaşlı bir gemici seni arıyor. 'Babanı tanırdım'    │
│     diyor. Tersanede bekliyor."                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**⚓ sembolü** = kişisel görev ipucu. 3 turda ilgilenilmezse kaybolur — ama görev ölmez, birkaç tur sonra geri gelir.

---

## Köken Seçimi

```
Nereden geliyorsun?
  ○ Venedik — tüccar ailesinin küçük oğlu
  ○ Cezayir — esir alınıp kaçmış bir denizci
  ○ İskenderiye — çökmüş bir tüccar hanedanının torunu
  ○ Ragusa — kimsesiz bir öksüz, limanlarda büyümüş
  ○ Rastgele — Akdeniz karar versin

Seni denize iten ne?
  ○ Kayıp bir hazine söylentisi      → Köken 1: Kayıp Hazine
  ○ Babanın batırdığı şerefi kurtarmak → Köken 2: Babanın Şerefi
  ○ Bir düşmandan intikam             → Köken 3: İntikam
  ○ Saf merak — dünyanın ucunu görmek → Köken 4: Merak
  ○ Rastgele — kader karar versin
```

---

## Köken 1: Kayıp Hazine — *"Denizin Altındaki Miras"*

**Tarihsel ilham:** Uluburun batığı (MÖ 1300, 10 ton bakır + dünyanın en eski kitabı), Antikythera batığı, yüzlerce Venedik/Osmanlı ticaret gemisi batığı.

### 5 Aşama Özeti

| Aşama | Tur | Lokasyon | Hedef |
|-------|-----|----------|-------|
| Fısıltı | 3–6 | Ev limanı | Sarhoş gemiciden harita parçası 1 al |
| Antikacı | 7–12 | İstanbul Kapalıçarşı | Antikacı Yakup'tan harita parçası 2 al |
| Korsan | 13–18 | Cezayir | Korsan Reis Hamid'den harita parçası 3 al |
| Batık | 19–24 | Girit/Gavdos | Özel rota ile batığa ulaş |
| Hazine | 25–30 | Her yer | Hazineyle ne yapacaksına karar ver |

### Aşama 3: Korsan Reis Hamid — Çoklu Çözüm

| Yol | Gereksinim | Sonuç |
|-----|-----------|-------|
| **Demir** | Kadırga + Meltem | Savaşı kazan, haritayı ganimet olarak al |
| **Mürekkep** | Fatma aracılığı + 100 altın | 3 birim Savaş malı karşılığı harita |
| **Simsar** | Tunus'tan ilaç getir | Hamid'in annesine iyilik → kalıcı borç |
| **Zehir** | Malta'ya Hamid'in rotasını sat | Hamid zayıflar; ama Cezayir'de Kem Göz |

### Aşama 5: Final İkilemi

| Seçenek | Kazanım | Ün Etkisi |
|---------|---------|-----------|
| Sat ve zenginleş | Büyük altın | Altın Parmak katkısı |
| Müzeye bağışla | İtibar + kalıcı ilişki | Açık El ünü |
| Gizle ve parça sat | Maksimum altın (10+ tur) | Hayalet Pala ünü |
| Siyasi koz olarak kullan | Büyük diplomatik borç | İpek Dil ünü |

```
☽ BİLİYOR MUYDUN?
Uluburun batığı (Türkiye kıyısı, MÖ ~1300) keşfedildiğinde içinden
10 ton bakır, 1 ton kalay, Mısır altınları, fildişi ve dünyanın
en eski kitabı (balmumu tablet) çıktı.
```

---

## Köken 2: Babanın Şerefi — *"Mürekkeple Yazılmış Yalan"*

**Tarihsel ilham:** Bardi ve Peruzzi bankacılık krizi (1343-1346), Venedik ticaret entrikaları.

### 5 Aşama Özeti

| Aşama | Tur | Lokasyon | Hedef |
|-------|-----|----------|-------|
| Babanın Hayaleti | 3–6 | Ev limanı | Tersane ustası Nuri Usta'dan ipucu al |
| Ortağın İzi | 7–12 | Çeşitli | Babanın eski ortağı hakkında bilgi topla |
| Kanıtlar | 13–18 | Çeşitli | Komployu kanıtla veya çökert |
| Yüzleşme | 19–24 | Ortağın limanı | Ortakla yüzleş |
| Karar | 25–30 | Her yer | Adalet mı intikam mı af mı? |

### Özel Dinamik

Babanın eski ortağı mevcut NPC'lerden biri:
- Venedik başlangıç → **Don Enrique** (Katalan Şahin)
- İskenderiye başlangıç → **Fatma Hatun**
- Cezayir başlangıç → **Kaptan Yorgos**
- Ragusa başlangıç → **Simsar Raşid**

Bu, oyunun başından beri tanıdığın NPC'yi babanın düşmanı yapar — ilişkiyi kişisel kılar.

```
☽ BİLİYOR MUYDUN?
Ortaçağ Venedik'te ticaret davasları "Quarantia" (Kırk Kişilik Kurul)
tarafından yargılanırdı. Yargıçların çoğu zengin tüccar ailesindendi.
"Adalet" ile "güç" arasındaki çizgi çok inceydi.
```

---

## Köken 3: İntikam — *"Çöl Rüzgârı"*

**Tarihsel ilham:** Akdeniz'de kan davası geleneği, corsaro ve deniz korsanlarının kişisel intikam hikayeleri.

### Temel Gerilim

Düşman NPC oyunun başında belirlenir. Oyuncu onu **bulmak, zayıflatmak ve yüzleşmek** zorundadır.

### Yüzleşme Seçeneği: Affetmek

Zincirin sonunda oyuncu düşmanı **affetme** seçeneğiyle karşılaşır. Bu seçenek:
- Büyük Mürekkep deneyimi verir
- İpek Dil ünü kazandırır
- LLM dramatik sahne yazar

Affetmek ile intikam arasındaki ikilem — ve her seçeneğin mekanik sonuçları — zincirin duygusal merkezini oluşturur.

---

## Köken 4: Saf Merak — *"Dünyanın Tuhaf Sırları"*

**Felsefe:** 7 sır keşif zinciri. Her aşama tarihsel bir gizem. Mekanik hedef yok — sadece **öğrenmek**.

**Tarihsel ilham:** Dünya haritalarının eksikliği, "Terra Incognita" konsepti, Marco Polo'nun anlatıları.

### 7 Sır Listesi (örnek)

| Sır | Lokasyon | Trivia |
|-----|----------|--------|
| Rum Ateşinin Formülü | Girit / İstanbul | Formül kayıp — kimse yeniden üretemedi |
| Antikythera Mekanizması | Girit açıkları | Dünyanın ilk analog bilgisayarı |
| Sahra Altının Yolu | Trablus / Cezayir | Mansa Musa'nın 12.000 devesi |
| Beyrut Alfabesi | Beyrut | Alfabe buradan doğdu |
| Kartaca'nın Tuzlu Toprağı | Tunus | "Tuz ektiler" efsanesi |
| Portekiz'in Gizli Haritaları | Marsilya / Barselona | Hint yolu keşfinin öncesi |
| İstanbul'un Yerin Altı | İstanbul | Yerebatan Sarnıcı ve altındakiler |

**Ün:** Zincir tamamlandığında özel **"Dünya Kaptanı"** sıfatı — standart ünlerin dışında.

---

## NPC Kişilik Profilleri

### Kaptan Yorgos
- **Profil:** Meltem %55, Simsar %20 — Denizci, hafif gölgeli
- **Rol:** Savaş ve deniz konularında yardımcı
- **Zayıflık:** Ticaret kararlarında hata yapar — oyuncu bundan yararlanabilir

### Fatma Hatun
- **Profil:** Terazi %60, Mürekkep %25 — Saf tüccar
- **Rol:** Ticaret ortaklığı ve aracılık
- **Zayıflık:** Korsana karşı savunmasız, konvoy korumaya ihtiyaç duyar

---

## Bağlantılı Sayfalar

- [LLM Entegrasyonu](llm-entegrasyon.md) — NPC diyalog ve görev prompt mimarisi
- [Oyun Genel Bakış](oyun-genel-bakis.md) — Singleplayer vs Multiplayer farkları
- [Görünmez Deneyim Sistemi](deneyim-sistemi.md) — Görevlerin deneyim katkısı
- [Ün Sistemi](un-sistemi.md) — Görev finallerinde kazanılan ünler
