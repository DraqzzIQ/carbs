"use no memo";
import { FlameSvg, makeCircularProgressSvg } from "~/components/widgets/svgs";
import { WidgetColors } from "~/components/widgets/widget-colors";

import React from "react";
import {
  FlexWidget,
  OverlapWidget,
  SvgWidget,
  TextWidget,
} from "react-native-android-widget";

interface MealsWidgetProps {
  displaySnacks: boolean;
  breakfastCalories: number;
  lunchCalories: number;
  dinnerCalories: number;
  snacksCalories: number;
  lunchPercentage: number;
  breakfastPercentage: number;
  dinnerPercentage: number;
  snacksPercentage: number;
  height: number;
  width: number;
  streakCount: number;
  darkMode: boolean;
}

export function MealsWidget({
  displaySnacks,
  breakfastCalories,
  lunchCalories,
  dinnerCalories,
  snacksCalories,
  breakfastPercentage,
  lunchPercentage,
  dinnerPercentage,
  snacksPercentage,
  height,
  width,
  streakCount,
  darkMode,
}: MealsWidgetProps) {
  const bgColor = darkMode
    ? WidgetColors.DarkBgColor
    : WidgetColors.LightBgColor;
  const textColor = darkMode
    ? WidgetColors.DarkFgColor
    : WidgetColors.LightFgColor;

  const secondaryTextColor = "#afafaf";

  const svgSize = width / (displaySnacks ? 6 : 5);

  return (
    <OverlapWidget
      clickAction="OPEN_APP"
      style={{ height: "match_parent", width: "match_parent" }}
    >
      <FlexWidget
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: "match_parent",
          width: "match_parent",
          backgroundColor: bgColor,
          paddingVertical: 16,
          paddingTop: height / 5,
        }}
      >
        <FlexWidget style={{ flex: 1 }} />
        <FlexWidget
          style={{ justifyContent: "center", alignItems: "center" }}
          clickAction="OPEN_URI"
          clickActionData={{ uri: "carbs://meal/add?mealName=Breakfast" }}
        >
          <SvgWidget
            style={{ height: svgSize, width: svgSize }}
            svg={makeCircularProgressSvg(breakfastPercentage, textColor)}
          />
          <TextWidget
            text={"Breakfast"}
            style={{
              marginTop: 10,
              fontSize: 12,
              fontWeight: "normal",
              color: secondaryTextColor,
            }}
          />
          <TextWidget
            text={`${breakfastCalories.toLocaleString()} kcal`}
            style={{
              fontSize: 12,
              fontWeight: "normal",
              color: secondaryTextColor,
            }}
          />
        </FlexWidget>
        <FlexWidget style={{ flex: 1 }} />
        <FlexWidget
          style={{ justifyContent: "center", alignItems: "center" }}
          clickAction="OPEN_URI"
          clickActionData={{ uri: "carbs://meal/add?mealName=Lunch" }}
        >
          <SvgWidget
            style={{ height: svgSize, width: svgSize }}
            svg={makeCircularProgressSvg(lunchPercentage, textColor)}
          />
          <TextWidget
            text={"Lunch"}
            style={{
              marginTop: 10,
              fontSize: 12,
              fontWeight: "normal",
              color: secondaryTextColor,
            }}
          />
          <TextWidget
            text={`${lunchCalories.toLocaleString()} kcal`}
            style={{
              fontSize: 12,
              fontWeight: "normal",
              color: secondaryTextColor,
            }}
          />
        </FlexWidget>
        <FlexWidget style={{ flex: 1 }} />
        <FlexWidget
          style={{ justifyContent: "center", alignItems: "center" }}
          clickAction="OPEN_URI"
          clickActionData={{ uri: "carbs://meal/add?mealName=Dinner" }}
        >
          <SvgWidget
            style={{ height: svgSize, width: svgSize }}
            svg={makeCircularProgressSvg(dinnerPercentage, textColor)}
          />
          <TextWidget
            text={"Dinner"}
            style={{
              marginTop: 10,
              fontSize: 12,
              fontWeight: "normal",
              color: secondaryTextColor,
            }}
          />
          <TextWidget
            text={`${dinnerCalories.toLocaleString()} kcal`}
            style={{
              fontSize: 12,
              fontWeight: "normal",
              color: secondaryTextColor,
            }}
          />
        </FlexWidget>
        <FlexWidget style={{ flex: 1 }} />
        {displaySnacks && (
          <FlexWidget
            style={{ justifyContent: "center", alignItems: "center" }}
            clickAction="OPEN_URI"
            clickActionData={{ uri: "carbs://meal/add?mealName=Snack" }}
          >
            <SvgWidget
              style={{ height: svgSize, width: svgSize }}
              svg={makeCircularProgressSvg(snacksPercentage, textColor)}
            />
            <TextWidget
              text={"Snacks"}
              style={{
                marginTop: 10,
                fontSize: 12,
                fontWeight: "normal",
                color: secondaryTextColor,
              }}
            />
            <TextWidget
              text={`${snacksCalories.toLocaleString()} kcal`}
              style={{
                fontSize: 12,
                fontWeight: "normal",
                color: secondaryTextColor,
              }}
            />
          </FlexWidget>
        )}
        {displaySnacks && <FlexWidget style={{ flex: 1 }} />}
      </FlexWidget>
      <FlexWidget
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          height: "match_parent",
          width: "match_parent",
          padding: 16,
        }}
      >
        <SvgWidget
          svg={FlameSvg(textColor)}
          style={{ height: 30, width: 30 }}
        />
        <TextWidget
          text={streakCount.toString()}
          style={{ color: textColor, fontSize: 24 }}
        />
      </FlexWidget>
    </OverlapWidget>
  );
}
