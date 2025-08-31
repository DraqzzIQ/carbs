import { MealDetailsQueryType } from "~/db/queries/mealDetailsQuery";
import { Food } from "~/db/schema";

export function mapMealsToNutritionFacts(meals: MealDetailsQueryType): (Food & {
  amount: number;
  servingQuantity: number;
})[] {
  return meals.map((meal) => ({
    ...meal.food,
    amount: meal.amount,
    servingQuantity: meal.servingQuantity,
  }));
}
