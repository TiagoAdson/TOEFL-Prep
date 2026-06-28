-- ============================================================
-- MEU INGLÊS — Migration v2
-- Execute no Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ============================================================
-- 1. NÍVEIS (adiciona C1 e C2)
-- ============================================================
INSERT INTO levels (id, name, description, order_number) VALUES
  ('C1','Domínio Operacional','Fluência acadêmica completa',5),
  ('C2','Maestria','Domínio nativo do idioma',6)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 2. ATUALIZA contents: adiciona coluna mastery_threshold
-- ============================================================
ALTER TABLE contents
  ADD COLUMN IF NOT EXISTS mastery_threshold INT DEFAULT 80;

-- Adiciona módulos 21-24 ao currículo
INSERT INTO contents (id, name, level_id, description, order_number, mastery_threshold) VALUES
  ('inversion',       'Inversion',          'C1', 'Inversão formal de sujeito e verbo', 21, 80),
  ('subjunctive',     'Subjunctive Mood',   'C1', 'Modo subjuntivo acadêmico',           22, 80),
  ('advanced-modals', 'Advanced Modals',    'C1', 'Modais avançados: must, ought, need', 23, 80),
  ('discourse-markers','Discourse Markers', 'C2', 'Marcadores de discurso e coesão',     24, 80)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 3. ATUALIZA exercises: adiciona colunas de categoria
-- ============================================================
ALTER TABLE exercises
  ADD COLUMN IF NOT EXISTS exercise_category VARCHAR DEFAULT 'general'
    CHECK (exercise_category IN ('general','toefl')),
  ADD COLUMN IF NOT EXISTS toefl_section VARCHAR
    CHECK (toefl_section IN ('reading','listening','speaking','writing') OR toefl_section IS NULL);

-- ============================================================
-- 4. TABELA: profiles (roles de usuário)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name  TEXT,
  role       VARCHAR NOT NULL DEFAULT 'student'
               CHECK (role IN ('student','tutor')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Trigger: cria perfil automaticamente ao cadastrar usuário
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', 'student')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- 5. TABELA: student_tutor (vínculo aluno ↔ tutor)
-- ============================================================
CREATE TABLE IF NOT EXISTS student_tutor (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (tutor_id, student_id)
);

-- ============================================================
-- 6. TABELA: content_mastery (domínio por conteúdo/aluno)
-- ============================================================
CREATE TABLE IF NOT EXISTS content_mastery (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id      TEXT NOT NULL REFERENCES contents(id),
  accuracy_rate   NUMERIC DEFAULT 0 CHECK (accuracy_rate BETWEEN 0 AND 100),
  status          VARCHAR NOT NULL DEFAULT 'locked'
                    CHECK (status IN ('locked','studying','mastered')),
  exercises_done  INT DEFAULT 0,
  last_reviewed_at TIMESTAMP,
  created_at      TIMESTAMP DEFAULT NOW(),
  UNIQUE (user_id, content_id)
);

-- ============================================================
-- 7. TABELA: mistake_journal (diário socrático)
-- ============================================================
CREATE TABLE IF NOT EXISTS mistake_journal (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id      UUID REFERENCES exercises(id),
  simulado_id      UUID REFERENCES simulado_history(id),
  question_text    TEXT NOT NULL,
  user_answer      TEXT,
  correct_answer   TEXT,
  user_justification TEXT,
  ai_correction    TEXT,
  error_category   VARCHAR CHECK (error_category IN ('common_english','toefl_pattern')),
  seen_with_tutor  BOOLEAN DEFAULT FALSE,
  created_at       TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 8. TABELA: tutor_materials (uploads do professor humano)
-- ============================================================
CREATE TABLE IF NOT EXISTS tutor_materials (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name       TEXT NOT NULL,
  file_content    TEXT,
  linked_contents TEXT[],  -- módulos da matriz identificados no PDF
  created_at      TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 9. TABELA: homework_exercises (exercícios do tutor humano)
-- ============================================================
CREATE TABLE IF NOT EXISTS homework_exercises (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  material_id   UUID REFERENCES tutor_materials(id) ON DELETE CASCADE,
  question      TEXT NOT NULL,
  answer        TEXT,
  explanation   TEXT,
  user_answer   TEXT,
  is_correct    BOOLEAN,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 10. ÍNDICES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_content_mastery_user    ON content_mastery(user_id);
CREATE INDEX IF NOT EXISTS idx_mistake_journal_user    ON mistake_journal(user_id);
CREATE INDEX IF NOT EXISTS idx_tutor_materials_user    ON tutor_materials(user_id);
CREATE INDEX IF NOT EXISTS idx_homework_user           ON homework_exercises(user_id);
CREATE INDEX IF NOT EXISTS idx_student_tutor_tutor     ON student_tutor(tutor_id);
CREATE INDEX IF NOT EXISTS idx_student_tutor_student   ON student_tutor(student_id);

-- ============================================================
-- 11. ROW LEVEL SECURITY — Habilitar em todas as tabelas
-- ============================================================
ALTER TABLE profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_tutor      ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_mastery    ENABLE ROW LEVEL SECURITY;
ALTER TABLE mistake_journal    ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_materials    ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress      ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulado_history   ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises          ENABLE ROW LEVEL SECURITY;
ALTER TABLE contents           ENABLE ROW LEVEL SECURITY;
ALTER TABLE levels             ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests_of_concept   ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 12. POLÍTICAS RLS
-- ============================================================

-- ── profiles ──────────────────────────────────────────────
DROP POLICY IF EXISTS "profiles: ver próprio" ON profiles;
CREATE POLICY "profiles: ver próprio" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles: editar próprio" ON profiles;
CREATE POLICY "profiles: editar próprio" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles: tutor vê alunos vinculados" ON profiles;
CREATE POLICY "profiles: tutor vê alunos vinculados" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM student_tutor
      WHERE tutor_id = auth.uid() AND student_id = profiles.id
    )
  );

-- ── student_tutor ──────────────────────────────────────────
DROP POLICY IF EXISTS "student_tutor: tutor gerencia" ON student_tutor;
CREATE POLICY "student_tutor: tutor gerencia" ON student_tutor
  FOR ALL USING (tutor_id = auth.uid());

DROP POLICY IF EXISTS "student_tutor: aluno vê seus tutores" ON student_tutor;
CREATE POLICY "student_tutor: aluno vê seus tutores" ON student_tutor
  FOR SELECT USING (student_id = auth.uid());

-- ── user_progress ──────────────────────────────────────────
DROP POLICY IF EXISTS "progress: aluno vê próprio" ON user_progress;
CREATE POLICY "progress: aluno vê próprio" ON user_progress
  FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "progress: tutor lê de alunos vinculados" ON user_progress;
CREATE POLICY "progress: tutor lê de alunos vinculados" ON user_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM student_tutor
      WHERE tutor_id = auth.uid() AND student_id = user_progress.user_id
    )
  );

-- ── content_mastery ────────────────────────────────────────
DROP POLICY IF EXISTS "mastery: aluno vê próprio" ON content_mastery;
CREATE POLICY "mastery: aluno vê próprio" ON content_mastery
  FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "mastery: tutor lê de alunos vinculados" ON content_mastery;
CREATE POLICY "mastery: tutor lê de alunos vinculados" ON content_mastery
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM student_tutor
      WHERE tutor_id = auth.uid() AND student_id = content_mastery.user_id
    )
  );

-- ── mistake_journal ────────────────────────────────────────
DROP POLICY IF EXISTS "mistakes: aluno vê próprio" ON mistake_journal;
CREATE POLICY "mistakes: aluno vê próprio" ON mistake_journal
  FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "mistakes: tutor lê de alunos vinculados" ON mistake_journal;
CREATE POLICY "mistakes: tutor lê de alunos vinculados" ON mistake_journal
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM student_tutor
      WHERE tutor_id = auth.uid() AND student_id = mistake_journal.user_id
    )
  );

-- ── simulado_history ───────────────────────────────────────
DROP POLICY IF EXISTS "simulado: aluno vê próprio" ON simulado_history;
CREATE POLICY "simulado: aluno vê próprio" ON simulado_history
  FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "simulado: tutor lê de alunos vinculados" ON simulado_history;
CREATE POLICY "simulado: tutor lê de alunos vinculados" ON simulado_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM student_tutor
      WHERE tutor_id = auth.uid() AND student_id = simulado_history.user_id
    )
  );

-- ── tutor_materials ────────────────────────────────────────
DROP POLICY IF EXISTS "materials: aluno vê próprio" ON tutor_materials;
CREATE POLICY "materials: aluno vê próprio" ON tutor_materials
  FOR ALL USING (user_id = auth.uid());

-- ── homework_exercises ─────────────────────────────────────
DROP POLICY IF EXISTS "homework: aluno vê próprio" ON homework_exercises;
CREATE POLICY "homework: aluno vê próprio" ON homework_exercises
  FOR ALL USING (user_id = auth.uid());

-- ── Conteúdo público (leitura para qualquer usuário logado) ─
DROP POLICY IF EXISTS "exercises: leitura pública" ON exercises;
CREATE POLICY "exercises: leitura pública" ON exercises
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "contents: leitura pública" ON contents;
CREATE POLICY "contents: leitura pública" ON contents
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "levels: leitura pública" ON levels;
CREATE POLICY "levels: leitura pública" ON levels
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "toc: leitura pública" ON tests_of_concept;
CREATE POLICY "toc: leitura pública" ON tests_of_concept
  FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================================
-- FIM DA MIGRATION v2
-- ============================================================
