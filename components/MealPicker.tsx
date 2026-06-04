"use client";

import { useMemo, useRef, useState } from "react";
import { CircleAlert, Database, HardDrive, Plus } from "lucide-react";

import { AddRecipeForm } from "@/components/AddRecipeForm";
import { Hero } from "@/components/Hero";
import { InspirationPicker } from "@/components/InspirationPicker";
import { RecipeFilters } from "@/components/RecipeFilters";
import { RecipeResult } from "@/components/RecipeResult";
import type {
  Difficulty,
  InspirationRecipe,
  InspirationStats,
  Recipe,
  RecipeCollection,
  RecipeFiltersState,
} from "@/lib/types";

interface MealPickerProps {
  initialCollection: RecipeCollection;
  inspirationStats: InspirationStats;
}

const emptyFilters: RecipeFiltersState = {
  difficulties: [],
  seasons: [],
  leftovers: [],
};

function filterRecipes(recipes: Recipe[], filters: RecipeFiltersState) {
  return recipes.filter((recipe) => {
    const matchesDifficulty =
      filters.difficulties.length === 0 ||
      filters.difficulties.includes(recipe.difficulte);
    const matchesSeason =
      filters.seasons.length === 0 ||
      recipe.saison.some((season) => filters.seasons.includes(season));
    const matchesLeftovers =
      filters.leftovers.length === 0 ||
      filters.leftovers.includes(recipe.restes_probables);

    return matchesDifficulty && matchesSeason && matchesLeftovers;
  });
}

export function MealPicker({
  initialCollection,
  inspirationStats,
}: MealPickerProps) {
  const [recipes, setRecipes] = useState(initialCollection.recipes);
  const [filters, setFilters] = useState<RecipeFiltersState>(emptyFilters);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [resultStatus, setResultStatus] = useState<
    "idle" | "choosing" | "empty" | "ready"
  >("idle");
  const [inspirationDifficulty, setInspirationDifficulty] = useState<
    Difficulty | "toutes"
  >("toutes");
  const [inspirationRecipe, setInspirationRecipe] =
    useState<InspirationRecipe | null>(null);
  const [inspirationStatus, setInspirationStatus] = useState<
    "idle" | "choosing" | "ready" | "error"
  >("idle");
  const [inspirationError, setInspirationError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const matchingRecipes = useMemo(
    () => filterRecipes(recipes, filters),
    [filters, recipes],
  );

  function chooseRecipe(scrollToResult = false) {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setResultStatus("choosing");

    if (scrollToResult) {
      window.setTimeout(() => {
        document
          .querySelector("#filtres")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 80);
    }

    timerRef.current = setTimeout(() => {
      if (matchingRecipes.length === 0) {
        setSelectedRecipe(null);
        setResultStatus("empty");
        return;
      }

      const alternatives =
        matchingRecipes.length > 1 && selectedRecipe
          ? matchingRecipes.filter((recipe) => recipe.id !== selectedRecipe.id)
          : matchingRecipes;
      const nextRecipe =
        alternatives[Math.floor(Math.random() * alternatives.length)];

      setSelectedRecipe(nextRecipe);
      setResultStatus("ready");

      if (scrollToResult) {
        window.setTimeout(() => {
          document
            .querySelector("#resultat")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }, 520);
  }

  function resetFilters() {
    setFilters(emptyFilters);
  }

  function handleRecipeAdded(recipe: Recipe) {
    setRecipes((current) => [
      recipe,
      ...current.filter((item) => item.id !== recipe.id),
    ]);
    setSelectedRecipe(recipe);
    setResultStatus("ready");
  }

  async function chooseInspiration(scrollToResult = false) {
    setInspirationStatus("choosing");
    setInspirationError(null);

    if (scrollToResult) {
      window.setTimeout(() => {
        document
          .querySelector("#inspiration")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 80);
    }

    const query =
      inspirationDifficulty === "toutes"
        ? ""
        : `?difficulty=${encodeURIComponent(inspirationDifficulty)}`;

    try {
      const [response] = await Promise.all([
        fetch(`/api/inspirations${query}`, { cache: "no-store" }),
        new Promise((resolve) => window.setTimeout(resolve, 480)),
      ]);
      const result = (await response.json()) as {
        recipe?: InspirationRecipe;
        error?: string;
      };

      if (!response.ok || !result.recipe) {
        throw new Error(result.error ?? "Aucune inspiration disponible.");
      }

      setInspirationRecipe(result.recipe);
      setInspirationStatus("ready");
    } catch (error) {
      setInspirationError(
        error instanceof Error
          ? error.message
          : "Une erreur inattendue est survenue.",
      );
      setInspirationStatus("error");
    }
  }

  return (
    <main className="relative min-h-dvh overflow-clip">
      <header className="relative z-20 mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <a
          href="#"
          className="focus-ring rounded-full text-sm font-semibold tracking-[-0.02em] text-stone-900"
        >
          on mange quoi<span className="text-orange-600">?</span>
        </a>
        <nav className="flex items-center gap-2">
          <span
            title={initialCollection.warning}
            className={`hidden items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium sm:inline-flex ${
              initialCollection.source === "supabase"
                ? "border-emerald-700/10 bg-emerald-100/45 text-emerald-800"
                : "border-amber-700/10 bg-amber-100/45 text-amber-800"
            }`}
          >
            {initialCollection.source === "supabase" ? (
              <Database className="size-3.5" />
            ) : (
              <HardDrive className="size-3.5" />
            )}
            {initialCollection.source === "supabase"
              ? "Supabase connecté"
              : "Données locales"}
          </span>
          <a
            href="#ajouter"
            className="focus-ring inline-flex items-center gap-2 rounded-full border border-stone-900/10 bg-white/50 px-3.5 py-2 text-xs font-semibold text-stone-700 transition-colors hover:bg-white hover:text-stone-900"
          >
            <Plus className="size-3.5" />
            <span className="hidden sm:inline">Ajouter une recette</span>
            <span className="sm:hidden">Ajouter</span>
          </a>
        </nav>
      </header>

      <Hero
        recipeCount={recipes.length}
        onChoose={() => chooseRecipe(true)}
        onInspire={() => chooseInspiration(true)}
      />

      <div className="relative mx-auto max-w-7xl space-y-24 px-5 pb-10 sm:px-8 sm:pb-14 lg:px-10">
        <div className="space-y-4">
          {initialCollection.warning && (
            <aside className="flex items-start gap-3 rounded-2xl border border-amber-700/10 bg-amber-100/45 px-4 py-3 text-xs leading-5 text-amber-900/70">
              <CircleAlert className="mt-0.5 size-4 shrink-0 text-amber-700" />
              <p>
                <span className="font-semibold text-amber-950">Mode local.</span>{" "}
                {initialCollection.warning}
              </p>
            </aside>
          )}
          <RecipeFilters
            filters={filters}
            matchCount={matchingRecipes.length}
            isChoosing={resultStatus === "choosing"}
            onChange={setFilters}
            onChoose={() => chooseRecipe()}
            onReset={resetFilters}
          />
        </div>
        <RecipeResult
          recipe={selectedRecipe}
          status={resultStatus}
          onRetry={() => chooseRecipe()}
        />
        <InspirationPicker
          difficulty={inspirationDifficulty}
          recipe={inspirationRecipe}
          stats={inspirationStats}
          status={inspirationStatus}
          error={inspirationError}
          onDifficultyChange={setInspirationDifficulty}
          onChoose={() => chooseInspiration()}
        />
        <AddRecipeForm
          writeEnabled={initialCollection.writeEnabled}
          onAdded={handleRecipeAdded}
        />
      </div>

      <footer className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-10 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
        <p>Décider moins. Profiter plus.</p>
        <p>
          {recipes.length} {recipes.length > 1 ? "recettes disponibles" : "recette disponible"}
        </p>
      </footer>
    </main>
  );
}
