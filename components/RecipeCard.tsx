"use client";

import { motion, useReducedMotion } from "motion/react";
import { ChefHat, Clock3, Leaf, PackageCheck, Sun, Snowflake } from "lucide-react";

import type { Recipe } from "@/lib/types";

interface RecipeCardProps {
  recipe: Recipe;
}

const difficultyCopy = {
  facile: "Sans prise de tête",
  moyen: "Un peu de cuisine",
  difficile: "Défi accepté",
};

export function RecipeCard({ recipe }: RecipeCardProps) {
  const reduceMotion = useReducedMotion();
  const initial = recipe.nom.trim().charAt(0).toLocaleUpperCase("fr-FR");

  return (
    <motion.article
      initial={reduceMotion ? undefined : { opacity: 0, scale: 0.96, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, scale: 0.97, y: -12 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative isolate min-h-[30rem] overflow-hidden rounded-[2rem] bg-stone-900 p-6 text-white shadow-[0_35px_90px_rgba(41,35,28,0.22)] sm:p-9 lg:min-h-[34rem] lg:p-11"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_75%_15%,rgba(242,151,90,0.35),transparent_32rem),linear-gradient(135deg,#29251f_0%,#171512_100%)]"
      />
      <div
        aria-hidden="true"
        className="subtle-grid absolute inset-0 -z-10 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]"
      />
      <div
        aria-hidden="true"
        className="absolute -right-20 -bottom-20 -z-10 grid size-[22rem] place-items-center rounded-full border border-white/8 bg-white/4 text-[16rem] leading-none font-semibold text-white/5 sm:size-[28rem]"
      >
        {initial}
      </div>

      <div className="flex items-center justify-between gap-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-2 text-xs font-semibold tracking-[0.12em] text-orange-200 uppercase backdrop-blur-lg">
          <ChefHat className="size-3.5" />
          Verdict du soir
        </span>
        <span className="rounded-full border border-white/10 px-3 py-2 text-xs text-white/55">
          {recipe.restes_probables ? "Demain aussi" : "Juste ce soir"}
        </span>
      </div>

      <div className="mt-20 max-w-3xl lg:mt-28">
        <p className="mb-4 text-sm font-medium text-white/45">
          La table a choisi…
        </p>
        <h3 className="display-text text-[clamp(3.5rem,9vw,7rem)] leading-[0.88] font-semibold first-letter:uppercase">
          {recipe.nom}
        </h3>
      </div>

      <div className="mt-12 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/6 p-4 backdrop-blur-md">
          <Clock3 className="mb-5 size-4 text-orange-300" />
          <p className="text-xs text-white/45">Difficulté</p>
          <p className="mt-1 text-sm font-semibold first-letter:uppercase">
            {recipe.difficulte}
          </p>
          <p className="mt-0.5 text-xs text-white/40">
            {difficultyCopy[recipe.difficulte]}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/6 p-4 backdrop-blur-md">
          <Leaf className="mb-5 size-4 text-emerald-300" />
          <p className="text-xs text-white/45">De saison</p>
          <p className="mt-1 flex flex-wrap gap-2 text-sm font-semibold">
            {recipe.saison.map((season) => (
              <span key={season} className="inline-flex items-center gap-1.5">
                {season === "été" ? (
                  <Sun className="size-3.5 text-amber-300" />
                ) : (
                  <Snowflake className="size-3.5 text-sky-300" />
                )}
                <span className="first-letter:uppercase">{season}</span>
              </span>
            ))}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/6 p-4 backdrop-blur-md">
          <PackageCheck className="mb-5 size-4 text-violet-300" />
          <p className="text-xs text-white/45">Restes probables</p>
          <p className="mt-1 text-sm font-semibold">
            {recipe.restes_probables ? "Oui, c’est prévu" : "Non, plat du soir"}
          </p>
        </div>
      </div>
    </motion.article>
  );
}
