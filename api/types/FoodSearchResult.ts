export type Nutrients = {
  energy: number;
  carb: number;
  fat: number;
  protein: number;
};

export type FoodSearchResult = {
  score: number;
  name: string;
  productId: string;
  serving: string;
  servingQuantity: number;
  amount: number;
  baseUnit: string;
  producer?: string;
  isVerified: boolean;
  nutrients: Nutrients;
  countries: string[];
  language: string;
};

export function mapApiFoodToFoodsSearchResult(apiFood: any): FoodSearchResult {
  return {
    score: apiFood.score,
    name: apiFood.name,
    productId: apiFood.product_id,
    serving: apiFood.serving,
    servingQuantity: apiFood.serving_quantity,
    amount: apiFood.amount,
    baseUnit: apiFood.base_unit,
    producer: apiFood.producer ?? undefined,
    isVerified: apiFood.is_verified,
    nutrients: {
      energy: apiFood.nutrients["energy.energy"],
      carb: apiFood.nutrients["nutrient.carb"],
      fat: apiFood.nutrients["nutrient.fat"],
      protein: apiFood.nutrients["nutrient.protein"],
    },
    countries: apiFood.countries,
    language: apiFood.language,
  };
}
