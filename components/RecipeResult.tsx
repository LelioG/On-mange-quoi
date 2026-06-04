"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, SearchX, Sparkles } from "lucide-react";

import { RecipeCard } from "@/components/RecipeCard";
import type { Recipe } from "@/lib/types";

interface RecipeResultProps {
  recipe: Recipe | null;
  status: "idle" | "choosing" | "empty" | "ready";
  onRetry: () => void;
}

export function RecipeResult({
  recipe,
  status,
  onRetry,
}: RecipeResultProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section id="resultat" className="scroll-mt-6" aria-live="polite">
      <div className="mb-6 flex items-end justify-between gap-5">
        <div>
          <p className="mb-2 text-xs font-semibold tracking-[0.13em] text-orange-600 uppercase">
            Le verdict
          </p>
          <h2 className="display-text text-3xl font-semibold text-stone-900 sm:text-4xl">
            À table.
          </h2>
        </div>
        {status === "ready" && (
          <motion.button
            type="button"
            onClick={onRetry}
            className="focus-ring group inline-flex items-center gap-2 rounded-full border border-stone-900/10 bg-white/55 px-4 py-2.5 text-sm font-semibold text-stone-700 transition-colors hover:bg-white hover:text-stone-900"
            whileHover={reduceMotion ? undefined : { y: -2 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          >
            Relancer
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </motion.button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {status === "choosing" && (
          <motion.div
            key="choosing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-panel grid min-h-[30rem] place-items-center rounded-[2rem] px-6 text-center"
          >
            <div>
              <motion.div
                animate={reduceMotion ? undefined : { rotate: 360 }}
                transition={{ duration: 1.25, repeat: Infinity, ease: "linear" }}
                className="mx-auto grid size-16 place-items-center rounded-full bg-orange-100 text-orange-600"
              >
                <Sparkles className="size-6" />
              </motion.div>
              <p className="mt-6 text-lg font-semibold text-stone-900">
                On consulte vos envies…
              </p>
              <p className="mt-1 text-sm text-stone-500">
                Le verdict arrive.
              </p>
            </div>
          </motion.div>
        )}

        {status === "empty" && (
          <motion.div
            key="empty"
            initial={reduceMotion ? undefined : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass-panel grid min-h-[30rem] place-items-center rounded-[2rem] px-6 text-center"
          >
            <div className="max-w-md">
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-stone-900/5 text-stone-500">
                <SearchX className="size-6" />
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-stone-900">
                Rien au menu avec ces critères.
              </h3>
              <p className="mt-2 text-sm leading-6 text-stone-500">
                Élargissez un peu les filtres ou ajoutez la recette qui manque
                à la collection.
              </p>
            </div>
          </motion.div>
        )}

        {status === "ready" && recipe && (
          <RecipeCard key={recipe.id} recipe={recipe} />
        )}

        {status === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-panel subtle-grid grid min-h-[30rem] place-items-center overflow-hidden rounded-[2rem] px-6 text-center"
          >
            <div className="max-w-md">
              <div className="mx-auto grid size-16 place-items-center rounded-full border border-orange-200/80 bg-orange-100/70 text-orange-600">
                <Sparkles className="size-6" />
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-stone-900">
                Une idée vous attend ici.
              </h3>
              <p className="mt-2 text-sm leading-6 text-stone-500">
                Ajustez les filtres, puis laissez le hasard faire le reste.
              </p>
              <button
                type="button"
                onClick={onRetry}
                className="focus-ring mt-6 rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
              >
                Choisir maintenant
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
