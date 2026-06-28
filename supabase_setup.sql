-- ============================================
-- TOEFL PREP - Setup Supabase
-- Execute no Supabase SQL Editor
-- ============================================

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

CREATE INDEX IF NOT EXISTS idx_exercises_content ON exercises(content_id);
CREATE INDEX IF NOT EXISTS idx_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_simulado_user ON simulado_history(user_id);

-- DADOS INICIAIS
INSERT INTO levels (id, name, description, order_number) VALUES
('A1','Elementar Basico','Basico absoluto',1),
('A2','Elementar','Conceitos basicos',2),
('B1','Intermediario','Conversacao simples',3),
('B2','Independente','Discussao de topicos',4),
('C1','Dominio Operacional','Fluencia completa',5)
ON CONFLICT (id) DO NOTHING;

INSERT INTO contents (id, name, level_id, description, order_number) VALUES
('verbo-to-be','Verbo TO BE','A1','Ser, estar, identidade',1),
('present-simple','Present Simple','A1','Presente simples',2),
('past-simple','Past Simple','A1','Passado simples',3),
('present-continuous','Present Continuous','A1','Estar + -ing',4),
('future-simple','Future Simple','A1','Futuro com will',5),
('be-going-to','Be Going To','A2','Futuro com plano',6),
('present-perfect','Present Perfect','A2','Presente perfeito',7),
('past-perfect','Past Perfect','A2','Passado perfeito',8),
('conditional-1','Conditional Tipo 1','A2','Se... vai...',9),
('modais-basicos','Modais Basicos','A2','Can, could, may',10),
('relative-clauses','Relative Clauses','A2','Who, which, that',11),
('conditional-2-3','Conditional Tipo 2-3','B1','Se... seria...',12),
('reported-speech','Reported Speech','B1','Discurso indireto',13),
('passive-voice','Passive Voice','B1','Voz passiva',14),
('gerund-infinitive','Gerund vs Infinitive','B1','-ing vs to+verb',15),
('articles-advanced','Articles Avancado','B2','A/An/The profundo',16),
('non-defining-clauses','Non-Defining Clauses','B2','Clausulas extras',17),
('nominalization','Nominalization','B2','Verbo para substantivo',18),
('hedging-language','Hedging Language','B2','Linguagem cautelosa',19),
('academic-connectors','Academic Connectors','B2','Conectivos academicos',20)
ON CONFLICT (id) DO NOTHING;

-- TESTE DE CONCEITO - VERBO TO BE
INSERT INTO tests_of_concept (content_id, question_number, question, options, correct_answer, explanation) VALUES
('verbo-to-be',1,'O verbo TO BE e usado principalmente para:','["Fazer uma acao","Ser, estar, identidade","Ir para algum lugar","Ter algo"]',1,'TO BE = Ser/Estar'),
('verbo-to-be',2,'Qual e a conjugacao correta?','["I am, You are, He is","I is, You am, He are","Todos usam is","Todos usam am"]',0,'I AM | You/We/They ARE | He/She/It IS'),
('verbo-to-be',3,'Como negar com TO BE?','["I not am happy","I am not happy","I do not am happy","I no happy"]',1,'Subject + AM/ARE/IS + NOT'),
('verbo-to-be',4,'Como fazer pergunta com TO BE?','["Do you are happy?","You are happy?","Are you happy?","Have you happy?"]',2,'AM/ARE/IS + Subject'),
('verbo-to-be',5,'Qual sentenca esta correta?','["She are a doctor","She am a doctor","She is a doctor","She be a doctor"]',2,'She/He/It + IS')
ON CONFLICT DO NOTHING;

-- EXERCICIOS - VERBO TO BE - BLOCO 1
INSERT INTO exercises (content_id, block_number, exercise_number, question, answer, type, explanation, difficulty) VALUES
('verbo-to-be',1,1,'She ___ happy.','is','gap_fill','She (3a pessoa singular) = IS','easy'),
('verbo-to-be',1,2,'I ___ a teacher.','am','gap_fill','I sempre = AM','easy'),
('verbo-to-be',1,3,'They ___ from Brazil.','are','gap_fill','They (plural) = ARE','easy'),
('verbo-to-be',1,4,'He ___ ready.','is','gap_fill','He (3a singular) = IS','easy'),
('verbo-to-be',1,5,'You ___ my friend.','are','gap_fill','You = ARE','easy'),
('verbo-to-be',1,6,'It ___ blue.','is','gap_fill','It (singular) = IS','easy'),
('verbo-to-be',1,7,'We ___ students.','are','gap_fill','We (plural) = ARE','easy'),
('verbo-to-be',1,8,'I ___ tired today.','am','gap_fill','I = AM','easy'),
('verbo-to-be',1,9,'She ___ not happy.','is','gap_fill','She + IS + NOT','medium'),
('verbo-to-be',1,10,'They ___ not here.','are','gap_fill','They = ARE','medium'),
('verbo-to-be',1,11,'___ she your teacher?','Is','gap_fill','Pergunta: IS + She','medium'),
('verbo-to-be',1,12,'___ you ready?','Are','gap_fill','Pergunta: ARE + You','medium'),
('verbo-to-be',1,13,'The cat ___ on the table.','is','gap_fill','The cat = singular = IS','easy'),
('verbo-to-be',1,14,'My parents ___ at home.','are','gap_fill','My parents = plural = ARE','easy'),
('verbo-to-be',1,15,'I ___ not a student anymore.','am','gap_fill','I + AM + NOT','medium'),
('verbo-to-be',1,16,'Qual e a forma correta?','He is not here','multiple_choice','He + IS + NOT','medium','["He are not here","He not is here","He is not here","He be not here"]'),
('verbo-to-be',1,17,'The books ___ on the shelf.','are','gap_fill','The books = plural = ARE','easy'),
('verbo-to-be',1,18,'She ___ very intelligent.','is','gap_fill','She = IS','easy'),
('verbo-to-be',1,19,'We ___ from Sao Paulo.','are','gap_fill','We = ARE','easy'),
('verbo-to-be',1,20,'Escreva uma frase usando I AM.','I am happy.','production','Use I + AM + adjetivo ou substantivo','medium')
ON CONFLICT DO NOTHING;

-- EXERCICIOS - VERBO TO BE - BLOCO 2 (intermediario)
INSERT INTO exercises (content_id, block_number, exercise_number, question, answer, type, explanation, difficulty) VALUES
('verbo-to-be',2,1,'___ (she / be) a doctor? Yes, she ___.','Is / is','gap_fill','Pergunta + resposta curta','medium'),
('verbo-to-be',2,2,'My brother ___ not at school today.','is','gap_fill','My brother = singular = IS','medium'),
('verbo-to-be',2,3,'Qual forma negativa esta correta?','They are not ready','multiple_choice','They + ARE + NOT','medium','["They not are ready","They are not ready","They arent ready (sem apostrofe)","They be not ready"]'),
('verbo-to-be',2,4,'The weather ___ cold in January.','is','gap_fill','The weather = singular = IS','medium'),
('verbo-to-be',2,5,'___ they Brazilian? No, they ___ not.','Are / are','gap_fill','Are + they + ...','medium'),
('verbo-to-be',2,6,'I ___ 25 years old.','am','gap_fill','I = AM (sempre)','easy'),
('verbo-to-be',2,7,'Complete: She ___ (not) happy.','is not','gap_fill','She IS NOT happy','medium'),
('verbo-to-be',2,8,'My dog ___ very friendly.','is','gap_fill','My dog = singular = IS','easy'),
('verbo-to-be',2,9,'Qual sentenca usa TO BE para identidade?','She is a nurse','multiple_choice','Identidade = o que a pessoa e','medium','["She goes to hospital","She is a nurse","She works hard","She has a job"]'),
('verbo-to-be',2,10,'___ it true?','Is','gap_fill','Pergunta com it = IS','medium'),
('verbo-to-be',2,11,'You ___ the best student in the class.','are','gap_fill','You = ARE','easy'),
('verbo-to-be',2,12,'___ I late?','Am','gap_fill','Pergunta com I = AM','medium'),
('verbo-to-be',2,13,'The children ___ very quiet today.','are','gap_fill','The children = plural = ARE','medium'),
('verbo-to-be',2,14,'Escreva uma frase negativa com HE.','He is not...','production','Use He + IS + NOT + complemento','medium'),
('verbo-to-be',2,15,'This book ___ interesting.','is','gap_fill','This book = singular = IS','easy'),
('verbo-to-be',2,16,'Those students ___ from Japan.','are','gap_fill','Those students = plural = ARE','easy'),
('verbo-to-be',2,17,'___ your sister a teacher?','Is','gap_fill','Pergunta com singular = IS','medium'),
('verbo-to-be',2,18,'We ___ not ready for the exam.','are','gap_fill','We = ARE','medium'),
('verbo-to-be',2,19,'Qual e a contracao de "they are"?','they''re','gap_fill','they + are = they''re','medium'),
('verbo-to-be',2,20,'Escreva uma pergunta com ARE.','Are you...?','production','ARE + sujeito + complemento + ?','hard')
ON CONFLICT DO NOTHING;

-- EXERCICIOS - PRESENT SIMPLE - BLOCO 1
INSERT INTO exercises (content_id, block_number, exercise_number, question, answer, type, explanation, difficulty) VALUES
('present-simple',1,1,'She ___ (work) every day.','works','gap_fill','3a pessoa singular: work + s','easy'),
('present-simple',1,2,'I ___ (like) coffee.','like','gap_fill','I: sem alteracao do verbo','easy'),
('present-simple',1,3,'He ___ (study) English.','studies','gap_fill','study -> studies (3a pessoa)','medium'),
('present-simple',1,4,'They ___ (play) football on weekends.','play','gap_fill','They: sem alteracao do verbo','easy'),
('present-simple',1,5,'She ___ (not / eat) meat.','does not eat','gap_fill','Negativa 3a pessoa: does not + infinitivo','medium'),
('present-simple',1,6,'___ you (like) pizza?','Do you like','gap_fill','Pergunta: Do + you + infinitivo','medium'),
('present-simple',1,7,'He ___ (go) to school by bus.','goes','gap_fill','go -> goes (3a pessoa)','medium'),
('present-simple',1,8,'We ___ (watch) TV at night.','watch','gap_fill','We: sem alteracao','easy'),
('present-simple',1,9,'___ she (speak) French?','Does she speak','gap_fill','Pergunta 3a pessoa: Does + she + infinitivo','medium'),
('present-simple',1,10,'My father ___ (read) the newspaper.','reads','gap_fill','My father = 3a pessoa = reads','easy'),
('present-simple',1,11,'I ___ (not / understand) this.','do not understand','gap_fill','Negativa 1a pessoa: do not + infinitivo','medium'),
('present-simple',1,12,'Qual forma esta correta?','She drinks coffee','multiple_choice','3a pessoa singular + s','easy','["She drink coffee","She drinkes coffee","She drinks coffee","She is drink coffee"]'),
('present-simple',1,13,'The sun ___ (rise) in the east.','rises','gap_fill','Fato geral: rise -> rises','medium'),
('present-simple',1,14,'We ___ (not / live) in Rio.','do not live','gap_fill','Negativa plural: do not + infinitivo','medium'),
('present-simple',1,15,'___ they (have) a car?','Do they have','gap_fill','Pergunta plural: Do + they + infinitivo','medium'),
('present-simple',1,16,'He ___ (teach) math.','teaches','gap_fill','teach -> teaches (3a pessoa)','medium'),
('present-simple',1,17,'I always ___ (brush) my teeth.','brush','gap_fill','I: sem alteracao','easy'),
('present-simple',1,18,'She ___ (not / like) horror movies.','does not like','gap_fill','Negativa 3a pessoa: does not + infinitivo','medium'),
('present-simple',1,19,'Quando usamos Present Simple?','Para habitos e rotinas','multiple_choice','Present Simple = habitos, fatos, rotinas','medium','["Para acoes em progresso","Para habitos e rotinas","Para acoes passadas","Para acoes futuras"]'),
('present-simple',1,20,'Escreva 2 frases sobre sua rotina.','I wake up at 7am. I drink coffee.','production','Use Present Simple para descrever sua rotina diaria','medium')
ON CONFLICT DO NOTHING;
