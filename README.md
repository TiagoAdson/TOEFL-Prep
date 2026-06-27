# TOEFL Prep — App de Ingles para TOEFL 110+

App pessoal de estudo de ingles com IA, baseado em neurociencia.

**Meta:** TOEFL IBT 110+ em Janeiro 2027 (24 semanas)
**Metodo:** 100 exercicios/semana em 5 blocos + simulado TOEFL todo sabado

---

## Como Rodar

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variaveis de ambiente
cp .env.example .env
# Edite .env com suas chaves do Supabase e Anthropic

# 3. Rodar em desenvolvimento
npm run dev
# Acesse: http://localhost:5173

# 4. Build para producao
npm run build
```

---

## Configurar Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Abra o **SQL Editor** no painel do Supabase
3. Copie e execute o arquivo `supabase_setup.sql`
4. Copie a **Project URL** e **anon public key**
5. Cole no arquivo `.env`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_KEY=sua-chave-publica
```

---

## Configurar Claude API (Feedback IA)

1. Acesse [console.anthropic.com](https://console.anthropic.com)
2. Crie uma API Key
3. Cole no `.env`:

```env
VITE_ANTHROPIC_API_KEY=sk-ant-seu-key
```

> Sem API key o app funciona em modo local com feedback basico.

---

## Estrutura do App

```
Dashboard       -> Seu progresso geral + lista de conteudos
Test of Concept -> 10 perguntas para testar conceito (min 80% para avancar)
Exercise        -> 100 exercicios por conteudo em 5 blocos de 20
Simulado        -> TOEFL completo (Reading, Listening, Speaking, Writing)
```

---

## Conteudos (A1 -> B2)

| # | Conteudo | Nivel |
|---|---------|-------|
| 1 | Verbo TO BE | A1 |
| 2 | Present Simple | A1 |
| 3 | Past Simple | A1 |
| 4 | Present Continuous | A1 |
| 5 | Future Simple | A1 |
| 6 | Be Going To | A2 |
| 7 | Present Perfect | A2 |
| 8 | Past Perfect | A2 |
| 9 | Conditional Tipo 1 | A2 |
| 10 | Modais Basicos | A2 |
| 11 | Relative Clauses | A2 |
| 12 | Conditional Tipo 2-3 | B1 |
| 13 | Reported Speech | B1 |
| 14 | Passive Voice | B1 |
| 15 | Gerund vs Infinitive | B1 |
| 16 | Articles Avancado | B2 |
| 17 | Non-Defining Clauses | B2 |
| 18 | Nominalization | B2 |
| 19 | Hedging Language | B2 |
| 20 | Academic Connectors | B2 |

---

## Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Database:** Supabase (PostgreSQL)
- **IA:** Claude API (Anthropic)
- **Styling:** CSS puro (sem dependencias extras)

---

## Plano de 24 Semanas

- **Semana 1:** App 100% funcional (MVP) ✅
- **Semana 2-6:** Conteudos A1 (5 topicos)
- **Semana 7-12:** Conteudos A2 (6 topicos)
- **Semana 13-18:** Conteudos B1 (4 topicos)
- **Semana 19-23:** Conteudos B2 (5 topicos)
- **Semana 24:** Revisao final + TOEFL real
- **Janeiro 2027:** TOEFL 110+ 🎯
