-- ============================================================
-- MIGRATION: toefl_skill — marca cada exercício com a habilidade
-- TOEFL que ele treina (reading/listening/speaking/writing) ou
-- NULL se for exercício de gramática geral (objetivo).
-- Execute no Supabase SQL Editor do projeto TOEFL
-- ============================================================

ALTER TABLE exercises
  ADD COLUMN IF NOT EXISTS toefl_skill TEXT
    CHECK (toefl_skill IN ('reading','listening','speaking','writing'));

CREATE INDEX IF NOT EXISTS idx_exercises_toefl_skill ON exercises(toefl_skill);
