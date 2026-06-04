# On mange quoi ?

**On mange quoi ?** est une application web moderne qui aide à choisir un repas quand personne ne sait quoi manger.  
L’utilisateur coche quelques préférences, lance le tirage, et le site propose une recette au hasard.

Site en ligne : https://on-mange-quoi-seven.vercel.app/

## Fonctionnalités

- Tirage aléatoire d’un repas
- Filtres par difficulté : facile, moyen, difficile
- Filtres par saison : été, hiver
- Filtre selon les restes : avec restes ou sans restes
- Formulaire d’ajout de recette
- Ajout sécurisé via mot de passe administrateur
- Stockage des recettes avec Supabase
- Fallback local avec un fichier JSON
- Catalogue d’inspiration depuis un fichier CSV
- Interface responsive pour mobile, tablette et ordinateur
- Design premium avec animations fluides

## Stack technique

- Next.js
- React
- TypeScript
- Tailwind CSS
- Motion
- Supabase
- Vercel

## Installation locale

Prérequis : Node.js installé sur la machine.

```bash
npm install
npm run dev
```

Puis ouvrir :

```txt
http://localhost:3000
```

## Variables d’environnement

Créer un fichier `.env.local` à la racine du projet.

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-publique
SUPABASE_SERVICE_ROLE_KEY=votre-cle-secrete
ADMIN_PASSWORD=votre-mot-de-passe-admin
```

## Format des recettes

Les recettes locales sont stockées dans :

```txt
data/recettes.json
```

Format attendu :

```json
{
  "recettes": [
    {
      "nom": "pâtes carbo",
      "difficulte": "facile",
      "saison": ["hiver"],
      "restes_probables": false
    }
  ]
}
```

Valeurs possibles :

```txt
difficulte : facile, moyen, difficile
saison : été, hiver
restes_probables : true ou false
```

## Base de données Supabase

La table principale s’appelle :

```txt
recettes
```

Structure conseillée :

```sql
create table if not exists public.recettes (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  difficulte text not null,
  saison text[] not null,
  restes_probables boolean not null,
  created_at timestamp with time zone default now()
);
```

L’application lit les recettes depuis Supabase quand les variables d’environnement sont configurées.  
Si Supabase n’est pas configuré, elle utilise le fichier local `data/recettes.json`.

## API

### `GET /api/recipes`

Récupère les recettes depuis Supabase.  
Si Supabase n’est pas disponible, l’API peut retourner les recettes locales.

### `POST /api/recipes`

Ajoute une nouvelle recette dans Supabase.

Exemple de corps envoyé :

```json
{
  "adminPassword": "mot-de-passe-admin",
  "recipe": {
    "nom": "curry de légumes",
    "difficulte": "facile",
    "saison": ["été", "hiver"],
    "restes_probables": true
  }
}
```

Le mot de passe est vérifié côté serveur avec la variable :

```env
ADMIN_PASSWORD
```

## Catalogue d’inspiration

Le site contient aussi un catalogue CSV dans :

```txt
data/recipe.csv
```

Il sert au bouton d’inspiration pour proposer une idée différente des recettes principales.

## Déploiement sur Vercel

Le projet est prévu pour être déployé gratuitement sur Vercel.

Étapes :

1. Créer un dépôt GitHub.
2. Pousser le projet sur GitHub.
3. Aller sur Vercel.
4. Importer le dépôt.
5. Laisser Vercel détecter Next.js.
6. Ajouter les variables d’environnement :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PASSWORD`
7. Lancer le déploiement.

## Commandes utiles

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Structure du projet

```txt
app/
  api/
    inspirations/
    recipes/
  page.tsx

components/
  AddRecipeForm.tsx
  Hero.tsx
  InspirationPicker.tsx
  MealPicker.tsx
  RecipeCard.tsx
  RecipeFilters.tsx
  RecipeResult.tsx

data/
  recettes.json
  recipe.csv

lib/
  recipes.ts
  types.ts
  supabase/

supabase/
  schema.sql
```

## Sécurité

Le projet utilise une clé publique Supabase côté client et une clé secrète côté serveur.

À ne jamais publier :

```txt
.env.local
SUPABASE_SERVICE_ROLE_KEY
ADMIN_PASSWORD
```

Le fichier `.gitignore` doit contenir :

```gitignore
.env.local
.env*.local
.next
node_modules
```

## État du projet

Le site est déployé et accessible ici :

```txt
https://on-mange-quoi-seven.vercel.app/
```

La version actuelle permet de choisir un repas, filtrer les recettes, piocher une inspiration et ajouter une recette via Supabase.
