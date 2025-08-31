import { z } from "zod";

interface Nutrients {
  energy: number;
  carb: number;
  fat: number;
  protein: number;
}

export interface FoodSearchResultDto {
  score: number;
  name: string;
  productId: string;
  serving: string;
  servingQuantity: number;
  amount: number;
  baseUnit: string;
  producer: string | null;
  isVerified: boolean;
  nutrients: Nutrients;
  countries: string[];
  language: string;
}

const ApiFoodResultSchema = z.object({
  score: z.number().optional(),
  name: z.string(),
  product_id: z.string(),
  serving: z.string(),
  serving_quantity: z.number().optional(),
  amount: z.number().optional(),
  base_unit: z.string(),
  producer: z.string().nullable().optional(),
  is_verified: z.boolean(),
  nutrients: z.record(z.number()).optional(),
  countries: z.array(z.string()).optional(),
  language: z.string(),
});
type ApiFoodResult = z.infer<typeof ApiFoodResultSchema>;

function transformApiFoodResult(
  apiResult: unknown,
): FoodSearchResultDto | null {
  const parsed = ApiFoodResultSchema.safeParse(apiResult);
  if (!parsed.success) {
    console.error("Failed to parse API food result:", parsed.error);
    return null;
  }
  const api: ApiFoodResult = parsed.data;

  const nutrientsMap: Record<string, keyof Nutrients> = {
    "energy.energy": "energy",
    "nutrient.carb": "carb",
    "nutrient.fat": "fat",
    "nutrient.protein": "protein",
  };

  const nutrients: Nutrients = {
    energy: 0,
    carb: 0,
    fat: 0,
    protein: 0,
  };
  for (const [apiKey, schemaKey] of Object.entries(nutrientsMap)) {
    nutrients[schemaKey] = api.nutrients?.[apiKey] ?? 0;
  }

  return {
    score: api.score ?? 0,
    name: api.name,
    productId: api.product_id,
    serving: api.serving,
    servingQuantity: api.serving_quantity ?? 1,
    amount: api.amount ?? 1,
    baseUnit: api.base_unit,
    producer: api.producer ?? null,
    isVerified: api.is_verified,
    nutrients,
    countries: api.countries ?? [],
    language: api.language,
  };
}

export function mapApiFoodsSearchResult(
  apiSearchResults: unknown[],
): FoodSearchResultDto[] {
  return apiSearchResults
    .map(transformApiFoodResult)
    .filter((item): item is FoodSearchResultDto => item !== null);
}
