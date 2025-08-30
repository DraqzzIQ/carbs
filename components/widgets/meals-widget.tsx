"use no memo";
import { makeCircularProgressSvg } from "~/components/widgets/svgs";
import { WidgetColors } from "~/components/widgets/widget-colors";

import React from "react";
import { FlexWidget, SvgWidget, TextWidget } from "react-native-android-widget";

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
  darkMode,
}: MealsWidgetProps) {
  const bgColor = darkMode
    ? WidgetColors.DarkBgColor
    : WidgetColors.LightBgColor;
  const textColor = darkMode
    ? WidgetColors.DarkFgColor
    : WidgetColors.LightFgColor;

  const secondaryTextColor = "#afafaf";

  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: "match_parent",
        width: "match_parent",
        backgroundColor: bgColor,
        padding: 16,
        paddingTop: height / 3,
      }}
    >
      <FlexWidget style={{ justifyContent: "center", alignItems: "center" }}>
        <SvgWidget
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
      <FlexWidget style={{ justifyContent: "center", alignItems: "center" }}>
        <SvgWidget svg={makeCircularProgressSvg(lunchPercentage, textColor)} />
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
      <FlexWidget style={{ justifyContent: "center", alignItems: "center" }}>
        <SvgWidget svg={makeCircularProgressSvg(dinnerPercentage, textColor)} />
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
      {displaySnacks && (
        <FlexWidget style={{ justifyContent: "center", alignItems: "center" }}>
          <SvgWidget
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
    </FlexWidget>
  );
}
