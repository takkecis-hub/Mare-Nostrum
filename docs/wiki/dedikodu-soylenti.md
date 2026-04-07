# Dedikodu & Söylenti

> Ana referans: [`mare_nostrum_master_v3.md`](../../mare_nostrum_master_v3.md) — Bölüm 3  
> Detaylı çalışma belgesi: [`mare_nostrum_conflict_spectrum.md`](../../mare_nostrum_conflict_spectrum.md)

---

## Söylenti: Oyunun Kalp Atışı

> *"Akdeniz'de en tehlikeli silah kılıç değil, fısıltıdır."*

Söylentiler hem bilgi akışını hem de sosyal saldırıyı sağlar. Her önemli eylem otomatik bir söylenti üretir — oyuncu müdahalesi gerekmez. Ama oyuncu söylentileri aktif olarak **silah olarak** da kullanabilir.

---

## Söylenti Üretimi (Otomatik)

Aşağıdaki eylemler otomatik söylenti oluşturur:

- Denizde savaş
- Büyük ticaret (çok yüksek kâr)
- Kaçakçılık
- Commenda ihaneti
- Cömertlik (limanda yardım)
- Fidye ödeme/alma

Üretilen söylenti tek bir cümledir ve **kaynak limandan** yayılmaya başlar.

---

## Söylenti Yayılması

Her tur söylenti kaynak limandan **komşu limanlar**a yayılır.

### Çarpıtma Mekanizması

Söylenti her limana geldiğinde o limanın ilişki durumuna göre çarpıtılır:

| Eylem | Sevenin yorumu | Sevmeyenin yorumu |
|-------|----------------|-------------------|
| Büyük savaş kazandı | "Kahraman" | "Saldırgan" |
| Çok ticaret yaptı | "Zengin tüccar" | "Piyasa manipülatörü" |
| İhanet etti | "Stratejist" | "Hain" |
| Kaçakçılık yaptı | "Cesur" | "Suçlu" |
| Cömertlik gösterdi | "Aziz" | "Gösteriş" |

### Söylenti Ömrü

| Boyut | Ömür |
|-------|------|
| Küçük (sıradan ticaret, karşılaşma) | 3–4 tur |
| Orta (savaş, kaçakçılık) | 5–6 tur |
| Büyük (ihanet, büyük hazine, mega event) | 8–10 tur |
| Kalıcı | 3+ aynı tip söylenti birikmesi → **ün**'e dönüşür |

**Ömrü uzatan faktörler:** Yayılma genişliği artar; aktif olarak yayılan söylentiler.  
**Ömrü kısaltan faktörler:** Çok fazla çarpıtma; söylenti sahibi aktif çürütme.

---

## Söylenti Silahı: Rüzgâr Ek

Oyuncu kahvehanede kasıtlı söylenti başlatabilir. **Şablon bazlı:**

```
KİM HAKKINDA?
  ○ Kendim  ○ [oyuncu seç]  ○ Genel

NE SÖYLÜYORSUN?
  ○ "... çok zengin / güçlü"      (gözdağı)
  ○ "... zayıf / parasız"         (küçümseme)
  ○ "... korsan / kaçakçı"        (suçlama)
  ○ "... güvenilmez / ihanetçi"   (karalama)
  ○ "... cömert / kahraman"       (övgü)
  ○ "... şu güçle gizlice çalışıyor" (ifşa)
  ○ "[mal] fiyatı [liman]'da fırlıyor"  (piyasa)

MALİYET: 25 altın
```

**Piyasa söylentisi** özellikle güçlüdür — diğer oyuncuları yanlış rotaya yönlendirir. Detay → [Ekonomi](ekonomi.md#piyasa-söylenti-silahı)

**Tekrarlayan söylenti cezası:** 5 tur içinde 3+ söylenti yayarsan NPC'ler "Bu adam çok fısıldıyor" söylentisi üretir.

---

## Söylenti Savunması

Hakkında kötü söylenti duyan oyuncunun 4 seçeneği:

### 1. Ateşe Su (Çürütme)

- Mürekkep %70+: %70 başarı
- Mürekkep düşük: %30 başarı
- **Başarılı:** Söylenti o limanda ölür
- **Başarısız:** "İnkârı daha da şüpheli" — söylenti güçlenir

### 2. İzi Sürmek (Kaynak Bulma)

- Simsar %60+: %60 bulma şansı
- Simsar düşük: %20 bulma şansı
- **Başarılı:** Kaynağı öğrenir → karşı saldırı, ifşa veya şantaj
- **Başarısız:** Hiçbir şey bulamazsın

### 3. Yoksay

- Söylenti doğal ömrüne bırakılır
- Bazı söylentiler 5–8 tur sonra kendiliğinden unutulur
- Ama bazıları kalıcı ünlere dönüşür — risk var

### 4. Karşı Söylenti

- Kaynağı bilmesen bile tahmini saldırganı hedef alırsın
- **Başarılı:** Karşılıklı söylenti savaşı başlar
- **Yanlış hedef:** İki düşman kazanırsın

---

## Söylenti → Şehir İlişkisi

Söylentiler şehir ilişkisini doğrudan etkiler:

```
Tanıdık Yüz ← olumlu söylentiler
Yabancı     ← nötr durum
Kem Göz     ← olumsuz söylentiler birikmesi
```

### İttifak Bulaşması

Eskisi: Osmanlı dostu olunca Venedik'te otomatik ilişki kaybı.  
Şimdi: **SÖYLENTI BAZLI** — "Osmanlı dostu" söylentisi Venedik'e **yayılırsa** etkili olur. Yayılmazsa etkisi yoktur.

Aktif söylenti yönetimiyle (Ateşe Su, çift taraflı iyilik, karşı söylenti) önlenebilir.

---

## Söylenti ve Ün İlişkisi

Ün kazanmak için deneyim oranı **ve** söylenti ikisi birlikte gereklidir:

```
"Demir Pruva" ünü:
  Meltem %35+ VE 2+ savaş söylentisi

Söylenti olmadan çok savaşıyorsun ama kimse bilmiyorsa → ün yok
Herkes seni savaşçı sanıyor ama sadece 2 savaşa girdiysen → ün yok
İkisi birlikte olmalı.
```

Bu kural, **kendi hakkında söylenti yaymanın** stratejik değer kazanmasını sağlar.

Detaylı → [Ün Sistemi](un-sistemi.md)

---

## Söylentinin Sosyal Boyutu

Söylentilerin kaynağı gizli tutulabilir. Bu, aşağıdaki dinamiği yaratır:

- **Multiplayer:** "Kim yaydı bunu?" şüphesi ilişkileri karmaşıklaştırır
- **İz sürmek** başarısız olursa yanlış kişiyi suçlayabilirsin
- **Bilgi ticareti:** "Sen ne duydun?" + "Ben şunu duydum" → ama karşı taraf yalan söylüyor olabilir

---

## Bağlantılı Sayfalar

- [Çatışma Spektrumu](catisma-spektrumu.md) — Zehir saldırısının tam senaryosu
- [Görünmez Deneyim Sistemi](deneyim-sistemi.md) — Mürekkep ve Simsar'ın söylenti üzerindeki etkisi
- [Ün Sistemi](un-sistemi.md) — Söylenti → Ün dönüşümü
- [Ekonomi Sistemi](ekonomi.md) — Piyasa söylentisi silahı
- [Çekirdek Döngü](cekirdek-dongu.md) — Kahvehane aksiyonları
