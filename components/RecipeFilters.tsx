"use client";

import { motion, useReducedMotion } from "motion/react";
import { Check, RotateCcw, SlidersHorizontal, Sparkles } from "lucide-react";

import {
  DIFFICULTIES,
  type Difficulty,
  type RecipeFiltersState,
  SEASONS,
  type Season,
} from "@/lib/types";

interface RecipeFiltersProps {
  filters: RecipeFiltersState;
  matchCount: number;
  isChoosing: boolean;
  onChange: (filters: RecipeFiltersState) => void;
  onChoose: () => void;
  onReset: () => void;
}

interface FilterButtonProps {
  active: boolean;
  label: string;
  onClick: () => void;
}

function FilterButton({ active, label, onClick }: FilterButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`focus-ring flex min-h-11 items-center justify-between gap-3 rounded-xl border px-3.5 text-left text-sm font-medium transition-all ${
        active
          ? "border-stone-900 bg-stone-900 text-white shadow-lg shadow-stone-900/10"
          : "border-stone-900/8 bg-white/45 text-stone-600 hover:border-stone-900/20 hover:bg-white/80 hover:text-stone-900"
      }`}
    >
      <span className="first-letter:uppercase">{label}</span>
      <span
        className={`grid size-4 place-items-center rounded-full border ${
          active ? "border-white/40 bg-white/15" : "border-stone-400/50"
        }`}
      >
        {active && <Check className="size-2.5 stroke-[3]" />}
      </span>
    </button>
  );
}

export function RecipeFilters({
  filters,
  matchCount,
  isChoosing,
  onChange,
  onChoose,
  onReset,
}: RecipeFiltersProps) {
  const reduceMotion = useReducedMotion();

  function toggleDifficulty(difficulty: Difficulty) {
    onChange({
      ...filters,
      difficulties: filters.difficulties.includes(difficulty)
        ? filters.difficulties.filter((item) => item !== difficulty)
        : [...filters.difficulties, difficulty],
    });
  }

  function toggleSeason(season: Season) {
    onChange({
      ...filters,
      seasons: filters.seasons.includes(season)
        ? filters.seasons.filter((item) => item !== season)
        : [...filters.seasons, season],
    });
  }

  function toggleLeftovers(value: boolean) {
    onChange({
      ...filters,
      leftovers: filters.leftovers.includes(value)
        ? filters.leftovers.filter((item) => item !== value)
        : [...filters.leftovers, value],
    });
  }

  return (
    <motion.section
      id="filtres"
      initial={reduceMotion ? undefined : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel scroll-mt-6 rounded-[2rem] p-5 sm:p-7 lg:p-9"
    >
      <div className="flex flex-col gap-4 border-b border-stone-900/8 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-[0.13em] text-orange-600 uppercase">
            <SlidersHorizontal className="size-3.5" />
            Vos envies
          </div>
          <h2 className="display-text text-3xl font-semibold text-stone-900 sm:text-4xl">
            Affinez l’inspiration.
          </h2>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="focus-ring inline-flex items-center gap-2 self-start rounded-full px-3 py-2 text-xs font-semibold text-stone-500 transition-colors hover:bg-white/70 hover:text-stone-900 sm:self-auto"
        >
          <RotateCcw className="size-3.5" />
          Réinitialiser les filtres
        </button>
      </div>

      <div className="grid gap-7 py-7 md:grid-cols-3">
        <fieldset>
          <legend className="mb-3 text-xs font-semibold tracking-[0.12em] text-stone-500 uppercase">
            Difficulté
          </legend>
          <div className="grid gap-2">
            {DIFFICULTIES.map((difficulty) => (
              <FilterButton
                key={difficulty}
                label={difficulty}
                active={filters.difficulties.includes(difficulty)}
                onClick={() => toggleDifficulty(difficulty)}
              />
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-xs font-semibold tracking-[0.12em] text-stone-500 uppercase">
            Saison
          </legend>
          <div className="grid gap-2">
            {SEASONS.map((season) => (
              <FilterButton
                key={season}
                label={season}
                active={filters.seasons.includes(season)}
                onClick={() => toggleSeason(season)}
              />
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-xs font-semibold tracking-[0.12em] text-stone-500 uppercase">
            Restes
          </legend>
          <div className="grid gap-2">
            <FilterButton
              label="avec restes"
              active={filters.leftovers.includes(true)}
              onClick={() => toggleLeftovers(true)}
            />
            <FilterButton
              label="sans restes"
              active={filters.leftovers.includes(false)}
              onClick={() => toggleLeftovers(false)}
            />
          </div>
        </fieldset>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-white/80 bg-white/45 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-stone-500">
          <span className="font-semibold text-stone-900">{matchCount}</span>{" "}
          {matchCount > 1 ? "recettes correspondent" : "recette correspond"} à
          vos envies.
        </p>
        <motion.button
          type="button"
          onClick={onChoose}
          disabled={isChoosing}
          className="focus-ring inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-orange-600 px-6 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(234,88,12,0.25)] transition-colors hover:bg-orange-700 disabled:opacity-60"
          whileHover={reduceMotion || isChoosing ? undefined : { y: -2 }}
          whileTap={reduceMotion || isChoosing ? undefined : { scale: 0.98 }}
        >
          <Sparkles className={`size-4 ${isChoosing ? "animate-spin" : ""}`} />
          {isChoosing ? "On cherche…" : "Choisir un repas"}
        </motion.button>
      </div>
    </motion.section>
  );
}
