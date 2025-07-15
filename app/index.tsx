import { AppState, View, ScrollView } from "react-native";
import { useSettings } from "~/contexts/AppSettingsContext";
import { Header } from "~/components/index/header";
import { Summary } from "~/components/index/summary";
import { Meals } from "~/components/index/meals";
import { useRelationalLiveQuery } from "~/db/queries/useRelationalLiveQuery";
import {
  getCurrentDayFormattedDate,
  offsetDateByDays,
} from "~/utils/formatting";
import { useEffect, useRef, useState } from "react";
import { useNavigation } from "expo-router";
import { getDateSlug } from "~/utils/formatting";
import { runOnJS } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { NutritionFacts } from "~/components/index/meal/nutrition-facts";
import { mealDetailsQuery } from "~/db/queries/mealDetailsQuery";
import { mapMealsToNutritionFacts } from "~/utils/mapMealsToNutritionFacts";

export default function Screen() {
  const {
    maxCarbs,
    maxProtein,
    maxFat,
    maxBreakfast,
    maxLunch,
    maxDinner,
    maxSnacks,
    displaySnacks,
  } = useSettings();
  const maxCalories =
    maxBreakfast + maxLunch + maxDinner + (displaySnacks ? maxSnacks : 0);

  const [currentDay, setCurrentDay] = useState(getCurrentDayFormattedDate);
  const [dateString, setDateString] = useState<string>(getDateSlug(currentDay));

  const { data: currentDayMeals, error: queryError } = useRelationalLiveQuery(
    mealDetailsQuery(currentDay),
    [currentDay],
  );

  useEffect(() => {
    if (queryError) {
      console.error("Error fetching streaks:", queryError);
    }
  }, [queryError]);

  const onSwipe = (direction: "left" | "right") => {
    const offset = direction === "left" ? 1 : -1;
    const newDate = offsetDateByDays(currentDay, offset);
    setCurrentDay(newDate);
    setDateString(getDateSlug(newDate));
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onEnd((event) => {
      if (event.translationX < -50) {
        runOnJS(onSwipe)("left");
      } else if (event.translationX > 50) {
        runOnJS(onSwipe)("right");
      }
    });

  //region update date header on focus and app state change
  const navigation = useNavigation();
  useEffect(() => {
    return navigation.addListener("focus", () => {
      setDateString(getDateSlug(currentDay));
    });
  }, [navigation, currentDay]);

  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        setDateString(getDateSlug(currentDay));
      }
      appState.current = nextAppState;
    });
    return () => {
      subscription.remove();
    };
  }, [currentDay]);
  //endregion

  return (
    <ScrollView className="bg-secondary" showsVerticalScrollIndicator={false}>
      <GestureDetector gesture={panGesture}>
        <View className="w-full items-center h-full">
          <View className="flex-1 items-center p-4 text-primary w-full max-w-xl">
            <Header date={dateString} />
            <View className="w-full">
              <Summary
                currentDayMeals={currentDayMeals}
                maxCalories={maxCalories}
                maxCarbs={maxCarbs}
                maxProtein={maxProtein}
                maxFat={maxFat}
              />
              <Meals
                date={currentDay}
                currentDayMeals={currentDayMeals}
                maxBreakfast={maxBreakfast}
                maxLunch={maxLunch}
                maxDinner={maxDinner}
                maxSnacks={maxSnacks}
                displaySnacks={displaySnacks}
              />
              <NutritionFacts
                foods={mapMealsToNutritionFacts(currentDayMeals)}
                className="mt-20"
              />
            </View>
          </View>
        </View>
      </GestureDetector>
    </ScrollView>
  );
}
