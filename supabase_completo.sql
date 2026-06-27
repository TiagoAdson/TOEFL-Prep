-- ============================================================
-- MEU INGLÊS — SQL COMPLETO (setup + migration v2)
-- Cole tudo isso no Supabase SQL Editor e clique Run
-- ============================================================

-- ============================================================
-- PARTE 1: TABELAS BASE
-- ============================================================

CREATE TABLE IF NOT EXISTS levels (
  id TEXT PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  order_number INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contents (
  id TEXT PRIMARY KEY,
  name VARCHAR NOT NULL,
  level_id TEXT REFERENCES levels(id),
  description TEXT,
  order_number INT NOT NULL,
  test_of_concept_count INT DEFAULT 10,
  total_exercises INT DEFAULT 100,
  mastery_threshold INT DEFAULT 80,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tests_of_concept (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id TEXT REFERENCES contents(id),
  question_number INT,
  question TEXT NOT NULL,
  options JSON NOT NULL,
  correct_answer INT NOT NULL,
  explanation TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id TEXT REFERENCES contents(id),
  block_number INT NOT NULL,
  exercise_number INT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  explanation TEXT NOT NULL,
  type VARCHAR NOT NULL,
  options JSON,
  difficulty VARCHAR DEFAULT 'medium',
  context VARCHAR,
  exercise_category VARCHAR DEFAULT 'general'
    CHECK (exercise_category IN ('general','toefl')),
  toefl_section VARCHAR
    CHECK (toefl_section IN ('reading','listening','speaking','writing') OR toefl_section IS NULL),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(content_id, block_number, exercise_number)
);

CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  content_id TEXT REFERENCES contents(id),
  block_number INT,
  exercise_number INT,
  exercise_id UUID REFERENCES exercises(id),
  user_answer TEXT,
  correct_answer TEXT,
  is_correct BOOLEAN,
  confidence_level INT,
  time_spent_seconds INT,
  feedback_received TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS simulado_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  reading_score INT,
  listening_score INT,
  speaking_score INT,
  writing_score INT,
  total_score INT,
  toefl_equivalent INT,
  analysis TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- PARTE 2: NOVAS TABELAS (v2)
-- ============================================================

CREATE TABLE IF NOT EXISTS profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name  TEXT,
  role       VARCHAR NOT NULL DEFAULT 'student'
               CHECK (role IN ('student','tutor')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_tutor (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (tutor_id, student_id)
);

CREATE TABLE IF NOT EXISTS content_mastery (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id       TEXT NOT NULL REFERENCES contents(id),
  accuracy_rate    NUMERIC DEFAULT 0 CHECK (accuracy_rate BETWEEN 0 AND 100),
  status           VARCHAR NOT NULL DEFAULT 'locked'
                     CHECK (status IN ('locked','studying','mastered')),
  exercises_done   INT DEFAULT 0,
  last_reviewed_at TIMESTAMP,
  created_at       TIMESTAMP DEFAULT NOW(),
  UNIQUE (user_id, content_id)
);

CREATE TABLE IF NOT EXISTS mistake_journal (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id        UUID REFERENCES exercises(id),
  simulado_id        UUID REFERENCES simulado_history(id),
  question_text      TEXT NOT NULL,
  user_answer        TEXT,
  correct_answer     TEXT,
  user_justification TEXT,
  ai_correction      TEXT,
  error_category     VARCHAR CHECK (error_category IN ('common_english','toefl_pattern')),
  seen_with_tutor    BOOLEAN DEFAULT FALSE,
  created_at         TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tutor_materials (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name       TEXT NOT NULL,
  file_content    TEXT,
  linked_contents TEXT[],
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS homework_exercises (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  material_id  UUID REFERENCES tutor_materials(id) ON DELETE CASCADE,
  question     TEXT NOT NULL,
  answer       TEXT,
  explanation  TEXT,
  user_answer  TEXT,
  is_correct   BOOLEAN,
  created_at   TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- PARTE 3: ÍNDICES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_exercises_content      ON exercises(content_id);
CREATE INDEX IF NOT EXISTS idx_progress_user          ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_simulado_user          ON simulado_history(user_id);
CREATE INDEX IF NOT EXISTS idx_content_mastery_user   ON content_mastery(user_id);
CREATE INDEX IF NOT EXISTS idx_mistake_journal_user   ON mistake_journal(user_id);
CREATE INDEX IF NOT EXISTS idx_tutor_materials_user   ON tutor_materials(user_id);
CREATE INDEX IF NOT EXISTS idx_homework_user          ON homework_exercises(user_id);
CREATE INDEX IF NOT EXISTS idx_student_tutor_tutor    ON student_tutor(tutor_id);
CREATE INDEX IF NOT EXISTS idx_student_tutor_student  ON student_tutor(student_id);

-- ============================================================
-- PARTE 4: TRIGGER — cria perfil automaticamente no cadastro
-- ============================================================

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
-- PARTE 5: DADOS — Níveis (A1 → C2)
-- ============================================================

INSERT INTO levels (id, name, description, order_number) VALUES
  ('A1','Elementar Básico','Básico absoluto',1),
  ('A2','Elementar','Conceitos básicos',2),
  ('B1','Intermediário','Conversação simples',3),
  ('B2','Independente','Discussão de tópicos',4),
  ('C1','Domínio Operacional','Fluência acadêmica completa',5),
  ('C2','Maestria','Domínio nativo do idioma',6)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- PARTE 6: DADOS — 24 Módulos do Currículo
-- ============================================================

INSERT INTO contents (id, name, level_id, description, order_number) VALUES
  ('verbo-to-be',       'Verbo TO BE',           'A1', 'Ser, estar, identidade',              1),
  ('present-simple',    'Present Simple',         'A1', 'Presente simples',                    2),
  ('past-simple',       'Past Simple',            'A1', 'Passado simples',                     3),
  ('present-continuous','Present Continuous',     'A1', 'Estar + -ing',                        4),
  ('future-simple',     'Future Simple',          'A1', 'Futuro com will',                     5),
  ('be-going-to',       'Be Going To',            'A2', 'Futuro com plano',                    6),
  ('present-perfect',   'Present Perfect',        'A2', 'Presente perfeito',                   7),
  ('past-perfect',      'Past Perfect',           'A2', 'Passado perfeito',                    8),
  ('conditional-1',     'Conditional Tipo 1',     'A2', 'Se... vai...',                        9),
  ('modais-basicos',    'Modais Básicos',         'A2', 'Can, could, may',                    10),
  ('relative-clauses',  'Relative Clauses',       'A2', 'Who, which, that',                   11),
  ('conditional-2-3',   'Conditional Tipo 2-3',   'B1', 'Se... seria...',                     12),
  ('reported-speech',   'Reported Speech',        'B1', 'Discurso indireto',                  13),
  ('passive-voice',     'Passive Voice',          'B1', 'Voz passiva',                        14),
  ('gerund-infinitive', 'Gerund vs Infinitive',   'B1', '-ing vs to+verb',                    15),
  ('articles-advanced', 'Articles Avançado',      'B2', 'A/An/The profundo',                  16),
  ('non-defining-clauses','Non-Defining Clauses', 'B2', 'Cláusulas extras',                   17),
  ('nominalization',    'Nominalization',         'B2', 'Verbo para substantivo',              18),
  ('hedging-language',  'Hedging Language',       'B2', 'Linguagem cautelosa',                19),
  ('academic-connectors','Academic Connectors',   'B2', 'Conectivos acadêmicos',              20),
  ('inversion',         'Inversion',              'C1', 'Inversão formal de sujeito e verbo', 21),
  ('subjunctive',       'Subjunctive Mood',       'C1', 'Modo subjuntivo acadêmico',          22),
  ('advanced-modals',   'Advanced Modals',        'C1', 'Modais avançados: must, ought, need',23),
  ('discourse-markers', 'Discourse Markers',      'C2', 'Marcadores de discurso e coesão',    24)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- PARTE 7: ROW LEVEL SECURITY
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

-- ── profiles ──────────────────────────────────────────────
DROP POLICY IF EXISTS "profiles: ver proprio" ON profiles;
CREATE POLICY "profiles: ver proprio" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles: editar proprio" ON profiles;
CREATE POLICY "profiles: editar proprio" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles: tutor ve alunos vinculados" ON profiles;
CREATE POLICY "profiles: tutor ve alunos vinculados" ON profiles
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

DROP POLICY IF EXISTS "student_tutor: aluno ve seus tutores" ON student_tutor;
CREATE POLICY "student_tutor: aluno ve seus tutores" ON student_tutor
  FOR SELECT USING (student_id = auth.uid());

-- ── user_progress ──────────────────────────────────────────
DROP POLICY IF EXISTS "progress: aluno ve proprio" ON user_progress;
CREATE POLICY "progress: aluno ve proprio" ON user_progress
  FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "progress: tutor le de alunos vinculados" ON user_progress;
CREATE POLICY "progress: tutor le de alunos vinculados" ON user_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM student_tutor
      WHERE tutor_id = auth.uid() AND student_id = user_progress.user_id
    )
  );

-- ── content_mastery ────────────────────────────────────────
DROP POLICY IF EXISTS "mastery: aluno ve proprio" ON content_mastery;
CREATE POLICY "mastery: aluno ve proprio" ON content_mastery
  FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "mastery: tutor le de alunos vinculados" ON content_mastery;
CREATE POLICY "mastery: tutor le de alunos vinculados" ON content_mastery
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM student_tutor
      WHERE tutor_id = auth.uid() AND student_id = content_mastery.user_id
    )
  );

-- ── mistake_journal ────────────────────────────────────────
DROP POLICY IF EXISTS "mistakes: aluno ve proprio" ON mistake_journal;
CREATE POLICY "mistakes: aluno ve proprio" ON mistake_journal
  FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "mistakes: tutor le de alunos vinculados" ON mistake_journal;
CREATE POLICY "mistakes: tutor le de alunos vinculados" ON mistake_journal
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM student_tutor
      WHERE tutor_id = auth.uid() AND student_id = mistake_journal.user_id
    )
  );

-- ── simulado_history ───────────────────────────────────────
DROP POLICY IF EXISTS "simulado: aluno ve proprio" ON simulado_history;
CREATE POLICY "simulado: aluno ve proprio" ON simulado_history
  FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "simulado: tutor le de alunos vinculados" ON simulado_history;
CREATE POLICY "simulado: tutor le de alunos vinculados" ON simulado_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM student_tutor
      WHERE tutor_id = auth.uid() AND student_id = simulado_history.user_id
    )
  );

-- ── tutor_materials ────────────────────────────────────────
DROP POLICY IF EXISTS "materials: aluno ve proprio" ON tutor_materials;
CREATE POLICY "materials: aluno ve proprio" ON tutor_materials
  FOR ALL USING (user_id = auth.uid());

-- ── homework_exercises ─────────────────────────────────────
DROP POLICY IF EXISTS "homework: aluno ve proprio" ON homework_exercises;
CREATE POLICY "homework: aluno ve proprio" ON homework_exercises
  FOR ALL USING (user_id = auth.uid());

-- ── Conteudo publico (qualquer usuario logado pode ler) ────
DROP POLICY IF EXISTS "exercises: leitura publica" ON exercises;
CREATE POLICY "exercises: leitura publica" ON exercises
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "contents: leitura publica" ON contents;
CREATE POLICY "contents: leitura publica" ON contents
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "levels: leitura publica" ON levels;
CREATE POLICY "levels: leitura publica" ON levels
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "toc: leitura publica" ON tests_of_concept;
CREATE POLICY "toc: leitura publica" ON tests_of_concept
  FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================================
-- FIM — SQL COMPLETO MEU INGLÊS
-- ============================================================
