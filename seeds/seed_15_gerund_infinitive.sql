-- ============================================================
-- SEED: Módulo 15 — Gerund vs Infinitive (B1)
-- ============================================================
DO $$
DECLARE cid TEXT;
BEGIN
  SELECT id INTO cid FROM contents WHERE id = 'gerund-infinitive';
  IF cid IS NULL THEN RAISE EXCEPTION 'Módulo gerund-infinitive não encontrado'; END IF;

  INSERT INTO exercises (content_id, block_number, exercise_number, type, question, answer, options, explanation, difficulty) VALUES

  -- BLOCK 1: Verbs + Gerund (enjoy, avoid, consider, suggest)
  (cid,1,1,'gap_fill','She enjoys _____ (read) novels in her free time.','reading',NULL,'After "enjoy," use the gerund (-ing form). → She enjoys reading novels.','easy'),
  (cid,1,2,'gap_fill','He avoided _____ (make) eye contact during the interview.','making',NULL,'After "avoid," use the gerund (-ing form). → avoided making.','easy'),
  (cid,1,3,'multiple_choice','They are considering _____ to a new apartment next month.','moving','["moving","to move","move","moved"]','After "consider," the gerund is required. → considering moving.','easy'),
  (cid,1,4,'gap_fill','The professor suggested _____ (review) the chapter before the exam.','reviewing',NULL,'After "suggest," use the gerund. → suggested reviewing.','easy'),
  (cid,1,5,'multiple_choice','Do you mind _____ the window? It is very hot in here.','opening','["to open","open","opening","opened"]','"Mind" is followed by the gerund. → Do you mind opening...','easy'),
  (cid,1,6,'gap_fill','She finally finished _____ (write) her thesis after three years.','writing',NULL,'After "finish," the gerund is required. → finished writing.','easy'),
  (cid,1,7,'multiple_choice','He kept _____ the same mistake despite the teacher''s corrections.','making','["to make","make","making","made"]','"Keep" requires the gerund to indicate repetition. → kept making.','medium'),
  (cid,1,8,'gap_fill','The athlete practices _____ (sprint) every morning before breakfast.','sprinting',NULL,'After "practice," use the gerund. → practices sprinting.','easy'),

  -- BLOCK 2: Verbs + Infinitive (want, need, decide, agree)
  (cid,2,9,'gap_fill','I want _____ (learn) more about climate change.','to learn',NULL,'After "want," use the infinitive (to + base verb). → want to learn.','easy'),
  (cid,2,10,'gap_fill','The city needs _____ (invest) in public transportation.','to invest',NULL,'After "need," use the infinitive. → needs to invest.','easy'),
  (cid,2,11,'multiple_choice','She decided _____ her studies abroad after finishing her degree.','to continue','["continuing","continue","to continue","continued"]','"Decide" is followed by the infinitive. → decided to continue.','easy'),
  (cid,2,12,'gap_fill','Both parties agreed _____ (negotiate) a new trade deal.','to negotiate',NULL,'After "agree," use the infinitive. → agreed to negotiate.','easy'),
  (cid,2,13,'multiple_choice','The committee refused _____ the proposal without further evidence.','to approve','["approving","approve","to approve","approved"]','"Refuse" requires the infinitive. → refused to approve.','medium'),
  (cid,2,14,'gap_fill','After months of effort, the team managed _____ (solve) the problem.','to solve',NULL,'After "manage," the infinitive is required. → managed to solve.','medium'),
  (cid,2,15,'multiple_choice','She hopes _____ a scholarship to study environmental science.','to receive','["receiving","receive","to receive","received"]','"Hope" is followed by the infinitive. → hopes to receive.','easy'),
  (cid,2,16,'gap_fill','They plan _____ (expand) their research into three new countries.','to expand',NULL,'After "plan," use the infinitive. → plan to expand.','easy'),

  -- BLOCK 3: Verbs + Both (like, love, hate, start, begin, continue, prefer)
  (cid,3,17,'multiple_choice','She likes _____ early on weekdays to avoid traffic.','leaving / to leave','["leaving / to leave","leave / leaving","to leave / leave","left / leaving"]','Both "leaving" and "to leave" are correct after "like." Both forms are acceptable with similar meaning.','medium'),
  (cid,3,18,'gap_fill','He loves _____ (cook) Italian food for his family.','cooking',NULL,'"Love" can be followed by gerund or infinitive. "Cooking" is the gerund form used here.','easy'),
  (cid,3,19,'multiple_choice','They hate _____ in long queues at the supermarket.','waiting / to wait','["waiting / to wait","wait","waited","to waiting"]','Both "waiting" and "to wait" are acceptable after "hate."','medium'),
  (cid,3,20,'gap_fill','The children started _____ (cry) when the lights went out.','crying',NULL,'"Start" can take gerund or infinitive. Both "crying" and "to cry" are correct. Gerund is given here.','easy'),
  (cid,3,21,'multiple_choice','She began _____ the piano at the age of five.','to play','["playing","to play","play","played"]','Both "to play" and "playing" are acceptable after "begin." "To play" is given here.','easy'),
  (cid,3,22,'gap_fill','Despite the interruptions, he continued _____ (work) on his report.','working',NULL,'"Continue" accepts both gerund and infinitive. "Working" is correct here.','easy'),
  (cid,3,23,'multiple_choice','Most students prefer _____ online lectures to attending them in person.','watching','["to watch","watch","watching","watched"]','Both forms work after "prefer." Here "watching" contrasts with the gerund "attending."','medium'),
  (cid,3,24,'gap_fill','I prefer _____ (take) notes by hand rather than using a laptop.','to take',NULL,'Both forms are acceptable after "prefer." The infinitive "to take" is used here.','medium'),

  -- BLOCK 4: Gerund as Subject & Infinitive of Purpose
  (cid,4,25,'multiple_choice','_____ a second language improves cognitive flexibility significantly.','Learning','["To learn","Learn","Learned","Learning"]','A gerund as subject is more common in general statements. "Learning" acts as the subject here.','medium'),
  (cid,4,26,'gap_fill','_____ (exercise) regularly is one of the best habits for mental health.','Exercising',NULL,'The gerund "Exercising" functions as the subject of the sentence.','easy'),
  (cid,4,27,'multiple_choice','She went to the library _____ for her upcoming presentation.','to research','["for researching","research","to research","researching"]','The infinitive of purpose (to + verb) explains why she went. → to research.','easy'),
  (cid,4,28,'gap_fill','He studies every night _____ (pass) the TOEFL exam.','to pass',NULL,'The infinitive of purpose answers "why." → to pass the exam.','easy'),
  (cid,4,29,'multiple_choice','_____ a healthy diet requires discipline and planning.','Maintaining','["To maintain","Maintain","Maintained","Maintaining"]','Gerund as subject for a general statement. Both forms are possible, but "Maintaining" is more natural here.','medium'),
  (cid,4,30,'gap_fill','They hired a consultant _____ (improve) the company''s efficiency.','to improve',NULL,'Infinitive of purpose: they hired a consultant in order to improve efficiency.','easy'),
  (cid,4,31,'multiple_choice','_____ in the library requires silence and concentration.','Studying','["Study","To study","Studied","Studying"]','The gerund "Studying" functions as the subject of the sentence.','easy'),
  (cid,4,32,'gap_fill','She saved money for years _____ (travel) around Southeast Asia.','to travel',NULL,'Infinitive of purpose: she saved money in order to travel.','easy'),

  -- BLOCK 5: TOEFL Academic – Gerund vs Infinitive in context
  (cid,5,33,'gap_fill','[TOEFL Reading] Researchers recommend _____ (use) a control group in all experimental designs.','using',NULL,'"Recommend" is followed by the gerund. → recommend using a control group.','medium'),
  (cid,5,34,'multiple_choice','[TOEFL Reading] The study failed _____ significant differences between the two groups.','to identify','["identifying","identify","to identify","identified"]','"Fail" requires the infinitive. → failed to identify.','medium'),
  (cid,5,35,'gap_fill','[TOEFL Reading] The researchers decided _____ (abandon) the hypothesis after the results proved inconclusive.','to abandon',NULL,'"Decide" takes the infinitive. → decided to abandon.','medium'),
  (cid,5,36,'multiple_choice','[TOEFL Reading] The committee proposed _____ a new framework for measuring carbon emissions.','adopting','["to adopt","adopt","adopting","adopted"]','"Propose" can take the gerund. → proposed adopting a new framework.','hard'),
  (cid,5,37,'gap_fill','[TOEFL Listening] The professor encouraged students _____ (question) established theories.','to question',NULL,'"Encourage someone to do" requires the infinitive. → encouraged students to question.','medium'),
  (cid,5,38,'multiple_choice','[TOEFL Listening] The scientist admitted _____ several errors in the original data set.','having made','["to make","make","having made","made"]','After "admit," the gerund (or perfect gerund) is required. → admitted having made errors.','hard'),
  (cid,5,39,'gap_fill','[TOEFL Listening] She regretted _____ (not study) the subject more deeply during her undergraduate years.','not studying',NULL,'After "regret," use the gerund. Negative gerund: "not studying."','hard'),
  (cid,5,40,'multiple_choice','[TOEFL Reading] Biologists tend _____ specimens in controlled laboratory environments.','to examine','["examining","examine","to examine","examined"]','"Tend" is always followed by the infinitive. → tend to examine.','medium'),

  -- BLOCK 6: TOEFL Academic – More complex contexts
  (cid,6,41,'gap_fill','[TOEFL Reading] Climate models appear _____ (underestimate) the rate of polar ice loss.','to underestimate',NULL,'"Appear" is followed by the infinitive. → appear to underestimate.','hard'),
  (cid,6,42,'multiple_choice','[TOEFL Reading] The government is considering _____ stricter regulations on industrial waste.','implementing','["to implement","implement","implementing","implemented"]','"Consider" takes the gerund. → considering implementing stricter regulations.','medium'),
  (cid,6,43,'gap_fill','[TOEFL Listening] The lecturer mentioned _____ (conduct) a follow-up study in the coming year.','conducting',NULL,'"Mention" is followed by the gerund. → mentioned conducting a follow-up study.','medium'),
  (cid,6,44,'multiple_choice','[TOEFL Reading] Many species have been observed _____ their behavior in response to urbanization.','adapting','["to adapt","adapt","adapting","adapted"]','In passive observation constructions (have been observed), the gerund follows. → observed adapting.','hard'),
  (cid,6,45,'gap_fill','[TOEFL Listening] The student stopped _____ (take) notes when the professor showed a video.','taking',NULL,'"Stop + gerund" = stop an activity. → stopped taking notes (stopped the action).','medium'),
  (cid,6,46,'multiple_choice','[TOEFL Reading] She stopped _____ a drink of water and then continued her presentation.','to get','["getting","get","to get","got"]','"Stop + infinitive" = stop in order to do something else. → stopped to get water.','hard'),
  (cid,6,47,'gap_fill','[TOEFL Listening] The researcher tried _____ (reduce) variables in the experiment.','to reduce',NULL,'"Try + infinitive" = make an attempt to do something. → tried to reduce variables.','medium'),
  (cid,6,48,'multiple_choice','[TOEFL Reading] Scientists tried _____ different antibiotics to find the most effective treatment.','using','["to use","use","using","used"]','"Try + gerund" = experiment with something. → tried using different antibiotics.','hard'),

  -- BLOCK 7: TOEFL Academic – Error Identification & Correction
  (cid,7,49,'multiple_choice','[TOEFL Reading] Which sentence is grammatically correct?','The board agreed to revise its environmental policy.','["The board agreed revising its environmental policy.","The board agreed to revise its environmental policy.","The board agreed for revising its environmental policy.","The board agreed that revising its policy."]','"Agree" must be followed by the infinitive (to + verb). → agreed to revise.','medium'),
  (cid,7,50,'multiple_choice','[TOEFL Reading] Which option correctly completes the sentence? "Economists tend _____ recessions as temporary downturns."','to view','["viewing","view","to view","viewed"]','"Tend" is always followed by the infinitive. → tend to view.','medium'),
  (cid,7,51,'gap_fill','[TOEFL Listening] The student denied _____ (cheat) on the exam.','cheating',NULL,'"Deny" is followed by the gerund. → denied cheating.','medium'),
  (cid,7,52,'multiple_choice','[TOEFL Reading] "I remember _____ this article last semester." (I read it — now I recall the memory)','reading','["to read","read","reading","having read"]','"Remember + gerund" = recall a past action that happened. → remember reading.','hard'),
  (cid,7,53,'gap_fill','[TOEFL Reading] Remember _____ (submit) your essay before the deadline. (instruction for a future action)','to submit',NULL,'"Remember + infinitive" = remember to do something in the future. → remember to submit.','hard'),
  (cid,7,54,'multiple_choice','[TOEFL Listening] "She forgot _____ the data before shutting down the computer." (the action happened but she forgot it)','saving','["to save","save","saving","saved"]','"Forget + gerund" = forget that you did something. → forgot saving (she saved but forgot she did).','hard'),
  (cid,7,55,'gap_fill','[TOEFL Listening] I forgot _____ (bring) my student ID to the exam. (I didn''t bring it)','to bring',NULL,'"Forget + infinitive" = forget to do a future task. → forgot to bring.','hard'),
  (cid,7,56,'multiple_choice','[TOEFL Reading] The authors acknowledge _____ limitations in their methodology.','having','["to have","have","having","had"]','"Acknowledge" takes the gerund. → acknowledge having limitations.','hard'),

  -- BLOCK 8: TOEFL Academic – Passive Gerunds & Perfect Gerunds
  (cid,8,57,'gap_fill','[TOEFL Reading] The participants objected to _____ (test) without their consent.','being tested',NULL,'After "object to," use the gerund. Passive gerund: "being tested." → objected to being tested.','hard'),
  (cid,8,58,'multiple_choice','[TOEFL Reading] She is proud of _____ selected for the research fellowship.','having been','["being","to be","having been","been"]','The perfect passive gerund "having been selected" shows the action preceded the pride.','hard'),
  (cid,8,59,'gap_fill','[TOEFL Listening] The professor insisted on _____ (see) the original sources, not just summaries.','seeing',NULL,'After "insist on," the gerund is required. → insisted on seeing.','medium'),
  (cid,8,60,'multiple_choice','[TOEFL Reading] The data appears _____ manipulated before publication.','to have been','["being","to be","to have been","having been"]','"Appear + infinitive" for current evidence. "To have been manipulated" = past passive infinitive.','hard'),
  (cid,8,61,'gap_fill','[TOEFL Reading] The author is credited with _____ (pioneer) the field of cognitive linguistics.','pioneering',NULL,'After "credited with," the gerund is required. → credited with pioneering.','hard'),
  (cid,8,62,'multiple_choice','[TOEFL Listening] The review committee considered the paper _____ its findings.','to have misrepresented','["misrepresenting","to misrepresent","to have misrepresented","having misrepresented"]','"Considered + object + to have + past participle" for a past action evaluated now.','hard'),
  (cid,8,63,'gap_fill','[TOEFL Reading] Rather than _____ (rely) on anecdotal evidence, the study uses empirical data.','relying',NULL,'After "rather than," the gerund is preferred. → Rather than relying on anecdotal evidence.','medium'),
  (cid,8,64,'multiple_choice','[TOEFL Reading] In addition to _____ new species, the expedition documented several new ecosystems.','discovering','["discover","to discover","discovered","discovering"]','After "in addition to" (a preposition), the gerund is required. → in addition to discovering.','medium'),

  -- BLOCK 9: TOEFL Speaking Tasks (45s)
  (cid,9,65,'production','[TOEFL Speaking — 45s] Some students prefer to study alone, while others prefer studying in groups. Which approach do you prefer, and why? Use specific reasons and examples to support your answer. You have 45 seconds to respond.','',NULL,'Key language: "I prefer studying / to study..." "One reason is that..." "For example..." "Additionally..." Use gerunds and infinitives naturally in your response.','medium'),
  (cid,9,66,'production','[TOEFL Speaking — 45s] Some people believe that learning by doing (hands-on experience) is more effective than learning from books. Do you agree or disagree? Use specific reasons and examples. You have 45 seconds to respond.','',NULL,'Include phrases like: "I agree with / disagree with..." "Hands-on learning allows students to practice..." "Reading books helps to develop..."','medium'),
  (cid,9,67,'production','[TOEFL Speaking — 45s] A university is considering requiring all students to complete a community service project before graduating. Do you think this is a good idea? Support your opinion with specific reasons. You have 45 seconds.','',NULL,'Use: "I think requiring students to complete..." "Community service helps develop..." "However, forcing students to volunteer..."','hard'),

  -- BLOCK 10: TOEFL Writing Tasks
  (cid,10,68,'production','[TOEFL Writing] Many educators argue that practicing skills repeatedly is more valuable than simply studying theory. Do you agree or disagree with this statement? Use specific reasons and examples to support your position. Write at least 150 words.','',NULL,'Include gerunds and infinitives: "Practicing regularly helps to reinforce..." "Students who avoid practicing..." "Educators recommend spending time..."','hard'),
  (cid,10,69,'production','[TOEFL Writing] Some people prefer to live in a large city; others prefer to live in a rural area. Compare the advantages and disadvantages of each option. Which do you prefer, and why? Write at least 150 words.','',NULL,'Use: "Living in a city offers..." "To enjoy a quieter lifestyle, many people choose..." "However, moving to a rural area means giving up..."','hard'),
  (cid,10,70,'production','[TOEFL Writing] A local school board is considering eliminating extracurricular activities to save money. Do you think schools should continue to fund these activities? Why or why not? Support your argument with specific reasons and examples. Write at least 150 words.','',NULL,'Key grammar: "Participating in extracurricular activities helps students to develop..." "Students who enjoy playing sports tend to perform better..." "Cutting these programs would mean losing..."','hard')

  ON CONFLICT (content_id, block_number, exercise_number) DO NOTHING;
END $$;
