"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, ChefHat, Lightbulb, Sparkles } from "lucide-react";

interface HeroProps {
  recipeCount: number;
  onChoose: () => void;
  onInspire: () => void;
}

export function Hero({ recipeCount, onChoose, onInspire }: HeroProps) {
  const reduceMotion = useReducedMotion();
  const entrance = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
      };

  return (
    <section className="relative flex min-h-[calc(100dvh-5rem)] items-center overflow-hidden py-14 sm:py-20">
      <motion.div
        aria-hidden="true"
        className="absolute -left-28 top-20 size-72 rounded-full bg-orange-300/20 blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : { scale: [1, 1.16, 1], x: [0, 24, 0], y: [0, -18, 0] }
        }
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute -right-24 bottom-10 size-80 rounded-full bg-amber-200/25 blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : { scale: [1.1, 0.96, 1.1], x: [0, -20, 0], y: [0, 20, 0] }
        }
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 lg:px-10">
        <div className="max-w-4xl">
          <motion.div
            {...entrance}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-stone-900/8 bg-white/55 px-3.5 py-2 text-xs font-semibold tracking-[0.11em] text-stone-700 uppercase shadow-sm backdrop-blur-xl"
          >
            <Sparkles className="size-3.5 text-orange-500" />
            {recipeCount} idées à portée de clic
          </motion.div>

          <motion.h1
            {...entrance}
            transition={{
              duration: 0.75,
              delay: reduceMotion ? 0 : 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="display-text max-w-4xl text-[clamp(4.2rem,12vw,9.5rem)] leading-[0.82] font-semibold text-stone-900"
          >
            On mange quoi{" "}
            <span className="relative inline-block text-orange-600">
              ce soir
              <svg
                aria-hidden="true"
                className="absolute -bottom-3 left-1 h-4 w-[98%] overflow-visible text-orange-400/55"
                viewBox="0 0 300 20"
                preserveAspectRatio="none"
              >
                <path
                  d="M3 13C65 4 192 5 297 11"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="7"
                />
              </svg>
            </span>
            <span className="text-stone-400"> ?</span>
          </motion.h1>

          <motion.p
            {...entrance}
            transition={{
              duration: 0.75,
              delay: reduceMotion ? 0 : 0.16,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-9 max-w-xl text-base leading-7 text-stone-600 sm:text-lg"
          >
            Fini les débats devant le frigo. Quelques préférences, un soupçon
            de hasard, et le dîner est décidé.
          </motion.p>

          <motion.div
            {...entrance}
            transition={{
              duration: 0.75,
              delay: reduceMotion ? 0 : 0.24,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <motion.button
              type="button"
              onClick={onChoose}
              className="focus-ring group inline-flex min-h-14 items-center gap-3 rounded-full bg-stone-900 px-7 text-sm font-semibold text-white shadow-[0_15px_40px_rgba(38,33,27,0.2)] transition-colors hover:bg-orange-600"
              whileHover={reduceMotion ? undefined : { y: -2 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            >
              Choisir un repas
              <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
            </motion.button>
            <motion.button
              type="button"
              onClick={onInspire}
              className="focus-ring group inline-flex min-h-14 items-center gap-3 rounded-full border border-stone-900/10 bg-white/55 px-6 text-sm font-semibold text-stone-700 shadow-sm backdrop-blur-xl transition-colors hover:bg-white hover:text-stone-900"
              whileHover={reduceMotion ? undefined : { y: -2 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            >
              <Lightbulb className="size-4 text-emerald-700" />
              En manque d’inspi ?
            </motion.button>
            <span className="text-sm text-stone-500">
              Prêt en moins d’une seconde.
            </span>
          </motion.div>
        </div>

        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, scale: 0.92, y: 28 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 0.9,
            delay: reduceMotion ? 0 : 0.18,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative mx-auto hidden aspect-square w-full max-w-[31rem] lg:block"
        >
          <div className="absolute inset-0 rounded-full border border-stone-900/5 bg-white/20 shadow-[0_45px_100px_rgba(58,47,32,0.12)] backdrop-blur-sm" />
          <div className="absolute inset-[9%] rounded-full border border-white/70 bg-gradient-to-br from-white/70 to-orange-50/50 shadow-inner" />
          <div className="absolute inset-[22%] grid place-items-center rounded-full border border-orange-200/60 bg-orange-500 text-white shadow-[0_25px_55px_rgba(237,107,52,0.32)]">
            <div className="text-center">
              <ChefHat className="mx-auto size-12 stroke-[1.5]" />
              <p className="mt-3 text-xs font-semibold tracking-[0.18em] uppercase">
                Ce soir
              </p>
              <p className="mt-1 text-lg font-semibold">On se régale</p>
            </div>
          </div>
          {[
            ["Facile", "left-2 top-[20%]", -8],
            ["De saison", "right-0 top-[29%]", 7],
            ["Zéro débat", "bottom-[12%] left-[17%]", -4],
          ].map(([label, position, rotation], index) => (
            <motion.div
              key={label}
              className={`glass-panel absolute ${position} rounded-2xl px-4 py-3 text-sm font-semibold text-stone-700`}
              animate={
                reduceMotion ? undefined : { y: [0, index % 2 ? 8 : -8, 0] }
              }
              style={{ rotate: Number(rotation) }}
              transition={{
                duration: 5 + index,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {label}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
