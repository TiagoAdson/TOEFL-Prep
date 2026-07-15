-- ============================================================
-- MIGRATION: admin role — permite marcar um usuário como admin
-- para liberar o botão de expansão de módulos (300 -> 500).
-- Execute no Supabase SQL Editor do projeto TOEFL
-- ============================================================

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('student','tutor','admin'));

-- Marque seu próprio usuário como admin (substitua pelo seu user_id,
-- visível em Minha Conta -> "Seu User ID"):
-- UPDATE profiles SET role = 'admin' WHERE id = 'SEU-USER-ID-AQUI';
