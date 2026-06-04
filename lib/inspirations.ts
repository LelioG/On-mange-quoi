import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

import { parse } from "csv-parse/sync";

import {
  DIFFICULTIES,
  type Difficulty,
  type InspirationRecipe,
  type InspirationStats,
} from "@/lib/types";

interface CsvRecipe {
  "Name of Recipe"?: string;
  "Recipe Type"?: string;
  "difficulty level"?: string;
  "cooking time"?: string;
}

const difficultyMap: Record<string, Difficulty> = {
  easy: "facile",
  moderate: "moyen",
  difficult: "difficile",
};

let inspirationCache: Promise<InspirationRecipe[]> | null = null;

async function loadInspirationRecipes() {
  const csvPath = path.join(process.cwd(), "data", "recipe.csv");
  const csv = await readFile(csvPath, "utf8");
  const rows = parse(csv, {
    bom: true,
    columns: true,
    relax_column_count: true,
    skip_empty_lines: true,
    trim: true,
  }) as CsvRecipe[];
  const recipesByName = new Map<string, InspirationRecipe>();

  for (const [index, row] of rows.entries()) {
    const nom = row["Name of Recipe"]?.trim();
    const categorie = row["Recipe Type"]?.trim() || "Recette du monde";
    const csvDifficulty = row["difficulty level"]?.trim().toLowerCase();
    const difficulte = csvDifficulty
      ? difficultyMap[csvDifficulty]
      : undefined;

    if (
      !nom ||
      !difficulte ||
      categorie.toLocaleLowerCase("en-US") === "dessert recipes"
    ) {
      continue;
    }

    const key = nom.toLocaleLowerCase("en-US");

    if (!recipesByName.has(key)) {
      recipesByName.set(key, {
        id: `csv-${index}`,
        nom,
        difficulte,
        categorie,
        temps: row["cooking time"]?.trim() || "Temps non précisé",
      });
    }
  }

  return [...recipesByName.values()];
}

export function getInspirationRecipes() {
  inspirationCache ??= loadInspirationRecipes();
  return inspirationCache;
}

export async function getInspirationStats(): Promise<InspirationStats> {
  const recipes = await getInspirationRecipes();

  return {
    total: recipes.length,
    byDifficulty: Object.fromEntries(
      DIFFICULTIES.map((difficulty) => [
        difficulty,
        recipes.filter((recipe) => recipe.difficulte === difficulty).length,
      ]),
    ) as Record<Difficulty, number>,
  };
}

export async function getRandomInspiration(difficulty?: Difficulty) {
  const recipes = await getInspirationRecipes();
  const matchingRecipes = difficulty
    ? recipes.filter((recipe) => recipe.difficulte === difficulty)
    : recipes;

  if (matchingRecipes.length === 0) {
    return null;
  }

  return matchingRecipes[Math.floor(Math.random() * matchingRecipes.length)];
}
