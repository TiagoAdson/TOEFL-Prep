-- ============================================================
-- SEED: Módulo 24 — Discourse Markers (C2)
-- 35 exercícios GERAIS + 35 exercícios TOEFL = 70 total
-- ============================================================
DO $$
DECLARE cid TEXT;
BEGIN
  SELECT id INTO cid FROM contents WHERE id = 'discourse-markers';
  IF cid IS NULL THEN RAISE EXCEPTION 'Módulo discourse-markers não encontrado'; END IF;

  INSERT INTO exercises (content_id, block_number, exercise_number, type, question, answer, options, explanation, difficulty) VALUES

  -- BLOCO 1 — Marcadores de adição e contraste
  (cid,1,1,'multiple_choice','Choose the correct discourse marker: "The results were positive. ___, further research is needed."','However','["Therefore","However","Moreover","Thus"]','However = contraste/concessão','medium'),
  (cid,1,2,'gap_fill','___ the difficulty of the task, the team completed it on time.','Despite',NULL,'Despite + noun phrase = contraste sem "although"','medium'),
  (cid,1,3,'multiple_choice','"The policy was controversial. ___, it was approved by a majority." Choose the best marker.','Nevertheless','["Furthermore","Nevertheless","For instance","In addition"]','Nevertheless = apesar disso (strong contrast)','hard'),
  (cid,1,4,'gap_fill','The experiment failed. ___, the researchers gained valuable data.','Nonetheless',NULL,'Nonetheless = mesmo assim (concession)','hard'),
  (cid,1,5,'multiple_choice','Which marker signals ADDITION?','Furthermore','["However","Furthermore","Whereas","Instead"]','Furthermore = além disso (addition)','easy'),
  (cid,1,6,'gap_fill','Inflation has risen. ___, unemployment has decreased.','Meanwhile',NULL,'Meanwhile = ao mesmo tempo (simultaneidade)','medium'),
  (cid,1,7,'multiple_choice','"She studied hard. ___ she passed all her exams." Best marker?','As a result','["In contrast","As a result","On the other hand","Despite"]','As a result = causa-efeito','easy'),
  (cid,1,8,'gap_fill','___ to cost, quality is the most important factor in this decision.','With regard',NULL,'With regard to = em relação a (formal topic marker)','hard'),
  (cid,1,9,'multiple_choice','Which phrase introduces an example in formal writing?','For instance','["In contrast","For instance","Therefore","Nevertheless"]','For instance = por exemplo','easy'),
  (cid,1,10,'gap_fill','The data is inconclusive. ___, we cannot draw firm conclusions.','Therefore',NULL,'Therefore = portanto (logical consequence)','easy'),

  -- BLOCO 2 — Marcadores causais e de conclusão
  (cid,2,11,'multiple_choice','Choose the correct marker: "Many students struggle with grammar. ___, dedicated practice helps significantly."','That said','["That said","Instead","Despite","Whereas"]','That said = dito isso (concession then pivot)','hard'),
  (cid,2,12,'gap_fill','___ terms of academic performance, attendance is a key factor.','In',NULL,'In terms of = em termos de (topic framing)','medium'),
  (cid,2,13,'multiple_choice','Which marker best expresses CAUSE?','Consequently','["Whereas","Consequently","In addition","On the contrary"]','Consequently = consequentemente','medium'),
  (cid,2,14,'gap_fill','___ far as academic writing is concerned, clarity is paramount.','As',NULL,'As far as X is concerned = no que diz respeito a','hard'),
  (cid,2,15,'multiple_choice','"Group A scored higher. ___, Group B showed more improvement over time."','On the other hand','["Moreover","On the other hand","Thus","In addition"]','On the other hand = por outro lado','medium'),
  (cid,2,16,'gap_fill','___ conclusion, the evidence supports the hypothesis.','In',NULL,'In conclusion = para concluir','easy'),
  (cid,2,17,'multiple_choice','Which marker is used to SUMMARIZE?','To summarize','["However","To summarize","For example","In contrast"]','To summarize = para resumir','easy'),
  (cid,2,18,'gap_fill','The study has limitations. ___, the findings are still significant.','Even so',NULL,'Even so = mesmo assim (concession)','hard'),
  (cid,2,19,'multiple_choice','Choose the correct use of "whereas": ','Urban areas grow rapidly, whereas rural populations decline.','["Urban areas grow rapidly, whereas rural populations decline.","Urban areas grow rapidly. Whereas rural populations decline.","Whereas, urban areas grow rapidly but rural populations decline.","Urban areas, whereas rural populations decline, grow rapidly."]','whereas at beginning of clause, comma before it','hard'),
  (cid,2,20,'gap_fill','___ other words, the hypothesis was not supported by the data.','In',NULL,'In other words = em outras palavras (reformulation)','easy'),

  -- BLOCO 3 — Marcadores de organização textual
  (cid,3,21,'multiple_choice','Which phrase introduces a CONTRASTING point most formally?','On the contrary','["Also","On the contrary","So","And"]','On the contrary = pelo contrário (strong formal contrast)','hard'),
  (cid,3,22,'gap_fill','___ to the previous study, this research uses a larger sample.','In contrast',NULL,'In contrast to = em contraste com','medium'),
  (cid,3,23,'multiple_choice','The marker "hence" is closest in meaning to:','Therefore','["However","Therefore","Moreover","Although"]','Hence = portanto (formal)','medium'),
  (cid,3,24,'gap_fill','___ should be noted that the sample size was limited.','It',NULL,'It should be noted that = é importante notar que (academic hedge)','hard'),
  (cid,3,25,'multiple_choice','Which marker shifts topic in academic writing?','Turning to','["As a result","Turning to","In spite of","Thus"]','Turning to = passando para / voltando para (topic shift)','hard'),
  (cid,3,26,'gap_fill','___ worth noting that these findings differ from previous research.','It is',NULL,'It is worth noting that = vale notar que','hard'),
  (cid,3,27,'multiple_choice','Choose the most formal way to add a point:','Furthermore, the data suggests a strong correlation.','["Also, the data suggests a strong correlation.","Plus the data suggests a strong correlation.","Furthermore, the data suggests a strong correlation.","And the data suggests a strong correlation."]','Furthermore is more formal than also/plus/and','medium'),
  (cid,3,28,'gap_fill','The first point concerns cost. ___ to the second point: quality.','Turning',NULL,'Turning to = topic shift marker','hard'),
  (cid,3,29,'multiple_choice','Which is a CONCESSION marker?','Admittedly','["Therefore","Admittedly","Moreover","In addition"]','Admittedly = reconhecendo um ponto contrário (concession)','hard'),
  (cid,3,30,'gap_fill','The results were unexpected. ___, they open new research directions.','That said',NULL,'That said = dito isso (pivot após concessão)','hard'),

  -- BLOCO 4 — Distinção fala vs escrita acadêmica
  (cid,4,31,'multiple_choice','Which discourse marker is appropriate in SPOKEN English but NOT in formal academic writing?','You know','["Furthermore","Nevertheless","You know","In contrast"]','You know = fala informal; avoid in academic writing','medium'),
  (cid,4,32,'gap_fill','The spoken marker "I mean" is best replaced in academic writing by "___.','That is to say',NULL,'That is to say / In other words = reformulação formal','hard'),
  (cid,4,33,'multiple_choice','In a TOEFL essay, which opener is most appropriate?','It is widely acknowledged that education plays a vital role in economic development.','["Well, education is really important for economic stuff.","So basically education matters a lot.","It is widely acknowledged that education plays a vital role in economic development.","You know, education is kind of important."]','Formal academic register; avoid well/so/basically/you know','hard'),
  (cid,4,34,'gap_fill','___ with respect to methodology, the study has clear strengths.','As',NULL,'As with respect to / With respect to = formal framing','hard'),
  (cid,4,35,'multiple_choice','Which sequence correctly organizes an argument?','Firstly... Secondly... Finally... In conclusion...','["Firstly... Secondly... Finally... In conclusion...","First of all... Then... And then... So...","Well... Also... Another thing... Anyway...","To start... Next... Last... So basically..."]','Firstly/Secondly/Finally/In conclusion = formal sequence markers','medium'),

  -- BLOCO 5 — TOEFL Reading: marcadores em texto acadêmico
  (cid,5,36,'multiple_choice','[TOEFL Reading] "The theory was initially rejected. ___, subsequent evidence confirmed its validity." Best marker:','Subsequently','["However","Subsequently","In addition","Whereas"]','Subsequently = depois disso (time sequence)','hard'),
  (cid,5,37,'gap_fill','[TOEFL Reading] "The study examined two variables: income ___ education level."','and',NULL,'and = additive connector in noun phrase','easy'),
  (cid,5,38,'multiple_choice','[TOEFL Reading] Which marker signals the AUTHOR''S CONCLUSION?','Thus, the data supports the hypothesis that...','["However, the data supports the hypothesis...","Thus, the data supports the hypothesis that...","Although the data supports the hypothesis...","For instance, the data supports the hypothesis..."]','Thus = logical conclusion marker','medium'),
  (cid,5,39,'gap_fill','[TOEFL Reading] "___ noted by Smith (2020), the relationship between variables is complex."','As',NULL,'As noted by = formal attribution marker','medium'),
  (cid,5,40,'multiple_choice','[TOEFL Reading] "Group A improved. Group B, ___, showed no change." Best word:','conversely','["additionally","moreover","conversely","subsequently"]','conversely = pelo contrário (contrasting parallel)','hard'),
  (cid,5,41,'gap_fill','[TOEFL] "The findings are significant; ___, further investigation is warranted."','however',NULL,'however after semicolon = formal contrast','hard'),
  (cid,5,42,'multiple_choice','[TOEFL] "The author uses ''in particular'' to:','Emphasize a specific example.','["Introduce a contrast","Summarize the argument","Emphasize a specific example.","Indicate a conclusion"]','in particular = especificação/ênfase','medium'),
  (cid,5,43,'gap_fill','[TOEFL] "The policy has broad implications. ___, it affects both public and private sectors."','Specifically',NULL,'Specifically = especificando (elaboration marker)','medium'),
  (cid,5,44,'multiple_choice','[TOEFL] "The research indicates a trend. ___ is to say, results are consistent across populations."','That','["That","This","It","What"]','That is to say = reformulation','hard'),
  (cid,5,45,'gap_fill','[TOEFL Reading] "The evidence is compelling; ___, some researchers remain skeptical."','nonetheless',NULL,'nonetheless = mesmo assim (concession after evidence)','hard'),

  -- BLOCO 6 — TOEFL Listening: marcadores em fala acadêmica
  (cid,6,46,'multiple_choice','[TOEFL Listening] A professor says: "Now, turning to our second point..." This means:','The professor is moving to a new topic.','["The professor is concluding.","The professor is giving an example.","The professor is moving to a new topic.","The professor is contrasting two ideas."]','Turning to = topic shift signal','medium'),
  (cid,6,47,'gap_fill','[TOEFL Listening] "The lecture covered three areas. ___, I''ll summarize the key ideas."','To summarize',NULL,'To summarize = lecture closing signal','easy'),
  (cid,6,48,'multiple_choice','[TOEFL Listening] "That said, we should consider alternative interpretations." ''That said'' signals:','A concession before a new point.','["Strong agreement","A final conclusion","A concession before a new point.","A specific example"]','that said = pivot: dito isso, mas...','hard'),
  (cid,6,49,'gap_fill','[TOEFL Listening] "The experiment succeeded. ___ the results surprised us all."','Moreover',NULL,'Moreover = adds positive information','medium'),
  (cid,6,50,'multiple_choice','[TOEFL Listening] "With regard to funding, the university faces significant challenges." This phrase:','Introduces the topic of the next statement.','["Concludes the argument","Contrasts two ideas","Introduces the topic of the next statement.","Provides a specific example"]','With regard to = topic marker','medium'),
  (cid,6,51,'multiple_choice','[TOEFL Listening] A student says "I mean, it''s complicated." The academic equivalent would be:','That is to say, the situation is complex.','["In other words, it is easy.","That is to say, the situation is complex.","To summarize, it is complex.","In conclusion, it is complicated."]','I mean → That is to say (informal→formal)','hard'),
  (cid,6,52,'gap_fill','[TOEFL] "The professor stressed that ___ is worth noting: the correlation does not imply causation."','it',NULL,'It is worth noting = academic attention marker','hard'),
  (cid,6,53,'multiple_choice','[TOEFL] "Nevertheless" is closest in meaning to:','Even so','["As a result","For example","Even so","In addition"]','Nevertheless = mesmo assim (formal concession)','medium'),
  (cid,6,54,'gap_fill','[TOEFL Listening] "First, let us consider the causes. ___, we will examine the effects."','Subsequently',NULL,'Subsequently = depois disso (sequencing)','hard'),
  (cid,6,55,'multiple_choice','[TOEFL] Which opening best signals a contrasting argument in a lecture?','On the other hand, critics argue that...','["Also, critics argue that...","And critics argue that...","On the other hand, critics argue that...","So critics argue that..."]','On the other hand = formal spoken contrast','medium'),

  -- BLOCO 7 — TOEFL Speaking Production
  (cid,7,56,'production','[TOEFL Speaking — 45s] Use at least 4 discourse markers to give your opinion on whether universities should make attendance mandatory. Include: however, furthermore, therefore, in conclusion.','',NULL,'Use: I believe... Furthermore... However... Therefore... In conclusion...','hard'),
  (cid,7,57,'production','[TOEFL Speaking — 45s] Describe two contrasting views on social media. Use: on the one hand / on the other hand / nevertheless / as a result.','',NULL,'On the one hand... On the other hand... Nevertheless... As a result...','hard'),
  (cid,7,58,'production','[TOEFL Speaking — 45s] A professor suggests students take gap years before university. Use discourse markers to agree or disagree: that said, moreover, consequently, in contrast.','',NULL,'That said... Moreover... Consequently... In contrast...','hard'),
  (cid,7,59,'production','[TOEFL Speaking — 45s] Explain the structure of a well-organized academic essay. Use sequence markers: firstly, secondly, furthermore, finally, in conclusion.','',NULL,'Firstly, an essay should... Secondly... Furthermore... Finally... In conclusion...','medium'),
  (cid,7,60,'production','[TOEFL Speaking — 45s] Describe a problem in your community and propose a solution. Use: with regard to, consequently, therefore, it is worth noting that.','',NULL,'With regard to [problem]... Consequently... Therefore... It is worth noting that...','hard'),

  -- BLOCO 8 — TOEFL Writing Production
  (cid,8,61,'production','[TOEFL Writing] Write a 5-sentence paragraph arguing that technology improves education. Use: furthermore, however, consequently, in addition, it should be noted that.','',NULL,'Technology... Furthermore... However... Consequently... In addition... It should be noted that...','hard'),
  (cid,8,62,'production','[TOEFL Writing — Error Correction] Fix the discourse markers: "The experiment failed. Despite, the team continued. Also furthermore, they published their findings. So in conclusion, persistence matters."','',NULL,'Despite → Nevertheless / Nonetheless; Also furthermore → choose one; So in conclusion → In conclusion','hard'),
  (cid,8,63,'production','[TOEFL Writing — 150 words] Write a balanced argument on whether governments should fund arts or science. Use at least 6 different discourse markers from: however, moreover, whereas, on the other hand, consequently, that said, in conclusion.','',NULL,'Governments... However... Moreover... Whereas... On the other hand... Consequently... That said... In conclusion...','hard'),
  (cid,8,64,'production','[TOEFL Writing] Rewrite these informal sentences using formal discourse markers: "Well, some people like it. Also it has problems. So it could be better."','',NULL,'Nevertheless → That said; Also → Furthermore / Moreover; So → Consequently / Therefore','hard'),
  (cid,8,65,'production','[TOEFL Writing] Write an introduction paragraph for an essay on climate change, using: with regard to, it is widely acknowledged that, furthermore, it should be noted that.','',NULL,'With regard to climate change, it is widely acknowledged that... Furthermore... It should be noted that...','hard'),

  -- BLOCO 9 — Avançado: distinções finas
  (cid,9,66,'multiple_choice','[TOEFL] What is the difference between "however" and "nevertheless"?','Both show contrast; nevertheless is stronger and more formal.','["However shows time; nevertheless shows contrast.","Both show contrast; nevertheless is stronger and more formal.","However is formal; nevertheless is informal.","They have opposite meanings."]','nevertheless = stronger concession than however','hard'),
  (cid,9,67,'gap_fill','[TOEFL] "The policy was criticized by experts. ___, the government proceeded with implementation."','Nonetheless',NULL,'Nonetheless = even so (strong persistence despite criticism)','hard'),
  (cid,9,68,'multiple_choice','[TOEFL] "In terms of X" is used to:','Frame the topic or aspect being discussed.','["Conclude an argument","Contrast two ideas","Frame the topic or aspect being discussed.","Provide an example"]','In terms of = framing the angle of discussion','hard'),
  (cid,9,69,'gap_fill','[TOEFL] "The results ___ speak for themselves: the intervention was effective."','arguably',NULL,'Arguably = one could argue = hedged claim','hard'),
  (cid,9,70,'production','[TOEFL Academic Synthesis] You have read two articles: one argues technology improves learning, the other argues it distracts students. Write a synthesis paragraph (5+ sentences) using at least 5 discourse markers to present both views and your conclusion.','',NULL,'While one perspective argues... On the other hand... Furthermore... Nevertheless... In conclusion, it can be argued that...','hard')

  ON CONFLICT (content_id, block_number, exercise_number) DO NOTHING;
END $$;
