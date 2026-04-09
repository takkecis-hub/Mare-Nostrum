# 🌊 Mare Nostrum — Wiki Ana Sayfası

> *"Akdeniz'de en tehlikeli silah kılıç değil, fısıltıdır. Kılıç bir gemiyi batırır. Fısıltı bir imparatorluğu batırır."*

**Mare Nostrum**, 11.–18. yüzyıl Akdeniz'inde geçen, tur tabanlı bir strateji/diplomasi oyunudur. 1–8 oyuncu; ticaret, diplomatik manevra, piyasa sabotajı ve savaş taktikleriyle **Efsane** olmak için rekabet eder.

Bu wiki, tüm tasarım belgelerinin sentezinden oluşan kapsamlı bir referans kaynağıdır.

> **📦 Uygulama:** Oyunun çalışan TypeScript uygulaması [`mockup/`](../../mockup/) dizinindedir. 383 test, 15 liman, 29 rota, 17 menşe mal ile dikey kesit. Wiki sayfalarında `> Uygulama durumu:` notları, tasarım ile mevcut kodun farklılıklarını belirtir.

---

## 📖 İçindekiler

| # | Sayfa | Özet |
|---|-------|------|
| 1 | [Oyun Genel Bakış](oyun-genel-bakis.md) | Tasarım manifestosu, dönem, oynanabilirlik özeti |
| 2 | [Terimler & Sözlük](terimler-sozluk.md) | Tüm oyun terimlerinin Türkçe etimolojisi ve açıklamaları |
| 3 | [Çekirdek Döngü](cekirdek-dongu.md) | Fondaco ve Rüzgâr fazlarının tam akışı |
| 4 | [Ekonomi Sistemi](ekonomi.md) | Menşe mallar, açlık/doyma mekaniği, Commenda, kaçak mal |
| 5 | [Çatışma Spektrumu](catisma-spektrumu.md) | Demir / Zehir / Kuşatma — üç saldırı boyutu |
| 6 | [Görünmez Deneyim Sistemi](deneyim-sistemi.md) | Meltem / Terazi / Mürekkep / Simsar havuzları |
| 7 | [Savaş Taktiği](savas-taktig.md) | Pruva / Ateş / Manevra, gemi sinerjileri, ganimet |
| 8 | [Harita & Limanlar](harita-limanlar.md) | 15 liman, 29 rota, 3 darboğaz, bölgesel dinamikler |
| 9 | [Dedikodu & Söylenti](dedikodu-soylenti.md) | Söylenti silahı, savunma stratejileri, ömür kuralları |
| 10 | [Ün Sistemi](un-sistemi.md) | 8 ün, kazanma koşulları, kaybetme riski |
| 11 | [Gemi Sistemi](gemi-sistemi.md) | Feluka / Karaka / Kadırga karşılaştırması |
| 12 | [Singleplayer Görev Zincirleri](gorev-zincirleri.md) | 4 köken hikayesi (Kayıp Hazine, Şeref, İntikam, Merak) |
| 13 | [LLM Entegrasyonu](llm-entegrasyon.md) | Kahvehane, NPC, anlatıcı — AI mimari |
| 14 | [Teknik Mimari](teknik-mimari.md) | Stack, monorepo yapısı, DB şeması, 26 haftalık faz planı |
| 15 | [Event Sistemi](event-sistemi.md) | Tarihsel eventler, dönem geçişleri, trivia sistemi |

---

## 🗂️ Kaynak Belgeler

Bu wiki aşağıdaki birincil belgelerden türetilmiştir:

| Dosya | Durum | İçerik |
|-------|-------|--------|
| [`mare_nostrum_master_v3.md`](../../mare_nostrum_master_v3.md) | ✅ Aktif — Tek gerçek referans | Konsolide tasarım dokümanı |
| [`mare_nostrum_implementation_plan_v2.md`](../../mare_nostrum_implementation_plan_v2.md) | ✅ Aktif | Teknik yol haritası (v2, tüm düzeltmeler entegre) |
| [`mare_nostrum_mechanics_review.md`](../../mare_nostrum_mechanics_review.md) | ✅ Tamamlandı | Tüm sistemlerin denge incelemesi |
| [`mare_nostrum_naming_review.md`](../../mare_nostrum_naming_review.md) | ✅ Tamamlandı | Yaratıcı isimlendirme & etimoloji — tüm isim kuralları kod tabanında uygulandı |
| [`mare_nostrum_experience_system.md`](../../mare_nostrum_experience_system.md) | ✅ Tamamlandı | Görünmez deneyim sistemi — 4 havuz, oran bazlı mekanik, ün eşikleri, çürüme takibi (57 test) |
| [`mare_nostrum_map_design.md`](../../mare_nostrum_map_design.md) | ✅ Tamamlandı | Harita tasarımı — 15 liman, 29 rota, 3 darboğaz, Mercator SVG harita |
| [`mare_nostrum_economy.md`](../../mare_nostrum_economy.md) | ✅ Tamamlandı | Ekonomi derinleştirme — menşe/doyma/mevsim/toptan indirim/kaçak mal/kontrat/görünürlük sistemi (70 test) |
| [`mare_nostrum_conflict_spectrum.md`](../../mare_nostrum_conflict_spectrum.md) | ✅ Tamamlandı | Çatışma spektrumu — Demir ✅, Zehir ✅, Kuşatma ✅ (38 test), söylenti savunması, kaçış mekaniği |
| [`mare_nostrum_combat_narrative.md`](../../mare_nostrum_combat_narrative.md) | ✅ Tamamlandı | Savaş taktiği ✅ (48 test), kaçış mekaniği ✅, taktik-özel ganimet, görev ipuçları |
| [`mare_nostrum_quest_chains.md`](../../mare_nostrum_quest_chains.md) | ✅ Tamamlandı | 4 köken görevi (5 aşama), durum makinesi, tetikleme sistemi, ipuçları (30 test) |

> **Not:** Master doküman (`mare_nostrum_master_v3.md`) her zaman nihai referanstır. Modüler belgeler ek detay ve çalışma notları içerir.

---

## ⚡ Hızlı Başlangıç

Oyuna yabancıysanız şu sırayla okuyun:
1. **[Oyun Genel Bakış](oyun-genel-bakis.md)** — Ne tür bir oyun bu?
2. **[Terimler & Sözlük](terimler-sozluk.md)** — Hangi terimler ne anlama geliyor?
3. **[Çekirdek Döngü](cekirdek-dongu.md)** — Bir tur nasıl geçiyor?
4. **[Ekonomi](ekonomi.md)** + **[Çatışma Spektrumu](catisma-spektrumu.md)** — Nasıl kazanılır?

Teknik geliştirme için:
- **[Teknik Mimari](teknik-mimari.md)** — Stack, monorepo yapısı, DB şeması
- **[LLM Entegrasyonu](llm-entegrasyon.md)** — AI katmanı tasarımı
- **[mockup/README.md](../../mockup/README.md)** — Çalışan uygulamayı başlatma
- **[Data Grounding](../data-grounding/README.md)** — veri doğrulama, provenance ve çelişki takibi
