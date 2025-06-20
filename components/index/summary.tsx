import { Text } from "~/components/ui/text";
import { Card } from "~/components/ui/card";
import { View } from "react-native";
import { Progress } from "~/components/ui/progress";
import { formatNumber } from "~/utils/formatting";
import { useMemo } from "react";
import { MealDetailsQueryType } from "~/db/queries/mealDetailsQuery";

type SummaryProps = {
  currentDayMeals: MealDetailsQueryType;
  maxCalories: number;
  maxCarbs: number;
  maxProtein: number;
  maxFat: number;
};

export const Summary = ({
  currentDayMeals,
  maxCalories,
  maxCarbs,
  maxProtein,
  maxFat,
}: SummaryProps) => {
  const calories: number = useMemo(() => {
    return currentDayMeals.reduce((acc, meal) => {
      const mealCalories =
        meal.servingQuantity * meal.food.energy * meal.amount;
      return acc + mealCalories;
    }, 0);
  }, [currentDayMeals]);

  const fat = useMemo(() => {
    return currentDayMeals.reduce((acc, meal) => {
      const mealFat = meal.servingQuantity * meal.food.fat * meal.amount;
      return acc + mealFat;
    }, 0);
  }, [currentDayMeals]);

  const protein = useMemo(() => {
    return currentDayMeals.reduce((acc, meal) => {
      const mealProtein =
        meal.servingQuantity * meal.food.protein * meal.amount;
      return acc + mealProtein;
    }, 0);
  }, [currentDayMeals]);

  const carbs = useMemo(() => {
    return currentDayMeals.reduce((acc, meal) => {
      const mealCarbs = meal.servingQuantity * meal.food.carb * meal.amount;
      return acc + mealCarbs;
    }, 0);
  }, [currentDayMeals]);

  return (
    <>
      <Text className="font-semibold text-lg w-full mt-4">Summary</Text>
      <Card className="w-full gap-3 p-4 pb-14 rounded-2xl bg-secondary mt-1">
        <View className="items-center">
          <Text className="mb-1 font-semibold text-lg">Calories</Text>
          <Progress
            value={(calories / maxCalories) * 100}
            className="h-2 bg-gray-400 dark:bg-gray-600"
          />
          <Text className="font-semibold text-sm text-gray-500 dark:text-gray-300">
            {formatNumber(calories)} / {formatNumber(maxCalories)} kcal (
            {formatNumber((calories / maxCalories) * 100)}%)
          </Text>
        </View>
        <View className="flex-row h-6 w-full">
          <MacroBar label="Carbs" consumed={carbs} max={maxCarbs} />
          <View className="grow" />
          <MacroBar label="Protein" consumed={protein} max={maxProtein} />
          <View className="grow" />
          <MacroBar label="Fat" consumed={fat} max={maxFat} />
        </View>
      </Card>
    </>
  );
};

function MacroBar({
  label,
  consumed,
  max,
}: {
  label: string;
  consumed: number;
  max: number;
}) {
  return (
    <View className="h-8 w-1/4 items-center">
      <Text className="mb-1 font-semibold">{label}</Text>
      <Progress
        value={(consumed / max) * 100}
        className="h-2 bg-gray-400 dark:bg-gray-600"
      />
      <Text className="font-semibold text-gray-500 dark:text-gray-300 text-xs text-center">
        {formatNumber(consumed)} / {max} g
      </Text>
      <Text className="font-semibold text-gray-500 dark:text-gray-300 text-xs text-center">
        ({formatNumber((consumed / max) * 100)}%)
      </Text>
    </View>
  );
}
