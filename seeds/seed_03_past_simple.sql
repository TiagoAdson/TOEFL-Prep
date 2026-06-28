-- ============================================================
-- SEED: Módulo 3 — Past Simple (A1)
-- ============================================================
DO $$
DECLARE cid TEXT;
BEGIN
  SELECT id INTO cid FROM contents WHERE id = 'past-simple';
  IF cid IS NULL THEN RAISE EXCEPTION 'Módulo past-simple não encontrado'; END IF;

  INSERT INTO exercises (content_id, block_number, exercise_number, type, question, answer, options, explanation, difficulty) VALUES

  -- BLOCK 1: was/were
  (cid,1,1,'gap_fill','She ___ very tired after the long flight.','was',NULL,'Use "was" with singular subjects (I, he, she, it) in the past.','easy'),
  (cid,1,2,'gap_fill','They ___ happy about the test results.','were',NULL,'Use "were" with plural subjects (we, you, they) in the past.','easy'),
  (cid,1,3,'multiple_choice','Choose the correct form: "The students ___ nervous before the exam."','were','["was","were","be","is"]','Use "were" with plural subjects like "the students" in past tense.','easy'),
  (cid,1,4,'gap_fill','I ___ not at home yesterday evening.','was',NULL,'"Was" is the past tense of "be" for first-person singular (I).','easy'),
  (cid,1,5,'gap_fill','___ you at the library last night?','Were',NULL,'Questions with "were" invert subject and verb: Were you...?','easy'),
  (cid,1,6,'multiple_choice','Which sentence is correct?','There were many people at the conference.','["There was many people at the conference.","There were many people at the conference.","There is many people at the conference.","There be many people at the conference."]','"Many people" is plural, so use "were".','medium'),
  (cid,1,7,'gap_fill','The weather ___ cold and rainy last week.','was',NULL,'"Weather" is an uncountable singular noun, so use "was".','easy'),

  -- BLOCK 2: regular -ed verbs
  (cid,2,8,'gap_fill','She ___ (study) for the TOEFL exam all weekend.','studied',NULL,'Verbs ending in consonant + y: change y to i and add -ed (study→studied).','easy'),
  (cid,2,9,'gap_fill','They ___ (walk) to the university every day last semester.','walked',NULL,'Add -ed to most regular verbs to form the past simple (walk→walked).','easy'),
  (cid,2,10,'multiple_choice','What is the past simple of "stop"?','stopped','["stoped","stopped","stopd","stoping"]','Double the final consonant before -ed when the verb ends in CVC pattern (stop→stopped).','medium'),
  (cid,2,11,'gap_fill','He ___ (watch) an educational documentary about climate change.','watched',NULL,'Add -ed to verbs ending in -ch: watch→watched.','easy'),
  (cid,2,12,'gap_fill','We ___ (plan) our research project carefully.','planned',NULL,'Double the final consonant: plan→planned (CVC pattern).','medium'),
  (cid,2,13,'multiple_choice','Choose the correct past form: "The professor ___ the lecture early."','finished','["finish","finishs","finished","finishing"]','Regular verbs add -ed: finish→finished.','easy'),
  (cid,2,14,'gap_fill','The students ___ (discuss) the article in groups.','discussed',NULL,'Double final consonant when verb ends in CVC with stress on last syllable.','medium'),

  -- BLOCK 3: irregular verbs - go/have/come
  (cid,3,15,'gap_fill','She ___ (go) to the library to find research materials.','went',NULL,'Irregular: go→went.','easy'),
  (cid,3,16,'gap_fill','I ___ (have) a very productive study session yesterday.','had',NULL,'Irregular: have→had.','easy'),
  (cid,3,17,'multiple_choice','What is the past simple of "come"?','came','["comed","came","come","comes"]','Irregular verb: come→came.','easy'),
  (cid,3,18,'gap_fill','They ___ (come) to class late because of the traffic.','came',NULL,'Irregular: come→came.','easy'),
  (cid,3,19,'gap_fill','The scientist ___ (make) an important discovery last year.','made',NULL,'Irregular: make→made.','medium'),
  (cid,3,20,'multiple_choice','Choose the correct sentence.','She went to the conference in Paris last month.','["She go to the conference in Paris last month.","She went to the conference in Paris last month.","She goed to the conference in Paris last month.","She goes to the conference in Paris last month."]','Irregular verb: go→went.','easy'),
  (cid,3,21,'gap_fill','The researchers ___ (find) new evidence to support their theory.','found',NULL,'Irregular: find→found.','medium'),

  -- BLOCK 4: more irregular verbs
  (cid,4,22,'gap_fill','He ___ (write) a detailed report about his findings.','wrote',NULL,'Irregular: write→wrote.','medium'),
  (cid,4,23,'gap_fill','They ___ (take) detailed notes during the lecture.','took',NULL,'Irregular: take→took.','medium'),
  (cid,4,24,'multiple_choice','What is the past simple of "think"?','thought','["thinked","thought","think","thinks"]','Irregular verb: think→thought.','medium'),
  (cid,4,25,'gap_fill','The professor ___ (give) us a very difficult assignment.','gave',NULL,'Irregular: give→gave.','medium'),
  (cid,4,26,'gap_fill','We ___ (see) a documentary about ocean pollution.','saw',NULL,'Irregular: see→saw.','easy'),
  (cid,4,27,'multiple_choice','Choose the correct past form: "The team ___ their proposal to the committee."','presented','["present","presents","presented","presenting"]','Regular verb: present→presented.','easy'),
  (cid,4,28,'gap_fill','She ___ (know) the answer immediately.','knew',NULL,'Irregular: know→knew.','medium'),

  -- BLOCK 5: negatives with didn't
  (cid,5,29,'gap_fill','She ___ (not/understand) the concept at first.','didn''t understand',NULL,'Use "didn''t" + base verb for negatives in past simple.','easy'),
  (cid,5,30,'gap_fill','They ___ (not/finish) the project on time.','didn''t finish',NULL,'Negative past simple: didn''t + base form of verb.','easy'),
  (cid,5,31,'multiple_choice','Which negative sentence is correct?','He didn''t go to the seminar.','["He didn''t went to the seminar.","He not go to the seminar.","He didn''t go to the seminar.","He not went to the seminar."]','Past negative: didn''t + base verb (not past verb form).','medium'),
  (cid,5,32,'gap_fill','I ___ (not/sleep) well the night before the exam.','didn''t sleep',NULL,'Use "didn''t" + base verb, not past verb.','easy'),
  (cid,5,33,'gap_fill','The committee ___ (not/approve) the initial proposal.','didn''t approve',NULL,'Negative past simple uses didn''t + base form.','medium'),
  (cid,5,34,'multiple_choice','Complete: "The students ___ the reading assignment because they had too much homework."','didn''t complete','["not completed","didn''t completed","didn''t complete","not complete"]','Past negative: didn''t + base verb form.','medium'),
  (cid,5,35,'gap_fill','He ___ (not/attend) the conference due to illness.','didn''t attend',NULL,'Negative form: subject + didn''t + base verb.','easy'),

  -- BLOCK 6: questions with did
  (cid,6,36,'gap_fill','___ she (finish) her thesis last year?','Did she finish',NULL,'Past simple questions: Did + subject + base verb?','easy'),
  (cid,6,37,'gap_fill','___ they (understand) the professor''s explanation?','Did they understand',NULL,'Question form in past simple: Did + subject + base verb.','easy'),
  (cid,6,38,'multiple_choice','Which question is correct?','Did the researchers find any new evidence?','["Did the researchers found any new evidence?","Did the researchers find any new evidence?","Do the researchers find any new evidence?","Did the researchers finds any new evidence?"]','Past simple question: Did + subject + base verb (not past).','medium'),
  (cid,6,39,'gap_fill','___ (you/study) abroad during your undergraduate program?','Did you study',NULL,'Yes/No questions in past: Did + subject + base verb?','easy'),
  (cid,6,40,'gap_fill','Where ___ (she/go) after the seminar?','did she go',NULL,'Wh-questions in past: Wh-word + did + subject + base verb?','medium'),
  (cid,6,41,'multiple_choice','Choose the correct question: "_____ the experiment produce the expected results?"','Did','["Was","Did","Do","Had"]','Use "did" to form past simple questions with action verbs.','medium'),
  (cid,6,42,'gap_fill','How long ___ (the lecture/last)?','did the lecture last',NULL,'Wh-question past simple: How long + did + subject + base verb?','medium'),

  -- BLOCK 7: time expressions - yesterday/last/ago
  (cid,7,43,'multiple_choice','Which time expression goes with Past Simple?','last semester','["since Monday","for three years","last semester","recently (with present perfect)"]','"Last semester" is a finished time period — use past simple.','easy'),
  (cid,7,44,'gap_fill','She submitted her application three weeks ___.','ago',NULL,'"Ago" follows a time period and indicates past distance from now.','easy'),
  (cid,7,45,'multiple_choice','Choose the correct sentence with "yesterday".','We discussed the results yesterday.','["We have discussed the results yesterday.","We discussed the results yesterday.","We discuss the results yesterday.","We are discussing the results yesterday."]','"Yesterday" is a finished past time, so use past simple.','easy'),
  (cid,7,46,'gap_fill','The study was published ___ 2019.','in',NULL,'Use "in" with years in past time expressions.','easy'),
  (cid,7,47,'gap_fill','He graduated ___ night.','last',NULL,'"Last night" is a past simple time expression.','easy'),
  (cid,7,48,'multiple_choice','Which sentence is grammatically correct?','The professor retired two years ago.','["The professor has retired two years ago.","The professor retired two years ago.","The professor retires two years ago.","The professor retiring two years ago."]','Use past simple with "ago".','medium'),
  (cid,7,49,'gap_fill','___ morning, the team presented their findings to the board.','Yesterday',NULL,'"Yesterday morning" signals a specific finished past time.','easy'),

  -- BLOCK 8: mixed past simple review
  (cid,8,50,'gap_fill','The researchers ___ (collect) data for six months before publishing.','collected',NULL,'Regular past simple: collect→collected.','easy'),
  (cid,8,51,'multiple_choice','Choose the correct form: "The government ___ a new education policy in 2022."','introduced','["introduce","introduced","has introduced","introducing"]','Past simple with a specific past year: use simple past.','easy'),
  (cid,8,52,'gap_fill','Why ___ (she/choose) that particular topic for her dissertation?','did she choose',NULL,'Past question with irregular verb: did + subject + base verb.','medium'),
  (cid,8,53,'gap_fill','The team ___ (not/expect) such positive results.','didn''t expect',NULL,'Past negative: didn''t + base verb.','medium'),
  (cid,8,54,'multiple_choice','Identify the error: "He didn''t wrote the report yesterday."','wrote should be write','["He is correct","didn''t should be don''t","wrote should be write","yesterday should be removed"]','After "didn''t", always use the base form of the verb, not the past form.','medium'),
  (cid,8,55,'gap_fill','She ___ (become) a professor after completing her doctorate.','became',NULL,'Irregular: become→became.','medium'),
  (cid,8,56,'gap_fill','The experiment ___ (take) three hours to complete.','took',NULL,'Irregular: take→took.','medium'),

  -- BLOCK 9: TOEFL academic contexts - gap_fill & multiple_choice
  (cid,9,57,'multiple_choice','[TOEFL Reading] The passage states that Darwin ___ his theory over many years of observation.','developed','["develop","developed","has developed","was developing"]','In a TOEFL reading passage describing past events, use past simple.','medium'),
  (cid,9,58,'gap_fill','[TOEFL Reading] Scientists ___ (discover) the structure of DNA in 1953.','discovered',NULL,'Past simple is used for completed scientific discoveries with a specific date.','medium'),
  (cid,9,59,'multiple_choice','[TOEFL Listening] The lecturer explained that the Roman Empire ___ in 476 AD.','fell','["falls","has fallen","fell","was fallen"]','Past simple with a specific historical date.','medium'),
  (cid,9,60,'gap_fill','[TOEFL Reading] The researchers ___ (conduct) the study over a five-year period ending in 2018.','conducted',NULL,'Completed action in the past: use past simple.','medium'),
  (cid,9,61,'multiple_choice','[TOEFL Listening] According to the professor, the experiment ___ unexpected results.','yielded','["yield","yields","yielded","has yielded"]','Past simple for completed academic events.','hard'),
  (cid,9,62,'gap_fill','[TOEFL Reading] The ancient civilization ___ (build) elaborate irrigation systems.','built',NULL,'Irregular: build→built. Used for historical past facts.','medium'),
  (cid,9,63,'gap_fill','[TOEFL Listening] The speaker mentioned that early astronomers ___ (believe) the sun revolved around the Earth.','believed',NULL,'Past simple for past beliefs/states: believe→believed.','hard'),

  -- BLOCK 10: TOEFL production tasks
  (cid,10,64,'multiple_choice','[TOEFL Reading] Which sentence uses Past Simple correctly in an academic context?','The study revealed a significant correlation between sleep and memory.','["The study has revealed a significant correlation yesterday.","The study revealed a significant correlation between sleep and memory.","The study is revealing a significant correlation between sleep and memory.","The study reveals a significant correlation last year."]','Past simple is appropriate for completed studies with past-time context.','hard'),
  (cid,10,65,'gap_fill','[TOEFL Reading] The author ___ (argue) that urbanization ___ (lead) to increased social inequality in the 20th century.','argued / led',NULL,'Both verbs describe completed past academic arguments.','hard'),
  (cid,10,66,'multiple_choice','[TOEFL Speaking — 45s] You are asked: "Describe a time when you overcame a learning challenge." Which opening is most appropriate?','Last year, I faced a serious challenge when I struggled to understand statistical methods in my research.','["I am always struggling with statistics.","Last year, I faced a serious challenge when I struggled to understand statistical methods in my research.","Statistics is very difficult for everyone.","I will struggle with statistics in the past."]','Past simple is needed to narrate a specific past experience.','hard'),
  (cid,10,67,'production','[TOEFL Speaking — 45s] Describe a significant event in your academic life using at least five past simple verbs. Include: what happened, when it occurred, who was involved, and what the outcome was.','',NULL,'Practice narrating past events using past simple: went, studied, took, found, became, etc.','hard'),
  (cid,10,68,'production','[TOEFL Writing] Write 3-4 sentences summarizing what a historical figure did to contribute to their field. Use past simple verbs and include at least one time expression (ago, in [year], last century).','',NULL,'Academic writing often uses past simple to describe historical achievements and contributions.','hard'),
  (cid,10,69,'multiple_choice','[TOEFL Writing] Which sentence best fits an academic essay about the Industrial Revolution?','The invention of the steam engine transformed manufacturing processes in the 18th century.','["The invention of the steam engine has transformed manufacturing processes in the 18th century.","The invention of the steam engine transforms manufacturing processes in the 18th century.","The invention of the steam engine transformed manufacturing processes in the 18th century.","The invention of the steam engine is transforming manufacturing processes in the 18th century."]','Past simple + specific time period = academic past simple.','hard'),
  (cid,10,70,'production','[TOEFL Writing] Write a short paragraph (4-5 sentences) describing the methodology of an imaginary research study conducted last year. Use past simple throughout and include time expressions.','',NULL,'Academic methodology sections often use past simple to describe what researchers did.','hard')

  ON CONFLICT (content_id, block_number, exercise_number) DO NOTHING;
END $$;
