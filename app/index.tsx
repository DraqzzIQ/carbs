import { AppState, View, ScrollView } from "react-native";
import { useSettings } from "~/contexts/AppSettingsContext";
import { Header } from "~/components/index/header";
import { Summary } from "~/components/index/summary";
import { Meals } from "~/components/index/meals";
import { useRelationalLiveQuery } from "~/db/queries/useRelationalLiveQuery";
import { getDateIdFromDate, offsetDateIdByDays } from "~/utils/formatting";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { getDateSlug } from "~/utils/formatting";
import { runOnJS } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { NutritionFacts } from "~/components/index/meal/nutrition-facts";
import { mealDetailsQuery } from "~/db/queries/mealDetailsQuery";
import { mapMealsToNutritionFacts } from "~/utils/mapMealsToNutritionFacts";
import { db } from "~/db/client";
import { fluidIntake } from "~/db/schema";
import { desc, eq } from "drizzle-orm";
import { WaterTracker } from "~/components/index/water-tracker";

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
    maxFluidIntake,
  } = useSettings();
  const maxCalories =
    maxBreakfast + maxLunch + maxDinner + (displaySnacks ? maxSnacks : 0);
  const params = useLocalSearchParams<{
    dateId?: string;
  }>();

  const [currentDayId, setCurrentDayId] = useState(
    params.dateId ?? getDateIdFromDate(),
  );
  const [dateString, setDateString] = useState<string>(
    getDateSlug(currentDayId),
  );

  const { waterTrackerEnabled } = useSettings();

  const { data: currentDayMeals, error: mealDetailsQueryError } =
    useRelationalLiveQuery(mealDetailsQuery(currentDayId), [currentDayId]);

  useEffect(() => {
    if (mealDetailsQueryError) {
      console.error("Error fetching streaks: ", mealDetailsQueryError);
    }
  }, [mealDetailsQueryError]);

  const { data: fluidIntakeResult, error: fluidIntakeQueryError } =
    useRelationalLiveQuery(
      db
        .select()
        .from(fluidIntake)
        .orderBy(desc(fluidIntake.id))
        .where(eq(fluidIntake.dateId, currentDayId)),
      [currentDayId],
    );
  const totalFluidIntake = useMemo(() => {
    return (
      fluidIntakeResult?.reduce((total, day) => total + day.amount, 0) || 0
    );
  }, [fluidIntakeResult]);

  useEffect(() => {
    if (fluidIntakeQueryError) {
      console.error("Error fetching fluid intake: ", fluidIntakeQueryError);
    }
  }, [fluidIntakeQueryError]);

  const onSwipe = (direction: "left" | "right") => {
    const offset = direction === "left" ? 1 : -1;
    const newDate = offsetDateIdByDays(currentDayId, offset);
    setCurrentDayId(newDate);
    setDateString(getDateSlug(newDate));
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-50, 50])
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
      setDateString(getDateSlug(currentDayId));
    });
  }, [navigation, currentDayId]);

  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        setDateString(getDateSlug(currentDayId));
      }
      appState.current = nextAppState;
    });
    return () => {
      subscription.remove();
    };
  }, [currentDayId]);
  //endregion

  return (
    <ScrollView className="bg-secondary" showsVerticalScrollIndicator={false}>
      <GestureDetector gesture={panGesture}>
        <View className="h-full w-full items-center">
          <View className="w-full max-w-xl flex-1 items-center p-4 text-primary">
            <Header dateSlug={dateString} dateId={currentDayId} />
            <View className="w-full">
              <Summary
                currentDayMeals={currentDayMeals}
                maxCalories={maxCalories}
                maxCarbs={maxCarbs}
                maxProtein={maxProtein}
                maxFat={maxFat}
                fluidIntake={totalFluidIntake}
                maxFluidIntake={maxFluidIntake}
                waterTrackerEnabled={waterTrackerEnabled}
              />
              <Meals
                dateId={currentDayId}
                currentDayMeals={currentDayMeals}
                maxBreakfast={maxBreakfast}
                maxLunch={maxLunch}
                maxDinner={maxDinner}
                maxSnacks={maxSnacks}
                displaySnacks={displaySnacks}
              />
              {waterTrackerEnabled && (
                <WaterTracker
                  dateId={currentDayId}
                  fluidIntake={fluidIntakeResult}
                />
              )}
              <NutritionFacts
                foods={mapMealsToNutritionFacts(currentDayMeals)}
                className="mt-8"
              />
            </View>
          </View>
        </View>
      </GestureDetector>
    </ScrollView>
  );
}
