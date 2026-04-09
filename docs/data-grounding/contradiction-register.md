# Contradiction Register

| Area | Design/doc claim | Implementation reality | Status |
|---|---|---|---|
| Route count | `mare_nostrum_master_v3.md` says 28 routes | `mockup/data/routes.json` has 29 routes | Open |
| Ragusa economy | Master/wiki describe Ragusa as transit/no production | `mockup/data/ports.json` gives Ragusa `ragusa_tuzu` production and `ligurya_mercan` demand | Open |
| Beirut goods | Master mentions broader/alternate Beirut goods in some places | `mockup/data/ports.json` uses `lubnan_sediri` produce + `osmanli_silahi` desire | Open |
| Whisper fallback | Docs expect 10+ static whispers per port | Old implementation had 3 strings; now structured bank provides 10+ source lines and runtime still returns 3 | Resolved in code |
| Trivia source | Docs referenced `mockup/data/trivia.json` | File was missing; now added as structured placeholder catalog | Resolved in code |
| Runtime validation | Server cast JSON directly with `as Port[]` etc. | Server now parses and validates data before startup | Resolved in code |
| Era scope | Docs speak across 11th–18th century as one layer | Current data still mixes multi-era claims in a single snapshot | Open |
| Starting ship | Some design docs say Feluka + 200 gold | `mockup/packages/server/src/index.ts` starts with Karaka + cargo | Open |

## Triage labels

- **Resolved in code**: integrity gap closed in this change
- **Open**: still requires source decision or design reconciliation

## Next decision owners

- Design authority: reconcile master doc vs implementation
- Data curation: replace `pending_verification` trivia/provenance with external citations
- Release/review: decide whether current implementation should move docs or docs should move code
