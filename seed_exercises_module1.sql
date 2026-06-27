-- ============================================================
-- SEED: Módulo 1 — Verb TO BE (A1)
-- 35 exercícios GERAIS (gap_fill / multiple_choice)
-- 35 exercícios TOEFL  (production / gap_fill acadêmico)
-- Execute no Supabase SQL Editor do projeto TOEFL
-- ============================================================

DO $$
DECLARE
  content_uuid TEXT;
BEGIN
  SELECT id INTO content_uuid FROM contents WHERE name ILIKE '%to be%' OR name ILIKE '%verb be%' LIMIT 1;

  IF content_uuid IS NULL THEN
    RAISE EXCEPTION 'Módulo "Verb TO BE" não encontrado em contents. Execute o supabase_completo.sql primeiro.';
  END IF;

  -- ══════════════════════════════════════════════════════════
  -- PARTE 1 — 35 EXERCÍCIOS GERAIS (gramática e mecânica)
  -- ══════════════════════════════════════════════════════════

  INSERT INTO exercises (content_id, block_number, exercise_number, type, question, answer, options, explanation, difficulty) VALUES

  -- A1 básico
  (content_uuid, 1, 1, 'gap_fill', 'I ___ a student.', 'am', NULL, 'I → AM', 'easy'),
  (content_uuid, 1, 2, 'gap_fill', 'She ___ a teacher.', 'is', NULL, 'She → IS (3ª singular)', 'easy'),
  (content_uuid, 1, 3, 'gap_fill', 'They ___ from Brazil.', 'are', NULL, 'They → ARE (plural)', 'easy'),
  (content_uuid, 1, 4, 'gap_fill', 'He ___ very tall.', 'is', NULL, 'He → IS', 'easy'),
  (content_uuid, 1, 5, 'gap_fill', 'We ___ ready to start.', 'are', NULL, 'We → ARE', 'easy'),
  (content_uuid, 1, 6, 'gap_fill', 'You ___ my best friend.', 'are', NULL, 'You → ARE', 'easy'),
  (content_uuid, 1, 7, 'gap_fill', 'It ___ a beautiful day.', 'is', NULL, 'It → IS', 'easy'),

  -- Negative forms
  (content_uuid, 1, 8, 'gap_fill', 'She ___ not at home right now.', 'is', NULL, 'She is not = She isn''t', 'easy'),
  (content_uuid, 1, 9, 'gap_fill', 'They ___ not students anymore.', 'are', NULL, 'They are not = They aren''t', 'easy'),
  (content_uuid, 1, 10, 'gap_fill', 'I ___ not tired today.', 'am', NULL, 'I am not = I''m not', 'easy'),

  -- Multiple choice — correct form
  (content_uuid, 2, 11, 'multiple_choice', 'Which sentence is CORRECT?', 'She is a doctor.', '["She are a doctor.", "She is a doctor.", "She am a doctor.", "She be a doctor."]', 'She (3ª singular) takes IS', 'easy'),
  (content_uuid, 2, 12, 'multiple_choice', 'Which sentence is CORRECT?', 'They are engineers.', '["They is engineers.", "They am engineers.", "They are engineers.", "They be engineers."]', 'They (plural) takes ARE', 'easy'),
  (content_uuid, 2, 13, 'multiple_choice', 'Which sentence is CORRECT?', 'I am happy today.', '["I is happy today.", "I are happy today.", "I am happy today.", "I be happy today."]', 'I always takes AM', 'easy'),
  (content_uuid, 2, 14, 'multiple_choice', 'Choose the CORRECT contraction: "I am not"', 'I''m not', '["I isn''t", "I''m not", "I amn''t", "I aren''t"]', 'I am not → I''m not (only correct negative contraction)', 'medium'),
  (content_uuid, 2, 15, 'multiple_choice', 'Choose the CORRECT question form: "She is late."', 'Is she late?', '["She is late?", "Is she late?", "Does she late?", "Are she late?"]', 'Question: invert subject and verb → Is she...?', 'medium'),

  -- Questions and short answers
  (content_uuid, 2, 16, 'gap_fill', '___ you from São Paulo?', 'Are', NULL, 'Question with "you" → Are', 'medium'),
  (content_uuid, 2, 17, 'gap_fill', '___ he a good student?', 'Is', NULL, 'Question with "he" → Is', 'medium'),
  (content_uuid, 2, 18, 'gap_fill', 'Yes, she ___. (short answer)', 'is', NULL, 'Short answer: Yes, she is.', 'medium'),
  (content_uuid, 2, 19, 'gap_fill', 'No, they ___. (short answer negative)', 'aren''t', NULL, 'Short answer: No, they aren''t.', 'medium'),
  (content_uuid, 2, 20, 'gap_fill', 'What ___ your name?', 'is', NULL, 'What is your name? — "What" is singular → is', 'medium'),

  -- Contractions
  (content_uuid, 3, 21, 'gap_fill', 'She ___ (she + is contraction) a nurse.', 'She''s', NULL, 'She is → She''s', 'medium'),
  (content_uuid, 3, 22, 'gap_fill', 'They ___ (they + are contraction) late.', 'They''re', NULL, 'They are → They''re', 'medium'),
  (content_uuid, 3, 23, 'gap_fill', 'I ___ (I + am contraction) so happy!', 'I''m', NULL, 'I am → I''m', 'easy'),
  (content_uuid, 3, 24, 'gap_fill', 'He ___ (he + is contraction) not here.', 'He''s', NULL, 'He is → He''s', 'medium'),
  (content_uuid, 3, 25, 'gap_fill', 'It ___ (it + is + not contraction) a problem.', 'isn''t', NULL, 'is not → isn''t', 'medium'),

  -- Harder gap fill
  (content_uuid, 3, 26, 'multiple_choice', '"The news ___ bad today." Which is correct?', 'is', '["is", "are", "am", "be"]', '"The news" is grammatically singular → is', 'hard'),
  (content_uuid, 3, 27, 'multiple_choice', '"The team ___ playing well." Which is correct?', 'is', '["are", "is", "am", "were"]', 'Collective noun "team" → singular → is', 'hard'),
  (content_uuid, 3, 28, 'gap_fill', 'There ___ a book on the table.', 'is', NULL, 'There is (singular) / There are (plural)', 'medium'),
  (content_uuid, 3, 29, 'gap_fill', 'There ___ many students in the library.', 'are', NULL, 'There are (plural)', 'medium'),
  (content_uuid, 3, 30, 'multiple_choice', 'Which is a QUESTION TAG for "She is smart"?', 'isn''t she?', '["is she?", "isn''t she?", "aren''t she?", "don''t she?"]', 'Positive sentence → negative tag → isn''t she?', 'hard'),

  -- Mixed review
  (content_uuid, 4, 31, 'gap_fill', 'My parents ___ doctors.', 'are', NULL, '"parents" is plural → are', 'easy'),
  (content_uuid, 4, 32, 'gap_fill', 'The cat ___ black and white.', 'is', NULL, '"the cat" is singular → is', 'easy'),
  (content_uuid, 4, 33, 'multiple_choice', 'Identify the error: "He are a good person."', 'are → is', '["He → She", "are → is", "a → an", "person → people"]', 'He takes IS, not ARE', 'medium'),
  (content_uuid, 4, 34, 'gap_fill', 'The children ___ very excited.', 'are', NULL, '"children" is irregular plural → are', 'medium'),
  (content_uuid, 4, 35, 'multiple_choice', 'Choose the correct form: "___ John and Mary married?"', 'Are', '["Is", "Are", "Am", "Be"]', 'Plural subject (John AND Mary) → Are', 'medium'),

  -- ══════════════════════════════════════════════════════════
  -- PARTE 2 — 35 EXERCÍCIOS TOEFL (acadêmico / produção)
  -- ══════════════════════════════════════════════════════════

  -- TOEFL Reading-style: choose correct form in academic context
  (content_uuid, 5, 36, 'gap_fill', '[TOEFL Reading] "The findings of the study ___ significant." ', 'are', NULL, '"findings" is plural → are', 'medium'),
  (content_uuid, 5, 37, 'gap_fill', '[TOEFL Reading] "The hypothesis ___ that climate change is accelerating."', 'is', NULL, '"hypothesis" is singular → is', 'medium'),
  (content_uuid, 5, 38, 'gap_fill', '[TOEFL Reading] "Both the professor and the researcher ___ present at the conference."', 'are', NULL, 'Two subjects joined by "and" → plural → are', 'hard'),
  (content_uuid, 5, 39, 'multiple_choice', '[TOEFL] "The data ___ analyzed by the research team." Choose the correct form.', 'are', '["is", "are", "was", "am"]', '"data" is plural in academic English → are', 'hard'),
  (content_uuid, 5, 40, 'multiple_choice', '[TOEFL] "The committee ___ in agreement on this issue." Choose the correct form.', 'is', '["are", "is", "am", "were"]', 'Collective noun acting as unit → singular → is', 'hard'),

  -- TOEFL Listening-style: understanding spoken academic English
  (content_uuid, 5, 41, 'multiple_choice', '[TOEFL Listening] The professor says: "The results aren''t what we expected." This means:', 'The results are NOT what was expected.', '["The results are exactly what was expected.", "The results are NOT what was expected.", "The professor is not satisfied.", "The experiment failed."]', 'aren''t = are not; the results differ from expectations', 'medium'),
  (content_uuid, 5, 42, 'multiple_choice', '[TOEFL Listening] A student says "I''m not sure about the deadline." What does this mean?', 'The student does not know the deadline.', '["The student missed the deadline.", "The student does not know the deadline.", "The student is certain about the deadline.", "The student wants a new deadline."]', 'I''m not sure = I am not certain', 'medium'),
  (content_uuid, 5, 43, 'gap_fill', '[TOEFL Listening] The speaker states: "Climate change ___ one of the most pressing issues today."', 'is', NULL, 'Climate change (singular) → is', 'medium'),
  (content_uuid, 5, 44, 'multiple_choice', '[TOEFL Listening] "The lecture isn''t about grammar." What is the correct meaning?', 'The lecture is about a topic other than grammar.', '["The lecture is about grammar.", "The lecture is about grammar and other topics.", "The lecture is about a topic other than grammar.", "The lecture has been cancelled."]', 'isn''t = is not', 'easy'),
  (content_uuid, 5, 45, 'gap_fill', '[TOEFL Listening] "The university library ___ open 24 hours during finals week."', 'is', NULL, '"library" is singular → is', 'easy'),

  -- TOEFL Speaking-style: production tasks
  (content_uuid, 6, 46, 'production', '[TOEFL Speaking — 45s] Describe your hometown. Use "is" and "are" at least 3 times. Focus on: What is it like? What are some famous places?', '', NULL, 'Example: "My hometown is Santos. It is a coastal city. The beaches are beautiful and the people are very friendly."', 'medium'),
  (content_uuid, 6, 47, 'production', '[TOEFL Speaking — 45s] A friend asks: "What is your major and why is it important?" Answer using "is" and "are" naturally.', '', NULL, 'Use: My major is... It is important because... There are many opportunities...', 'medium'),
  (content_uuid, 6, 48, 'production', '[TOEFL Speaking — 45s] Describe a teacher who is important to you. Use: "He/She is...", "The lessons are...", "It is..."', '', NULL, 'Practice natural use of TO BE in personal descriptions.', 'medium'),
  (content_uuid, 6, 49, 'production', '[TOEFL Speaking — 45s] The professor says: "Universities are the backbone of society." Do you agree? Explain why universities are or aren''t essential.', '', NULL, 'This is an integrated speaking task. Use: Universities are... They are... Education is...', 'hard'),
  (content_uuid, 6, 50, 'production', '[TOEFL Speaking — 45s] A classmate is confused about "is" vs "are". Explain the rule in English as if you are tutoring them.', '', NULL, 'Teach the rule: I am, he/she/it is, we/you/they are. Use examples.', 'hard'),

  -- TOEFL Writing-style: sentence correction and short essays
  (content_uuid, 6, 51, 'production', '[TOEFL Writing] Write 3-4 academic sentences about why education IS important in the modern world. Use "is", "are", and "it is" correctly.', '', NULL, 'Target: "Education is the key to economic development. Universities are centers of innovation. It is essential that..."', 'hard'),
  (content_uuid, 6, 52, 'production', '[TOEFL Writing] Rewrite this sentence correctly: "The students is happy because the exam are easy." Then explain both errors.', '', NULL, 'Correction: "The students ARE happy because the exam IS easy." Explain: students=plural→are; exam=singular→is', 'medium'),
  (content_uuid, 6, 53, 'production', '[TOEFL Writing] Complete this academic paragraph (3+ sentences): "Climate change ___ a global crisis. The effects ___ already visible. Scientists ___ warning that..."', '', NULL, 'Answers: is / are / are. Practice subject-verb agreement in academic writing.', 'hard'),
  (content_uuid, 6, 54, 'production', '[TOEFL Writing] Write a 5-sentence opinion: "Is social media beneficial or harmful to students?" Use TO BE correctly throughout.', '', NULL, 'Use: Social media is... The benefits are... However, it is also true that... Many students are...', 'hard'),
  (content_uuid, 6, 55, 'production', '[TOEFL Writing] Identify and fix all errors in this passage: "My country are located in South America. The capital is Brasília. The people is very welcoming."', '', NULL, 'country→is (singular); people→are (plural). Brasília→is (correct)', 'medium'),

  -- Advanced TOEFL gap fill (reading-style)
  (content_uuid, 7, 56, 'multiple_choice', '[TOEFL] "Neither the students nor the professor ___ aware of the new policy."', 'is', '["are", "is", "am", "were"]', 'Neither...nor → verb agrees with the NEAREST subject (professor=singular) → is', 'hard'),
  (content_uuid, 7, 57, 'multiple_choice', '[TOEFL] "Either the director or the board members ___ responsible for the decision."', 'are', '["is", "are", "am", "be"]', 'Either...or → verb agrees with NEAREST subject (members=plural) → are', 'hard'),
  (content_uuid, 7, 58, 'gap_fill', '[TOEFL] "The number of students in this program ___ increasing every year."', 'is', NULL, '"The number" is singular → is (vs. "A number of students ARE...")', 'hard'),
  (content_uuid, 7, 59, 'gap_fill', '[TOEFL] "A number of factors ___ contributing to the rise in tuition."', 'are', NULL, '"A number of" = many → plural → are', 'hard'),
  (content_uuid, 7, 60, 'multiple_choice', '[TOEFL] "Each of the participants ___ required to sign a consent form."', 'is', '["are", "is", "am", "were"]', '"Each" is always singular → is', 'hard'),
  (content_uuid, 7, 61, 'multiple_choice', '[TOEFL] "The majority of the research ___ inconclusive."', 'is', '["are", "is", "am", "were"]', '"The majority of + uncountable noun" → singular → is', 'hard'),
  (content_uuid, 7, 62, 'gap_fill', '[TOEFL] "There ___ little evidence to support this claim."', 'is', NULL, '"little" = uncountable/singular → is', 'hard'),
  (content_uuid, 7, 63, 'gap_fill', '[TOEFL] "The media ___ known to influence public opinion."', 'is', NULL, '"The media" = collective → singular → is (in formal academic English)', 'hard'),
  (content_uuid, 7, 64, 'multiple_choice', '[TOEFL] "Statistics ___ a required course for all social science majors."', 'is', '["are", "is", "am", "be"]', '"Statistics" as a subject/field → singular → is', 'hard'),
  (content_uuid, 7, 65, 'multiple_choice', '[TOEFL] "The economics of developing nations ___ complex."', 'is', '["are", "is", "am", "were"]', '"Economics" as a field → singular → is', 'hard'),

  -- Final production tasks (TOEFL exam-style)
  (content_uuid, 8, 66, 'production', '[TOEFL Speaking Task 1 — 45s] "Do you agree or disagree: It is more important to study abroad than to study locally?" Give your opinion with 2 reasons.', '', NULL, 'Use: I believe it is... Studying abroad is... The experiences are... However, local universities are also...', 'hard'),
  (content_uuid, 8, 67, 'production', '[TOEFL Speaking Task 2 — 45s] Read: "The university is planning to eliminate printed textbooks. Students are expected to use digital resources only." Summarize and give your opinion.', '', NULL, 'Summarize then react: The university is planning... Digital resources are... However, printed books are...', 'hard'),
  (content_uuid, 8, 68, 'production', '[TOEFL Writing — 150 words] "Technology is changing education forever." Write a balanced argument. Use TO BE at least 10 times correctly.', '', NULL, 'Argument structure: Intro (Tech is...) → Point 1 (Online courses are...) → Point 2 (However, human teachers are irreplaceable...) → Conclusion', 'hard'),
  (content_uuid, 8, 69, 'production', '[TOEFL Writing — Error Correction] Rewrite this academic paragraph fixing all TO BE errors: "University libraries is essential. The books which is available there are useful for research. It are important that students is aware of these resources."', '', NULL, 'Corrections: libraries ARE; books which ARE; It IS; students ARE', 'medium'),
  (content_uuid, 8, 70, 'production', '[TOEFL Academic Synthesis] You read: "Data IS the new oil." The professor says: "The data FROM this study ARE compelling." Explain why both sentences are correct despite using different forms of TO BE.', '', NULL, '"Data" as a concept/mass noun = singular IS. "Data from this study" as countable results = plural ARE. Context determines number agreement.', 'hard')
  ON CONFLICT (content_id, block_number, exercise_number) DO NOTHING;

END $$;
