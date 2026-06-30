# PROGRESSO — Geração de Seeds SQL (TOEFL Prep)
> Protocolo Autônomo Ativado. Primeira ação de qualquer sessão: LER ESTE ARQUIVO.

## OBJETIVO
Levar todos os 23 módulos TOEFL a exatamente **300 exercícios cada**.

## CONTEXTO DO PROJETO
- **Repositório:** `c:\Users\Mazepa 04\TOEFL-Prep`
- **Branch:** master → push para GitHub → Vercel auto-deploy
- **Tabela:** `exercises` no Supabase (executar manualmente no SQL Editor)
- **Conflito:** `ON CONFLICT (content_id, block_number, exercise_number) DO NOTHING`
- **Tokens renovam:** 20:30 / 01:30 / 06:30 / 11:30 / 16:30 BRT (a cada 5h)
- **Webhook marco crítico:** `curl -X POST -H "Content-Type: application/json" -d "{\"message\":\"A tarefa no aplicativo foi concluída. Aguardando sua revisão no terminal!\"}" https://hook.us2.make.com/nn14t7wa7q0pxjx2jvr1p6giw7dcpnnb`

## PADRÃO SQL (obrigatório em todos os arquivos)
```sql
DO $$
DECLARE cid TEXT;
BEGIN
  SELECT id INTO cid FROM contents WHERE id = 'MODULE-ID';
  IF cid IS NULL THEN RAISE EXCEPTION 'Módulo X não encontrado'; END IF;
  INSERT INTO exercises (content_id, block_number, exercise_number, type, question, answer, options, explanation, difficulty) VALUES
  (cid, BLOCK, EX_NUM, 'gap_fill', 'question', 'answer', NULL, 'explanation', 'medium'),
  ...
  ON CONFLICT (content_id, block_number, exercise_number) DO NOTHING;
END $$;
```

## NUMERAÇÃO DE BLOCOS
- ext5 = blocos 51–68 (conforme necessário)
- ext6 = blocos 71–85 (conforme necessário)

## MÓDULOS COMPLETOS ✅ (não criar mais arquivos)
| Módulo | Content ID | Total |
|--------|-----------|-------|
| 02 | present-simple | 300 ✅ |
| 03 | past-simple | 300 ✅ |
| 13 | reported-speech | 300 ✅ |
| 14 | passive-voice | 300 ✅ |
| 20 | academic-connectors | 300 ✅ |

## CHECKLIST DE EXECUÇÃO (20 arquivos)

### MARCO 1 — ext5 para módulos 06 e 08 ✅
- [x] `seed_06_be_going_to_ext5.sql` — content_id: `be-going-to` — ex 166–228 (63 ex) — blocos 51–61 ✅
- [x] `seed_08_past_perfect_ext5.sql` — content_id: `past-perfect` — ex 169–226 (58 ex) — blocos 51–61 ✅

### MARCO 2 — ext6 para módulos 06, 08, 09, 10 ✅
- [x] `seed_06_be_going_to_ext6.sql` — content_id: `be-going-to` — ex 229–300 (72 ex) — blocos 71–83 ✅
- [x] `seed_08_past_perfect_ext6.sql` — content_id: `past-perfect` — ex 227–300 (74 ex) — blocos 71–83 ✅
- [x] `seed_09_conditional_1_ext6.sql` — content_id: `conditional-1` — ex 229–300 (72 ex) — blocos 71–79 ✅
- [x] `seed_10_modais_basicos_ext6.sql` — content_id: `basic-modals` — ex 225–300 (76 ex) — blocos 71–80 ✅

### MARCO 3 — ext6 para módulos 04, 05, 07, 11, 12 ✅
- [x] `seed_04_present_continuous_ext6.sql` — content_id: `present-continuous` — ex 206–300 (95 ex) — blocos 71–82 ✅
- [x] `seed_05_future_simple_ext6.sql` — content_id: `future-simple` — ex 204–300 (97 ex) — blocos 71–82 ✅
- [x] `seed_07_present_perfect_ext6.sql` — content_id: `present-perfect` — ex 214–300 (87 ex) — blocos 71–80 ✅
- [x] `seed_11_relative_clauses_ext6.sql` — content_id: `relative-clauses` — ex 205–300 (96 ex) — blocos 71–82 ✅
- [x] `seed_12_conditional_2_3_ext6.sql` — content_id: `conditional-2-3` — ex 202–300 (99 ex) — blocos 71–82 ✅

### MARCO 4 — ext6 para módulos 15, 16, 17, 18, 19
- [x] `seed_15_gerund_infinitive_ext6.sql` — content_id: `gerund-infinitive` — ex 217–300 (84 ex) — blocos 71–80 ✅
- [x] `seed_16_articles_advanced_ext6.sql` — content_id: `articles-advanced` — ex 199–300 (102 ex) — blocos 71–83 ✅
- [x] `seed_17_non_defining_clauses_ext6.sql` — content_id: `non-defining-clauses` — ex 203–300 (98 ex) — blocos 71–80 ✅
- [x] `seed_18_nominalization_ext6.sql` — content_id: `nominalization` — ex 202–300 (99 ex) — blocos 71–82 ✅
- [x] `seed_19_hedging_language_ext6.sql` — content_id: `hedging-language` — ex 208–300 (93 ex) — blocos 71–81 ✅

### MARCO 5 — ext6 para módulos 21, 22, 23, 24 + FINALIZAÇÃO
- [x] `seed_21_inversion_ext6.sql` — content_id: `inversion` — ex 204–300 (97 ex) — blocos 71–82 ✅
- [x] `seed_22_subjunctive_ext6.sql` — content_id: `subjunctive` — ex 199–300 (102 ex) — blocos 71–83 ✅
- [x] `seed_23_advanced_modals_ext6.sql` — content_id: `advanced-modals` — ex 203–300 (98 ex) — blocos 71–82 ✅
- [x] `seed_24_discourse_markers_ext6.sql` — content_id: `discourse-markers` — ex 215–300 (86 ex) — blocos 71–80 ✅

### MARCO 6 — Entregáveis finais
- [ ] `TAREFAS_MANUAIS.md` — guia completo de execução no Supabase
- [ ] Script PowerShell wake-up criado e documentado
- [ ] `git add seeds/ && git commit && git push origin master`
- [ ] Webhook disparado confirmando conclusão

## STATUS ATUAL
**Último arquivo criado:** `seed_24_discourse_markers_ext6.sql` — MARCO 5 ✅ COMPLETO (todos os 4 arquivos criados)
**Próximo passo:** MARCO 6 — TAREFAS_MANUAIS.md, TESTE.md, git commit + push, webhook MARCO FINAL
**Próxima renovação de tokens:** ~01:30 / 06:30 / 11:30 / 16:30 / 20:30 BRT

## HISTÓRICO DE SESSÕES
| Data | Arquivos criados | Observações |
|------|-----------------|-------------|
| 2026-06-27/28 | ext5 para 04,05,07,09,10,11,12,15,16,17,18,19,21,22,23,24 | 16 ext5 criados |
| 2026-06-28 | PROGRESSO.md criado | Protocolo autônomo ativado |
