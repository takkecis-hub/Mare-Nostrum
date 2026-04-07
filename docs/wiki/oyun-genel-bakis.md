# Oyun Genel Bakış

> Ana referans: [`mare_nostrum_master_v3.md`](../../mare_nostrum_master_v3.md) — Bölüm 0

---

## Tek Cümlelik Özet

**Mare Nostrum**, 11.–18. yüzyıl Akdeniz'inde bir gemiye kaptan olduğunuz, ticaret, diplomasi, dedikodu ve savaşla **Efsane** olmaya çalıştığınız tur tabanlı bir strateji oyunudur.

---

## Tasarım Manifestosu

Oyunun altı değişmez tasarım kuralı:

| # | Kural |
|---|-------|
| 1 | Oyuncunun turda vereceği karar sayısı: **en fazla üç** |
| 2 | Her karar bir ikilem olmalı — **doğru cevap olmamalı** |
| 3 | **Sürpriz** anı olmayan tur başarısız turdur |
| 4 | Spreadsheet açan oyuncu kaybeder — **içgüdü kazanır** |
| 5 | Singleplayer ve multiplayer **aynı oyun** — iki ayrı mod değil |
| 6 | En tehlikeli silah kılıç değil, **fısıltıdır** |

---

## Temel Parametreler

| Parametre | Değer |
|-----------|-------|
| **Dönem** | 11.–18. yüzyıl, Akdeniz havzası |
| **Oyuncu sayısı** | 1 (Singleplayer + LLM) veya 2–8 (Multiplayer) |
| **Tur süresi** | 7–12 dakika |
| **Oturum uzunluğu** | 20–40 tur (yaklaşık 2–5 saat) |
| **Dil** | Türkçe (tasarım belgeleri) |
| **Zafer koşulu** | [**Efsane**](terimler-sozluk.md) olmak — Akdeniz'in en çok anlatılan ismi |

---

## Oyun Stilleri

Mare Nostrum dört farklı oyun stilini eşit ölçüde destekler:

| Stil | Birincil Deneyim Havuzu | Nasıl Kazanır? |
|------|------------------------|----------------|
| **Tüccar** | [Terazi](deneyim-sistemi.md) | Menşe mal arbitrajı, piyasa bilgisi asimetrisi |
| **Korsan** | [Meltem](deneyim-sistemi.md) | Denizde yağma, fiziksel çatışma |
| **Diplomat** | [Mürekkep](deneyim-sistemi.md) | Söylenti yönetimi, ittifaklar, şehir ilişkileri |
| **Gölge** | [Simsar](deneyim-sistemi.md) | Kaçakçılık, istihbarat, ekonomik sabotaj |

> Hiçbir oyun stili dominant değildir. Her biri farklı şeyi feda eder.

---

## Oyun Dönemleri

Oyun 11.–18. yüzyılı kapsayan **8 tarihi döneme** ayrılır. Her dönem:
- Farklı güç dengesi ve aktif liman kontrolleri
- Kendine özgü tarihsel eventler
- Yeni ticaret yolları ve tehlikeler

Dönemler hakkında detaylı bilgi için → [Event Sistemi](event-sistemi.md)

---

## Singleplayer vs Multiplayer

| Özellik | Singleplayer | Multiplayer |
|---------|-------------|-------------|
| Rakipler | LLM NPC'ler | Gerçek oyuncular |
| Görev zincirleri | ✅ 4 köken hikayesi | ❌ (drama oyunculardan gelir) |
| Kişisel anlatı | ✅ "Kaptanın Günlüğü" | ❌ |
| Tarihsel trivia | Her 3-4 turda | Daha seyrek |
| NPC borç sistemi | ✅ Sayaç tabanlı | ❌ |
| Sosyal gerilim | LLM üretir | Oyunculardan doğar |

---

## Oyunun Kalbi

```
"Akdeniz'de bir geminin var. Her tur bir yere gidiyorsun,
bir şey yapıyorsun. Yolda kimi bulacağını bilmiyorsun.
Limanda kimi bulacağını bilmiyorsun. Seni tanıyanlar
hakkında hikayeler anlatıyor. Hikayeler seni kurtarır
ya da batırır. Kılıcınla bir gemiyi batırırsın;
fısıltınla bir imparatorluğu batırırsın."
```

---

## Bağlantılı Sayfalar

- [Çekirdek Döngü](cekirdek-dongu.md) — Tur nasıl geçiyor?
- [Terimler & Sözlük](terimler-sozluk.md) — Tüm terimler
- [Görünmez Deneyim Sistemi](deneyim-sistemi.md) — Oyuncu nasıl gelişiyor?
- [Ün Sistemi](un-sistemi.md) — Nasıl Efsane olunur?
- [Singleplayer Görev Zincirleri](gorev-zincirleri.md) — 4 köken hikayesi
