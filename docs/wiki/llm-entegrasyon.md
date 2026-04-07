# LLM Entegrasyonu

> Ana referans: [`mare_nostrum_master_v3.md`](../../mare_nostrum_master_v3.md) — Bölüm 11  
> Teknik detaylar: [`mare_nostrum_implementation_plan_v2.md`](../../mare_nostrum_implementation_plan_v2.md) — Bölüm 8

---

## Temel İlke

> **Oyun motoru ve söylenti motoru deterministiktir — LLM'e bağlı değildir. LLM sadece metin üretir, mekanik etkilemez.**

LLM bir **anlatıcıdır**, bir **karar vericisi değildir**. Tüm mekanik hesaplamalar (savaş, ekonomi, söylenti) sunucuda çalışır. LLM yalnızca bunların nasıl anlatılacağını belirler.

---

## Üç Temel Görev

### Görev 1: Kahvehane Fısıltıları

Her tur, oyuncunun bulunduğu limanda **3 kısa fısıltı** üretilir.

**Prompt şablonu:**

```
Sen bir Akdeniz kahvehanesinin atmosferini yaratıyorsun.
Liman: {port_name} ({port_region})
Mevsim: {season}
Aktif olaylar: {active_events}
Oyuncunun deneyim profili (kelime olarak): {experience_words}

Tam olarak 3 kısa fısıltı üret (her biri 1-2 cümle, Türkçe).
Fısıltı 1: {experience_dominant} alanıyla ilgili
Fısıltı 2: genel piyasa/güvenlik bilgisi
Fısıltı 3: NPC veya söylenti bilgisi

KURAL: Fısıltılar %70 doğru, %30 yanıltıcı olabilir.
KURAL: Kısa, atmosferik, kahvehane dili kullan.
```

**Hedef performans:** < 3 saniye, < $0.002 per call (Claude Haiku)

### Görev 2: Şehir Yöneticisi Diyalogu

Opsiyonel, max **3 mesaj alışverişi**. Mürekkep deneyimine göre yöneticinin sıcaklığı değişir.

**Düşük Mürekkep için:**
```
Sen İstanbul valisisin. Bu oyuncu tanınmamış biri.
Kısa ve resmi konuş. Tek standart görev teklif et. Sır paylaşma.
```

**Yüksek Mürekkep için:**
```
Sen İstanbul valisisin. Bu oyuncu çok deneyimli bir diplomat.
Ona sıcak davran, bir sır paylaş, 2-3 görev seçeneği sun.
Kısa ama içerikli konuş.
```

**Hedef:** < 4 saniye, < $0.004 per call (Claude Haiku)

### Görev 3: Event Anlatıcısı

Nadir, dramatik olaylar için 2-3 cümle açıklama + ☽ trivia. Mega event'lerde kullanılır.

---

## Singleplayer Ek Görevler

### NPC Karakterleri

3–4 derin NPC karakteri — her birinin gizli motivasyonu, tarihsel gönderme ve kendi trivia'ları vardır.

```
KAPTAN YORGOS PROMPT:
  "Sen Kaptan Yorgos'sun. Deneyim profilin Meltem ağırlıklı.
   Denizde güçlüsün ama ticarette zayıfsın.
   Ticaret kararlarında hata yapabilirsin.
   Oyuncunun ticaret bilgisine ihtiyacın var.
   Bu tura karar ver ve oyuncuyla mesajlaşmak istersen yaz."
```

NPC mesajlarında üç bağlam katmanı var:
1. **Karakter profili** (Meltem/Terazi oranı, motivasyon)
2. **Anlık durum** (nerede, ne elde etti, ne kaybetti)
3. **Görev bağlamı** (eğer görev zinciri aktifse)

### Kişisel Görev Zinciri

Aktif görev aşamasına göre LLM'e ek bağlam eklenir:

```
"Bu NPC şu anda görev zincirinin 2. aşamasında.
 Yakup karakteri: 3 mesajda harita parçası almaya zorla.
 Altın değil IYILIK ister. Gizemli ve hesaplı konuş."
```

### 10 Tur Özeti: Kaptanın Günlüğü

Her 10 turda bir LLM **dramatik özet** yazar:

```
"Türkçe, 150-200 kelime. Özet formatı:
 - Bu 10 turda olan 1-2 önemli olay
 - Mevcut NPC ilişkilerindeki değişim
 - Stratejik bir soru (Bu tur başarılı mıydı?)
 - 1 tarihsel perspektif (döneme uygun)"
```

---

## LLM Mimarisi

```
┌─────────────────────────────────────────────────┐
│                LLM KATMANI                       │
│                                                  │
│  Claude Haiku 3.5  ←──── Redis Cache ────┐      │
│  (standart çağrılar)                     │      │
│                                          │      │
│  Claude Sonnet 3.5 ←────────────────────┘      │
│  (görev NPC diyalog — kritik sahneler)          │
│                                                  │
│  Fallback: OpenAI GPT-4o-mini                   │
│  Statik fallback: whispers.json                 │
└─────────────────────────────────────────────────┘
```

### Redis Cache Stratejisi

Aynı prompt hash'i → aynı yanıt (cache'den). Cache TTL:

| Çağrı tipi | Cache süresi |
|-----------|-------------|
| Kahvehane fısıltısı | 1 saat (aynı liman, aynı profil) |
| Şehir yöneticisi | 30 dakika |
| Event anlatıcısı | 24 saat (aynı event) |
| NPC mesajı | Önbelleğe alınmaz (kişisel bağlam değişir) |

### Statik Fallback

LLM erişilemez durumdaysa `data/whispers.json` dosyasından statik fısıltılar gelir. Her liman × bölge için 10+ hazır fısıltı.

---

## Deneyim Profilini Prompt'a Çevirme

**Önemli:** LLM'e "Meltem skill'i 47" denmez. "Denizci ağırlıklı" denir. Doğal dil → doğal çıktı.

```
Deneyim → LLM Dili dönüşümü:

Meltem %57 → "Deneyimli denizci, fırtına tanıyan kaptan"
Terazi %47 → "Keskin ticaret zekası, piyasayı iyi okuyan tüccar"
Mürekkep %45 → "Diplomatik çevreler arasında tanınan biri"
Simsar %38 → "Gölge işlere yatkın, gizli bilgiye sahip"
```

---

## Tarihsel Trivia Sistemi (☽)

Her ☽ işaretli trivia:
- Mekanik etkisi yoktur
- Atmosfer ve merak uyandırma amaçlıdır
- LLM üretmez — `data/trivia.json` statik havuzundan gelir

**Örnekler:**
- ☽ İstanbul: "Fetihten önce Bizans, gemileri karadan taşıdı — Haliç'i geçmek için."
- ☽ Marsilya: "Karantina kelimesi buradan gelir. İtalyanca quaranta giorni: kırk gün."
- ☽ Barselona: "1492'de 3 olay: Amerika keşfi, Müslümanların kovulması, Yahudilerin kovulması."
- ☽ Trablus: "Mansa Musa hacca giderken 12.000 deve ve 80 kilo altın taşıdı."

Detaylı liste → [Event Sistemi](event-sistemi.md#liman-bazlı-trivia)

---

## Performans Hedefleri

| Çağrı | Model | Hedef Süre | Hedef Maliyet |
|-------|-------|-----------|---------------|
| Kahvehane fısıltısı | Claude Haiku | < 3 sn | < $0.002 |
| Şehir yöneticisi | Claude Haiku | < 4 sn | < $0.004 |
| NPC mesajı | Claude Haiku | < 3 sn | < $0.003 |
| Görev NPC diyalogu | Claude Sonnet | < 5 sn | < $0.01 |
| Kaptanın Günlüğü | Claude Sonnet | < 6 sn | < $0.02 |

**Oturum başına hedef:** < $0.50

---

## Bağlantılı Sayfalar

- [Görünmez Deneyim Sistemi](deneyim-sistemi.md) — Profil → Prompt dönüşümü
- [Singleplayer Görev Zincirleri](gorev-zincirleri.md) — NPC diyalog bağlamı
- [Dedikodu & Söylenti](dedikodu-soylenti.md) — Söylenti üretiminde LLM rolü
- [Event Sistemi](event-sistemi.md) — Event anlatıcısı ve trivia
- [Teknik Mimari](teknik-mimari.md) — Redis, fallback, maliyet modeli
