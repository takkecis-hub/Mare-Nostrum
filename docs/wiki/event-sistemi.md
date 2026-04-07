# Event Sistemi

> Ana referans: [`mare_nostrum_master_v3.md`](../../mare_nostrum_master_v3.md) — Bölüm 10, 12  
> Ham event listesi: [`akdeniz_events.md`](../../akdeniz_events.md) (92 event, tarihsel referans)  
> Savaş anlatısı ve trivia: [`mare_nostrum_combat_narrative.md`](../../mare_nostrum_combat_narrative.md)

---

## Event Yapısı

Her event dört bileşenden oluşur:

```
DUYURU    LLM, 1-2 dramatik cümle
ETKİ      Mekanik değişim (fiyat, liman, karşılaşma)
İKİLEM    Oyuncunun verdiği zor karar (A/B/C seçeneği)
☽ TRİVİA  Tarihsel detay — mekanik etkisi yok, atmosfer amaçlı
```

---

## Dört Tetikleyici Tipi

| Tip | Örnek | Ne Zaman |
|-----|-------|----------|
| **Zamansal** | "1453'te İstanbul fethedildi" | Belirli tur / dönem eşiği |
| **Koşullu** | "Bir liman çok az ticaret aldı → harabeye dönüyor" | Oyun durumuna bağlı |
| **Rastgele** | "Bu turda fırtına" | Her tur zar atışı |
| **Zincir** | "Veba başladı → 3 tur sonra liman kapanıyor" | Önceki event'in etkisi |

---

## Sıklık Dengesi

| Boyut | Sıklık |
|-------|--------|
| **Mega** | Yüzyılda 2-3 olay |
| **Büyük** | Her 10-15 turda |
| **Orta** | Her 5-10 turda |
| **Küçük** | Her 3-5 turda |

---

## 8 Tarihi Dönem

| Dönem | Yüzyıl | Güç Dengesi |
|-------|--------|-------------|
| 1 | 11. yy | Bizans güçlü, ilk Haçlı Seferleri |
| 2 | 12. yy | Haçlı devletleri, Selahaddin yükselişi |
| 3 | 13. yy | Venedik/Cenova rekabeti, Moğol baskısı |
| 4 | 14. yy | Kara Veba, Osmanlı yükselişi |
| 5 | 15. yy | İstanbul fethi (1453), Portekiz keşifleri |
| 6 | 16. yy | İnebahtı savaşı (1571), Osmanlı zirvesi |
| 7 | 17. yy | Osmanlı duraklama, Venedik çöküşü |
| 8 | 18. yy | Yeni dünya etkisi, dengelerin değişimi |

**Liman el değiştirmesi:** Yeni sahip geldikten sonra 2-3 tur kaos. Söylentiler sıfırlanır, fiyatlar dalgalanır.

---

## Önemli Mega Eventler

### Kara Veba (14. yy)

```
Etki:
  → Cenova ve Venedik 3 tur kapanır
  → Yemek fiyatı 2× artar
  → Tüm Akdeniz'de karşılaşma oranı -30%

İkilem:
  A) Göçmenlere yardım et → Söylenti: "Veba Kahramanı", Kem Göz riski
  B) Limanları kapat → Güvenli ama insani maliyet
  C) Fırsatçılık yap → Yemek stoku yap ve fiyat artırmayı bekle
```

```
☽ BİLİYOR MUYDUN?
Kara Veba'nın biyolojik silah olarak ilk kullanımı:
Tatarlar Caffa'yı (Kırım) kuşatırken vebadan ölen
askerlerin cesetlerini mancınıkla şehrin içine fırlattı.
Kaçan Cenevizli tüccarlar vebayı Akdeniz'e taşıdı.
```

### İstanbul'un Fethi (1453)

```
Etki:
  → İstanbul artık Osmanlı — Latin tüccarlara kısıtlama
  → Ege Kapısı darboğazı daha sıkı kontrol
  → Bizans dönemi limanları el değiştiriyor

☽ BİLİYOR MUYDUN?
Top ustası Macar Urban, topunu önce Bizans'a teklif etti.
Bizans karşılayamadı. Osmanlı'ya gitti. İroni: Konstantinopolis'in
surları kendi topçusunun yapamadığı bir topla yıkıldı.
```

### İnebahtı (1571)

```
Etki:
  → Osmanlı donanmasında geçici zayıflama
  → Batı Akdeniz'de Hristiyan güçlere kısa dönem avantaj

☽ BİLİYOR MUYDUN?
Don Kişot'un yazarı Cervantes İnebahtı'da sol kolunu kaybetti.
"Sol kolumu kaybettim ama sağ kolumu insanlık hizmetine kazandırdım."
Osmanlı Büyük Veziri Sokullu ise şunu söyledi:
"Sizin zaferiniz bize sakal tıraşı gibi oldu — kısa sürede yeniden uzar."
```

### Portekiz'in Hint Yolu (15. yy sonu)

```
Etki:
  → İskenderiye'de baharat fiyatı her 5 turda 1 kademe düşer
  → Doğu ticaret yollarının değeri azalıyor
  → Batı Akdeniz'de yeni fırsatlar (Atlantik rotaları)

Bu, ekonomik denge için hayati bir event. Erken fark eden
oyuncu İskenderiye'den çıkıp Barselona/Marsilya rotasına geçer.
```

---

## ☽ Tarihsel Trivia Sistemi

Her ☽ işaretli trivia:
- Mekanik etkisi **yoktur**
- Atmosfer ve merak uyandırma amaçlıdır
- Statik `data/trivia.json` dosyasından gelir (LLM üretmez)
- Her 3-4 turda bir kahvehanede çıkar (singleplayer'da)

### Liman Bazlı Trivia

| Liman | Örnek Trivia |
|-------|-------------|
| **Venedik** | Arsenal her günde 1 gemi üretiyordu; Murano camcıları adaya hapsedildi — formül sızdırmamak için |
| **İstanbul** | Fatih, gemileri karadan yürüttü — Haliç'i geçmek için yağlı tomruklar kullandı |
| **Cezayir** | Barbaros'un asıl adı Hızır, lakabı "Hayreddin" idi. Padişahın "din hayrına" dediği adam. |
| **İskenderiye** | Ortaçağda karabiber altın değerindeydi — gram başına gram altın ödendi |
| **Ragusa** | Ragusa hem Osmanlı hem Venedik'e haraç ödüyordu. Çifte haraç, çifte özgürlük. |
| **Malta** | Hospitalier Şövalyeleri aslen Kudüs'teki hasta bakım evinden gelir — "Hospitaller" buradan |
| **Marsilya** | "Karantina" kelimesi İtalyanca. Quaranta giorni = kırk gün. Hastalıklı gemiler bekliyordu. |
| **Barselona** | 1492: Amerika keşfi + Müslümanların kovulması + Yahudilerin kovulması. Üç büyük olay, bir yıl. |
| **Girit** | Rum Ateşinin formülü kayıptır. Sadece Bizans'ın ürettiğini biliyoruz. Sönmüyordu — su üzerinde yanıyordu. |
| **Beyrut** | Alfabe bu topraklarda doğdu. Fenike alfabesi buradan dağıldı. |
| **Trablus** | Mansa Musa (Mali İmparatoru) 1324'te Mekke'ye hacca giderken 12.000 deve ve 80 kilo altın getirdi. |
| **Kıbrıs** | Ortaçağda şeker kamışı Kıbrıs'ta üretilirdi. Şeker o dönem ilaç — gram altına yakın fiyat. |
| **Tunus** | "Kartaca'yı tuzladılar" efsanesi muhtemelen yalan. Ama insanlar inanmak istedi — çünkü iyi hikayedir. |

### Event Trivia Örnekleri

| Event | Trivia |
|-------|--------|
| Kara Veba | İlk biyolojik savaş silahının kullanımı (Caffa kuşatması) |
| Haçlı Seferleri | Seferlerin ilk pogromları (Rhineland katliamları, 1096) |
| Yeni Dünya Gümüşü | Potosí madeninde tahminen 8 milyon işçi hayatını kaybetti |
| Yahudi Sürgünü | Bayezid: "Ferdinand akıllı değil — bana iyi vatandaşlarını, kendisine fakirlerini gönderiyor" |
| Kahve | Papa VIII. Clement kahveyi "şeytan içkisi" demek yerine "vaftiz etti" |

---

## Event Mekanik Etkileri

| Etki Tipi | Örnek |
|-----------|-------|
| `port_close` | Cenova 3 tur kapalı |
| `price_shock` | Yemek fiyatı 2× |
| `encounter_change` | Karşılaşma oranı -30% |
| `power_shift` | İstanbul kontrolü Bizans → Osmanlı |
| `route_open` | Yeni rota açılır (Portekiz keşfi) |
| `route_close` | Darboğaz blokajı |

---

## Bağlantılı Sayfalar

- [Harita & Limanlar](harita-limanlar.md) — Liman el değiştirmesi
- [LLM Entegrasyonu](llm-entegrasyon.md) — Event anlatıcısı promptu
- [Ekonomi Sistemi](ekonomi.md) — Fiyat şoku etkileri
