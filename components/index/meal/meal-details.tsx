import { FlatList, TouchableOpacity, View } from "react-native";
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
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { Trash2Icon } from "lucide-nativewind";
import { removeFoodFromMeal } from "~/utils/querying";
import { router } from "expo-router";
import { MacroHeader } from "~/components/index/meal/macro-header";
import { formatServing } from "~/utils/serving";
import { NutritionFacts } from "~/components/index/meal/nutrition-facts";
import { mapMealsToNutritionFacts } from "~/utils/mapMealsToNutritionFacts";

interface MealDetailProps {
  dateId: string;
  mealType: MealType;
}

export const MealDetails = ({ dateId, mealType }: MealDetailProps) => {
  const { data: currentDayMeals, error: queryError } = useRelationalLiveQuery(
    mealDetailsQuery(dateId, mealType),
    [dateId],
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
    <>
      <FlatList
        className="h-full bg-secondary"
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        ListHeaderComponent={
          <MacroHeader
            energy={mealData.totalCalories}
            carbs={mealData.totalCarbs}
            protein={mealData.totalProtein}
            fat={mealData.totalFat}
          />
        }
        contentContainerClassName="pb-10"
        data={currentDayMeals}
        renderItem={({ item }) => <MealItem meal={item} key={item.id} />}
      />
      {currentDayMeals.length === 0 ? (
        <Text className="mt-4 text-center text-muted-foreground">
          Nothing added yet.
        </Text>
      ) : (
        <NutritionFacts
          foods={mapMealsToNutritionFacts(currentDayMeals)}
          className="mb-10"
        />
      )}
    </>
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
    <View className="h-full w-full items-center justify-center p-1">
      <TouchableOpacity
        className="w-full rounded-lg bg-[#ff526b] pr-4"
        onPress={async () => {
          await removeFoodFromMeal(mealId);
        }}
      >
        <View className="flex-grow" />
        <Animated.View
          style={[animatedStyle]}
          className="h-full items-center justify-center"
        >
          <Trash2Icon className="h-8 w-8 text-primary" />
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
    <Animated.View
      className="mt-1.5 overflow-hidden rounded-lg"
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      exiting={FadeOut}
      layout={LinearTransition}
    >
      <ReanimatedSwipeable
        renderRightActions={(_, translation) =>
          renderRightActions(translation, meal.id, width)
        }
      >
        <Card className="m-1 p-3">
          <TouchableOpacity
            onPress={async () => {
              const pathname =
                meal.food.category === "quick-entry"
                  ? "/meal/add/quick-entry"
                  : "/meal/add/product";
              router.navigate({
                pathname,
                params: {
                  edit: "true",
                  mealId: meal.id,
                  dateId: meal.dateId,
                  mealName: meal.mealType,
                },
              });
            }}
          >
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
            <View className="mt-1 flex-row justify-between">
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
          </TouchableOpacity>
        </Card>
      </ReanimatedSwipeable>
    </Animated.View>
  );
}
