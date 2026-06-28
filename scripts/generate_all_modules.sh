#!/usr/bin/env bash
# Gera 300 exercícios para cada módulo do banco.
# Uso: bash scripts/generate_all_modules.sh [--count 300]

COUNT=${2:-300}

MODULES=(
  "verbo-to-be"
  "present-simple"
  "present-continuous"
  "simple-past"
  "past-continuous"
  "present-perfect"
  "future-will-going-to"
  "modal-verbs"
  "conditionals"
  "gerunds-infinitives"
  "articles-determiners"
  "prepositions"
  "passive-voice"
  "reported-speech"
  "relative-clauses"
  "comparatives-superlatives"
  "noun-clauses"
  "adverb-clauses"
  "conjunctions"
  "academic-vocabulary"
  "reading-strategies"
  "listening-strategies"
  "writing-organization"
  "discourse-markers"
)

for MODULE in "${MODULES[@]}"; do
  echo "========================================"
  echo "Gerando: $MODULE"
  echo "========================================"
  npx tsx scripts/generate_exercises.ts "$MODULE" --count "$COUNT"
  echo ""
  sleep 2
done

echo "✅ Todos os módulos processados!"
