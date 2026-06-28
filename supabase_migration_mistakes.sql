-- ============================================================
-- MIGRATION: mistake_journal — adiciona colunas faltando
-- Execute no Supabase SQL Editor do projeto TOEFL
-- ============================================================

ALTER TABLE mistake_journal
  ADD COLUMN IF NOT EXISTS question          TEXT,
  ADD COLUMN IF NOT EXISTS content_id        TEXT,
  ADD COLUMN IF NOT EXISTS is_resolved       BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS spaced_review_date TIMESTAMP;

-- Popula 'question' a partir de 'question_text' onde vazio
UPDATE mistake_journal
  SET question = question_text
  WHERE question IS NULL AND question_text IS NOT NULL;

-- Índice para buscas por is_resolved
CREATE INDEX IF NOT EXISTS idx_mistake_journal_resolved
  ON mistake_journal(user_id, is_resolved);
