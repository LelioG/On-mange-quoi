import { MealPicker } from "@/components/MealPicker";
import { getInspirationStats } from "@/lib/inspirations";
import { getRecipes } from "@/lib/recipes";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [collection, inspirationStats] = await Promise.all([
    getRecipes(),
    getInspirationStats(),
  ]);

  return (
    <MealPicker
      initialCollection={collection}
      inspirationStats={inspirationStats}
    />
  );
}
