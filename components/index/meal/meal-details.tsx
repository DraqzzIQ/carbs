import { ScrollView, TouchableOpacity, View } from "react-native";
import { Card } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { useRelationalLiveQuery } from "~/db/queries/useRelationalLiveQuery";
import { MealType } from "~/types/MealType";
import { useEffect, useMemo, useState } from "react";
import { formatNumber } from "~/utils/formatting";
import {
  mealDetailsQuery,
  MealDetailsQueryType,
} from "~/db/queries/mealDetailsQuery";
import { NutritionFacts } from "~/components/index/meal/nutrition-facts";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { Trash2Icon } from "lucide-nativewind";
import { removeFoodFromMeal } from "~/utils/querying";
import { router } from "expo-router";
import { mapMealsToNutritionFacts } from "~/utils/mapMealsToNutritionFacts";
import { MacroHeader } from "~/components/index/meal/macro-header";
import { formatServing } from "~/utils/serving";

type MealDetailProps = {
  date: string;
  mealType: MealType;
};

export const MealDetails = ({ date, mealType }: MealDetailProps) => {
  const { data: currentDayMeals, error: queryError } = useRelationalLiveQuery(
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
    <ScrollView className="h-full bg-secondary pb-6">
      <MacroHeader
        energy={mealData.totalCalories}
        carbs={mealData.totalCarbs}
        protein={mealData.totalProtein}
        fat={mealData.totalFat}
      />
      {currentDayMeals.length > 0 ? (
        <View>
          {currentDayMeals.map((meal) => (
            <MealItem meal={meal} key={meal.id} />
          ))}
          <View className="p-1 pb-2 mt-6">
            <NutritionFacts foods={mapMealsToNutritionFacts(currentDayMeals)} />
          </View>
        </View>
      ) : (
        <Text className="text-center text-muted-foreground mt-4">
          Nothing added yet.
        </Text>
      )}
    </ScrollView>
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
    <View className="w-full items-center justify-center h-full p-1">
      <TouchableOpacity
        className="w-full bg-[#ff526b] pr-4 rounded-lg"
        onPress={async () => {
          await removeFoodFromMeal(mealId);
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
    </View>
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
    <TouchableOpacity
      onPress={async () => {
        const path = `/meal/add/${meal.food.category === "quick-entry" ? "/quick-entry" : "product"}`;
        router.navigate({
          pathname: path as any,
          params: {
            edit: "true",
            mealId: meal.id,
            date: meal.date,
            mealName: meal.mealType,
          },
        });
      }}
    >
      <View
        className="mt-1.5 rounded-lg overflow-hidden"
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      >
        <ReanimatedSwipeable
          renderRightActions={(_, translation) =>
            renderRightActions(translation, meal.id, width)
          }
        >
          <Card className="p-3 bg-secondary m-1">
            <View className="flex-row">
              <View>
                <Text className="font-semibold">{meal.food.name}</Text>
                <Text className="text-sm">
                  {meal.food.producer ? meal.food.producer : ""}
                  {meal.food.category !== "quick-entry" && (
                    <>
                      {meal.food.producer ? ", " : ""}
                      {meal.servingQuantity}{" "}
                      {meal.amount === 1
                        ? meal.food.baseUnit
                        : formatServing(
                            meal.serving,
                            meal.amount * meal.servingQuantity,
                            meal.food.baseUnit,
                            meal.servingQuantity > 1,
                          )}
                    </>
                  )}
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
    </TouchableOpacity>
  );
}
