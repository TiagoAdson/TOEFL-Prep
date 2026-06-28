-- ============================================================
-- SEED EXT 2: Módulo 15 — Gerund vs Infinitive (exercícios 71-175)
-- Novos tópicos: verbos com mudança de sentido (remember/stop/
-- try/forget/regret/go on/mean), after prepositions, passiva,
-- TOEFL Reading/Speaking/Writing
-- ============================================================
DO $$
DECLARE cid TEXT;
BEGIN
  SELECT id INTO cid FROM contents WHERE id = 'gerund-infinitive';
  IF cid IS NULL THEN RAISE EXCEPTION 'Módulo gerund-infinitive não encontrado'; END IF;

  INSERT INTO exercises (content_id, block_number, exercise_number, type, question, answer, options, explanation, difficulty) VALUES

  -- BLOCK 11: verbs that change meaning — remember
  (cid,11,71,'multiple_choice','What is the difference: "I remember locking the door" vs "I remembered to lock the door"?','Remember + gerund = recalls a past action; remember + infinitive = did not forget to do it.','["They are identical","Remember + gerund = recalls a past action; remember + infinitive = did not forget to do it.","Gerund is more formal","Infinitive implies forgetting"]','"Remember doing" = memory of a past action. "Remember to do" = not forgetting a future/scheduled task.','hard'),
  (cid,11,72,'gap_fill','Please remember ___ (submit) your assignment before midnight. (don''t forget to do it)','to submit',NULL,'"Remember to + infinitive" = don''t forget to do something in the future.','medium'),
  (cid,11,73,'gap_fill','I remember ___ (meet) her at the conference years ago. (a memory of a past event)','meeting',NULL,'"Remember + gerund" = memory of a past action.','medium'),
  (cid,11,74,'multiple_choice','Choose the correct form: "She remembered ___ the lab results before presenting." (She had already checked them.)','checking','["to check","check","checking","having checked"]','"Remembered checking" = she has a memory of checking — it happened before the presentation.','hard'),

  -- BLOCK 12: stop + gerund/infinitive
  (cid,12,75,'multiple_choice','What is the difference: "He stopped smoking" vs "He stopped to smoke"?','Stopped smoking = quit permanently; stopped to smoke = paused another activity in order to smoke.','["They mean the same","Stopped smoking = quit permanently; stopped to smoke = paused another activity in order to smoke.","Gerund is for habits; infinitive for future","Stop + infinitive is incorrect"]','"Stop + gerund" = end an activity. "Stop + infinitive" = pause to do something else (infinitive of purpose).','hard'),
  (cid,12,76,'gap_fill','The researcher stopped ___ (work) on that hypothesis after the data proved inconclusive. (quit)','working',NULL,'"Stop working" = ended the activity permanently.','easy'),
  (cid,12,77,'gap_fill','She stopped ___ (buy) coffee on her way in and arrived late. (paused to do something)','to buy',NULL,'"Stopped to buy" = paused her commute in order to buy coffee.','medium'),

  -- BLOCK 13: try + gerund/infinitive
  (cid,13,78,'multiple_choice','What is the difference: "Try using a different approach" vs "Try to use a different approach"?','Try + gerund = experiment with something; try + infinitive = make an effort (may fail).','["They are the same","Try + gerund = experiment with something; try + infinitive = make an effort (may fail).","Gerund = success; infinitive = failure","Try + infinitive is always wrong"]','"Try doing" = experiment as a solution. "Try to do" = attempt (suggests difficulty).','hard'),
  (cid,13,79,'gap_fill','If the software crashes, try ___ (restart) your computer. (experiment with this solution)','restarting',NULL,'"Try + gerund" = experiment with this solution to see if it works.','medium'),
  (cid,13,80,'gap_fill','She tried ___ (reach) the professor by email but received no reply. (attempted but had difficulty)','to reach',NULL,'"Try to + infinitive" = make an effort (suggests it was difficult or unsuccessful).','medium'),

  -- BLOCK 14: forget / regret / go on / mean
  (cid,14,81,'multiple_choice','"I forgot to submit the paper" vs "I''ll never forget submitting my first paper":','Forget + infinitive = failed to do something; forget + gerund = cannot forget a memory.','["Both = identical","Forget + infinitive = failed to do something; forget + gerund = cannot forget a memory.","Gerund = future; infinitive = past","Forget + infinitive is always negative"]','"Forget to do" = fail to do. "Forget doing" = retain/lose the memory of a past event.','hard'),
  (cid,14,82,'gap_fill','I regret ___ (inform) you that your application has been unsuccessful. (formal announcement)','to inform',NULL,'"Regret + infinitive" = expressing regret about what you are about to say (formal).','hard'),
  (cid,14,83,'gap_fill','She regrets ___ (not/apply) for the scholarship — she would have been eligible. (past regret)','not applying',NULL,'"Regret + gerund" = feel sorry about a past action.','hard'),
  (cid,14,84,'multiple_choice','"She went on talking for an hour" vs "She went on to talk about a new topic":','Go on + gerund = continue; go on + infinitive = move to the next thing.','["They are the same","Go on + gerund = continue; go on + infinitive = move to the next thing.","Infinitive is always negative","Gerund is formal; infinitive is informal"]','"Go on doing" = continue the same thing. "Go on to do" = move to next activity.','hard'),
  (cid,14,85,'gap_fill','This study ___ (mean) overhauling the entire methodology. (implies/requires)','means',NULL,'"Mean + gerund" = involve/require. "Mean to do" = intend.','hard'),

  -- BLOCK 15: gerund after prepositions
  (cid,15,86,'gap_fill','She is responsible for ___ (design) the experimental protocol.','designing',NULL,'After a preposition (for), use the gerund.','easy'),
  (cid,15,87,'multiple_choice','Which sentence is correct?','He is interested in understanding the mechanisms behind the phenomenon.','["He is interested in to understand the mechanisms.","He is interested in understanding the mechanisms behind the phenomenon.","He is interested to understand the mechanisms (both acceptable?).","He is interested understand the mechanisms."]','After a preposition (in), gerund is required. "Interested in + -ing."','easy'),
  (cid,15,88,'gap_fill','Instead of ___ (dismiss) the anomaly, the team investigated it further.','dismissing',NULL,'"Instead of + gerund." Never infinitive after a preposition.','medium'),
  (cid,15,89,'gap_fill','She succeeded in ___ (obtain) the grant despite the intense competition.','obtaining',NULL,'"Succeed in + gerund" for achieving something after effort.','medium'),
  (cid,15,90,'multiple_choice','Which sentence correctly uses a gerund after a preposition?','Without conducting preliminary tests, the team proceeded to publish.','["Without to conduct preliminary tests, the team proceeded.","Without conduct preliminary tests, the team proceeded.","Without conducting preliminary tests, the team proceeded to publish.","Without conducted preliminary tests, the team proceeded."]','"Without" is a preposition → requires gerund (conducting).','medium'),
  (cid,15,91,'gap_fill','The committee is opposed to ___ (change) the policy without further evidence.','changing',NULL,'"Opposed to + gerund." "To" here is a preposition, not part of an infinitive.','hard'),
  (cid,15,92,'gap_fill','Prior to ___ (conduct) the experiment, all participants must sign consent forms.','conducting',NULL,'"Prior to + gerund" = before doing something.','medium'),

  -- BLOCK 16: passive infinitive & passive gerund
  (cid,16,93,'gap_fill','The participants expected ___ (inform/passive) about the results immediately.','to be informed',NULL,'Passive infinitive: expect + to be + past participle.','hard'),
  (cid,16,94,'multiple_choice','Which sentence uses passive gerund correctly?','She disliked being observed while working in the lab.','["She disliked to be observed while working in the lab.","She disliked being observed while working in the lab.","She disliked be observed while working in the lab.","She disliked to being observed while working."]','"Dislike + gerund (passive)" = being + past participle.','hard'),
  (cid,16,95,'gap_fill','The candidate hoped ___ (select/passive) for the fellowship.','to be selected',NULL,'Passive infinitive: hope + to be + past participle.','hard'),
  (cid,16,96,'gap_fill','She objected to ___ (exclude/passive) from the decision-making process.','being excluded',NULL,'"Objected to + passive gerund" = being + past participle. "To" = preposition here.','hard'),

  -- BLOCK 17: TOEFL Reading
  (cid,17,97,'multiple_choice','[TOEFL Reading] "Researchers have attempted to identify the genetic basis of this disorder." The infinitive "to identify" follows "attempted" because:','Attempt requires an infinitive (to + base verb).','["Gerunds always follow attempt","Attempt requires an infinitive (to + base verb).","Both gerund and infinitive are correct after attempt","The infinitive is more formal"]','"Attempt to do" = try to do (with effort). Not "attempt doing."','medium'),
  (cid,17,98,'gap_fill','[TOEFL Reading] "The policy aims ___ (reduce) carbon emissions by 40% before 2030." Best form?','to reduce',NULL,'"Aim + to + infinitive." Purpose statement in academic context.','easy'),
  (cid,17,99,'multiple_choice','[TOEFL Reading] "The study involved administering a placebo to the control group." The word "administering" is in the gerund because:','It follows "involved," which requires a gerund.','["It is a present participle adjective","It follows ''involved,'' which requires a gerund.","Both forms are correct after involve","It is an infinitive of purpose"]','"Involve + gerund" = required structure. "Involved administering."','medium'),
  (cid,17,100,'gap_fill','[TOEFL Reading] "Urban planners tend ___ (prioritize) economic growth over environmental sustainability." Best form?','to prioritize',NULL,'"Tend + to + infinitive" in academic writing for general patterns.','easy'),

  -- BLOCK 18: TOEFL Speaking
  (cid,18,101,'production','[TOEFL Speaking — 45s] Talk about a habit you stopped, something you tried to improve about yourself, and something you regret not doing. Use: stopped + gerund, tried + infinitive, regret + gerund.','',NULL,'I stopped checking my phone before bed and noticed a significant improvement in my sleep quality. I tried to exercise every morning, though maintaining the schedule was difficult at first. I regret not studying abroad during my undergraduate years, as it would have been an invaluable experience.','medium'),
  (cid,18,102,'production','[TOEFL Speaking — 45s] A university wants to stop offering paper exams and switch entirely to online testing. Agree or disagree. Use: involve + gerund, aim + to + infinitive, risk + gerund, allow + object + to + infinitive.','',NULL,'Transitioning to online exams involves upgrading significant infrastructure and retraining staff. The university aims to reduce paper waste and grading time. However, it risks disadvantaging students with limited technological access. The digital format should allow students to complete assessments more efficiently, provided reliable connectivity is ensured.','hard'),

  -- BLOCK 19: TOEFL Writing
  (cid,19,103,'production','[TOEFL Writing] Write 5 sentences about academic success using 5 different verb+gerund/infinitive patterns: enjoy + gerund, manage + infinitive, avoid + gerund, seem + infinitive, involve + gerund.','',NULL,'Successful students enjoy engaging with challenging material beyond the required reading. They manage to balance academic responsibilities with personal well-being. They avoid procrastinating by breaking large tasks into manageable steps. High achievers seem to possess a growth mindset that treats failure as feedback. Ultimately, academic success involves developing consistent, sustainable study habits over time.','hard'),
  (cid,19,104,'production','[TOEFL Writing — Error Correction] Fix: "She stopped to work late after having a child. He tried submitting the paper early but the system crashed. They avoided to use statistical methods they didn''t understand. She remembered locking the door tonight."','',NULL,'stopped working (ended the habit — not stopped to work); tried to submit OR tried submitting (both possible; crashed = system didn''t work, so ''tried to submit'' better); avoided using (not to use after avoid); remembered to lock (future task reminder, not past memory).','hard'),
  (cid,19,105,'production','[TOEFL Writing — 150 words] Write a paragraph on "The importance of learning a second language." Use at least 6 gerund/infinitive structures: aim + to, involve + -ing, help + infinitive, avoid + -ing, tend + to, worth + -ing.','',NULL,'Learning a second language is worth investing significant time and effort in, as the cognitive and professional benefits are substantial. The process involves mastering not only grammar and vocabulary but also cultural nuances and pragmatic conventions. Students who aim to reach fluency tend to immerse themselves in the target language as fully as possible. Bilingualism helps individuals develop greater cognitive flexibility and avoid the communication barriers that hinder global collaboration. Research suggests that multilingual individuals tend to demonstrate stronger executive function and problem-solving skills. In academic and professional contexts, avoiding linguistic misunderstandings can be the difference between success and failure. In short, the effort required to become proficient in a second language is entirely worth undertaking.','hard')

  ON CONFLICT (content_id, block_number, exercise_number) DO NOTHING;
END $$;
