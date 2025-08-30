import React from "react";
import type { WidgetTaskHandlerProps } from "react-native-android-widget";
import { StreakWidget } from "~/components/widgets/streak-widget";
import { getStreakCount } from "~/utils/streak";
import { db } from "~/db/client";
import { streaks } from "~/db/schema";
import { desc } from "drizzle-orm";
import { CaloriesWidget } from "~/components/widgets/calories-widget";
import { getStaticSettings } from "~/contexts/AppSettingsContext";
import { getTotalCaloriesForDayAndMeal } from "~/utils/querying";
import { getDateIdFromDate, roundToInt } from "~/utils/formatting";
import { Appearance } from "react-native";
import { MealsWidget } from "~/components/widgets/meals-widget";
import { MealType } from "~/types/MealType";

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const widgetInfo = props.widgetInfo;

  const colorScheme = Appearance.getColorScheme();

  if (widgetInfo.widgetName === "Streak") {
    const streakCount = getStreakCount(
      await db.select().from(streaks).orderBy(desc(streaks.dateId)),
    );

    switch (props.widgetAction) {
      case "WIDGET_ADDED":
      case "WIDGET_UPDATE":
      case "WIDGET_RESIZED":
        props.renderWidget(
          <StreakWidget
            streakCount={streakCount}
            height={props.widgetInfo.height}
            width={props.widgetInfo.width}
            darkMode={colorScheme === "dark"}
          />,
        );
        break;
      default:
        break;
    }
  } else if (widgetInfo.widgetName === "Calories") {
    const { maxBreakfast, maxLunch, maxDinner } = getStaticSettings();
    const goalCalories = roundToInt(maxBreakfast + maxLunch + maxDinner);
    const eatenCalories = roundToInt(
      await getTotalCaloriesForDayAndMeal(getDateIdFromDate()),
    );

    switch (props.widgetAction) {
      case "WIDGET_ADDED":
      case "WIDGET_UPDATE":
      case "WIDGET_RESIZED":
        props.renderWidget(
          <CaloriesWidget
            eatenCalories={eatenCalories}
            goalCalories={goalCalories}
            darkMode={colorScheme === "dark"}
          />,
        );
        break;
      default:
        break;
    }
  } else if (widgetInfo.widgetName === "Meals") {
    const { displaySnacks, maxBreakfast, maxLunch, maxDinner, maxSnacks } =
      getStaticSettings();
    const [breakfastCalories, lunchCalories, dinnerCalories, snacksCalories] =
      await Promise.all([
        getTotalCaloriesForDayAndMeal(getDateIdFromDate(), MealType.BREAKFAST),
        getTotalCaloriesForDayAndMeal(getDateIdFromDate(), MealType.LUNCH),
        getTotalCaloriesForDayAndMeal(getDateIdFromDate(), MealType.DINNER),
        displaySnacks
          ? getTotalCaloriesForDayAndMeal(getDateIdFromDate(), MealType.SNACK)
          : Promise.resolve(0),
      ]);

    const breakfastPercentage =
      maxBreakfast === 0
        ? 0
        : roundToInt((breakfastCalories / maxBreakfast) * 100);
    const lunchPercentage =
      maxLunch === 0 ? 0 : roundToInt((lunchCalories / maxLunch) * 100);
    const dinnerPercentage =
      maxDinner === 0 ? 0 : roundToInt((dinnerCalories / maxDinner) * 100);
    const snacksPercentage =
      maxSnacks === 0 ? 0 : roundToInt((snacksCalories / maxSnacks) * 100);

    switch (props.widgetAction) {
      case "WIDGET_ADDED":
      case "WIDGET_UPDATE":
      case "WIDGET_RESIZED":
        props.renderWidget(
          <MealsWidget
            breakfastCalories={roundToInt(breakfastCalories)}
            lunchCalories={roundToInt(lunchCalories)}
            dinnerCalories={roundToInt(dinnerCalories)}
            snacksCalories={roundToInt(snacksCalories)}
            breakfastPercentage={breakfastPercentage}
            lunchPercentage={lunchPercentage}
            dinnerPercentage={dinnerPercentage}
            snacksPercentage={snacksPercentage}
            displaySnacks={displaySnacks}
            height={props.widgetInfo.height}
            darkMode={colorScheme === "dark"}
          />,
        );
        break;
      default:
        break;
    }
  }
}
