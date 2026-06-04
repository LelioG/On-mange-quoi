# On mange quoi ?

Une application Next.js moderne pour filtrer des recettes, tirer un repas au
hasard, piocher une inspiration dans un catalogue CSV et enrichir la
collection via Supabase.

## Stack

- Next.js 16 avec App Router
- React 19 et TypeScript strict
- Tailwind CSS 4
- Motion
- Supabase
- Déploiement Vercel

## Lancer le projet

Prérequis : Node.js 20.9 ou plus récent.

```bash
npm install
npm run dev
```

Ouvrez ensuite [http://localhost:3000](http://localhost:3000).

Sans variables d’environnement, l’application fonctionne automatiquement avec
[`data/recettes.json`](data/recettes.json). Le formulaire d’ajout reste
désactivé, car une application déployée sur Vercel ne peut pas écrire de façon
persistante dans ce fichier.

Commandes utiles :

```bash
npm run lint
npm run build
npm run start
```

## Format du JSON local

Le fichier `data/recettes.json` doit respecter ce format :

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

Valeurs acceptées :

- `difficulte` : `facile`, `moyen`, `difficile`
- `saison` : `été`, `hiver`, ou les deux

## Catalogue d’inspiration CSV

Le bouton **En manque d’inspi ?** pioche une recette dans
`data/recipe.csv`, avec un filtre optionnel par difficulté. Les niveaux
`Easy`, `Moderate` et `Difficult` sont automatiquement convertis en français.
Les lignes sans difficulté et la catégorie `Dessert Recipes` sont exclues des
tirages.

## Connecter Supabase

1. Créez un projet sur [supabase.com](https://supabase.com).
2. Ouvrez **SQL Editor**, puis exécutez
   [`supabase/schema.sql`](supabase/schema.sql).
3. Copiez `.env.example` vers `.env.local`.
4. Renseignez les variables :

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon
SUPABASE_SERVICE_ROLE_KEY=votre-cle-service-role
ADMIN_PASSWORD=un-mot-de-passe-long-et-unique
```

La clé `SUPABASE_SERVICE_ROLE_KEY` et `ADMIN_PASSWORD` restent exclusivement
côté serveur. Ne leur ajoutez jamais le préfixe `NEXT_PUBLIC_`.

La politique RLS fournie autorise uniquement la lecture publique. Les
insertions passent par `POST /api/recipes`, après vérification du mot de passe,
puis utilisent la service role côté serveur.

Pour importer les recettes locales dans Supabase, ajoutez-les depuis le
formulaire ou utilisez l’éditeur de table Supabase.

## API

### `GET /api/recipes`

Retourne les recettes Supabase. Si Supabase n’est pas configuré ou est
indisponible, retourne automatiquement les recettes du JSON local avec
`source: "local"`.

### `POST /api/recipes`

Ajoute une recette dans Supabase. Exemple de corps :

```json
{
  "adminPassword": "votre-mot-de-passe",
  "recipe": {
    "nom": "curry de légumes",
    "difficulte": "facile",
    "saison": ["été", "hiver"],
    "restes_probables": true
  }
}
```

### `GET /api/inspirations`

Retourne une recette aléatoire du catalogue CSV, hors catégorie
`Dessert Recipes`. Un filtre de difficulté peut être ajouté :

```text
GET /api/inspirations?difficulty=facile
GET /api/inspirations?difficulty=moyen
GET /api/inspirations?difficulty=difficile
```

## Déployer gratuitement sur Vercel

1. Poussez le projet dans un dépôt GitHub, GitLab ou Bitbucket.
2. Dans [vercel.com/new](https://vercel.com/new), importez le dépôt.
3. Laissez Vercel détecter Next.js et la commande `npm run build`.
4. Ajoutez les quatre variables d’environnement dans **Project Settings >
   Environment Variables**.
5. Lancez le déploiement.

Le site peut aussi être déployé sans Supabase : il fonctionnera alors en mode
lecture locale.

## Structure principale

```text
app/
  api/recipes/route.ts
  page.tsx
components/
  AddRecipeForm.tsx
  Hero.tsx
  InspirationPicker.tsx
  MealPicker.tsx
  RecipeCard.tsx
  RecipeFilters.tsx
  RecipeResult.tsx
data/recettes.json
data/recipe.csv
lib/
  recipes.ts
  types.ts
  supabase/client.ts
  supabase/server.ts
supabase/schema.sql
```
