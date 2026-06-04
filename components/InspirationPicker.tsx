"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  ChefHat,
  Clock3,
  Gauge,
  Globe2,
  Lightbulb,
  LoaderCircle,
  Sparkles,
} from "lucide-react";

import {
  DIFFICULTIES,
  type Difficulty,
  type InspirationRecipe,
  type InspirationStats,
} from "@/lib/types";

type InspirationDifficulty = Difficulty | "toutes";
type InspirationStatus = "idle" | "choosing" | "ready" | "error";

interface InspirationPickerProps {
  difficulty: InspirationDifficulty;
  recipe: InspirationRecipe | null;
  stats: InspirationStats;
  status: InspirationStatus;
  error: string | null;
  onDifficultyChange: (difficulty: InspirationDifficulty) => void;
  onChoose: () => void;
}

const difficultyCopy: Record<Difficulty, string> = {
  facile: "Easy",
  moyen: "Moderate",
  difficile: "Difficult",
};

export function InspirationPicker({
  difficulty,
  recipe,
  stats,
  status,
  error,
  onDifficultyChange,
  onChoose,
}: InspirationPickerProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id="inspiration"
      initial={reduceMotion ? undefined : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="scroll-mt-6 overflow-hidden rounded-[2rem] bg-[#dfe8e1] shadow-[0_30px_80px_rgba(47,65,51,0.1)]"
    >
      <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
        <div className="relative isolate flex min-h-[28rem] flex-col justify-between overflow-hidden bg-emerald-950 p-7 text-white sm:p-9 lg:p-11">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_20%_8%,rgba(110,231,183,0.28),transparent_24rem),linear-gradient(150deg,#174437,#09271f)]"
          />
          <div
            aria-hidden="true"
            className="subtle-grid absolute inset-0 -z-10 opacity-25"
          />

          <div>
            <div className="mb-6 grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/8 text-emerald-200">
              <Lightbulb className="size-5" />
            </div>
            <p className="text-xs font-semibold tracking-[0.13em] text-emerald-300 uppercase">
              Le grand catalogue
            </p>
            <h2 className="display-text mt-4 text-4xl leading-[0.95] font-semibold sm:text-5xl">
              En manque d’inspi ?
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/55">
              Piochez une idée inattendue parmi {stats.total.toLocaleString("fr-FR")}{" "}
              recettes du monde.
            </p>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold tracking-[0.12em] text-white/45 uppercase">
              Difficulté souhaitée
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(["toutes", ...DIFFICULTIES] as InspirationDifficulty[]).map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={difficulty === item}
                    onClick={() => onDifficultyChange(item)}
                    className={`focus-ring min-h-11 rounded-xl border px-3 text-left text-sm font-medium transition-colors ${
                      difficulty === item
                        ? "border-white bg-white text-emerald-950"
                        : "border-white/10 bg-white/6 text-white/65 hover:bg-white/12 hover:text-white"
                    }`}
                  >
                    <span className="block first-letter:uppercase">{item}</span>
                    <span
                      className={`mt-0.5 block text-[0.65rem] ${
                        difficulty === item
                          ? "text-emerald-900/55"
                          : "text-white/35"
                      }`}
                    >
                      {item === "toutes"
                        ? `${stats.total} idées`
                        : `${stats.byDifficulty[item]} idées`}
                    </span>
                  </button>
                ),
              )}
            </div>

            <motion.button
              type="button"
              onClick={onChoose}
              disabled={status === "choosing"}
              className="focus-ring mt-4 inline-flex min-h-13 w-full items-center justify-center gap-2.5 rounded-full bg-emerald-300 px-6 text-sm font-semibold text-emerald-950 shadow-[0_12px_35px_rgba(110,231,183,0.18)] transition-colors hover:bg-white disabled:opacity-65"
              whileHover={
                reduceMotion || status === "choosing" ? undefined : { y: -2 }
              }
              whileTap={
                reduceMotion || status === "choosing"
                  ? undefined
                  : { scale: 0.98 }
              }
            >
              {status === "choosing" ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              {status === "choosing" ? "On pioche…" : "Me surprendre"}
            </motion.button>
          </div>
        </div>

        <div className="grid min-h-[28rem] place-items-center p-5 sm:p-8 lg:p-11">
          <AnimatePresence mode="wait">
            {status === "ready" && recipe ? (
              <motion.article
                key={recipe.id}
                initial={
                  reduceMotion ? undefined : { opacity: 0, y: 18, scale: 0.98 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={
                  reduceMotion ? undefined : { opacity: 0, y: -12, scale: 0.98 }
                }
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                className="relative isolate w-full overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/65 p-6 shadow-[0_24px_70px_rgba(40,70,50,0.12)] backdrop-blur-xl sm:p-8"
              >
                <div
                  aria-hidden="true"
                  className="absolute -top-20 -right-16 -z-10 size-56 rounded-full bg-emerald-200/45 blur-3xl"
                />
                <div className="flex items-center justify-between gap-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-950 px-3 py-2 text-xs font-semibold tracking-[0.1em] text-emerald-100 uppercase">
                    <Globe2 className="size-3.5" />
                    Idée du monde
                  </span>
                  <span className="text-xs font-medium text-emerald-950/45">
                    Source CSV
                  </span>
                </div>

                <div className="my-14 sm:my-20">
                  <p className="mb-3 text-xs font-semibold tracking-[0.12em] text-emerald-700 uppercase">
                    Essayez donc…
                  </p>
                  <h3 className="display-text text-[clamp(3rem,7vw,5.5rem)] leading-[0.92] font-semibold text-emerald-950">
                    {recipe.nom}
                  </h3>
                </div>

                <div className="grid gap-2 sm:grid-cols-3">
                  <div className="rounded-2xl bg-emerald-950/5 p-4">
                    <Gauge className="mb-4 size-4 text-emerald-700" />
                    <p className="text-[0.65rem] font-semibold tracking-[0.1em] text-emerald-950/40 uppercase">
                      Difficulté
                    </p>
                    <p className="mt-1 text-sm font-semibold text-emerald-950 first-letter:uppercase">
                      {recipe.difficulte}
                    </p>
                    <p className="mt-0.5 text-xs text-emerald-950/40">
                      {difficultyCopy[recipe.difficulte]}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-emerald-950/5 p-4">
                    <Clock3 className="mb-4 size-4 text-emerald-700" />
                    <p className="text-[0.65rem] font-semibold tracking-[0.1em] text-emerald-950/40 uppercase">
                      Temps
                    </p>
                    <p className="mt-1 text-sm font-semibold text-emerald-950">
                      {recipe.temps}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-emerald-950/5 p-4">
                    <ChefHat className="mb-4 size-4 text-emerald-700" />
                    <p className="text-[0.65rem] font-semibold tracking-[0.1em] text-emerald-950/40 uppercase">
                      Catégorie
                    </p>
                    <p className="mt-1 text-sm font-semibold text-emerald-950">
                      {recipe.categorie}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onChoose}
                  className="focus-ring group mt-5 inline-flex items-center gap-2 rounded-full px-1 py-2 text-xs font-semibold text-emerald-800 transition-colors hover:text-emerald-950"
                >
                  Une autre idée
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </motion.article>
            ) : status === "choosing" ? (
              <motion.div
                key="choosing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <motion.div
                  animate={reduceMotion ? undefined : { rotate: 360 }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-950 text-emerald-200"
                >
                  <Sparkles className="size-6" />
                </motion.div>
                <p className="mt-5 text-sm font-semibold text-emerald-950">
                  On fouille le catalogue…
                </p>
              </motion.div>
            ) : status === "error" ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-sm text-center"
              >
                <p className="text-lg font-semibold text-emerald-950">
                  Impossible de piocher une idée.
                </p>
                <p className="mt-2 text-sm leading-6 text-emerald-950/55">
                  {error}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-sm text-center"
              >
                <div className="mx-auto grid size-16 place-items-center rounded-full border border-emerald-950/8 bg-white/55 text-emerald-800">
                  <Lightbulb className="size-6" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold text-emerald-950">
                  Une nouvelle idée vous attend.
                </h3>
                <p className="mt-2 text-sm leading-6 text-emerald-950/50">
                  Choisissez votre niveau, ou laissez toutes les portes
                  ouvertes.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}
