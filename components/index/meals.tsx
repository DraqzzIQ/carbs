import { Text } from "~/components/ui/text";
import { Card } from "~/components/ui/card";
import {
  CandyIcon,
  CoffeeIcon,
  PlusIcon,
  SandwichIcon,
  UtensilsIcon,
} from "lucide-nativewind";
import { Separator } from "~/components/ui/separator";
import { TouchableOpacity, View } from "react-native";
import { Progress } from "~/components/ui/progress";
import { formatNumber } from "~/utils/formatting";
import { router } from "expo-router";
import { MealType } from "~/types/MealType";
import { Fragment, ReactNode } from "react";
import { MealDetailsQueryType } from "~/db/queries/mealDetailsQuery";

type MealsProps = {
  currentDayMeals: MealDetailsQueryType;
  maxBreakfast: number;
  maxLunch: number;
  maxDinner: number;
  maxSnacks: number;
  displaySnacks: boolean;
  date: string;
};

export const Meals = ({
  currentDayMeals,
  maxBreakfast,
  maxLunch,
  maxDinner,
  maxSnacks,
  displaySnacks,
  date,
}: MealsProps) => {
  const breakfast = getMealData(currentDayMeals, MealType.BREAKFAST);
  const lunch = getMealData(currentDayMeals, MealType.LUNCH);
  const dinner = getMealData(currentDayMeals, MealType.DINNER);
  const snacks = getMealData(currentDayMeals, MealType.SNACK);

  return (
    <>
      <Text className="font-semibold text-lg w-full mt-7">Nutrition</Text>
      <Card className="w-full gap-3 p-4 rounded-2xl bg-secondary mt-1">
        {[
          {
            icon: <CoffeeIcon className="mr-3 w-7 h-7 text-primary" />,
            name: "Breakfast",
            consumed: breakfast,
            max: maxBreakfast,
            date: date,
          },
          {
            icon: <SandwichIcon className="mr-3 w-7 h-7 text-primary" />,
            name: "Lunch",
            consumed: lunch,
            max: maxLunch,
            date: date,
          },
          {
            icon: <UtensilsIcon className="mr-3 w-7 h-7 text-primary" />,
            name: "Dinner",
            consumed: dinner,
            max: maxDinner,
            date: date,
          },
        ].map((meal, index, arr) => (
          <Fragment key={meal.name}>
            <MealBar {...meal} />
            {(index < arr.length - 1 || displaySnacks) && <Separator />}
          </Fragment>
        ))}
        {displaySnacks && (
          <MealBar
            icon={<CandyIcon className="mr-3 w-7 h-7 text-primary" />}
            name="Snacks"
            consumed={snacks}
            max={maxSnacks}
            date={date}
          />
        )}
      </Card>
    </>
  );
};

function MealBar({
  icon,
  name,
  consumed,
  max,
  date,
}: {
  icon: ReactNode;
  name: string;
  consumed: { calories: number; carbs: number; protein: number; fat: number };
  max: number;
  date: string;
}) {
  const percentage = (consumed.calories / max) * 100;

  return (
    <TouchableOpacity
      onPress={() => router.push(`/meal?mealName=${name}&date=${date}`)}
    >
      <View className="flex-row items-center">
        {icon}
        <View className="items-center w-2/3">
          <Text className="mb-1 font-semibold w-full">{name}</Text>
          <Progress
            value={percentage}
            className="h-2 bg-gray-400 dark:bg-gray-600"
          />
          <Text className="text-xs text-gray-500 dark:text-gray-300 font-semibold w-full">
            {formatNumber(consumed.calories)} / {max} kcal (
            {formatNumber(percentage)}%)
          </Text>
        </View>
        <View className="grow" />
        <TouchableOpacity
          onPress={() => router.push(`/meal/add?mealName=${name}&date=${date}`)}
        >
          <View className="w-10 h-10 items-center justify-center">
            <PlusIcon className="h-7 w-7 text-primary" />
          </View>
        </TouchableOpacity>
      </View>
      <View className="flex-row justify-between mt-1">
        <View className="items-center">
          <Text className="text-xs font-semibold">
            {formatNumber(consumed.carbs, 1)} g
          </Text>
          <Text className="text-xs">Carbs</Text>
        </View>
        <View className="items-center">
          <Text className="text-xs font-semibold">
            {formatNumber(consumed.protein, 1)} g
          </Text>
          <Text className="text-xs">Protein</Text>
        </View>
        <View className="items-center">
          <Text className="text-xs font-semibold">
            {formatNumber(consumed.fat, 1)} g
          </Text>
          <Text className="text-xs">Fat</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function getMealData(
  meals: MealDetailsQueryType,
  mealType: MealType,
): { calories: number; carbs: number; protein: number; fat: number } {
  const filteredMeals = meals.filter((meal) => meal.mealType === mealType);
  let result = { calories: 0, carbs: 0, protein: 0, fat: 0 };
  filteredMeals.forEach((meal) => {
    const quantity = meal.servingQuantity * meal.amount;
    result.calories += meal.food.energy * quantity;
    result.carbs += meal.food.carb * quantity;
    result.protein += meal.food.protein * quantity;
    result.fat += meal.food.fat * quantity;
  });
  return result;
}
