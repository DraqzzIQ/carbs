import { z } from "zod";

export const NutrientsSchema = z.object({
  "energy.energy": z.number().default(0),
  // minerals
  "mineral.arsenic": z.number().optional(),
  "mineral.biotin": z.number().optional(),
  "mineral.boron": z.number().optional(),
  "mineral.calcium": z.number().optional(),
  "mineral.chlorine": z.number().optional(),
  "mineral.choline": z.number().optional(),
  "mineral.chrome": z.number().optional(),
  "mineral.cobalt": z.number().optional(),
  "mineral.copper": z.number().optional(),
  "mineral.fluoride": z.number().optional(),
  "mineral.fluorine": z.number().optional(),
  "mineral.iodine": z.number().optional(),
  "mineral.iron": z.number().optional(),
  "mineral.magnesium": z.number().optional(),
  "mineral.manganese": z.number().optional(),
  "mineral.molybdenum": z.number().optional(),
  "mineral.phosphorus": z.number().optional(),
  "mineral.potassium": z.number().optional(),
  "mineral.rubidium": z.number().optional(),
  "mineral.selenium": z.number().optional(),
  "mineral.silicon": z.number().optional(),
  "mineral.sulfur": z.number().optional(),
  "mineral.tin": z.number().optional(),
  "mineral.vanadium": z.number().optional(),
  "mineral.zinc": z.number().optional(),
  // nutrients
  "nutrient.protein": z.number().default(0),
  "nutrient.carb": z.number().default(0),
  "nutrient.dietaryfiber": z.number().optional(),
  "nutrient.sugar": z.number().default(0),
  "nutrient.fat": z.number().default(0),
  "nutrient.saturated": z.number().default(0),
  "nutrient.monounsaturated": z.number().optional(),
  "nutrient.polyunsaturated": z.number().optional(),
  "nutrient.transfat": z.number().optional(),
  "nutrient.alcohol": z.number().optional(),
  "nutrient.cholesterol": z.number().optional(),
  "nutrient.sodium": z.number().optional(),
  "nutrient.salt": z.number().default(0),
  "nutrient.water": z.number().optional(),
  // vitamins
  "vitamin.a": z.number().optional(),
  "vitamin.b1": z.number().optional(),
  "vitamin.b11": z.number().optional(),
  "vitamin.b12": z.number().optional(),
  "vitamin.b2": z.number().optional(),
  "vitamin.b3": z.number().optional(),
  "vitamin.b5": z.number().optional(),
  "vitamin.b6": z.number().optional(),
  "vitamin.b7": z.number().optional(),
  "vitamin.c": z.number().optional(),
  "vitamin.d": z.number().optional(),
  "vitamin.e": z.number().optional(),
  "vitamin.k": z.number().optional(),
});
export type Nutrients = z.infer<typeof NutrientsSchema>;

export const ServingSchema = z.object({
  serving: z.string(),
  amount: z.number().positive(),
});
export type Serving = z.infer<typeof ServingSchema>;

export const ProductDetailsSchema = z.object({
  id: z.string().uuid(),
  is_custom: z.boolean(),
  name: z.string(),
  is_verified: z.boolean(),
  is_private: z.boolean(),
  is_deleted: z.boolean(),
  has_ean: z.boolean(),
  category: z.string(),
  producer: z.string().nullable(),
  nutrients: NutrientsSchema,
  updated_at: z.string().nullable(),
  servings: z.array(ServingSchema),
  base_unit: z.string(),
  eans: z.array(z.string()).optional(),
  language: z.string(),
  countries: z.array(z.string()),
});
export type ProductDetails = z.infer<typeof ProductDetailsSchema>;

export function mapApiProductDetailsToFood(
  apiProduct: any,
  productId: string,
): ProductDetails | null {
  const result = ProductDetailsSchema.safeParse({
    ...apiProduct,
    id: productId,
    is_custom: false,
  });
  if (!result.success) {
    console.error("Failed to parse product details:", result.error);
    return null;
  }
  return result.data;
}
