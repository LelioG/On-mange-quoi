"use client";

import { FormEvent, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Check,
  ChefHat,
  CircleAlert,
  KeyRound,
  LoaderCircle,
  Plus,
  X,
} from "lucide-react";

import {
  DIFFICULTIES,
  type Difficulty,
  type NewRecipe,
  type Recipe,
  SEASONS,
  type Season,
} from "@/lib/types";

interface AddRecipeFormProps {
  writeEnabled: boolean;
  onAdded: (recipe: Recipe) => void;
}

interface FormState {
  nom: string;
  difficulte: Difficulty;
  saison: Season[];
  restes_probables: boolean;
  adminPassword: string;
}

const initialForm: FormState = {
  nom: "",
  difficulte: "facile",
  saison: ["été"],
  restes_probables: false,
  adminPassword: "",
};

export function AddRecipeForm({
  writeEnabled,
  onAdded,
}: AddRecipeFormProps) {
  const reduceMotion = useReducedMotion();
  const [form, setForm] = useState<FormState>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  function toggleSeason(season: Season) {
    setForm((current) => ({
      ...current,
      saison: current.saison.includes(season)
        ? current.saison.filter((item) => item !== season)
        : [...current.saison, season],
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (form.saison.length === 0) {
      setMessage({
        type: "error",
        text: "Choisissez au moins une saison.",
      });
      return;
    }

    setIsSubmitting(true);

    const recipe: NewRecipe = {
      nom: form.nom.trim(),
      difficulte: form.difficulte,
      saison: form.saison,
      restes_probables: form.restes_probables,
    };

    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminPassword: form.adminPassword,
          recipe,
        }),
      });
      const result = (await response.json()) as {
        recipe?: Recipe;
        error?: string;
      };

      if (!response.ok || !result.recipe) {
        throw new Error(result.error ?? "Impossible d’ajouter la recette.");
      }

      onAdded(result.recipe);
      setForm(initialForm);
      setMessage({
        type: "success",
        text: "Recette ajoutée. Elle rejoint la sélection.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Une erreur inattendue est survenue.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <motion.section
      id="ajouter"
      initial={reduceMotion ? undefined : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden rounded-[2rem] border border-stone-900/8 bg-[#e9e1d5] shadow-[0_30px_80px_rgba(69,54,36,0.08)]"
    >
      <div className="grid lg:grid-cols-[0.76fr_1.24fr]">
        <div className="relative isolate overflow-hidden bg-stone-900 p-7 text-white sm:p-9 lg:min-h-full lg:p-11">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(237,107,52,0.38),transparent_24rem),linear-gradient(160deg,#2b2721,#171513)]"
          />
          <div className="flex min-h-full flex-col justify-between gap-16">
            <div>
              <div className="mb-5 grid size-11 place-items-center rounded-2xl border border-white/10 bg-white/8 text-orange-300">
                <ChefHat className="size-5" />
              </div>
              <p className="text-xs font-semibold tracking-[0.13em] text-orange-300 uppercase">
                La collection grandit
              </p>
              <h2 className="display-text mt-4 text-4xl leading-[0.95] font-semibold sm:text-5xl">
                Ajoutez votre classique.
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-6 text-white/50">
                Une idée qui met tout le monde d’accord ? Ajoutez-la une fois,
                retrouvez-la dans les prochains tirages.
              </p>
            </div>

            <div
              className={`flex items-start gap-3 rounded-2xl border p-4 text-xs leading-5 ${
                writeEnabled
                  ? "border-emerald-300/15 bg-emerald-300/8 text-emerald-100/70"
                  : "border-amber-300/15 bg-amber-300/8 text-amber-100/70"
              }`}
            >
              {writeEnabled ? (
                <Check className="mt-0.5 size-4 shrink-0" />
              ) : (
                <CircleAlert className="mt-0.5 size-4 shrink-0" />
              )}
              {writeEnabled
                ? "L’ajout sécurisé via Supabase est disponible."
                : "Mode lecture locale. Configurez Supabase pour activer l’ajout."}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-9 lg:p-11">
          <div>
            <label
              htmlFor="recipe-name"
              className="text-xs font-semibold tracking-[0.12em] text-stone-500 uppercase"
            >
              Nom de la recette
            </label>
            <input
              id="recipe-name"
              type="text"
              required
              minLength={2}
              maxLength={100}
              value={form.nom}
              onChange={(event) =>
                setForm((current) => ({ ...current, nom: event.target.value }))
              }
              placeholder="Ex. gratin dauphinois"
              className="focus-ring mt-3 min-h-14 w-full rounded-2xl border border-stone-900/10 bg-white/60 px-4 text-base text-stone-900 placeholder:text-stone-400 transition-colors hover:bg-white/80 focus:bg-white"
            />
          </div>

          <div className="mt-7 grid gap-7 sm:grid-cols-2">
            <fieldset>
              <legend className="text-xs font-semibold tracking-[0.12em] text-stone-500 uppercase">
                Difficulté
              </legend>
              <div className="mt-3 grid gap-2">
                {DIFFICULTIES.map((difficulty) => (
                  <label
                    key={difficulty}
                    className={`flex min-h-11 cursor-pointer items-center justify-between rounded-xl border px-3.5 text-sm font-medium transition-colors ${
                      form.difficulte === difficulty
                        ? "border-stone-900 bg-stone-900 text-white"
                        : "border-stone-900/8 bg-white/45 text-stone-600 hover:bg-white/80"
                    }`}
                  >
                    <span className="first-letter:uppercase">{difficulty}</span>
                    <input
                      type="radio"
                      name="difficulty"
                      value={difficulty}
                      checked={form.difficulte === difficulty}
                      onChange={() =>
                        setForm((current) => ({
                          ...current,
                          difficulte: difficulty,
                        }))
                      }
                      className="sr-only"
                    />
                    {form.difficulte === difficulty && (
                      <Check className="size-3.5" />
                    )}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="grid content-start gap-7">
              <fieldset>
                <legend className="text-xs font-semibold tracking-[0.12em] text-stone-500 uppercase">
                  Saison
                </legend>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {SEASONS.map((season) => (
                    <button
                      key={season}
                      type="button"
                      aria-pressed={form.saison.includes(season)}
                      onClick={() => toggleSeason(season)}
                      className={`focus-ring min-h-11 rounded-xl border px-3 text-sm font-medium first-letter:uppercase ${
                        form.saison.includes(season)
                          ? "border-orange-600 bg-orange-600 text-white"
                          : "border-stone-900/8 bg-white/45 text-stone-600 hover:bg-white/80"
                      }`}
                    >
                      {season}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-xs font-semibold tracking-[0.12em] text-stone-500 uppercase">
                  Restes probables
                </legend>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {[true, false].map((value) => (
                    <button
                      key={String(value)}
                      type="button"
                      aria-pressed={form.restes_probables === value}
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          restes_probables: value,
                        }))
                      }
                      className={`focus-ring min-h-11 rounded-xl border px-3 text-sm font-medium ${
                        form.restes_probables === value
                          ? "border-stone-900 bg-stone-900 text-white"
                          : "border-stone-900/8 bg-white/45 text-stone-600 hover:bg-white/80"
                      }`}
                    >
                      {value ? "Oui" : "Non"}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>

          <div className="mt-7">
            <label
              htmlFor="admin-password"
              className="text-xs font-semibold tracking-[0.12em] text-stone-500 uppercase"
            >
              Mot de passe administrateur
            </label>
            <div className="relative mt-3">
              <KeyRound className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-stone-400" />
              <input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                value={form.adminPassword}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    adminPassword: event.target.value,
                  }))
                }
                placeholder="Requis pour ajouter"
                className="focus-ring min-h-14 w-full rounded-2xl border border-stone-900/10 bg-white/60 pr-4 pl-11 text-sm text-stone-900 placeholder:text-stone-400 transition-colors hover:bg-white/80 focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!writeEnabled || isSubmitting}
            className="focus-ring mt-7 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-orange-600 px-6 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(234,88,12,0.23)] transition-colors hover:bg-orange-700 disabled:bg-stone-400 disabled:shadow-none"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Ajout en cours…
              </>
            ) : (
              <>
                <Plus className="size-4" />
                Ajouter la recette
              </>
            )}
          </button>
        </form>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className={`fixed right-4 bottom-4 z-50 flex max-w-[calc(100vw-2rem)] items-start gap-3 rounded-2xl border px-4 py-3 text-sm shadow-2xl backdrop-blur-xl sm:right-6 sm:bottom-6 ${
              message.type === "success"
                ? "border-emerald-200/70 bg-emerald-950/90 text-emerald-50"
                : "border-red-200/70 bg-red-950/90 text-red-50"
            }`}
          >
            {message.type === "success" ? (
              <Check className="mt-0.5 size-4 shrink-0" />
            ) : (
              <CircleAlert className="mt-0.5 size-4 shrink-0" />
            )}
            <span>{message.text}</span>
            <button
              type="button"
              aria-label="Fermer"
              onClick={() => setMessage(null)}
              className="ml-2 opacity-60 transition-opacity hover:opacity-100"
            >
              <X className="size-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
