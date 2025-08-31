"use no memo";
import { WidgetColors } from "~/components/widgets/widget-colors";
import { FlameSvg } from "~/components/widgets/svgs";

import React from "react";
import {
  FlexWidget,
  OverlapWidget,
  SvgWidget,
  TextWidget,
} from "react-native-android-widget";

interface StreakWidgetProps {
  streakCount: number;
  height: number;
  width: number;
  darkMode: boolean;
}

export function StreakWidget({
  streakCount,
  height,
  width,
  darkMode,
}: StreakWidgetProps) {
  const bgColor = darkMode
    ? WidgetColors.DarkBgColor
    : WidgetColors.LightBgColor;
  const textColor = darkMode
    ? WidgetColors.DarkFgColor
    : WidgetColors.LightFgColor;

  const minSize = Math.min(width, height);
  let fontSize = Math.max(16, Math.round(minSize / 3.5));
  fontSize -= streakCount.toString().length * 2;

  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        alignItems: "center",
        justifyContent: "center",
        height: "match_parent",
        width: "match_parent",
      }}
    >
      <OverlapWidget
        style={{
          height: minSize,
          width: minSize,
          backgroundColor: bgColor,
          borderRadius: minSize / 2,
        }}
      >
        <SvgWidget
          svg={FlameSvg(textColor)}
          style={{ height: "match_parent", width: "match_parent" }}
        />
        <FlexWidget
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: "match_parent",
            width: "match_parent",
          }}
        >
          <TextWidget
            text={streakCount.toString()}
            style={{
              fontSize: fontSize,
              fontWeight: "bold",
              color: textColor,
              height: "match_parent",
              width: "match_parent",
              textAlign: "center",
              marginTop: minSize * 0.42,
            }}
          />
        </FlexWidget>
      </OverlapWidget>
    </FlexWidget>
  );
}
