# TAREFAS MANUAIS — Execução dos Seeds no Supabase

Execute os arquivos SQL abaixo **no Supabase SQL Editor**, nesta ordem exata.
Acesse: **supabase.com → seu projeto → SQL Editor → New Query**

Resposta esperada após cada execução: `Success. No rows returned.`

---

## MÓDULOS JÁ COMPLETOS (não executar — já têm 300 exercícios)

Estes módulos já foram populados anteriormente e não precisam de seeds adicionais:
- `present-simple` (módulo 02)
- `past-simple` (módulo 03)
- `reported-speech` (módulo 13)
- `passive-voice` (módulo 14)
- `academic-connectors` (módulo 20)

---

## ORDEM DE EXECUÇÃO DOS SEEDS

### GRUPO 1 — Módulos 06 e 08 (ext5)

Execute cada arquivo na ordem abaixo. Copie o conteúdo do arquivo e cole no SQL Editor.

- [ ] `seeds/seed_06_be_going_to_ext5.sql`
- [ ] `seeds/seed_08_past_perfect_ext5.sql`

### GRUPO 2 — Módulos 06, 08, 09, 10 (ext6)

- [ ] `seeds/seed_06_be_going_to_ext6.sql`
- [ ] `seeds/seed_08_past_perfect_ext6.sql`
- [ ] `seeds/seed_09_conditional_1_ext6.sql`
- [ ] `seeds/seed_10_modais_basicos_ext6.sql`

### GRUPO 3 — Módulos 04, 05, 07, 11, 12 (ext6)

- [ ] `seeds/seed_04_present_continuous_ext6.sql`
- [ ] `seeds/seed_05_future_simple_ext6.sql`
- [ ] `seeds/seed_07_present_perfect_ext6.sql`
- [ ] `seeds/seed_11_relative_clauses_ext6.sql`
- [ ] `seeds/seed_12_conditional_2_3_ext6.sql`

### GRUPO 4 — Módulos 15, 16, 17, 18, 19 (ext6)

- [ ] `seeds/seed_15_gerund_infinitive_ext6.sql`
- [ ] `seeds/seed_16_articles_advanced_ext6.sql`
- [ ] `seeds/seed_17_non_defining_clauses_ext6.sql`
- [ ] `seeds/seed_18_nominalization_ext6.sql`
- [ ] `seeds/seed_19_hedging_language_ext6.sql`

### GRUPO 5 — Módulos 21, 22, 23, 24 (ext6)

- [ ] `seeds/seed_21_inversion_ext6.sql`
- [ ] `seeds/seed_22_subjunctive_ext6.sql`
- [ ] `seeds/seed_23_advanced_modals_ext6.sql`
- [ ] `seeds/seed_24_discourse_markers_ext6.sql`

---

## VERIFICAÇÃO FINAL

Após executar todos os seeds, execute no SQL Editor:

```sql
SELECT
  content_id,
  COUNT(*) AS total,
  CASE WHEN COUNT(*) = 300 THEN '✅ OK' ELSE '❌ ERRO' END AS status
FROM exercises
GROUP BY content_id
ORDER BY status, content_id;
```

Todos os 23 módulos devem mostrar `✅ OK` com total = 300.

---

## RESOLUÇÃO DE PROBLEMAS

**Se um arquivo falhar com "Módulo X não encontrado":**
Significa que o `content_id` não existe na tabela `contents`.
Execute: `SELECT id FROM contents ORDER BY id;` para verificar os IDs disponíveis.

**Se aparecer contagem diferente de 300:**
Execute: `SELECT block_number, exercise_number FROM exercises WHERE content_id = 'X' ORDER BY block_number, exercise_number;`
para identificar gaps ou duplicatas.

**Se receber erro de conflito:**
Os seeds usam `ON CONFLICT DO NOTHING` — execute novamente sem problema. Nenhum dado será duplicado.

---

## TOTAL ESPERADO

- **23 módulos × 300 exercícios = 6.900 exercícios no total**
- **20 arquivos seed** a serem executados manualmente
- **5 módulos** já completos (não precisam de seeds adicionais)
