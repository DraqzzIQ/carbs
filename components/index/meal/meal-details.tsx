import { ScrollView, TouchableOpacity, View } from "react-native";
import { Card } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { MealType } from "~/types/MealType";
import { useEffect, useMemo, useState } from "react";
import { formatNumber } from "~/utils/formatting";
import {
  mealDetailsQuery,
  MealDetailsQueryType,
} from "~/db/queries/mealDetailsQuery";
import { NutritionFacts } from "~/components/index/meal/NutritionFacts";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  LightSpeedInLeft,
  FadeOut,
} from "react-native-reanimated";
import { Trash2Icon } from "lucide-nativewind";
import { removeMealProduct } from "~/utils/querying";

type MealDetailProps = {
  date: string;
  mealType: MealType;
};

export const MealDetails = ({ date, mealType }: MealDetailProps) => {
  const { data: currentDayMeals, error: queryError } = useLiveQuery(
    mealDetailsQuery(date, mealType),
    [date],
  );

  useEffect(() => {
    if (queryError) {
      console.error("Error fetching streaks:", queryError);
    }
  }, [queryError]);

  const mealData = useMemo(() => {
    const result = {
      totalCalories: 0,
      totalCarbs: 0,
      totalProtein: 0,
      totalFat: 0,
    };
    currentDayMeals.forEach((meal) => {
      const quantity = meal.servingQuantity * meal.amount;
      result.totalCalories += meal.food.energy * quantity;
      result.totalCarbs += meal.food.carb * quantity;
      result.totalProtein += meal.food.protein * quantity;
      result.totalFat += meal.food.fat * quantity;
    });
    return result;
  }, [currentDayMeals]);

  return (
    <Animated.View entering={LightSpeedInLeft} exiting={FadeOut}>
      <ScrollView className="h-full bg-secondary mb-6">
        <Card className="p-2 mb-1 bg-secondary border-2 border-foreground">
          <View className="flex-1 flex-row justify-between">
            <View className="items-center">
              <Text className="font-semibold">
                {formatNumber(mealData.totalCalories)} kcal
              </Text>
              <Text className="text-xs">Calories</Text>
            </View>
            <View className="items-center">
              <Text className="font-semibold">
                {formatNumber(mealData.totalCarbs, 1)} g
              </Text>
              <Text className="text-xs">Carbs</Text>
            </View>
            <View className="items-center">
              <Text className="font-semibold">
                {formatNumber(mealData.totalProtein, 1)} g
              </Text>
              <Text className="text-xs">Protein</Text>
            </View>
            <View className="items-center">
              <Text className="font-semibold">
                {formatNumber(mealData.totalFat, 1)} g
              </Text>
              <Text className="text-xs">Fat</Text>
            </View>
          </View>
        </Card>
        {currentDayMeals.length > 0 && (
          <View>
            {currentDayMeals.map((meal) => (
              <MealItem meal={meal} key={meal.id} />
            ))}
            <NutritionFacts meals={currentDayMeals} className="pt-1" />
          </View>
        )}
      </ScrollView>
    </Animated.View>
  );
};

const RightAction = ({
  translation,
  mealId,
  width,
}: {
  translation: SharedValue<number>;
  mealId: number;
  width: number;
}) => {
  const animatedStyle = useAnimatedStyle(() => ({
    width: `${interpolate(
      translation.value,
      [-width / 2, 0],
      [100, -15],
      Extrapolation.CLAMP,
    )}%`,
  }));

  return (
    <TouchableOpacity
      className="flex w-full flex-row items-center pr-4 bg-[#ff526b] h-full justify-center"
      onPress={async () => {
        await removeMealProduct(mealId);
      }}
    >
      <View className="flex-grow" />
      <Animated.View
        style={[animatedStyle]}
        className="items-center justify-center h-full"
      >
        <Trash2Icon className="w-8 h-8 text-primary" />
      </Animated.View>
    </TouchableOpacity>
  );
};

const renderRightActions = (
  translation: SharedValue<number>,
  mealId: number,
  width: number,
) => <RightAction translation={translation} mealId={mealId} width={width} />;

function MealItem({ meal }: { meal: MealDetailsQueryType[number] }) {
  const [width, setWidth] = useState(0);

  return (
    <View
      className="mt-1.5 rounded-lg overflow-hidden"
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      <ReanimatedSwipeable
        renderRightActions={(_, translation) =>
          renderRightActions(translation, meal.id, width)
        }
      >
        <Card className="p-3 bg-secondary ">
          <View className="flex-row">
            <View>
              <Text className="font-semibold">{meal.food.name}</Text>
              <Text className="text-sm">
                {meal.food.producer ? meal.food.producer + ", " : ""}
                {meal.servingQuantity}{" "}
                {meal.servingQuantity > 1 ? "servings" : "serving"} (
                {meal.amount} {meal.food.baseUnit})
              </Text>
            </View>
            <View className="flex-grow" />
            <Text className="">
              {formatNumber(
                meal.food.energy * meal.servingQuantity * meal.amount,
              )}{" "}
              kcal
            </Text>
          </View>
          <View className="flex-row justify-between mt-1">
            <View className="items-center">
              <Text className="text-xs font-semibold">
                {formatNumber(
                  meal.food.carb * meal.servingQuantity * meal.amount,
                  1,
                )}{" "}
                g
              </Text>
              <Text className="text-xs">Carbs</Text>
            </View>
            <View className="items-center">
              <Text className="text-xs font-semibold">
                {formatNumber(
                  meal.food.protein * meal.servingQuantity * meal.amount,
                  1,
                )}{" "}
                g
              </Text>
              <Text className="text-xs">Protein</Text>
            </View>
            <View className="items-center">
              <Text className="text-xs font-semibold">
                {formatNumber(
                  meal.food.fat * meal.servingQuantity * meal.amount,
                  1,
                )}{" "}
                g
              </Text>
              <Text className="text-xs">Fat</Text>
            </View>
          </View>
        </Card>
      </ReanimatedSwipeable>
    </View>
  );
}
