-- ============================================================
-- MIGRATION: speaking_history — histórico de tentativas de Speaking
-- (transcrição, nota, apontamentos) + referência ao áudio salvo
-- no Supabase Storage (bucket "speaking-audio").
-- Execute no Supabase SQL Editor do projeto TOEFL
-- ============================================================

CREATE TABLE IF NOT EXISTS speaking_history (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id        TEXT REFERENCES contents(id),
  exercise_id       UUID REFERENCES exercises(id),
  task              TEXT,          -- enunciado/tarefa respondida
  transcript        TEXT,          -- o que o aluno disse (transcrito pela IA)
  score             INT,           -- 0-30
  feedback          TEXT,
  strengths         TEXT,
  improvements      TEXT,
  audio_path        TEXT,          -- caminho no bucket "speaking-audio", NULL se já foi apagado
  audio_size_bytes  BIGINT,
  created_at        TIMESTAMP DEFAULT NOW()
);

ALTER TABLE speaking_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "speaking_history: aluno ve e gerencia proprio" ON speaking_history;
CREATE POLICY "speaking_history: aluno ve e gerencia proprio" ON speaking_history
  FOR ALL USING (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_speaking_history_user ON speaking_history(user_id);
CREATE INDEX IF NOT EXISTS idx_speaking_history_content ON speaking_history(user_id, content_id, created_at DESC);

-- ============================================================
-- STORAGE: bucket privado para os áudios de Speaking
-- (bucket em si precisa ser criado uma vez no Dashboard →
-- Storage → New bucket → nome "speaking-audio" → Private,
-- OU descomente e rode o insert abaixo, que faz a mesma coisa)
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('speaking-audio', 'speaking-audio', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "speaking-audio: aluno gerencia seus arquivos" ON storage.objects;
CREATE POLICY "speaking-audio: aluno gerencia seus arquivos" ON storage.objects
  FOR ALL USING (
    bucket_id = 'speaking-audio'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
