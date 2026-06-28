-- ============================================================
-- SEED: Módulo 4 — Present Continuous (A1)
-- ============================================================
DO $$
DECLARE cid TEXT;
BEGIN
  SELECT id INTO cid FROM contents WHERE id = 'present-continuous';
  IF cid IS NULL THEN RAISE EXCEPTION 'Módulo present-continuous não encontrado'; END IF;

  INSERT INTO exercises (content_id, block_number, exercise_number, type, question, answer, options, explanation, difficulty) VALUES

  -- BLOCK 1: am/is/are + -ing formation
  (cid,1,1,'gap_fill','She ___ (study) for her TOEFL exam right now.','is studying',NULL,'Present continuous: subject + is/am/are + verb-ing. She → is.','easy'),
  (cid,1,2,'gap_fill','They ___ (discuss) the research findings at the moment.','are discussing',NULL,'They → are + -ing form.','easy'),
  (cid,1,3,'multiple_choice','Choose the correct form: "I ___ (write) my thesis this semester."','am writing','["is writing","are writing","am writing","writing"]','I → am + -ing.','easy'),
  (cid,1,4,'gap_fill','The professor ___ (explain) a complex theory to the class.','is explaining',NULL,'Singular third person (the professor) → is + -ing.','easy'),
  (cid,1,5,'gap_fill','We ___ (work) on a group project this week.','are working',NULL,'We → are + -ing.','easy'),
  (cid,1,6,'multiple_choice','Which sentence is correct?','The scientists are conducting an experiment.','["The scientists is conducting an experiment.","The scientists are conducting an experiment.","The scientists am conducting an experiment.","The scientists conducting an experiment."]','Plural subject (scientists) requires "are".','easy'),
  (cid,1,7,'gap_fill','He ___ (read) an article about climate change.','is reading',NULL,'He → is + -ing.','easy'),

  -- BLOCK 2: spelling rules for -ing
  (cid,2,8,'gap_fill','The child is ___ (run) across the field.','running',NULL,'CVC pattern: double the final consonant before -ing (run→running).','medium'),
  (cid,2,9,'multiple_choice','What is the -ing form of "write"?','writing','["writeing","writing","writting","writng"]','Drop the silent -e before adding -ing (write→writing).','medium'),
  (cid,2,10,'gap_fill','She is ___ (make) coffee while she reviews her notes.','making',NULL,'Drop silent -e: make→making.','medium'),
  (cid,2,11,'multiple_choice','Choose the correct -ing form of "sit".','sitting','["siting","sitting","siting","siting"]','CVC pattern with stressed final syllable: double the t (sit→sitting).','medium'),
  (cid,2,12,'gap_fill','They are ___ (plan) a field trip to the research center.','planning',NULL,'CVC pattern: double final n (plan→planning).','medium'),
  (cid,2,13,'multiple_choice','What is the -ing form of "begin"?','beginning','["begining","beginning","begginning","beginng"]','Stress on final syllable + CVC: double final n (begin→beginning).','hard'),
  (cid,2,14,'gap_fill','He is ___ (study) linguistics at the university.','studying',NULL,'Verbs ending in -y: simply add -ing (study→studying).','easy'),

  -- BLOCK 3: NOT with stative verbs - know/like/love
  (cid,3,15,'multiple_choice','Which sentence is correct?','I know the answer to that question.','["I am knowing the answer to that question.","I know the answer to that question.","I am know the answer to that question.","I knowing the answer."]','"Know" is a stative verb and cannot be used in continuous form.','medium'),
  (cid,3,16,'gap_fill','She ___ (love) learning new languages. (Use correct tense)','loves',NULL,'"Love" is a stative verb expressing a state, not an action. Use simple present.','medium'),
  (cid,3,17,'multiple_choice','Identify the error: "He is wanting to improve his score."','is wanting should be wants','["He is correct","is should be are","is wanting should be wants","improve should be improving"]','"Want" is a stative verb — it cannot be used in continuous form.','medium'),
  (cid,3,18,'gap_fill','They ___ (understand) the concept now. (Use correct tense)','understand',NULL,'"Understand" is a stative verb. Use simple present form.','medium'),
  (cid,3,19,'multiple_choice','Which verb CANNOT normally be used in continuous form?','believe','["run","believe","read","work"]','"Believe" is a stative verb expressing a mental state.','hard'),
  (cid,3,20,'gap_fill','I ___ (need) more time to finish the essay. (Use correct tense)','need',NULL,'"Need" is a stative verb — use simple present, not continuous.','medium'),
  (cid,3,21,'multiple_choice','Choose the correct sentence.','She seems very confident about the presentation.','["She is seeming very confident about the presentation.","She seem very confident about the presentation.","She seems very confident about the presentation.","She is seem very confident about the presentation."]','"Seem" is a stative verb — use simple present.','hard'),

  -- BLOCK 4: more stative verbs - want/need/believe/understand
  (cid,4,22,'multiple_choice','Which sentence uses "want" correctly?','He wants to study abroad next year.','["He is wanting to study abroad next year.","He wants to study abroad next year.","He wanting to study abroad next year.","He want studying abroad next year."]','"Want" is stative — use simple present.','medium'),
  (cid,4,23,'gap_fill','The professor ___ (believe) that critical thinking is essential. (Use correct tense)','believes',NULL,'"Believe" is a stative verb. Use simple present.','medium'),
  (cid,4,24,'multiple_choice','Which stative verb is used INCORRECTLY?','We are knowing the professor well.','["She likes classical music.","We are knowing the professor well.","I need more practice.","He prefers online learning."]','"Know" is stative and cannot take -ing form.','hard'),
  (cid,4,25,'gap_fill','I ___ (not/understand) why the results were so different. (Use correct tense)','don''t understand',NULL,'"Understand" is stative. Use simple present negative.','medium'),
  (cid,4,26,'multiple_choice','Choose the correct form: "The researcher ___ that her hypothesis is correct."','believes','["is believing","believing","believes","has believing"]','"Believe" is stative — use simple present.','medium'),
  (cid,4,27,'gap_fill','She ___ (hate) making careless mistakes in her writing. (Use correct tense)','hates',NULL,'"Hate" is a stative verb — use simple present.','medium'),
  (cid,4,28,'multiple_choice','Which sentence is grammatically correct?','I think the experiment needs to be repeated.','["I am thinking the experiment is needing to be repeated.","I think the experiment needs to be repeated.","I thinking the experiment needs to be repeated.","I am think the experiment is needing."]','"Think" and "need" in this context are stative — use simple present.','hard'),

  -- BLOCK 5: contrast with Present Simple - actions vs. states
  (cid,5,29,'multiple_choice','Choose the correct sentence: "Every day she ___, but right now she ___ a novel."','reads / is reading','["reads / reads","is reading / is reading","reads / is reading","is reading / reads"]','Habitual actions use present simple; actions happening now use present continuous.','medium'),
  (cid,5,30,'gap_fill','He usually ___ (take) the bus, but today he ___ (drive) to campus.','takes / is driving',NULL,'Habits use present simple; temporary current actions use present continuous.','medium'),
  (cid,5,31,'multiple_choice','Which sentence describes a HABIT?','She checks her email every morning.','["She is checking her email right now.","She checks her email every morning.","She is working on a new project this month.","They are studying for exams this week."]',' "Every morning" signals a habitual action → present simple.','medium'),
  (cid,5,32,'gap_fill','Water ___ (boil) at 100°C. (permanent fact)','boils',NULL,'Scientific facts and permanent truths use present simple, not continuous.','easy'),
  (cid,5,33,'multiple_choice','Choose the correct form: "This semester, the department ___ a new curriculum."','is piloting','["pilots","is piloting","pilot","has piloted"]','"This semester" signals a temporary situation — use present continuous.','medium'),
  (cid,5,34,'gap_fill','The library ___ (close) at 10 p.m. every night. (routine)','closes',NULL,'Fixed schedules and routines use present simple.','easy'),
  (cid,5,35,'multiple_choice','Identify the sentence in Present Continuous used for a temporary situation.','She is living in the dormitory while her apartment is being renovated.','["She lives in a small apartment near the campus.","Water contains hydrogen and oxygen.","She is living in the dormitory while her apartment is being renovated.","The sun rises in the east."]','"While...renovated" signals a temporary situation → present continuous.','medium'),

  -- BLOCK 6: present continuous for future arrangements
  (cid,6,36,'gap_fill','We ___ (meet) the research team next Monday. (arranged plan)','are meeting',NULL,'Present continuous can describe fixed future arrangements.','medium'),
  (cid,6,37,'multiple_choice','Which sentence uses present continuous for a future arrangement?','She is presenting her paper at the conference next week.','["She presents her paper at the conference next week.","She is presenting her paper at the conference next week.","She will present her paper at the conference next week.","She presented her paper at the conference next week."]','Present continuous with future time = arranged plans.','medium'),
  (cid,6,38,'gap_fill','They ___ (fly) to London for the academic symposium tomorrow.','are flying',NULL,'Arranged future event: are + -ing + future time marker.','medium'),
  (cid,6,39,'multiple_choice','Choose the best response to: "What are you doing this evening?"','I''m attending a guest lecture on neuroscience.','["I attend a guest lecture on neuroscience.","I''m attending a guest lecture on neuroscience.","I attended a guest lecture on neuroscience.","I will attending a guest lecture on neuroscience."]','Present continuous answers "what are you doing" — ongoing or arranged activity.','easy'),
  (cid,6,40,'gap_fill','The committee ___ (vote) on the proposal next Friday.','is voting',NULL,'Arranged future: is/are + -ing + future time expression.','medium'),
  (cid,6,41,'multiple_choice','Which time expression typically signals a future arrangement with present continuous?','next Thursday','["yesterday","last week","right now","next Thursday"]','"Next Thursday" is a future time — use present continuous for arrangements.','easy'),
  (cid,6,42,'gap_fill','I ___ (have) a meeting with my advisor at 3 p.m. today.','am having',NULL,'"Have" can be used in continuous when referring to an event/appointment, not a state.','hard'),

  -- BLOCK 7: negatives and questions in present continuous
  (cid,7,43,'gap_fill','She ___ (not/listen) to the lecture right now.','isn''t listening',NULL,'Negative present continuous: is/am/are + not + -ing.','easy'),
  (cid,7,44,'multiple_choice','Which negative sentence is correct?','They aren''t participating in the debate.','["They not are participating in the debate.","They aren''t participating in the debate.","They don''t participating in the debate.","They are not participate in the debate."]','Negative: are + not + -ing (or aren''t + -ing).','easy'),
  (cid,7,45,'gap_fill','___ the professor ___ (explain) the assignment right now?','Is / explaining',NULL,'Present continuous question: Is/Am/Are + subject + -ing?','easy'),
  (cid,7,46,'multiple_choice','Form the question: "What ___ the students ___ ?"','are / doing','["do / doing","are / doing","is / doing","am / doing"]','Question form: What + are + subject + -ing?','easy'),
  (cid,7,47,'gap_fill','Why ___ (you/not/pay) attention to the lecture?','aren''t you paying',NULL,'Negative question: Aren''t + subject + -ing?','medium'),
  (cid,7,48,'multiple_choice','Which question is correctly formed?','Is she writing her conclusion right now?','["Does she writing her conclusion right now?","Is she write her conclusion right now?","Is she writing her conclusion right now?","Are she writing her conclusion right now?"]','Is + singular subject + -ing = correct present continuous question.','medium'),
  (cid,7,49,'gap_fill','___ (they/use) the lab equipment properly?','Are they using',NULL,'Are + plural subject + -ing = present continuous question.','easy'),

  -- BLOCK 8: mixed present continuous review
  (cid,8,50,'multiple_choice','Choose the correct sentence.','The team is analyzing the data they collected.','["The team are analyze the data they collected.","The team is analyzing the data they collected.","The team is analyze the data they collected.","The team analyzing the data they collected."]','Present continuous: is + -ing form.','easy'),
  (cid,8,51,'gap_fill','I ___ (not/feel) well today, so I can''t attend the seminar.','am not feeling',NULL,'"Feel" can be used in continuous to describe a temporary physical state.','medium'),
  (cid,8,52,'multiple_choice','Identify the error: "She is knowing the professor since last year."','is knowing should be has known','["She is correct","the professor should be a professor","is knowing should be has known","since should be for"]','"Know" is stative and cannot be used in continuous. Also, duration = present perfect.','hard'),
  (cid,8,53,'gap_fill','The new policy ___ (change) the way students are assessed this semester.','is changing',NULL,'"This semester" suggests a temporary ongoing change — present continuous.','medium'),
  (cid,8,54,'multiple_choice','Which sentence is correct?','I usually walk to class, but today I am taking the bus.','["I usually am walking to class, but today I take the bus.","I usually walk to class, but today I am taking the bus.","I usually walk to class, but today I take the bus.","I am usually walking to class, but today I am taking the bus."]','Habit → present simple; temporary current action → present continuous.','medium'),
  (cid,8,55,'gap_fill','He ___ (write) his dissertation and ___ (work) part-time this year.','is writing / is working',NULL,'Two parallel temporary actions ongoing now — both use present continuous.','medium'),
  (cid,8,56,'multiple_choice','Choose the correct sentence about a temporary situation.','She is staying with her parents while looking for an apartment.','["She stays with her parents while looking for an apartment (permanent).","She is staying with her parents while looking for an apartment.","She stayed with her parents while looking for an apartment.","She will staying with her parents while looking for an apartment."]','"While looking for an apartment" implies a temporary ongoing situation.','medium'),

  -- BLOCK 9: TOEFL academic contexts
  (cid,9,57,'multiple_choice','[TOEFL Reading] According to the passage, researchers ___ currently ___ a new approach to vaccine development.','are / exploring','["have / explored","are / exploring","were / exploring","do / explore"]','"Currently" signals an ongoing action — use present continuous.','medium'),
  (cid,9,58,'gap_fill','[TOEFL Listening] The professor says: "Scientists ___ (increasingly/discover) that microplastics ___ (affect) marine ecosystems."','are increasingly discovering / are affecting',NULL,'"Increasingly" + ongoing trend = present continuous.','hard'),
  (cid,9,59,'multiple_choice','[TOEFL Reading] The passage notes that global temperatures ___ at an alarming rate.','are rising','["rose","rise","are rising","have rose"]','"Are rising" shows an ongoing trend — present continuous.','medium'),
  (cid,9,60,'gap_fill','[TOEFL Listening] The lecturer explains that more universities ___ (adopt) online learning platforms this academic year.','are adopting',NULL,'Temporary trend in the current academic year = present continuous.','medium'),
  (cid,9,61,'multiple_choice','[TOEFL Reading] Which word in this sentence signals Present Continuous is needed? "Renewable energy ___ an increasingly large share of global power."','currently','["share","global","currently","energy"]','"Currently" signals an ongoing present action or trend.','hard'),
  (cid,9,62,'gap_fill','[TOEFL Reading] The article argues that social media ___ (reshape) the way we consume news today.','is reshaping',NULL,'Ongoing current process: present continuous.','hard'),
  (cid,9,63,'multiple_choice','[TOEFL Listening] Which is the most natural academic way to describe a current trend?','Researchers are increasingly focusing on renewable materials.','["Researchers focus increasingly on renewable materials now.","Researchers are increasingly focusing on renewable materials.","Researchers focused increasingly on renewable materials.","Researchers will increasingly focus on renewable materials now."]','Present continuous with adverb "increasingly" = academic trend language.','hard'),

  -- BLOCK 10: TOEFL production tasks
  (cid,10,64,'multiple_choice','[TOEFL Reading] Identify the sentence that correctly uses present continuous for an ongoing trend.','The number of students pursuing STEM degrees is growing rapidly.','["The number of students pursued STEM degrees rapidly.","The number of students pursues STEM degrees rapidly.","The number of students is growing rapidly in STEM.","The number of students are grew rapidly."]','Present continuous: is + -ing for ongoing academic trends.','hard'),
  (cid,10,65,'gap_fill','[TOEFL Reading] Urban populations ___ (expand) dramatically as more people ___ (move) from rural to urban areas.','are expanding / are moving',NULL,'Two parallel ongoing trends: both use present continuous.','hard'),
  (cid,10,66,'multiple_choice','[TOEFL Speaking — 45s] Which response best uses present continuous to describe something happening in your field?','Research in artificial intelligence is advancing so rapidly that new applications are appearing every month.','["Research in artificial intelligence advanced very fast.","Research in artificial intelligence is advancing so rapidly that new applications are appearing every month.","Research in artificial intelligence advances fast every month.","Research in artificial intelligence will advance rapidly."]','Present continuous describes ongoing, current developments in an academic field.','hard'),
  (cid,10,67,'production','[TOEFL Speaking — 45s] Describe what is currently happening in a field of study that interests you. Use present continuous verbs to describe ongoing trends, changes, and developments happening right now.','',NULL,'Use: is/are + -ing to describe current ongoing academic developments and trends.','hard'),
  (cid,10,68,'production','[TOEFL Writing] Write 3-4 sentences describing changes currently happening in education. Use present continuous for at least 3 different verbs. Avoid using stative verbs in continuous form.','',NULL,'Academic writing uses present continuous for current trends: is changing, are adapting, is growing.','hard'),
  (cid,10,69,'multiple_choice','[TOEFL Writing] Which sentence is most appropriate for an academic essay describing a current global trend?','Developing nations are increasingly investing in renewable energy infrastructure.','["Developing nations invest increasingly in renewable energy infrastructure now.","Developing nations are increasingly investing in renewable energy infrastructure.","Developing nations invested increasingly in renewable energy infrastructure.","Developing nations increasing invest in renewable energy infrastructure."]','Present continuous + "increasingly" = strong academic trend language.','hard'),
  (cid,10,70,'production','[TOEFL Writing] Write a short paragraph (4-5 sentences) about a social or scientific trend that is currently occurring. Use present continuous for ongoing actions and present simple for facts/habits. Include at least one stative verb in the correct simple form.','',NULL,'Mix present continuous (ongoing trends) and present simple (facts, habits, stative verbs) appropriately.','hard')

  ON CONFLICT (content_id, block_number, exercise_number) DO NOTHING;
END $$;
