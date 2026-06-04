import { timingSafeEqual } from "node:crypto";

import { NextRequest, NextResponse } from "next/server";

import { getRecipes, insertRecipe } from "@/lib/recipes";
import {
  DIFFICULTIES,
  type NewRecipe,
  SEASONS,
  type Season,
} from "@/lib/types";

export const dynamic = "force-dynamic";

function passwordsMatch(received: string, expected: string) {
  const receivedBuffer = Buffer.from(received);
  const expectedBuffer = Buffer.from(expected);

  return (
    receivedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(receivedBuffer, expectedBuffer)
  );
}

function parseRecipe(value: unknown): NewRecipe | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Record<string, unknown>;
  const name = typeof candidate.nom === "string" ? candidate.nom.trim() : "";
  const seasons = Array.isArray(candidate.saison)
    ? [...new Set(candidate.saison)].filter((season): season is Season =>
        SEASONS.includes(season as Season),
      )
    : [];

  if (
    name.length < 2 ||
    name.length > 100 ||
    !DIFFICULTIES.includes(candidate.difficulte as NewRecipe["difficulte"]) ||
    seasons.length === 0 ||
    typeof candidate.restes_probables !== "boolean"
  ) {
    return null;
  }

  return {
    nom: name,
    difficulte: candidate.difficulte as NewRecipe["difficulte"],
    saison: seasons,
    restes_probables: candidate.restes_probables,
  };
}

export async function GET() {
  const collection = await getRecipes();
  return NextResponse.json(collection);
}

export async function POST(request: NextRequest) {
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    return NextResponse.json(
      {
        error:
          "L’ajout de recettes est désactivé : ADMIN_PASSWORD n’est pas configuré.",
      },
      { status: 503 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Le corps de la requête doit être un JSON valide." },
      { status: 400 },
    );
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: "La requête est incomplète." },
      { status: 400 },
    );
  }

  const { adminPassword, recipe } = body as Record<string, unknown>;

  if (
    typeof adminPassword !== "string" ||
    !passwordsMatch(adminPassword, expectedPassword)
  ) {
    return NextResponse.json(
      { error: "Mot de passe administrateur incorrect." },
      { status: 401 },
    );
  }

  const parsedRecipe = parseRecipe(recipe);

  if (!parsedRecipe) {
    return NextResponse.json(
      { error: "Vérifiez le nom, la difficulté, la saison et les restes." },
      { status: 400 },
    );
  }

  try {
    const createdRecipe = await insertRecipe(parsedRecipe);
    return NextResponse.json({ recipe: createdRecipe }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Une erreur inattendue est survenue.",
      },
      { status: 503 },
    );
  }
}
