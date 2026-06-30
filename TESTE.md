# TESTE — Verificação de Contagem de Exercícios

Execute estas queries no **Supabase SQL Editor** após executar todos os seeds para verificar que cada módulo tem exatamente 300 exercícios.

## Query principal — contagem por módulo

```sql
SELECT content_id, COUNT(*) AS total
FROM exercises
GROUP BY content_id
ORDER BY content_id;
```

**Resultado esperado:** Todos os módulos abaixo devem mostrar `300`.

## Módulos esperados e suas contagens

| content_id | Total esperado |
|---|---|
| academic-connectors | 300 |
| advanced-modals | 300 |
| articles-advanced | 300 |
| basic-modals | 300 |
| be-going-to | 300 |
| conditional-1 | 300 |
| conditional-2-3 | 300 |
| discourse-markers | 300 |
| future-simple | 300 |
| gerund-infinitive | 300 |
| hedging-language | 300 |
| inversion | 300 |
| nominalization | 300 |
| non-defining-clauses | 300 |
| passive-voice | 300 |
| past-perfect | 300 |
| past-simple | 300 |
| present-continuous | 300 |
| present-perfect | 300 |
| present-simple | 300 |
| relative-clauses | 300 |
| reported-speech | 300 |
| subjunctive | 300 |

## Query de verificação rápida

```sql
SELECT
  content_id,
  COUNT(*) AS total,
  CASE WHEN COUNT(*) = 300 THEN '✅ OK' ELSE '❌ ERRO' END AS status
FROM exercises
GROUP BY content_id
ORDER BY status, content_id;
```

## Query para detectar gaps na numeração

```sql
SELECT content_id, block_number, exercise_number
FROM exercises
WHERE content_id = 'advanced-modals'  -- substitua pelo módulo desejado
ORDER BY block_number, exercise_number;
```

## Query para verificar tipos de exercícios

```sql
SELECT content_id, type, COUNT(*) AS total
FROM exercises
GROUP BY content_id, type
ORDER BY content_id, type;
```

## Query de verificação total geral

```sql
SELECT COUNT(*) AS total_geral FROM exercises;
-- Esperado: 23 módulos × 300 = 6900 exercícios
```
