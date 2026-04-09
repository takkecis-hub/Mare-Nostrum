# Data Grounding

Bu klasör, repo içindeki tarihsel/doğruluk riski taşıyan veri ve belgeler için çalışma sözleşmesini tutar.

## Kaynak hiyerarşisi

1. `mare_nostrum_master_v3.md` — tasarım otoritesi
2. `mockup/data/*.json` + `mockup/packages/*` — mevcut implementasyon gerçeği
3. `docs/wiki/*.md` ve diğer `mare_nostrum_*.md` dosyaları — ikincil açıklama katmanı

## Bu repoda “hallucination” tanımı

- Kaynaksız tarihsel iddia
- Oyun kurgusunun gerçek coğrafya/ekonomi diye sunulması
- Doküman kaymasının gerçek gibi aktarılması
- İma edilen anlatı öğesinde provenance olmaması
- Kod, veri ve belge arasında açıklanmamış çelişki

## Sınıflandırma

- `factual_world_data`: koordinat, liman kimliği, tarihsel bağlam çekirdeği
- `derived_game_data`: rota, mal, risk, tur sayısı gibi oyunlaştırılmış türev veri
- `narrative_flavor`: fısıltı, trivia, atmosferik metin
- `documentation`: audit, provenance, backlog

## Kabul kriteri

- Yetim referans yok
- Provenance kaydı olmayan tarihsel ima yok
- Açıklanmamış doc/data/code çelişkisi yok
- Her yüksek riskli dosya audit matrisinde kayıtlı
- Her port, rota, mal, fısıltı ve trivia için provenance izi var

## Bu turda eklenen çıktılar

- `file-audit-matrix.md`
- `contradiction-register.md`
- `provenance-ledger.md`
- `remediation-backlog.md`
- `mockup/data/grounding-manifest.json`
- `mockup/data/provenance.json`
- `mockup/data/trivia.json`

## Not

Bu çalışma, “kesin tarih doğrulaması” değil “güvenli çalışma zemini” üretir. `provenance.json` içindeki `pending_verification` ve `fictionalized` kayıtları, dış kaynak doğrulaması tamamlanana kadar kesin tarih iddiası yapılmaması gerektiğini gösterir.
