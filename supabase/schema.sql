create extension if not exists pgcrypto;

create table if not exists public.recettes (
  id uuid primary key default gen_random_uuid(),
  nom text not null check (char_length(nom) between 2 and 100),
  difficulte text not null check (difficulte in ('facile', 'moyen', 'difficile')),
  saison text[] not null check (
    cardinality(saison) > 0
    and saison <@ array['été', 'hiver']::text[]
  ),
  restes_probables boolean not null,
  created_at timestamp with time zone default now()
);

alter table public.recettes enable row level security;

grant select on table public.recettes to anon, authenticated;
revoke insert, update, delete on table public.recettes from anon, authenticated;

drop policy if exists "Lecture publique des recettes" on public.recettes;

create policy "Lecture publique des recettes"
on public.recettes
for select
to anon, authenticated
using (true);

-- Les insertions passent uniquement par /api/recipes avec la service role key.
