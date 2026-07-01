// ============================================================
// TOEFL Prep — Dados de Teoria
// Resumo didático para conteúdos gramaticais + seções TOEFL
// ============================================================

export interface Example {
  en: string          // Frase em inglês
  pt: string          // Tradução
  label: string       // Categoria (ex: "Afirmativa", "Negativa")
}

export interface ContentTheory {
  title: string
  tagline: string
  summary: string
  structure: string
  examples: Example[]
  tip: string
}

export interface TOEFLSectionInfo {
  what: string
  format: string
  strategies: string[]
  timeInfo: string
}

// ============================================================
// TEORIA — 20 CONTEÚDOS GRAMATICAIS
// ============================================================

export const THEORY_MAP: Record<string, ContentTheory> = {

  'verbo-to-be': {
    title: 'Verbo TO BE',
    tagline: 'Ser e Estar em inglês',
    summary: 'TO BE é o verbo mais fundamental do inglês. Ele expressa identidade (o que você é), profissão, origem, características e estados temporários.\n\n🇬🇧 TO BE is the most fundamental verb in English. It expresses identity, profession, origin, characteristics, and temporary states.',
    structure: 'I am • You / We / They are • He / She / It is',
    examples: [
      { en: 'She is a doctor.', pt: 'Ela é médica.', label: 'Identidade / Profissão' },
      { en: 'I am from Brazil.', pt: 'Eu sou do Brasil.', label: 'Origem' },
      { en: 'They are not ready.', pt: 'Eles não estão prontos.', label: 'Negativa' },
      { en: 'Are you happy?', pt: 'Você está feliz?', label: 'Pergunta' },
    ],
    tip: 'Nunca use "do/does" para negar o TO BE. Use: I am NOT, she is NOT, they are NOT.',
  },

  'present-simple': {
    title: 'Present Simple',
    tagline: 'Rotinas, hábitos e fatos',
    summary: 'O Present Simple descreve ações habituais, rotinas, verdades universais e fatos permanentes. É o tempo verbal mais comum no inglês cotidiano.',
    structure: 'I/You/We/They + verbo base | He/She/It + verbo + S',
    examples: [
      { en: 'I wake up at 7am every day.', pt: 'Eu acordo às 7h todo dia.', label: 'Hábito' },
      { en: 'The sun rises in the east.', pt: 'O sol nasce no leste.', label: 'Fato universal' },
      { en: 'She does not eat meat.', pt: 'Ela não come carne.', label: 'Negativa (3ª pessoa)' },
      { en: 'Does he speak English?', pt: 'Ele fala inglês?', label: 'Pergunta (3ª pessoa)' },
    ],
    tip: 'Na 3ª pessoa (he/she/it), o verbo ganha -S: work→works, study→studies, go→goes.',
  },

  'past-simple': {
    title: 'Past Simple',
    tagline: 'Ações concluídas no passado',
    summary: 'O Past Simple descreve ações que começaram e terminaram no passado. Pode ser com verbos regulares (-ed) ou irregulares (formas próprias).',
    structure: 'Verbo regular: + ED | Verbo irregular: forma própria (go→went)',
    examples: [
      { en: 'I visited London last year.', pt: 'Eu visitei Londres no ano passado.', label: 'Regular' },
      { en: 'She went to the store yesterday.', pt: 'Ela foi à loja ontem.', label: 'Irregular' },
      { en: 'He did not study for the exam.', pt: 'Ele não estudou para a prova.', label: 'Negativa' },
      { en: 'Did you see that movie?', pt: 'Você viu aquele filme?', label: 'Pergunta' },
    ],
    tip: 'Na negativa e pergunta do Past Simple, use DID + verbo no infinitivo: "Did you go?" nunca "Did you went?"',
  },

  'present-continuous': {
    title: 'Present Continuous',
    tagline: 'O que está acontecendo agora',
    summary: 'O Present Continuous descreve ações que estão acontecendo neste exato momento ou situações temporárias em andamento.',
    structure: 'AM / IS / ARE + verbo-ING',
    examples: [
      { en: 'I am studying English right now.', pt: 'Estou estudando inglês agora.', label: 'Ação em progresso' },
      { en: 'She is not working today.', pt: 'Ela não está trabalhando hoje.', label: 'Situação temporária' },
      { en: 'Are they coming to the party?', pt: 'Eles vão à festa?', label: 'Pergunta' },
      { en: 'He is always complaining!', pt: 'Ele está sempre reclamando!', label: 'Hábito irritante' },
    ],
    tip: 'Palavras-chave: now, right now, at the moment, currently. Cuidado: verbos de estado (know, like, believe) raramente usam -ing.',
  },

  'future-simple': {
    title: 'Future Simple (Will)',
    tagline: 'Previsões e decisões espontâneas',
    summary: 'WILL é usado para previsões sobre o futuro, decisões tomadas no momento da fala e promessas. Diferente do "be going to", que é para planos já feitos.',
    structure: 'Subject + WILL + verbo base',
    examples: [
      { en: 'It will rain tomorrow.', pt: 'Vai chover amanhã.', label: 'Previsão' },
      { en: 'I will help you with that.', pt: 'Eu vou te ajudar com isso.', label: 'Promessa espontânea' },
      { en: 'She will not attend the meeting.', pt: 'Ela não vai à reunião.', label: 'Negativa (won\'t)' },
      { en: 'Will you be at home tonight?', pt: 'Você vai estar em casa esta noite?', label: 'Pergunta' },
    ],
    tip: 'WILL para decisões na hora: "The phone is ringing." → "I\'ll answer it!" | BE GOING TO para planos: "I\'m going to travel next month."',
  },

  'be-going-to': {
    title: 'Be Going To',
    tagline: 'Planos e intenções futuras',
    summary: 'BE GOING TO expressa intenções e planos já decididos antes do momento da fala. Também é usado para previsões baseadas em evidências visíveis.',
    structure: 'AM / IS / ARE + going to + verbo base',
    examples: [
      { en: 'I am going to study medicine.', pt: 'Vou estudar medicina.', label: 'Plano / Intenção' },
      { en: 'Look at those clouds — it is going to rain!', pt: 'Olha aquelas nuvens — vai chover!', label: 'Previsão com evidência' },
      { en: 'We are not going to be late.', pt: 'Não vamos nos atrasar.', label: 'Negativa' },
      { en: 'Are you going to call her?', pt: 'Você vai ligar para ela?', label: 'Pergunta' },
    ],
    tip: 'Dica TOEFL: "be going to" = plano deliberado com evidência. "will" = decisão espontânea ou previsão sem evidência.',
  },

  'present-perfect': {
    title: 'Present Perfect',
    tagline: 'Experiências e ações recentes',
    summary: 'O Present Perfect conecta o passado ao presente. Usado para experiências de vida (sem momento específico), ações recentes com resultado atual e situações que continuam até agora.',
    structure: 'HAVE / HAS + Past Participle (3ª coluna)',
    examples: [
      { en: 'I have visited Japan twice.', pt: 'Eu visitei o Japão duas vezes.', label: 'Experiência de vida' },
      { en: 'She has just finished the report.', pt: 'Ela acabou de terminar o relatório.', label: 'Ação recente' },
      { en: 'Have you ever eaten sushi?', pt: 'Você já comeu sushi?', label: 'Pergunta com "ever"' },
      { en: 'They have lived here since 2010.', pt: 'Eles moram aqui desde 2010.', label: 'Situação contínua (since/for)' },
    ],
    tip: 'Palavras-chave: already, yet, ever, never, just, since, for, recently. Nunca use com tempo específico: ~~"I have seen him yesterday"~~ → "I saw him yesterday".',
  },

  'past-perfect': {
    title: 'Past Perfect',
    tagline: 'Passado dentro do passado',
    summary: 'O Past Perfect descreve uma ação que aconteceu ANTES de outra ação no passado. É o "mais-que-perfeito" do inglês — frequente em textos acadêmicos do TOEFL.',
    structure: 'HAD + Past Participle',
    examples: [
      { en: 'When I arrived, she had already left.', pt: 'Quando cheguei, ela já tinha ido embora.', label: 'Ação anterior' },
      { en: 'He had studied for 3 hours before the exam.', pt: 'Ele tinha estudado 3h antes da prova.', label: 'Sequência' },
      { en: 'They had never seen snow before.', pt: 'Eles nunca tinham visto neve antes.', label: 'Com "never"' },
      { en: 'Had she finished the project?', pt: 'Ela tinha terminado o projeto?', label: 'Pergunta' },
    ],
    tip: 'Pense em dois momentos no passado. O Past Perfect é sempre o que aconteceu PRIMEIRO. Palavras-chave: before, after, when, already, by the time.',
  },

  'conditional-1': {
    title: 'Conditional Tipo 1',
    tagline: 'Condições reais e possíveis',
    summary: 'O Conditional Tipo 1 expressa situações reais e possíveis no futuro. Se a condição acontecer (é provável), então o resultado ocorrerá.',
    structure: 'IF + Present Simple → WILL + verbo base',
    examples: [
      { en: 'If it rains, I will stay home.', pt: 'Se chover, vou ficar em casa.', label: 'Condição possível' },
      { en: 'If you study, you will pass.', pt: 'Se você estudar, vai passar.', label: 'Causa e efeito' },
      { en: 'I will call you if I arrive early.', pt: 'Vou ligar para você se chegar cedo.', label: 'Ordem invertida' },
      { en: 'Unless you hurry, we will miss the bus.', pt: 'A menos que você se apresse, perderemos o ônibus.', label: 'Unless = if not' },
    ],
    tip: 'NUNCA coloque "will" na cláusula com IF: ~~"If it will rain"~~ → "If it rains". O "if" já indica futuro.',
  },

  'modais-basicos': {
    title: 'Modais Básicos',
    tagline: 'Can, could, may, should, must',
    summary: 'Verbos modais modificam o verbo principal para expressar habilidade, permissão, possibilidade, obrigação ou conselho. São seguidos sempre por verbo no infinitivo sem "to".',
    structure: 'Modal + VERBO BASE (sem to)',
    examples: [
      { en: 'She can speak three languages.', pt: 'Ela sabe falar três idiomas.', label: 'CAN = habilidade' },
      { en: 'You should study every day.', pt: 'Você deveria estudar todo dia.', label: 'SHOULD = conselho' },
      { en: 'Students must submit their work.', pt: 'Alunos devem entregar o trabalho.', label: 'MUST = obrigação forte' },
      { en: 'It might rain this afternoon.', pt: 'Pode chover esta tarde.', label: 'MIGHT = possibilidade fraca' },
    ],
    tip: 'Modais nunca ganham -S na 3ª pessoa: ~~"She cans"~~ → "She can". Sempre: modal + verbo base. Para negar: modal + NOT.',
  },

  'relative-clauses': {
    title: 'Relative Clauses',
    tagline: 'Who, which, that — dando mais info',
    summary: 'Relative clauses adicionam informação sobre um substantivo usando pronomes relativos. Essenciais no TOEFL Reading para compreender frases longas e complexas.',
    structure: 'WHO (pessoas) | WHICH (coisas) | THAT (ambos) | WHOSE (posse)',
    examples: [
      { en: 'The woman who called is my professor.', pt: 'A mulher que ligou é minha professora.', label: 'WHO = pessoa' },
      { en: 'The book which I read was amazing.', pt: 'O livro que li foi incrível.', label: 'WHICH = coisa' },
      { en: 'This is the city where I was born.', pt: 'Esta é a cidade onde nasci.', label: 'WHERE = lugar' },
      { en: 'The student whose notes I borrowed passed.', pt: 'O aluno cujas notas peguei foi aprovado.', label: 'WHOSE = posse' },
    ],
    tip: 'TOEFL tip: quando você ver uma cláusula longa, identifique o substantivo principal + o pronome relativo para entender a estrutura.',
  },

  'conditional-2-3': {
    title: 'Conditional Tipos 2 e 3',
    tagline: 'Situações hipotéticas e irreais',
    summary: 'Tipo 2: situações hipotéticas no presente/futuro (improvável ou impossível). Tipo 3: situações que NÃO aconteceram no passado — arrependimentos e especulações.',
    structure: 'Tipo 2: IF + Past Simple → WOULD + base | Tipo 3: IF + Past Perfect → WOULD HAVE + pp',
    examples: [
      { en: 'If I were rich, I would travel the world.', pt: 'Se eu fosse rico, viajaria pelo mundo.', label: 'Tipo 2 (hipotético)' },
      { en: 'If she studied harder, she would pass.', pt: 'Se ela estudasse mais, passaria.', label: 'Tipo 2 (conselho indireto)' },
      { en: 'If I had studied, I would have passed.', pt: 'Se eu tivesse estudado, teria passado.', label: 'Tipo 3 (arrependimento)' },
      { en: 'She would have come if she had known.', pt: 'Ela teria vindo se tivesse sabido.', label: 'Tipo 3 (especulação)' },
    ],
    tip: 'Use "were" para todos com Tipo 2: "If I were you..." (não "If I was"). No TOEFL, Tipo 3 é muito comum em textos acadêmicos.',
  },

  'reported-speech': {
    title: 'Reported Speech',
    tagline: 'Contando o que alguém disse',
    summary: 'Reported Speech (discurso indireto) relata o que alguém disse sem usar as palavras exatas. Os tempos verbais recuam um passo no passado (backshift).',
    structure: 'He said (that) + [tempo recuado]',
    examples: [
      { en: '"I am tired." → She said she was tired.', pt: '"Estou cansada." → Ela disse que estava cansada.', label: 'is → was' },
      { en: '"I will help you." → He said he would help me.', pt: '"Vou te ajudar." → Ele disse que me ajudaria.', label: 'will → would' },
      { en: '"I have finished." → She said she had finished.', pt: '"Terminei." → Ela disse que tinha terminado.', label: 'have → had' },
      { en: '"Can you come?" → He asked if I could come.', pt: '"Você pode vir?" → Ele perguntou se eu podia ir.', label: 'Pergunta indireta' },
    ],
    tip: 'Backshift: present→past, past→past perfect, will→would, can→could. Pronomes e expressões de tempo também mudam: "tomorrow" → "the next day".',
  },

  'passive-voice': {
    title: 'Passive Voice',
    tagline: 'Foco na ação, não em quem fez',
    summary: 'A voz passiva é usada quando a ação é mais importante que o agente. Extremamente comum em textos acadêmicos e científicos do TOEFL.',
    structure: 'AM / IS / ARE / WAS / WERE + Past Participle (+ by agent)',
    examples: [
      { en: 'The report was written by the team.', pt: 'O relatório foi escrito pela equipe.', label: 'Passado simples' },
      { en: 'English is spoken worldwide.', pt: 'O inglês é falado no mundo todo.', label: 'Presente simples' },
      { en: 'The results will be published next month.', pt: 'Os resultados serão publicados no mês que vem.', label: 'Futuro' },
      { en: 'New treatments have been developed.', pt: 'Novos tratamentos foram desenvolvidos.', label: 'Present Perfect' },
    ],
    tip: 'TOEFL tip: textos científicos usam muito passiva. "It was found that...", "The study was conducted..." — reconhecer essa estrutura é essencial para Reading e Listening.',
  },

  'gerund-infinitive': {
    title: 'Gerund vs Infinitive',
    tagline: '-ing ou to + verbo?',
    summary: 'Alguns verbos são seguidos por gerúndio (-ing), outros por infinitivo (to + verbo), e alguns aceitam os dois. Não existe regra universal — é necessário memorizar os principais.',
    structure: 'Gerúndio: enjoy, avoid, suggest, finish, mind | Infinitivo: want, need, plan, decide, hope',
    examples: [
      { en: 'I enjoy reading academic texts.', pt: 'Eu gosto de ler textos acadêmicos.', label: 'Enjoy + -ing' },
      { en: 'She decided to study abroad.', pt: 'Ela decidiu estudar no exterior.', label: 'Decide + to' },
      { en: 'They stopped to rest. (parar para descansar)', pt: 'Significado muda com stop!', label: 'Stop + to (propósito)' },
      { en: 'They stopped talking. (pararam de falar)', pt: 'vs Stop + -ing (parar a ação)', label: 'Stop + -ing (encerrar)' },
    ],
    tip: 'Verbos que MUDAM significado: stop, remember, forget, try, regret + gerúndio vs infinitivo. Esses aparecem bastante no TOEFL.',
  },

  'articles-advanced': {
    title: 'Articles Avançado',
    tagline: 'A, An, The — o que cada um significa',
    summary: 'Os artigos em inglês têm regras complexas. "A/An" para primeira menção ou coisas gerais; "The" para coisas específicas/conhecidas; Zero article para conceitos abstratos ou nomes próprios.',
    structure: 'A/AN = indefinido/geral | THE = específico/único | Ø = abstrato/geral',
    examples: [
      { en: 'A scientist discovered a new element.', pt: 'Um cientista descobriu um novo elemento.', label: 'Primeira menção' },
      { en: 'The scientist won the Nobel Prize.', pt: 'O cientista ganhou o Prêmio Nobel.', label: 'Referência específica' },
      { en: 'Knowledge is power. (Ø)', pt: 'Conhecimento é poder.', label: 'Conceito abstrato = sem artigo' },
      { en: 'The Amazon is the largest rainforest.', pt: 'A Amazônia é a maior floresta tropical.', label: 'Único / superlativo' },
    ],
    tip: 'TOEFL tip: "the" antes de superlativo (the best, the most), de rios/oceanos (the Amazon, the Pacific) e de coisas únicas (the sun, the government).',
  },

  'non-defining-clauses': {
    title: 'Non-Defining Clauses',
    tagline: 'Informação extra entre vírgulas',
    summary: 'As non-defining clauses adicionam informação EXTRA sobre um substantivo, mas não são essenciais para identificá-lo. Sempre separadas por vírgulas. Comuns em textos acadêmicos.',
    structure: 'Substantivo, WHO / WHICH + info extra,',
    examples: [
      { en: 'Darwin, who was born in 1809, changed science.', pt: 'Darwin, que nasceu em 1809, mudou a ciência.', label: 'WHO = pessoa (extra)' },
      { en: 'The Amazon, which flows through Brazil, is massive.', pt: 'O Amazonas, que atravessa o Brasil, é gigante.', label: 'WHICH = coisa (extra)' },
      { en: 'My professor, whose research won awards, retired.', pt: 'Minha professora, cuja pesquisa ganhou prêmios, se aposentou.', label: 'WHOSE = posse' },
      { en: 'The experiment, which lasted 3 years, was successful.', pt: 'O experimento, que durou 3 anos, foi bem-sucedido.', label: 'Contexto acadêmico' },
    ],
    tip: 'As vírgulas são obrigatórias. Remova a cláusula e a frase principal ainda faz sentido completo. Diferente das defining clauses (sem vírgulas), que identificam o substantivo.',
  },

  'nominalization': {
    title: 'Nominalization',
    tagline: 'Transformar verbos em substantivos',
    summary: 'Nominalization é o processo de transformar verbos ou adjetivos em substantivos. É uma característica central da escrita acadêmica — faz o texto mais formal e denso.',
    structure: 'Verb → Noun: discover→discovery, develop→development, analyze→analysis',
    examples: [
      { en: 'They discovered → The discovery of...', pt: 'Eles descobriram → A descoberta de...', label: 'discover → discovery' },
      { en: 'We analyzed → The analysis showed...', pt: 'Analisamos → A análise mostrou...', label: 'analyze → analysis' },
      { en: 'It improved → The improvement was...', pt: 'Melhorou → A melhoria foi...', label: 'improve → improvement' },
      { en: 'They argued → Their argument was...', pt: 'Eles argumentaram → O argumento deles foi...', label: 'argue → argument' },
    ],
    tip: 'Sufixos comuns: -tion (education), -ment (development), -ance (performance), -sis (analysis), -ity (creativity). No TOEFL Writing, usar nominalização eleva seu score.',
  },

  'hedging-language': {
    title: 'Hedging Language',
    tagline: 'Linguagem cautelosa e acadêmica',
    summary: 'Hedging é o uso de linguagem que mostra incerteza ou cautela. É obrigatório na escrita e fala acadêmica — afirmações absolutas sem evidência são consideradas não-científicas.',
    structure: 'Modal verbs + expressions: may, might, could, tend to, appear to, seem to, suggest',
    examples: [
      { en: 'This may indicate a shift in behavior.', pt: 'Isso pode indicar uma mudança de comportamento.', label: 'MAY = possibilidade' },
      { en: 'The results seem to suggest a correlation.', pt: 'Os resultados parecem sugerir uma correlação.', label: 'Seem to suggest' },
      { en: 'Students tend to perform better with feedback.', pt: 'Alunos tendem a se sair melhor com feedback.', label: 'Tend to = generalização cautelosa' },
      { en: 'It appears that the hypothesis is correct.', pt: 'Parece que a hipótese está correta.', label: 'It appears that' },
    ],
    tip: 'No TOEFL Writing e Speaking, use hedging para soar mais acadêmico: "might", "could", "it seems", "tend to". Evite afirmações absolutas como "always" ou "never".',
  },

  'academic-connectors': {
    title: 'Academic Connectors',
    tagline: 'Conectivos que fazem seu texto fluir',
    summary: 'Conectivos acadêmicos organizam ideias e mostram a relação entre elas. São fundamentais para o TOEFL Writing (Integrated + Independent) e Speaking — aumentam significativamente a coerência.',
    structure: 'Adição | Contraste | Causa | Resultado | Exemplificação | Conclusão',
    examples: [
      { en: 'Furthermore / Moreover / In addition', pt: 'Além disso / Adicionalmente', label: 'Adição de argumento' },
      { en: 'However / Nevertheless / In contrast', pt: 'No entanto / Contudo / Em contraste', label: 'Contraste / Oposição' },
      { en: 'Therefore / Consequently / As a result', pt: 'Portanto / Consequentemente / Como resultado', label: 'Resultado / Conclusão' },
      { en: 'For instance / For example / Such as', pt: 'Por exemplo / Como por exemplo', label: 'Exemplificação' },
    ],
    tip: 'TOEFL tip: use conectivos no início das frases para estruturar parágrafos. "However" e "Furthermore" são os mais avaliados. Evite repetição — varie entre os equivalentes.',
  },

}

// ============================================================
// TOEFL — EXPLICAÇÃO DAS 4 SEÇÕES
// ============================================================

export const TOEFL_SECTIONS: Record<string, TOEFLSectionInfo> = {

  reading: {
    what: 'O TOEFL Reading testa sua capacidade de ler e compreender textos acadêmicos em inglês — o mesmo tipo de conteúdo que você encontra em universidades americanas.',
    format: '3–4 passages acadêmicos (700 palavras cada) + 10 questões por texto. Neste simulado: 1 passage + 5 questões.',
    strategies: [
      'Leia o parágrafo introdutório com atenção — define o tema central',
      'Questões de vocabulário: procure pistas de contexto ao redor da palavra',
      'Questões de referência ("it" / "they"): identifique o antecedente na frase anterior',
      'Questões de inferência: a resposta está implícita no texto, não explícita',
    ],
    timeInfo: '54–72 minutos no TOEFL real para 3–4 textos. Ritmo ideal: ~18 minutos por texto.',
  },

  listening: {
    what: 'O TOEFL Listening testa sua compreensão de lectures acadêmicas (professores explicando conceitos) e conversas em campus (estudante + professor/funcionário).',
    format: '3–4 lectures (3–5 min cada) + 2 conversas (3 min cada) + 6 questões por áudio. Neste simulado: questões baseadas em cenários típicos.',
    strategies: [
      'Foque no PROPÓSITO do áudio, não apenas nos detalhes',
      'Preste atenção quando o professor muda de tom ou diz "importantly" / "the key point is"',
      'Em conversas, identifique o PROBLEMA do estudante e a SOLUÇÃO proposta',
      'Tome notas mentais da organização: problema → causa → solução',
    ],
    timeInfo: '41–57 minutos no TOEFL real. Você ouvirá cada áudio apenas UMA VEZ — concentração total é essencial.',
  },

  speaking: {
    what: 'O TOEFL Speaking avalia sua capacidade de expressar ideias claramente em inglês. É avaliado em 3 critérios: Delivery (fluência/clareza), Language Use (gramática/vocabulário) e Topic Development (coerência/argumentação).',
    format: '4 tarefas: 1 independente (opinião pessoal) + 3 integradas (ler/ouvir + falar). Neste simulado: 1 tarefa independente escrita como prova de resposta oral.',
    strategies: [
      'Estruture: Opinião → Razão 1 + exemplo → Razão 2 + exemplo → Conclusão breve',
      'Use conectivos: "First...", "Additionally...", "For example...", "In conclusion..."',
      'Seja específico — exemplos concretos valem mais que generalizações',
      'No TOEFL real: você tem 15–30 segundos para preparar e 45–60 para falar',
    ],
    timeInfo: '17 minutos no total para 4 tarefas. Resposta independente: 15s preparo + 45s fala.',
  },

  writing: {
    what: 'O TOEFL Writing avalia sua capacidade de escrever de forma organizada, clara e academicamente adequada. É avaliado em: Task Achievement, Coherence, Lexical Resource e Grammatical Range.',
    format: '2 tarefas: Integrated (resumir lecture + refutar/complementar reading) + Independent (ensaio de opinião argumentativo). Neste simulado: 1 tarefa Independent.',
    strategies: [
      'Estrutura obrigatória: Introdução (tese) → 2–3 parágrafos de argumento → Conclusão',
      'Cada parágrafo: tópico sentence → evidência → exemplo → mini-conclusão',
      'Use conectivos acadêmicos: Furthermore, However, Consequently, In contrast',
      'Revise: gramática, pontuação e vocabulário variado (evite repetição)',
    ],
    timeInfo: '20 min (Integrated) + 30 min (Independent) no TOEFL real. Mínimo 150 palavras para Independent, 250 para Integrated.',
  },

}

// Helper para buscar teoria por contentId
export function getTheory(contentId: string): ContentTheory | null {
  return THEORY_MAP[contentId] ?? null
}
