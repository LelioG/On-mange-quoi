import "server-only";

import localRecipes from "@/data/recettes.json";
import {
  DIFFICULTIES,
  type Difficulty,
  type NewRecipe,
  type Recipe,
  type RecipeCollection,
  SEASONS,
  type Season,
} from "@/lib/types";
import {
  createAdminSupabaseClient,
  createServerSupabaseClient,
  isRecipeWritingEnabled,
} from "@/lib/supabase/server";

function isDifficulty(value: unknown): value is Difficulty {
  return DIFFICULTIES.includes(value as Difficulty);
}

function isSeason(value: unknown): value is Season {
  return SEASONS.includes(value as Season);
}

function normalizeRecipe(value: unknown, index = 0): Recipe | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Record<string, unknown>;
  const seasons = Array.isArray(candidate.saison)
    ? candidate.saison.filter(isSeason)
    : [];

  if (
    typeof candidate.nom !== "string" ||
    !candidate.nom.trim() ||
    !isDifficulty(candidate.difficulte) ||
    seasons.length === 0 ||
    typeof candidate.restes_probables !== "boolean"
  ) {
    return null;
  }

  return {
    id:
      typeof candidate.id === "string" && candidate.id
        ? candidate.id
        : `local-${index}`,
    nom: candidate.nom.trim(),
    difficulte: candidate.difficulte,
    saison: [...new Set(seasons)],
    restes_probables: candidate.restes_probables,
    ...(typeof candidate.created_at === "string"
      ? { created_at: candidate.created_at }
      : {}),
  };
}

export function getLocalRecipes(): Recipe[] {
  const data = localRecipes as { recettes?: unknown[] };
  return (data.recettes ?? [])
    .map((recipe, index) => normalizeRecipe(recipe, index))
    .filter((recipe): recipe is Recipe => recipe !== null);
}

export async function getRecipes(): Promise<RecipeCollection> {
  const supabase = createServerSupabaseClient();
  const writeEnabled = isRecipeWritingEnabled();

  if (!supabase) {
    return {
      recipes: getLocalRecipes(),
      source: "local",
      writeEnabled,
      warning:
        "Supabase n’est pas configuré : les recettes du fichier local sont utilisées.",
    };
  }

  const { data, error } = await supabase
    .from("recettes")
    .select("id, nom, difficulte, saison, restes_probables, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return {
      recipes: getLocalRecipes(),
      source: "local",
      writeEnabled,
      warning:
        "Supabase est momentanément indisponible : les recettes locales sont utilisées.",
    };
  }

  return {
    recipes: (data ?? [])
      .map((recipe, index) => normalizeRecipe(recipe, index))
      .filter((recipe): recipe is Recipe => recipe !== null),
    source: "supabase",
    writeEnabled,
  };
}

export async function insertRecipe(recipe: NewRecipe): Promise<Recipe> {
  const supabase = createAdminSupabaseClient();

  if (!supabase) {
    throw new Error(
      "Supabase n’est pas configuré pour l’écriture. Ajoutez les variables serveur requises.",
    );
  }

  const { data, error } = await supabase
    .from("recettes")
    .insert(recipe)
    .select("id, nom, difficulte, saison, restes_probables, created_at")
    .single();

  if (error) {
    throw new Error(`Impossible d’ajouter la recette : ${error.message}`);
  }

  const normalized = normalizeRecipe(data);

  if (!normalized) {
    throw new Error("La recette ajoutée a un format inattendu.");
  }

  return normalized;
}
