"use no memo";
import { WidgetColors } from "~/components/widgets/widget-colors";

import React from "react";
import { FlexWidget, TextWidget } from "react-native-android-widget";

interface CaloriesWidgetProps {
  goalCalories: number;
  eatenCalories: number;
  darkMode: boolean;
}

export function CaloriesWidget({
  goalCalories,
  eatenCalories,
  darkMode,
}: CaloriesWidgetProps) {
  const bgColor = darkMode
    ? WidgetColors.DarkBgColor
    : WidgetColors.LightBgColor;
  const textColor = darkMode
    ? WidgetColors.DarkFgColor
    : WidgetColors.LightFgColor;

  let remainingCalories = goalCalories - eatenCalories;
  const over = remainingCalories < 0;
  remainingCalories = Math.abs(remainingCalories);

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
      }}
    >
      <FlexWidget style={{ justifyContent: "center", alignItems: "center" }}>
        <TextWidget
          text={goalCalories.toString()}
          style={{ fontSize: 22, fontWeight: "bold", color: textColor }}
        />
        <TextWidget
          text={"Goal"}
          style={{ fontSize: 16, fontWeight: "normal", color: textColor }}
        />
      </FlexWidget>
      <TextWidget
        text={"-"}
        style={{ fontSize: 24, fontWeight: "600", color: textColor }}
      />
      <FlexWidget style={{ justifyContent: "center", alignItems: "center" }}>
        <TextWidget
          text={eatenCalories.toString()}
          style={{ fontSize: 22, fontWeight: "bold", color: textColor }}
        />
        <TextWidget
          text={"Eaten"}
          style={{ fontSize: 16, fontWeight: "normal", color: textColor }}
        />
      </FlexWidget>
      <TextWidget
        text={"="}
        style={{ fontSize: 24, fontWeight: "600", color: textColor }}
      />
      <FlexWidget style={{ justifyContent: "center", alignItems: "center" }}>
        <TextWidget
          text={remainingCalories.toString()}
          style={{ fontSize: 22, fontWeight: "bold", color: textColor }}
        />
        <TextWidget
          text={over ? "Over" : "Remaining"}
          style={{ fontSize: 16, fontWeight: "normal", color: textColor }}
        />
      </FlexWidget>
    </FlexWidget>
  );
}
