export const DIFFICULTIES = ["facile", "moyen", "difficile"] as const;
export const SEASONS = ["été", "hiver"] as const;

export type Difficulty = (typeof DIFFICULTIES)[number];
export type Season = (typeof SEASONS)[number];

export interface Recipe {
  id: string;
  nom: string;
  difficulte: Difficulty;
  saison: Season[];
  restes_probables: boolean;
  created_at?: string;
}

export type NewRecipe = Omit<Recipe, "id" | "created_at">;

export interface RecipeFiltersState {
  difficulties: Difficulty[];
  seasons: Season[];
  leftovers: boolean[];
}

export interface RecipeCollection {
  recipes: Recipe[];
  source: "supabase" | "local";
  writeEnabled: boolean;
  warning?: string;
}

export interface InspirationRecipe {
  id: string;
  nom: string;
  difficulte: Difficulty;
  categorie: string;
  temps: string;
}

export interface InspirationStats {
  total: number;
  byDifficulty: Record<Difficulty, number>;
}
