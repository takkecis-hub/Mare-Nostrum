# Remediation Backlog

1. **Canonical era seçimi yap**
   - Tek snapshot mı kullanılacak, yoksa dönem varyantları mı desteklenecek karar ver.

2. **Master doc ile implementation’ı uzlaştır**
   - Özellikle Ragusa, Beirut, başlangıç gemisi, rota sayısı, ticaret eşleşmeleri.

3. **External provenance ekle**
   - `mockup/data/provenance.json` içindeki `pending_verification` ve `inferred` kayıtları gerçek kaynaklarla değiştir.

4. **Trivia katmanını sertleştir**
   - `mockup/data/trivia.json` içindeki placeholder kayıtları tarihsel kaynaklı metinlerle güncelle.

5. **Whisper policy’yi netleştir**
   - Hangi cümlelerin salt atmosfer, hangilerinin kaynaklı ekonomik/siyasi veri taşıdığı belgeye bağlanmalı.

6. **Legacy port trivia alanını taşı**
   - `mockup/data/ports.json` içindeki `trivia` dizileri ile yeni `trivia.json` arasındaki görev ayrımını kesinleştir.

7. **Doc drift review yap**
   - `docs/wiki/harita-limanlar.md`, `docs/wiki/ekonomi.md`, `mare_nostrum_master_v3.md` için reconcile pass aç.

8. **Integrity gate’i CI’ye bağla**
   - Yeni test dosyasını repo CI’sında zorunlu kapı haline getir.
