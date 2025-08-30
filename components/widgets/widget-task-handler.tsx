import React from "react";
import type { WidgetTaskHandlerProps } from "react-native-android-widget";
import { StreakWidget } from "~/components/widgets/streak-widget";
import { getStreakCount } from "~/utils/streak";
import { db } from "~/db/client";
import { streaks } from "~/db/schema";
import { desc } from "drizzle-orm";

const nameToWidget = {
  Streak: StreakWidget,
};

// eslint-disable-next-line @typescript-eslint/require-await
export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const widgetInfo = props.widgetInfo;
  const Widget =
    nameToWidget[widgetInfo.widgetName as keyof typeof nameToWidget];

  const streakCount = getStreakCount(
    await db.select().from(streaks).orderBy(desc(streaks.dateId)),
  );

  switch (props.widgetAction) {
    case "WIDGET_ADDED":
      props.renderWidget(
        <Widget
          streakCount={streakCount}
          height={props.widgetInfo.height}
          width={props.widgetInfo.width}
        />,
      );
      break;

    case "WIDGET_UPDATE":
      // Not needed for now
      props.renderWidget(
        <Widget
          streakCount={streakCount}
          height={props.widgetInfo.height}
          width={props.widgetInfo.width}
        />,
      );
      break;

    case "WIDGET_RESIZED":
      // Not needed for now
      props.renderWidget(
        <Widget
          streakCount={streakCount}
          height={props.widgetInfo.height}
          width={props.widgetInfo.width}
        />,
      );
      break;

    case "WIDGET_DELETED":
      // Not needed for now
      break;

    case "WIDGET_CLICK":
      // Not needed for now
      break;

    default:
      break;
  }
}
