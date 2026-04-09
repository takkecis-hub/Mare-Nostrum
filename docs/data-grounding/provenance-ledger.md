# Provenance Ledger

Makine tarafından okunabilen ledger: `mockup/data/provenance.json`

## Provenance şeması

Her kayıt şu alanları taşır:

- `id`
- `subjectPath`
- `category`
- `summary`
- `sources[]`
- `notes`

Her `sources[]` girdisi şu alanları taşır:

- `type`
- `title`
- `locator`
- `periodCovered`
- `confidence`
- `disposition`

## Disposition anlamları

- `exact`: implementasyonda bire bir taşınan veri
- `inferred`: repo içi kaynaklardan türetilmiş ama dış kaynakla sabitlenmemiş bilgi
- `fictionalized`: gerçeklikten esinli ama açıkça atmosferik/anlatısal ifade
- `pending_verification`: dış kaynak doğrulaması bekleyen içerik

## Bu turdaki kapsam

- Tüm portlar
- Tüm rotalar
- Tüm mallar
- Tüm fallback fısıltıları
- Tüm trivia kayıtları

## Şu anki sınır

Ledger artık “hangi bilgi ne kadar güvenli” sorusunu cevaplıyor; fakat çoğu tarihsel kayıt için dış kaynak referansı henüz girilmedi. Bu yüzden `medium` ve `low` confidence kayıtları, yayın öncesi doğrulama kuyruğunda tutulmalıdır.
