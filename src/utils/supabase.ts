import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY as string;

// Fallback para evitar crash no startup quando .env nao esta configurado
const isConfigured =
  SUPABASE_URL &&
  SUPABASE_KEY &&
  !SUPABASE_URL.includes('seu-projeto') &&
  !SUPABASE_KEY.includes('sua-chave');

export const supabaseConfigured = isConfigured;

export const supabase = isConfigured
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');

if (!isConfigured) {
  console.warn(
    '[Supabase] Variaveis de ambiente nao configuradas. ' +
      'Edite o arquivo .env e adicione VITE_SUPABASE_URL e VITE_SUPABASE_KEY.'
  );
}

// Tipos das tabelas
export interface Level {
  id: string;
  name: string;
  description: string;
  order_number: number;
}

export interface Content {
  id: string;
  name: string;
  level_id: string;
  description: string;
  order_number: number;
  test_of_concept_count?: number;
  total_exercises?: number;
}

export interface TestQuestion {
  id: string;
  content_id: string;
  question_number: number;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

export interface ExerciseItem {
  id: string;
  content_id: string;
  block_number: number;
  exercise_number: number;
  question: string;
  answer: string;
  explanation: string;
  type: 'gap_fill' | 'multiple_choice' | 'error_spotting' | 'production' | 'reading';
  options?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  toefl_skill?: 'reading' | 'listening' | 'speaking' | 'writing' | null;
}

export interface UserProgress {
  id?: string;
  user_id: string;
  content_id: string;
  block_number: number;
  exercise_number: number;
  exercise_id?: string;
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
  confidence_level?: number;
  time_spent_seconds?: number;
  feedback_received?: string;
}
