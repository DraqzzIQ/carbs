import { z } from "zod";

const NutrientsSchema = z.object({
  energy: z.number(),
  carb: z.number(),
  fat: z.number(),
  protein: z.number(),
});

const FoodSearchResultSchema = z.object({
  score: z.number(),
  name: z.string(),
  productId: z.string(),
  serving: z.string(),
  servingQuantity: z.number(),
  amount: z.number(),
  baseUnit: z.string(),
  producer: z.string().nullable(),
  isVerified: z.boolean(),
  nutrients: NutrientsSchema,
  countries: z.array(z.string()),
  language: z.string(),
});
export type FoodSearchResultDto = z.infer<typeof FoodSearchResultSchema>;

function transformApiFoodResult(apiResult: unknown): unknown {
  const nutrientsMap: Record<string, keyof z.infer<typeof NutrientsSchema>> = {
    "energy.energy": "energy",
    "nutrient.carb": "carb",
    "nutrient.fat": "fat",
    "nutrient.protein": "protein",
  };

  const nutrients: Record<string, number> = {};
  for (const [apiKey, schemaKey] of Object.entries(nutrientsMap)) {
    nutrients[schemaKey] = apiResult.nutrients?.[apiKey] ?? 0;
  }

  return {
    score: apiResult.score ?? 0,
    name: apiResult.name,
    productId: apiResult.product_id,
    serving: apiResult.serving,
    servingQuantity: apiResult.serving_quantity ?? 1,
    amount: apiResult.amount ?? 1,
    baseUnit: apiResult.base_unit,
    producer: apiResult.producer,
    isVerified: apiResult.is_verified,
    nutrients,
    countries: apiResult.countries ?? [],
    language: apiResult.language,
  };
}

export function mapApiFoodsSearchResult(
  apiSearchResults: unknown[],
): FoodSearchResultDto[] {
  return apiSearchResults
    .map((searchResult: unknown) => {
      const mapped = transformApiFoodResult(searchResult);
      const result = FoodSearchResultSchema.safeParse(mapped);
      if (!result.success) {
        console.error("Failed to parse search result:", result.error);
        return null;
      }
      return result.data;
    })
    .filter(
      (item: FoodSearchResultDto | null): item is FoodSearchResultDto =>
        item !== null,
    );
}
