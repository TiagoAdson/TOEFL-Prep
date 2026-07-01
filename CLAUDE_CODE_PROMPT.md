# PROMPT PARA CLAUDE CODE — TOEFL Prep App

## Contexto e Estratégia Atualizada
App pessoal de estudo de ingles para TOEFL IBT 110+ em Janeiro 2027.
Estudante: Tiago | 24 semanas | Foco em Qualidade > Quantidade.

**Nova Regra de Ouro (O Método 50/50):**
- **50 exercícios por semana** (10 por dia).
- Destes 10 diários: 5 são de **Fundação (Inglês Geral/Gramática)** e 5 são focados no **Padrão TOEFL (Leitura acadêmica, Listening, Templates)**.
- O app deve ser 100% em Inglês na tela de exercícios para evitar o "vício de tradução". Português apenas nas explicações da teoria ou no feedback de erros.

## Stack
- React 19 + TypeScript + Vite
- Supabase (banco de dados)
- **Claude API (Anthropic)**: Para feedback de Redação (Writing) e Reading.
- **Gemini API (Google)**: Para avaliar Speaking (processamento nativo de áudio).

## Estrutura de Pastas
```
src/
  pages/
    Dashboard.tsx       — Homepage com progresso e lista de conteudos
    TestOfConcept.tsx   — Teste (min 80% para avancar) com feedback em tempo real
    Exercise.tsx        — 50 exercicios divididos em blocos (5 Foundation / 5 TOEFL por dia)
    Simulado.tsx        — Simulado TOEFL completo aos sábados (4 secoes)
  utils/
    supabase.ts         — Cliente Supabase + tipos TypeScript
    feedbackAI.ts       — Integracao Claude API e Gemini API
    constants.ts        — USER_ID e constantes do app
```

## Diretrizes de Geração de Conteúdo para o Claude Code
Quando gerar novos exercícios para o banco de dados (SQL), respeite a regra 50/50. 
Para cada bloco diário de 10 questões, gere:
- 5 questões focadas na estrutura/gramática isolada (Ex: preencher lacunas).
- 5 questões nível TOEFL C1/C2 aplicando a regra (Ex: compreensão de um mini-texto acadêmico).

## Próximos Passos Prioritários
1. Atualizar o schema do banco de dados/exercícios para suportar a flag `type` (general vs toefl).
2. Implementar integração com a API do **Gemini 1.5 Flash** para receber áudios gravados pelo usuário na etapa de Speaking.
3. Desabilitar `spellcheck` e colar (Ctrl+V) nos campos de texto para simular o ambiente real do TOEFL.
4. Adicionar botão de `Hint` oculto (tradução sob demanda) nos exercícios.
