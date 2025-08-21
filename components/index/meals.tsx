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

interface MealsProps {
  currentDayMeals: MealDetailsQueryType;
  maxBreakfast: number;
  maxLunch: number;
  maxDinner: number;
  maxSnacks: number;
  displaySnacks: boolean;
  dateId: string;
}

export const Meals = ({
  currentDayMeals,
  maxBreakfast,
  maxLunch,
  maxDinner,
  maxSnacks,
  displaySnacks,
  dateId,
}: MealsProps) => {
  const breakfast = getMealData(currentDayMeals, MealType.BREAKFAST);
  const lunch = getMealData(currentDayMeals, MealType.LUNCH);
  const dinner = getMealData(currentDayMeals, MealType.DINNER);
  const snacks = getMealData(currentDayMeals, MealType.SNACK);

  return (
    <>
      <Text className="mt-7 w-full text-xl font-semibold">Nutrition</Text>
      <Card className="mt-1 w-full gap-3 rounded-2xl p-4">
        {[
          {
            icon: <CoffeeIcon className="mr-3 h-7 w-7 text-primary" />,
            name: MealType.BREAKFAST,
            consumed: breakfast,
            max: maxBreakfast,
            dateId: dateId,
          },
          {
            icon: <SandwichIcon className="mr-3 h-7 w-7 text-primary" />,
            name: MealType.LUNCH,
            consumed: lunch,
            max: maxLunch,
            dateId: dateId,
          },
          {
            icon: <UtensilsIcon className="mr-3 h-7 w-7 text-primary" />,
            name: MealType.DINNER,
            consumed: dinner,
            max: maxDinner,
            dateId: dateId,
          },
        ].map((meal, index, arr) => (
          <Fragment key={meal.name}>
            <MealBar {...meal} />
            {(index < arr.length - 1 || displaySnacks) && <Separator />}
          </Fragment>
        ))}
        {displaySnacks && (
          <MealBar
            icon={<CandyIcon className="mr-3 h-7 w-7 text-primary" />}
            name={MealType.SNACK}
            consumed={snacks}
            max={maxSnacks}
            dateId={dateId}
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
  dateId,
}: {
  icon: ReactNode;
  name: string;
  consumed: { calories: number; carbs: number; protein: number; fat: number };
  max: number;
  dateId: string;
}) {
  const percentage = (consumed.calories / max) * 100;

  return (
    <TouchableOpacity
      onPress={() =>
        router.navigate({
          pathname: "/meal",
          params: { mealName: name, dateId: dateId },
        })
      }
    >
      <View className="flex-row items-center">
        {icon}
        <View className="w-2/3 items-center">
          <Text className="mb-1 w-full font-semibold">{name}</Text>
          <Progress
            value={percentage}
            className="h-2 bg-gray-400 dark:bg-gray-600"
          />
          <Text className="w-full text-xs font-semibold text-gray-500 dark:text-gray-300">
            {formatNumber(consumed.calories)} / {max} kcal (
            {formatNumber(percentage)}%)
          </Text>
        </View>
        <View className="grow" />
        <TouchableOpacity
          onPress={() =>
            router.navigate({
              pathname: "/meal/add",
              params: { mealName: name, dateId: dateId },
            })
          }
        >
          <View className="h-10 w-10 items-center justify-center">
            <PlusIcon className="h-7 w-7 text-primary" />
          </View>
        </TouchableOpacity>
      </View>
      <View className="mt-1 flex-row justify-between">
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
  const result = { calories: 0, carbs: 0, protein: 0, fat: 0 };
  filteredMeals.forEach((meal) => {
    const quantity = meal.servingQuantity * meal.amount;
    result.calories += meal.food.energy * quantity;
    result.carbs += meal.food.carb * quantity;
    result.protein += meal.food.protein * quantity;
    result.fat += meal.food.fat * quantity;
  });
  return result;
}
