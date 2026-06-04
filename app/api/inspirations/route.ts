import { NextRequest, NextResponse } from "next/server";

import { getRandomInspiration } from "@/lib/inspirations";
import { DIFFICULTIES, type Difficulty } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const requestedDifficulty = request.nextUrl.searchParams.get("difficulty");

  if (
    requestedDifficulty &&
    !DIFFICULTIES.includes(requestedDifficulty as Difficulty)
  ) {
    return NextResponse.json(
      { error: "La difficulté demandée n’est pas valide." },
      { status: 400 },
    );
  }

  try {
    const recipe = await getRandomInspiration(
      requestedDifficulty as Difficulty | undefined,
    );

    if (!recipe) {
      return NextResponse.json(
        { error: "Aucune recette ne correspond à cette difficulté." },
        { status: 404 },
      );
    }

    return NextResponse.json({ recipe });
  } catch {
    return NextResponse.json(
      { error: "Impossible de lire le catalogue d’inspiration." },
      { status: 500 },
    );
  }
}
