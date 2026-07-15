-- ============================================================
-- SEED EXT 2: Módulo 01 — Verbo TO BE (ex 71-120)
-- Tópicos: respostas curtas, perguntas com WH, adjetivos após
-- TO BE, profissões/nacionalidades, preposições com TO BE
-- ============================================================
DO $$
DECLARE cid TEXT;
BEGIN
  SELECT id INTO cid FROM contents WHERE id = 'verbo-to-be';
  IF cid IS NULL THEN RAISE EXCEPTION 'Módulo verbo-to-be não encontrado'; END IF;

  INSERT INTO exercises (content_id, block_number, exercise_number, type, question, answer, options, explanation, difficulty) VALUES

  -- BLOCK 9: Respostas curtas com TO BE
  (cid,9,71,'gap_fill','Answer: "Are you a doctor?" — "Yes, I ___."','am',NULL,'Resposta curta afirmativa: Yes, I am.','easy'),
  (cid,9,72,'gap_fill','Answer: "Is she from Canada?" — "No, she ___."','isn''t',NULL,'Resposta curta negativa: No, she isn''t.','easy'),
  (cid,9,73,'gap_fill','Answer: "Are they students?" — "Yes, they ___."','are',NULL,'Resposta curta afirmativa: Yes, they are.','easy'),
  (cid,9,74,'multiple_choice','Which is the correct short answer to "Is he your brother?"','Yes, he is.','["Yes, he do.","Yes, he is.","Yes, he does.","Yes, he be."]','Perguntas com TO BE respondem com TO BE, não com DO.','easy'),
  (cid,9,75,'gap_fill','Answer: "Am I late?" — "No, you ___."','aren''t',NULL,'Resposta curta: No, you aren''t (para "am I", a resposta usa "you").','easy'),
  (cid,9,76,'multiple_choice','Which is the correct short answer to "Are we ready?"','Yes, we are.','["Yes, we is.","Yes, we are.","Yes, we am.","Yes, we be."]','"We" sempre usa ARE.','easy'),
  (cid,9,77,'gap_fill','Answer: "Is it cold today?" — "Yes, it ___."','is',NULL,'Resposta curta: Yes, it is.','easy'),
  (cid,9,78,'gap_fill','Answer: "Are your parents at home?" — "No, they ___."','aren''t',NULL,'Resposta curta negativa: No, they aren''t.','easy'),
  (cid,9,79,'multiple_choice','Which short answer is correct for "Is this seat free?"','Yes, it is.','["Yes, this is.","Yes, it is.","Yes, seat is.","Yes, it be."]','Usamos "it" para substituir "this seat" na resposta.','easy'),
  (cid,9,80,'gap_fill','Answer: "Are you and your sister twins?" — "Yes, we ___."','are',NULL,'"You and your sister" = we, então a resposta usa ARE.','easy'),

  -- BLOCK 10: Perguntas com WH + TO BE
  (cid,10,81,'gap_fill','Complete: "___ is your name?" — "My name is Ana."','What',NULL,'Pergunta sobre identidade usa WHAT + IS.','easy'),
  (cid,10,82,'gap_fill','Complete: "___ are you from?" — "I am from Brazil."','Where',NULL,'Pergunta sobre origem usa WHERE + ARE.','easy'),
  (cid,10,83,'gap_fill','Complete: "___ is the meeting?" — "It is at 3 PM."','When',NULL,'Pergunta sobre horário usa WHEN + IS.','easy'),
  (cid,10,84,'multiple_choice','Which question word fits: "___ is your favorite color?"','What','["Who","What","Where","When"]','Perguntamos sobre uma coisa (cor) com WHAT.','easy'),
  (cid,10,85,'gap_fill','Complete: "___ is that man over there?" — "He is my teacher."','Who',NULL,'Pergunta sobre uma pessoa usa WHO.','easy'),
  (cid,10,86,'gap_fill','Complete: "___ are the keys?" — "They are on the table."','Where',NULL,'Pergunta sobre localização usa WHERE.','easy'),
  (cid,10,87,'multiple_choice','Which question is grammatically correct?','Why are you late?','["Why you are late?","Why are you late?","Why is you late?","Why you late?"]','Em perguntas com WH + TO BE, o verbo vem antes do sujeito.','medium'),
  (cid,10,88,'gap_fill','Complete: "___ old are you?" — "I am twenty years old."','How',NULL,'Idade se pergunta com HOW OLD.','easy'),
  (cid,10,89,'gap_fill','Complete: "___ is the weather like today?" — "It is sunny."','What',NULL,'"What is the weather like" pergunta sobre a condição do tempo.','medium'),
  (cid,10,90,'multiple_choice','Which question correctly asks about a person''s job?','What is your job?','["What are your job?","Who is your job?","What is your job?","Where is your job?"]','Perguntamos sobre profissão com WHAT + IS.','easy'),

  -- BLOCK 11: Adjetivos depois de TO BE (sentimentos e descrições)
  (cid,11,91,'gap_fill','Complete: "I ___ very happy today."','am',NULL,'TO BE + adjetivo descreve um sentimento: I am happy.','easy'),
  (cid,11,92,'gap_fill','Complete: "She ___ tired after work."','is',NULL,'She + IS + adjetivo.','easy'),
  (cid,11,93,'gap_fill','Complete: "We ___ excited about the trip."','are',NULL,'We + ARE + adjetivo.','easy'),
  (cid,11,94,'multiple_choice','Which sentence correctly describes a feeling?','I am nervous about the exam.','["I am nervous about the exam.","I is nervous about the exam.","I be nervous about the exam.","I are nervous about the exam."]','Primeira pessoa do singular sempre usa AM.','easy'),
  (cid,11,95,'gap_fill','Complete: "The children ___ hungry."','are',NULL,'"The children" (plural) + ARE.','easy'),
  (cid,11,96,'gap_fill','Complete: "This soup ___ delicious!"','is',NULL,'"This soup" (singular) + IS.','easy'),
  (cid,11,97,'multiple_choice','Which sentence is correct?','My brother is tall and friendly.','["My brother are tall and friendly.","My brother is tall and friendly.","My brother am tall and friendly.","My brother be tall and friendly."]','Sujeito singular (my brother) usa IS.','easy'),
  (cid,11,98,'gap_fill','Complete: "___ you afraid of spiders?"','Are',NULL,'Pergunta com "you" usa ARE.','easy'),
  (cid,11,99,'gap_fill','Complete: "It ___ not fair!"','is',NULL,'"It" + IS + NOT (negativa).','easy'),
  (cid,11,100,'multiple_choice','Which sentence correctly uses TO BE + adjective?','They are proud of their team.','["They is proud of their team.","They are proud of their team.","They am proud of their team.","They be proud of their team."]','"They" sempre usa ARE.','easy'),

  -- BLOCK 12: TO BE com profissões e nacionalidades
  (cid,12,101,'gap_fill','Complete: "He ___ an engineer."','is',NULL,'He + IS + profissão.','easy'),
  (cid,12,102,'gap_fill','Complete: "I ___ Brazilian."','am',NULL,'I + AM + nacionalidade.','easy'),
  (cid,12,103,'gap_fill','Complete: "My parents ___ both doctors."','are',NULL,'"My parents" (plural) + ARE.','easy'),
  (cid,12,104,'multiple_choice','Which sentence correctly states a nationality?','She is Japanese.','["She are Japanese.","She is Japanese.","She am Japanese.","She be Japanese."]','She + IS.','easy'),
  (cid,12,105,'gap_fill','Complete: "___ she a nurse?" — "Yes, she is."','Is',NULL,'Pergunta com "she" usa IS.','easy'),
  (cid,12,106,'gap_fill','Complete: "We ___ not from the same city."','are',NULL,'We + ARE + NOT.','easy'),
  (cid,12,107,'multiple_choice','Which question correctly asks about someone''s nationality?','Where are you from?','["Where you are from?","Where are you from?","Where is you from?","Where you from?"]','WHERE + ARE + you: ordem correta da pergunta.','medium'),
  (cid,12,108,'gap_fill','Complete: "My best friend ___ a lawyer."','is',NULL,'Sujeito singular + IS.','easy'),
  (cid,12,109,'gap_fill','Complete: "They ___ from Mexico."','are',NULL,'They + ARE + origem.','easy'),
  (cid,12,110,'multiple_choice','Which sentence is correct?','I am a student at this school.','["I is a student at this school.","I am a student at this school.","I are a student at this school.","I be a student at this school."]','I + AM.','easy'),

  -- BLOCK 13: TO BE com preposições (in, on, at, from)
  (cid,13,111,'gap_fill','Complete: "The keys ___ on the table."','are',NULL,'"The keys" (plural) + ARE + preposição de lugar.','easy'),
  (cid,13,112,'gap_fill','Complete: "My phone ___ in my bag."','is',NULL,'Sujeito singular + IS + IN.','easy'),
  (cid,13,113,'gap_fill','Complete: "We ___ at the airport now."','are',NULL,'We + ARE + AT.','easy'),
  (cid,13,114,'multiple_choice','Which sentence correctly describes a location?','The cat is under the bed.','["The cat are under the bed.","The cat is under the bed.","The cat am under the bed.","The cat be under the bed."]','"The cat" (singular) + IS.','easy'),
  (cid,13,115,'gap_fill','Complete: "I ___ from a small town."','am',NULL,'I + AM + FROM (origem).','easy'),
  (cid,13,116,'gap_fill','Complete: "The books ___ on the shelf."','are',NULL,'"The books" (plural) + ARE.','easy'),
  (cid,13,117,'multiple_choice','Which sentence correctly uses TO BE with a preposition of time?','The meeting is at 5 PM.','["The meeting are at 5 PM.","The meeting is at 5 PM.","The meeting am at 5 PM.","The meeting be at 5 PM."]','"The meeting" (singular) + IS.','easy'),
  (cid,13,118,'gap_fill','Complete: "___ you at home right now?"','Are',NULL,'Pergunta com "you" usa ARE.','easy'),
  (cid,13,119,'gap_fill','Complete: "Our office ___ near the train station."','is',NULL,'"Our office" (singular) + IS.','easy'),
  (cid,13,120,'multiple_choice','Which sentence is correct?','The children are in the garden.','["The children is in the garden.","The children are in the garden.","The children am in the garden.","The children be in the garden."]','"The children" (plural) + ARE.','easy')

  ON CONFLICT (content_id, block_number, exercise_number) DO NOTHING;
END $$;
