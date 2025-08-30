"use no memo";
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
}

export function StreakWidget({
  streakCount,
  height,
  width,
}: StreakWidgetProps) {
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
          backgroundColor: "#ffffff",
          borderRadius: minSize / 2,
        }}
      >
        <SvgWidget
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
          svg={require("../../assets/widgets/flame.svg")}
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
              color: "#000000",
              height: "match_parent",
              width: "match_parent",
              textAlign: "center",
              marginTop: minSize * 0.415,
            }}
          />
        </FlexWidget>
      </OverlapWidget>
    </FlexWidget>
  );
}
