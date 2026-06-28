-- ============================================================
-- SEED: Módulo 5 — Future Simple (A1)
-- ============================================================
DO $$
DECLARE cid TEXT;
BEGIN
  SELECT id INTO cid FROM contents WHERE id = 'future-simple';
  IF cid IS NULL THEN RAISE EXCEPTION 'Módulo future-simple não encontrado'; END IF;

  INSERT INTO exercises (content_id, block_number, exercise_number, type, question, answer, options, explanation, difficulty) VALUES

  -- BLOCK 1: will + base verb formation
  (cid,1,1,'gap_fill','She ___ (help) you with the assignment if you ask her.','will help',NULL,'Future simple: will + base verb (no -s, no -ing).','easy'),
  (cid,1,2,'gap_fill','They ___ (announce) the results next week.','will announce',NULL,'Will + base verb for future simple.','easy'),
  (cid,1,3,'multiple_choice','Choose the correct future form: "The professor ___ a new textbook next semester."','will use','["will uses","will used","will use","will using"]','Will + base verb (never add -s or -ed after will).','easy'),
  (cid,1,4,'gap_fill','I ___ (send) you the research paper as soon as I find it.','will send',NULL,'Will + base verb for promises and spontaneous decisions.','easy'),
  (cid,1,5,'gap_fill','It ___ (probably/rain) during the outdoor graduation ceremony.','will probably rain',NULL,'Adverbs like "probably" go between will and the base verb.','medium'),
  (cid,1,6,'multiple_choice','Which sentence is correct?','The conference will take place in Chicago next year.','["The conference will takes place in Chicago next year.","The conference will took place in Chicago next year.","The conference will take place in Chicago next year.","The conference will taking place in Chicago next year."]','Will + base verb. Never change the base verb after "will".','easy'),
  (cid,1,7,'gap_fill','Scientists believe they ___ (develop) a cure within the next decade.','will develop',NULL,'Future prediction with will + base verb.','easy'),

  -- BLOCK 2: won't (will not) - negatives
  (cid,2,8,'gap_fill','She ___ (not/attend) the seminar because she has a conflict.','won''t attend',NULL,'Won''t = will not. Use won''t + base verb for future negatives.','easy'),
  (cid,2,9,'multiple_choice','Which negative sentence is correct?','The results won''t be available until Friday.','["The results will not available until Friday.","The results won''t be available until Friday.","The results will be not available until Friday.","The results won''t available until Friday."]','Won''t + base verb (don''t omit "be" with linking verbs).','medium'),
  (cid,2,10,'gap_fill','I ___ (not/be) able to submit the report by tomorrow.','won''t be',NULL,'"Be" is the base verb here; won''t be + adjective/available.','easy'),
  (cid,2,11,'gap_fill','They ___ (not/accept) late applications under any circumstances.','won''t accept',NULL,'Won''t + base verb for refusals and future negatives.','easy'),
  (cid,2,12,'multiple_choice','Choose the correct negative: "The library ___ next Monday because of a holiday."','won''t be open','["will not opens","won''t be open","will be not open","won''t opened"]','Won''t be + adjective is the correct structure.','medium'),
  (cid,2,13,'gap_fill','She promised she ___ (not/miss) another class.','won''t miss',NULL,'Won''t + base verb for promises (negative).','easy'),
  (cid,2,14,'multiple_choice','Identify the error: "He will not comes to the meeting."','comes should be come','["He is correct","will not should be won''t","comes should be come","meeting should be meetings"]','After will/won''t, always use the base form (no -s).','medium'),

  -- BLOCK 3: will questions
  (cid,3,15,'gap_fill','___ (she/pass) the TOEFL with a high enough score?','Will she pass',NULL,'Will questions: Will + subject + base verb?','easy'),
  (cid,3,16,'multiple_choice','Which question is correct?','Will the experiment produce reliable results?','["Will the experiment produces reliable results?","Will the experiment produced reliable results?","Will the experiment produce reliable results?","Does the experiment will produce reliable results?"]','Will + subject + base verb (no change to verb form).','easy'),
  (cid,3,17,'gap_fill','When ___ (the professor/return) the graded papers?','will the professor return',NULL,'Wh-question future: When + will + subject + base verb?','medium'),
  (cid,3,18,'multiple_choice','Form a question: "_____ you help me review this draft?"','Will','["Do","Are","Would","Will"]','Use "will" for a simple request/offer question about future.','easy'),
  (cid,3,19,'gap_fill','___ (there/be) enough resources for all the participants?','Will there be',NULL,'Will there be = existential future question.','medium'),
  (cid,3,20,'multiple_choice','Which is a correct yes/no answer to "Will she submit on time?"','Yes, she will.','["Yes, she will do.","Yes, she does.","Yes, she will.","Yes, she is."]','Short answer: Yes, subject + will. / No, subject + won''t.','easy'),
  (cid,3,21,'gap_fill','___ (what/happen) if the funding is not approved?','What will happen',NULL,'Wh- question: What + will + subject + base verb?','medium'),

  -- BLOCK 4: predictions
  (cid,4,22,'multiple_choice','Which sentence makes a PREDICTION about the future?','Experts believe that automation will replace many manufacturing jobs.','["She is meeting her advisor tomorrow.","I''m going to visit the library later.","Experts believe that automation will replace many manufacturing jobs.","The lecture starts at 9 a.m."]','Will is used for predictions, especially with little or no evidence.','medium'),
  (cid,4,23,'gap_fill','Based on current trends, sea levels ___ (rise) significantly by 2100.','will rise',NULL,'Will for predictions based on general knowledge or expert opinion.','medium'),
  (cid,4,24,'multiple_choice','Choose the best prediction: "If CO2 emissions continue at this rate, temperatures ___."','will increase by 3 degrees','["are increasing by 3 degrees","increased by 3 degrees","will increase by 3 degrees","are going to increase by 3 degrees already"]','Will + base verb for future predictions.','medium'),
  (cid,4,25,'gap_fill','Technology ___ (probably/transform) the healthcare industry in the next 20 years.','will probably transform',NULL,'"Probably" + will for less certain predictions.','medium'),
  (cid,4,26,'multiple_choice','Which sentence predicts a future outcome based on a present condition?','If the study is replicated, it will confirm the original findings.','["The study was replicated and confirmed the findings.","If the study is replicated, it will confirm the original findings.","The study is being replicated to confirm findings.","The study has confirmed the findings."]','If + present simple + will = type 1 conditional prediction.','hard'),
  (cid,4,27,'gap_fill','Researchers predict that the drug ___ (prove) effective in clinical trials.','will prove',NULL,'Will + base verb for research predictions.','medium'),
  (cid,4,28,'multiple_choice','Choose the most natural prediction: "Look at those clouds — it ___ rain."','is going to','["will","is going to","rains","rained"]','Evidence-based near prediction uses "going to," not "will."','hard'),

  -- BLOCK 5: offers and promises
  (cid,5,29,'gap_fill','Don''t worry about the report — I ___ (check) it for you.','will check',NULL,'Spontaneous offer: will + base verb decided at the moment of speaking.','medium'),
  (cid,5,30,'multiple_choice','Which sentence is a SPONTANEOUS OFFER using will?','I''ll carry those books for you.','["I''m going to carry those books for you (planned).","I carried those books for you.","I''ll carry those books for you.","I carry those books for you."]','Will is used for offers decided at the moment of speaking.','medium'),
  (cid,5,31,'gap_fill','I promise I ___ (submit) my paper before the deadline.','will submit',NULL,'Will + base verb for promises.','easy'),
  (cid,5,32,'multiple_choice','He says: "The printer is broken." You offer to fix it. What do you say?','I''ll take a look at it.','["I''m going to take a look at it.","I take a look at it.","I took a look at it.","I''ll take a look at it."]','Spontaneous help: I''ll (will) + base verb.','medium'),
  (cid,5,33,'gap_fill','She ___ (never/reveal) the source of her data.','will never reveal',NULL,'Will + adverb + base verb for strong promises.','medium'),
  (cid,5,34,'multiple_choice','Which sentence contains a PROMISE made with will?','I will return the book by Friday.','["I am returning the book by Friday.","I will return the book by Friday.","I returned the book by Friday.","I return the book by Friday always."]','Will + base verb for explicit promises.','easy'),
  (cid,5,35,'gap_fill','A: "Can anyone help me with this equation?" B: "I ___ (help) you."','will help',NULL,'Spontaneous decision: will + base verb at moment of decision.','easy'),

  -- BLOCK 6: spontaneous decisions vs going to
  (cid,6,36,'multiple_choice','Which sentence shows a SPONTANEOUS DECISION (use will)?','A: "We''re out of paper." B: "I''ll buy some on my way back."','["I''m going to buy some — I planned it last week.","A: ''We''re out of paper.'' B: ''I''ll buy some on my way back.''","I was going to buy some but forgot.","I bought some yesterday."]','Will = decided at the moment; going to = planned in advance.','medium'),
  (cid,6,37,'gap_fill','She already decided: she ___ (study) in Canada next year. (planned)','is going to study',NULL,'"Going to" is used for plans already decided before speaking.','medium'),
  (cid,6,38,'multiple_choice','Choose the correct form: The phone is ringing and you decide to answer it. You say: "I ___ get it."','will','["am going to","will","am","have"]','"Will" for spontaneous decisions made right now.','medium'),
  (cid,6,39,'gap_fill','Look at those dark clouds! It ___ (rain) soon. (evidence-based)','is going to',NULL,'"Going to" for predictions based on visible evidence.','medium'),
  (cid,6,40,'multiple_choice','Which sentence uses WILL correctly for a spontaneous decision?','The library just closed. I''ll study at home then.','["I''m going to study at home — I planned this yesterday.","The library just closed. I''ll study at home then.","I was going to study at home.","I study at home when the library closes."]','Reaction to new information → spontaneous decision → will.','hard'),
  (cid,6,41,'gap_fill','I''ve already enrolled: I ___ (take) the advanced grammar course next term. (prior plan)','am going to take',NULL,'Pre-planned decision = going to, not will.','hard'),
  (cid,6,42,'multiple_choice','Someone offers you coffee. You decide to accept right now. You say:','Yes, I''ll have a cup, thank you.','["Yes, I''m going to have a cup, thank you.","Yes, I have a cup, thank you.","Yes, I''ll have a cup, thank you.","Yes, I had a cup, thank you."]','Spontaneous acceptance = will.','medium'),

  -- BLOCK 7: future simple with time clauses
  (cid,7,43,'gap_fill','I ___ (call) you as soon as the meeting ___ (end).','will call / ends',NULL,'Future time clauses use present simple (not will) in the "when/as soon as" clause.','hard'),
  (cid,7,44,'multiple_choice','Choose the correct sentence.','When she arrives, we will start the presentation.','["When she will arrive, we will start the presentation.","When she arrives, we will start the presentation.","When she arrives, we start the presentation.","When she will arrive, we start the presentation."]','After "when/until/as soon as" in future context, use present simple — not will.','hard'),
  (cid,7,45,'gap_fill','He ___ (not/leave) until he ___ (finish) the assignment.','won''t leave / finishes',NULL,'Time clause with "until": present simple; main clause: won''t + base verb.','hard'),
  (cid,7,46,'multiple_choice','Identify the correct future sentence with a time clause.','I will email you once I receive the feedback.','["I will email you once I will receive the feedback.","I email you once I receive the feedback.","I will email you once I receive the feedback.","I will email you once I received the feedback."]','Time clause (once): present simple; main clause: will + base verb.','hard'),
  (cid,7,47,'gap_fill','Before the team ___ (submit) the report, they ___ (review) all the data.','submits / will review',NULL,'Time clause: present simple; main clause: will + base verb.','hard'),
  (cid,7,48,'multiple_choice','Complete: "She won''t accept the position ___ she receives a better offer."','unless','["if","unless","when","while"]','"Unless" = if not. She won''t accept unless = she will accept only if.','hard'),
  (cid,7,49,'gap_fill','The results ___ (be) published after the peer review ___ (be) complete.','will be / is',NULL,'Time clause: present simple; main clause: will + base verb.','hard'),

  -- BLOCK 8: mixed future simple review
  (cid,8,50,'multiple_choice','Which sentence uses will correctly?','Scientists predict that renewable energy will supply 50% of global needs by 2050.','["Scientists predict that renewable energy supplies 50% by 2050.","Scientists predicted that renewable energy will supply 50% by 2050.","Scientists predict that renewable energy will supply 50% of global needs by 2050.","Scientists predict that renewable energy supplied 50% by 2050."]','Will for future predictions in academic contexts.','medium'),
  (cid,8,51,'gap_fill','A: "The projector is broken." B: "I ___ (ask) someone to fix it."','will ask',NULL,'Spontaneous decision in response to a problem: will + base verb.','easy'),
  (cid,8,52,'multiple_choice','Which is NOT a correct use of will?','She will going to the conference next month.','["I will help you with that.","They won''t submit the form.","Will you check this report?","She will going to the conference next month."]','"Will going" is incorrect — will + base verb (not going).','medium'),
  (cid,8,53,'gap_fill','The committee ___ (make) its final decision by the end of next month.','will make',NULL,'Future simple for decisions expected in the future.','easy'),
  (cid,8,54,'multiple_choice','Choose the sentence that uses will for a PREDICTION:','Experts believe that AI will change the job market permanently.','["She is going to present her paper tomorrow (planned).","I''ll get the door (spontaneous offer).","Experts believe that AI will change the job market permanently.","He promised he will be on time."]','Will for expert predictions about the future.','medium'),
  (cid,8,55,'gap_fill','If we don''t act now, the consequences ___ (be) severe.','will be',NULL,'Conditional type 1: if + present simple + will + base verb.','medium'),
  (cid,8,56,'multiple_choice','Which sentence is a promise?','I will always acknowledge my sources in my research.','["I always acknowledge my sources.","I will always acknowledge my sources in my research.","I was always acknowledging my sources.","I have always acknowledged my sources."]','Will + always = commitment/promise.','medium'),

  -- BLOCK 9: TOEFL academic contexts
  (cid,9,57,'multiple_choice','[TOEFL Reading] According to the passage, the authors predict that rising temperatures ___ affect crop yields significantly.','will','["are going to","will","are","have to"]','Will for academic predictions in TOEFL reading passages.','medium'),
  (cid,9,58,'gap_fill','[TOEFL Listening] The professor states: "New regulations ___ (likely/reshape) the pharmaceutical industry over the next decade."','will likely reshape',NULL,'Will + adverb + base verb for academic predictions in lectures.','hard'),
  (cid,9,59,'multiple_choice','[TOEFL Reading] Complete the sentence: "If current immigration patterns continue, urban populations ___ dramatically by 2050."','will increase','["increased","are increasing","will increase","have increased"]','Will + base verb for conditional future prediction.','medium'),
  (cid,9,60,'gap_fill','[TOEFL Listening] The speaker suggests that online education ___ (eventually/replace) traditional classroom models.','will eventually replace',NULL,'Academic prediction: will + adverb + base verb.','hard'),
  (cid,9,61,'multiple_choice','[TOEFL Reading] Which sentence is most appropriate in an academic conclusion section?','These findings will inform future research in cognitive psychology.','["These findings are informing future research.","These findings informed future research.","These findings will inform future research in cognitive psychology.","These findings have informing future research."]','Will is used in academic conclusions to describe future implications.','hard'),
  (cid,9,62,'gap_fill','[TOEFL Reading] The researchers conclude that further studies ___ (be) necessary to validate these results.','will be',NULL,'Academic conclusion: will be + adjective/necessary.','medium'),
  (cid,9,63,'multiple_choice','[TOEFL Listening] The lecturer says, "If the funding is approved, the team ___." Choose the best completion.','will begin trials immediately','["begins trials immediately","began trials immediately","will begin trials immediately","is beginning trials immediately"]','Type 1 conditional: if + present + will + base verb.','hard'),

  -- BLOCK 10: TOEFL production tasks
  (cid,10,64,'multiple_choice','[TOEFL Reading] Which sentence best expresses a future research implication using will?','Further investigation will be required to determine the long-term effects of the treatment.','["Further investigation is required to determine the long-term effects.","Further investigation was required to determine the long-term effects.","Further investigation will be required to determine the long-term effects of the treatment.","Further investigation has been required to determine the long-term effects."]','Will be + past participle (passive) for academic future predictions.','hard'),
  (cid,10,65,'gap_fill','[TOEFL Reading] The study concludes that the proposed changes ___ (not/solve) the problem entirely and that additional measures ___ (require) attention.','will not solve / will require',NULL,'Academic conclusions often use will for future implications.','hard'),
  (cid,10,66,'multiple_choice','[TOEFL Speaking — 45s] You are asked: "Do you think technology will improve education?" Which response uses will most effectively?','Technology will certainly transform education by making learning more personalized, but it won''t replace the critical role of human teachers.','["Technology improves education because it is useful.","Technology will certainly transform education by making learning more personalized, but it won''t replace the critical role of human teachers.","Technology improved education already in many ways.","Technology is improving education right now."]','Will + base verb for opinions and predictions about the future.','hard'),
  (cid,10,67,'production','[TOEFL Speaking — 45s] A professor asks: "What do you think will be the most important scientific development in the next 20 years?" Give a 45-second response using will for predictions, won''t for negatives, and include at least one conditional (if + present simple, will + base verb).','',NULL,'Use will for predictions, won''t for negatives, and if + present simple + will for conditionals.','hard'),
  (cid,10,68,'production','[TOEFL Writing] Write a short paragraph (4-5 sentences) about how artificial intelligence will impact higher education over the next decade. Use will for predictions, won''t for limitations, and include at least one spontaneous offer or promise structure.','',NULL,'Academic writing often uses will for future implications and predictions in conclusion sections.','hard'),
  (cid,10,69,'multiple_choice','[TOEFL Writing] Which sentence best fits the conclusion of an academic essay about climate policy?','Without immediate action, climate change will pose an existential threat to future generations.','["Without immediate action, climate change poses an existential threat.","Without immediate action, climate change posed an existential threat.","Without immediate action, climate change will pose an existential threat to future generations.","Without immediate action, climate change is posing an existential threat."]','Will in academic writing for projected future consequences.','hard'),
  (cid,10,70,'production','[TOEFL Writing] Write a paragraph predicting the future of work in your field of interest. Include: at least 3 will + base verb predictions, 1 won''t sentence, and 1 time clause (when/as soon as/once + present simple, will + base verb).','',NULL,'Demonstrate mastery of will for predictions, won''t for negatives, and present simple in time clauses.','hard')

  ON CONFLICT (content_id, block_number, exercise_number) DO NOTHING;
END $$;
