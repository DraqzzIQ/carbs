import { Text } from "~/components/ui/text";
import { Card } from "~/components/ui/card";
import { View } from "react-native";
import { Progress } from "~/components/ui/progress";
import { formatNumber, getVolumeUnitForLocale } from "~/utils/formatting";
import { useMemo } from "react";
import { MealDetailsQueryType } from "~/db/queries/mealDetailsQuery";

interface SummaryProps {
  currentDayMeals: MealDetailsQueryType;
  maxCalories: number;
  maxCarbs: number;
  maxProtein: number;
  maxFat: number;
  fluidIntake: number;
  maxFluidIntake: number;
  waterTrackerEnabled: boolean;
}

export const Summary = ({
  currentDayMeals,
  maxCalories,
  maxCarbs,
  maxProtein,
  maxFat,
  fluidIntake,
  maxFluidIntake,
  waterTrackerEnabled,
}: SummaryProps) => {
  const calories = useMemo(() => {
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
      <Text className="mt-4 w-full text-xl font-semibold">Summary</Text>
      <Card className="mt-1 w-full gap-3 rounded-2xl p-4 pb-6">
        <View className="items-center">
          <Text className="mb-1 text-lg font-semibold">Calories</Text>
          <Progress
            value={(calories / maxCalories) * 100}
            className="h-2 bg-gray-400 dark:bg-gray-600"
          />
          <Text className="text-sm font-semibold text-gray-500 dark:text-gray-300">
            {formatNumber(calories)} / {formatNumber(maxCalories)} kcal (
            {formatNumber((calories / maxCalories) * 100)}%)
          </Text>
        </View>
        <View className="h-16 w-full flex-row">
          <MacroBar label="Carbs" consumed={carbs} max={maxCarbs} />
          <View className="grow" />
          <MacroBar label="Protein" consumed={protein} max={maxProtein} />
          <View className="grow" />
          <MacroBar label="Fat" consumed={fat} max={maxFat} />
        </View>
        {waterTrackerEnabled && (
          <View className="items-center">
            <Text className="text-md mb-1 font-semibold">Water</Text>
            <Progress
              value={(fluidIntake / maxFluidIntake) * 100}
              className="h-2 bg-gray-400 dark:bg-gray-600"
            />
            <Text className="text-sm font-semibold text-gray-500 dark:text-gray-300">
              {formatNumber(fluidIntake)} / {formatNumber(maxFluidIntake)}{" "}
              {getVolumeUnitForLocale()} (
              {formatNumber((fluidIntake / maxFluidIntake) * 100)}%)
            </Text>
          </View>
        )}
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
      <Text className="text-center text-xs font-semibold text-gray-500 dark:text-gray-300">
        {formatNumber(consumed)} / {max} g
      </Text>
      <Text className="text-center text-xs font-semibold text-gray-500 dark:text-gray-300">
        ({formatNumber((consumed / max) * 100)}%)
      </Text>
    </View>
  );
}
