import React from "react";
import {
  requestWidgetUpdate,
  WidgetInfo,
  WidgetTaskHandlerProps,
} from "react-native-android-widget";
import { StreakWidget } from "~/components/widgets/streak-widget";
import { getStreakCount } from "~/utils/streak";
import { db } from "~/db/client";
import { streaks } from "~/db/schema";
import { desc } from "drizzle-orm";
import { CaloriesWidget } from "~/components/widgets/calories-widget";
import { getCurrentSettings } from "~/contexts/AppSettingsContext";
import { getTotalCaloriesForDayAndMeal } from "~/utils/querying";
import { getDateIdFromDate, roundToInt } from "~/utils/formatting";
import { Appearance } from "react-native";
import { MealsWidget } from "~/components/widgets/meals-widget";
import { MealType } from "~/types/MealType";

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const widgetInfo = props.widgetInfo;

  if (widgetInfo.widgetName === "Streak") {
    switch (props.widgetAction) {
      case "WIDGET_ADDED":
      case "WIDGET_UPDATE":
      case "WIDGET_RESIZED":
        props.renderWidget(await renderStreakWidget(widgetInfo));
        break;
      default:
        break;
    }
  } else if (widgetInfo.widgetName === "Calories") {
    switch (props.widgetAction) {
      case "WIDGET_ADDED":
      case "WIDGET_UPDATE":
      case "WIDGET_RESIZED":
        props.renderWidget(await renderCaloriesWidget());
        break;
      default:
        break;
    }
  } else if (widgetInfo.widgetName === "Meals") {
    switch (props.widgetAction) {
      case "WIDGET_ADDED":
      case "WIDGET_UPDATE":
      case "WIDGET_RESIZED":
        props.renderWidget(await renderMealsWidget(widgetInfo));
        break;
      default:
        break;
    }
  }
}

export async function renderStreakWidget(widgetInfo: WidgetInfo) {
  const colorScheme = Appearance.getColorScheme();
  const streakCount = getStreakCount(
    await db.select().from(streaks).orderBy(desc(streaks.dateId)),
  );

  return (
    <StreakWidget
      streakCount={streakCount}
      height={widgetInfo.height}
      width={widgetInfo.width}
      darkMode={colorScheme === "dark"}
    />
  );
}

export async function renderCaloriesWidget() {
  const colorScheme = Appearance.getColorScheme();
  const { maxBreakfast, maxLunch, maxDinner } = await getCurrentSettings();
  const goalCalories = roundToInt(maxBreakfast + maxLunch + maxDinner);
  const eatenCalories = roundToInt(
    await getTotalCaloriesForDayAndMeal(getDateIdFromDate()),
  );

  return (
    <CaloriesWidget
      eatenCalories={eatenCalories}
      goalCalories={goalCalories}
      darkMode={colorScheme === "dark"}
    />
  );
}

export async function renderMealsWidget(widgetInfo: WidgetInfo) {
  const colorScheme = Appearance.getColorScheme();
  const { displaySnacks, maxBreakfast, maxLunch, maxDinner, maxSnacks } =
    await getCurrentSettings();
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

  const streakCount = getStreakCount(
    await db.select().from(streaks).orderBy(desc(streaks.dateId)),
  );

  return (
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
      height={widgetInfo.height}
      width={widgetInfo.width}
      streakCount={streakCount}
      darkMode={colorScheme === "dark"}
    />
  );
}

export async function requestAllWidgetsUpdate() {
  await Promise.all([
    requestWidgetUpdate({
      widgetName: "Streak",
      renderWidget: (widgetInfo) => renderStreakWidget(widgetInfo),
    }),
    requestWidgetUpdate({
      widgetName: "Calories",
      renderWidget: () => renderCaloriesWidget(),
    }),
    requestWidgetUpdate({
      widgetName: "Meals",
      renderWidget: (widgetInfo) => renderMealsWidget(widgetInfo),
    }),
  ]);
}
