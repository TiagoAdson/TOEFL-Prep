-- ============================================================
-- SEED: Módulo 2 — Present Simple (A1)
-- 35 exercícios GERAIS + 35 exercícios TOEFL = 70 total
-- ============================================================
DO $$
DECLARE cid TEXT;
BEGIN
  SELECT id INTO cid FROM contents WHERE id = 'present-simple';
  IF cid IS NULL THEN RAISE EXCEPTION 'Módulo present-simple não encontrado'; END IF;

  INSERT INTO exercises (content_id, block_number, exercise_number, type, question, answer, options, explanation, difficulty) VALUES

  -- BLOCO 1 — Afirmativas (he/she/it + s)
  (cid,1,1,'gap_fill','She ___ to school every day.','goes',NULL,'He/She/It → verb + S','easy'),
  (cid,1,2,'gap_fill','He ___ in São Paulo.','lives',NULL,'He/She/It → verb + S','easy'),
  (cid,1,3,'gap_fill','It ___ a lot in the Amazon.','rains',NULL,'It → verb + S','easy'),
  (cid,1,4,'gap_fill','My mother ___ English at university.','teaches',NULL,'teach → teaches (ch+es)','easy'),
  (cid,1,5,'gap_fill','The dog ___ under the table.','sleeps',NULL,'3rd person singular + S','easy'),
  (cid,1,6,'gap_fill','He ___ his teeth every morning.','brushes',NULL,'brush → brushes (sh+es)','easy'),
  (cid,1,7,'gap_fill','She ___ her homework after dinner.','does',NULL,'do → does (irregular)','easy'),
  (cid,1,8,'multiple_choice','Which is correct for 3rd person singular?','She watches TV.','["She watch TV.","She watchs TV.","She watches TV.","She watche TV."]','watch → watches (ch+es)','easy'),
  (cid,1,9,'multiple_choice','Which sentence uses Present Simple correctly?','He goes to the gym twice a week.','["He go to the gym twice a week.","He goes to the gym twice a week.","He gos to the gym twice a week.","He going to the gym twice a week."]','3rd singular → goes','easy'),
  (cid,1,10,'gap_fill','Water ___ at 100°C.','boils',NULL,'Scientific fact = Present Simple','easy'),

  -- BLOCO 2 — Negativas e interrogativas
  (cid,2,11,'gap_fill','She ___ not like coffee.','does',NULL,'Negativa 3rd person: does not','easy'),
  (cid,2,12,'gap_fill','They ___ not work on Sundays.','do',NULL,'Negativa plural: do not','easy'),
  (cid,2,13,'gap_fill','___ he speak French?','Does',NULL,'Pergunta 3rd singular: Does','easy'),
  (cid,2,14,'gap_fill','___ they live nearby?','Do',NULL,'Pergunta plural/I/you: Do','easy'),
  (cid,2,15,'multiple_choice','Choose the correct negative form: "He plays football."','He doesn''t play football.','["He don''t play football.","He doesn''t plays football.","He doesn''t play football.","He not plays football."]','doesn''t + base verb (no -s)','medium'),
  (cid,2,16,'multiple_choice','Choose the correct question: "She works here."','Does she work here?','["Do she work here?","Does she works here?","Does she work here?","Is she work here?"]','Does + subject + base verb','medium'),
  (cid,2,17,'gap_fill','He ___ (not/understand) the lesson.','doesn''t understand',NULL,'doesn''t + base verb','medium'),
  (cid,2,18,'gap_fill','___ your brother ___ a car? (have)','Does / have',NULL,'Does + subject + base verb','medium'),
  (cid,2,19,'multiple_choice','Which question is grammatically correct?','Where do they study?','["Where does they study?","Where they study?","Where do they study?","Where do they studies?"]','do + they + base verb','medium'),
  (cid,2,20,'gap_fill','She ___ (not/eat) meat. She is vegetarian.','doesn''t eat',NULL,'doesn''t + base verb','medium'),

  -- BLOCO 3 — Adverbiais de frequência e regras
  (cid,3,21,'multiple_choice','Where does the frequency adverb go?','She always drinks coffee in the morning.','["She drinks always coffee in the morning.","Always she drinks coffee in the morning.","She always drinks coffee in the morning.","She drinks coffee always in the morning."]','Frequency adverb: before main verb, after "be"','medium'),
  (cid,3,22,'gap_fill','I ___ late for class. (never)','am never',NULL,'never goes after "be"','medium'),
  (cid,3,23,'gap_fill','He ___ plays tennis on weekends. (sometimes)','sometimes',NULL,'sometimes before main verb','medium'),
  (cid,3,24,'multiple_choice','The Present Simple is used to express:','A habitual action','["An action happening now","A habitual action","An action that happened yesterday","A future plan only"]','habits, routines, facts','medium'),
  (cid,3,25,'gap_fill','The sun ___ in the east.','rises',NULL,'Scientific/geographical fact = Present Simple','easy'),
  (cid,3,26,'multiple_choice','Identify the error: "She don''t like rainy days."','don''t → doesn''t','["She → He","don''t → doesn''t","like → likes","rainy → raining"]','3rd person singular → doesn''t','medium'),
  (cid,3,27,'gap_fill','The train ___ at 7am every day. (leave)','leaves',NULL,'3rd person + S, schedule = Present Simple','medium'),
  (cid,3,28,'multiple_choice','Which uses Present Simple for a schedule?','The flight departs at 9pm.','["The flight is departing at 9pm.","The flight departs at 9pm.","The flight will depart at 9pm.","The flight departed at 9pm."]','Timetables/schedules use Present Simple','medium'),
  (cid,3,29,'gap_fill','My parents ___ (not/speak) English at home.','don''t speak',NULL,'don''t + base verb (plural)','easy'),
  (cid,3,30,'multiple_choice','He ___ his phone every night. (check)','checks','["check","checks","is checking","checked"]','3rd person singular → checks','easy'),

  -- BLOCO 4 — Mistos avançados
  (cid,4,31,'gap_fill','What time ___ the bank ___ ? (open)','does / open',NULL,'Does + subject + base verb','medium'),
  (cid,4,32,'multiple_choice','Which sentence is in the Present Simple?','Scientists study the effects of climate change.','["Scientists are studying the effects.","Scientists studied the effects.","Scientists study the effects of climate change.","Scientists will study the effects."]','habitual/general truth = Present Simple','medium'),
  (cid,4,33,'gap_fill','Oil ___ on water. (float)','floats',NULL,'Scientific fact; 3rd singular','easy'),
  (cid,4,34,'multiple_choice','"Do you understand?" — The correct short answer is:','Yes, I do.','["Yes, I understand.","Yes, I does.","Yes, I do.","Yes, I am."]','short answer with auxiliary do','medium'),
  (cid,4,35,'gap_fill','The manager always ___ the meetings on Monday. (run)','runs',NULL,'3rd person singular: runs','medium'),

  -- BLOCO 5 — TOEFL Academic context
  (cid,5,36,'gap_fill','[TOEFL] "The study ___ that exercise improves memory." (show)','shows',NULL,'3rd person singular academic context','medium'),
  (cid,5,37,'gap_fill','[TOEFL] "Researchers ___ data from over 500 participants." (collect)','collect',NULL,'plural subject → base verb','medium'),
  (cid,5,38,'gap_fill','[TOEFL] "The hypothesis ___ that language acquisition ___ during childhood." (suggest/peak)','suggests / peaks',NULL,'3rd person both verbs','hard'),
  (cid,5,39,'multiple_choice','[TOEFL] "The brain ___ new neural pathways throughout life."','forms','["form","forms","is forming","formed"]','3rd singular: forms; scientific fact','medium'),
  (cid,5,40,'multiple_choice','[TOEFL] Which sentence expresses a general scientific truth?','Water molecules consist of two hydrogen atoms and one oxygen atom.','["Water molecules are consisting of two hydrogen atoms.","Water molecules consisted of two hydrogen atoms.","Water molecules consist of two hydrogen atoms and one oxygen atom.","Water molecules will consist of two hydrogen atoms."]','General truth → Present Simple','medium'),

  -- BLOCO 6 — TOEFL Listening
  (cid,6,41,'multiple_choice','[TOEFL Listening] Professor: "The Amazon River flows into the Atlantic Ocean." This is:','A geographical fact stated in Present Simple.','["A past event","A current observation","A geographical fact stated in Present Simple.","A future plan"]','general truth/fact = Present Simple','easy'),
  (cid,6,42,'gap_fill','[TOEFL Listening] "Economic growth ___ on multiple factors." (depend)','depends',NULL,'3rd singular: depends','medium'),
  (cid,6,43,'multiple_choice','[TOEFL] "The professor doesn''t accept late submissions." means:','It is the professor''s permanent policy.','["The professor has never accepted late work.","The professor is not accepting work today.","It is the professor''s permanent policy.","The professor sometimes accepts late work."]','Present Simple = rule/policy','medium'),
  (cid,6,44,'gap_fill','[TOEFL] "Carbon dioxide ___ heat in the atmosphere." (trap)','traps',NULL,'Scientific process = Present Simple','medium'),
  (cid,6,45,'multiple_choice','[TOEFL] Choose the correct academic form: "The researcher ___ the experiment twice a week."','conducts','["conduct","is conducting","conducts","conducted"]','3rd singular, routine = Present Simple','medium'),

  -- BLOCO 7 — TOEFL Speaking Production
  (cid,7,46,'production','[TOEFL Speaking — 45s] Describe your daily routine using Present Simple at least 5 times. Include: when you wake up, what you eat, and what you study.','',NULL,'Use: I wake up, I eat, I study, I go, I come back','medium'),
  (cid,7,47,'production','[TOEFL Speaking — 45s] "Do you think universities require too many general courses?" Give your opinion using Present Simple verbs: require, believe, think, suggest, help.','',NULL,'Use: I believe universities require... This helps students...','medium'),
  (cid,7,48,'production','[TOEFL Speaking — 45s] Describe what a scientist does in their job. Use: conducts, analyzes, publishes, collaborates, investigates.','',NULL,'A scientist conducts research, analyzes data, publishes findings...','medium'),
  (cid,7,49,'production','[TOEFL Speaking — 45s] Explain why regular exercise matters. Use Present Simple with: improves, reduces, helps, strengthens, increases.','',NULL,'Exercise improves health, reduces stress, helps the body...','hard'),
  (cid,7,50,'production','[TOEFL Speaking — 45s] Describe how the internet changes education today. Use: allows, provides, enables, connects, transforms.','',NULL,'The internet allows students to access... It provides...','hard'),

  -- BLOCO 8 — TOEFL Writing Production
  (cid,8,51,'production','[TOEFL Writing] Write 4 academic sentences about what the Present Simple expresses in English. Use examples from science.','',NULL,'The Present Simple expresses... Scientists use it when... For instance, "Water boils at..."','hard'),
  (cid,8,52,'production','[TOEFL Writing] Rewrite these incorrect sentences: "She don''t study medicine. He go to class every day. The experiment show interesting results."','',NULL,'doesn''t study / goes / shows — all need 3rd singular -s','medium'),
  (cid,8,53,'production','[TOEFL Writing] Write a paragraph (5+ sentences) about a scientific fact you know, using Present Simple throughout.','',NULL,'Photosynthesis converts... Plants absorb... Sunlight provides...','hard'),
  (cid,8,54,'production','[TOEFL Writing — Error Correction] Fix: "A university education prepare students for work. It also help them develop critical thinking. Research show that graduates earn more."','',NULL,'prepares / helps / shows — 3rd singular agreement','medium'),
  (cid,8,55,'production','[TOEFL Writing] "Social media influences academic performance." Write 3 arguments for and 3 against this claim using Present Simple.','',NULL,'Social media distracts... However, it also connects... Students spend...','hard'),

  -- BLOCO 9 — TOEFL Advanced gap fill
  (cid,9,56,'multiple_choice','[TOEFL] "The number of students who ___ online courses ___ every year."','takes / increases','["take / increase","takes / increases","take / increases","takes / increase"]','singular "number" → takes; year-on-year fact → increases','hard'),
  (cid,9,57,'gap_fill','[TOEFL] "According to the study, bilingual children ___ cognitive advantages." (demonstrate)','demonstrate',NULL,'plural subject → base verb','hard'),
  (cid,9,58,'multiple_choice','[TOEFL] "The committee ___ on new curriculum policies every semester."','meets','["meet","meets","is meeting","met"]','collective noun as unit → singular → meets','hard'),
  (cid,9,59,'gap_fill','[TOEFL] "Neither the professor nor the students ___ aware of the change." (be)','are',NULL,'neither...nor → agrees with nearest (students=plural)','hard'),
  (cid,9,60,'multiple_choice','[TOEFL] In academic writing, Present Simple is preferred when:','Describing permanent truths or research findings.','["Narrating past events","Describing temporary actions","Describing permanent truths or research findings.","Talking about future plans"]','Academic writing uses Present Simple for facts and findings','hard'),
  (cid,9,61,'gap_fill','[TOEFL] "Each of the experiments ___ a unique outcome." (produce)','produces',NULL,'each → singular → produces','hard'),
  (cid,9,62,'multiple_choice','[TOEFL] "Statistics show that poverty ___ educational outcomes."','affects','["affect","affects","is affecting","affected"]','3rd singular: affects; general fact','hard'),
  (cid,9,63,'gap_fill','[TOEFL] "The policy ___ students who fail to meet attendance requirements." (affect)','affects',NULL,'3rd singular: affects','hard'),
  (cid,9,64,'multiple_choice','[TOEFL] "Gravity ___ all objects toward the center of the Earth."','pulls','["pull","pulls","is pulling","pulled"]','Scientific law = Present Simple; 3rd singular','hard'),
  (cid,9,65,'gap_fill','[TOEFL] "The data ___ that intervention ___ outcomes significantly." (indicate/improve)','indicate / improve',NULL,'plural data → indicate; plural outcomes → improve','hard'),

  -- BLOCO 10 — TOEFL Final Production
  (cid,10,66,'production','[TOEFL Speaking Task 1 — 45s] "Do you agree that a person''s daily habits determine their success?" Use Present Simple throughout your answer.','',NULL,'Habits determine... A person who studies regularly achieves... Success requires...','hard'),
  (cid,10,67,'production','[TOEFL Speaking Task 2 — 45s] A university announcement states: "The library closes two hours earlier on Fridays." Express your opinion on this policy.','',NULL,'The library closes... This affects students who... Many students prefer...','hard'),
  (cid,10,68,'production','[TOEFL Writing — 150 words] Write about the role of technology in modern classrooms. Use Present Simple at least 8 times.','',NULL,'Technology transforms... Teachers use... Students access... It enables...','hard'),
  (cid,10,69,'production','[TOEFL Writing — Error Correction] "A good student attend classes regularly. He also complete all assignments on time. Research suggest that attendance correlate with success."','',NULL,'attends / completes / suggests / correlates — all 3rd singular','medium'),
  (cid,10,70,'production','[TOEFL Academic Synthesis] Explain why academic English relies heavily on the Present Simple tense. Give 3 specific reasons with examples.','',NULL,'Academic English uses Present Simple to: (1) state facts, (2) describe processes, (3) present findings','hard')

  ON CONFLICT (content_id, block_number, exercise_number) DO NOTHING;
END $$;
