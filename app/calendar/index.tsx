import { View } from "react-native";
import { useState, useEffect } from "react";
import {
  Calendar,
  CalendarActiveDateRange,
  CalendarTheme,
} from "@marceloterreiro/flash-calendar";
import { router, useLocalSearchParams } from "expo-router";
import { getLocales } from "expo-localization";
import { getAllStreaks } from "~/utils/querying";
import {
  convertDateIdToDate,
  getDateIdFromDate,
  offsetDateIdByDays,
} from "~/utils/formatting";
import { Card, CardTitle } from "~/components/ui/card";

const locales = getLocales();

export default function CalendarScreen() {
  const params = useLocalSearchParams<{
    dateId: string;
  }>();
  const [firstStreakDateId, setFirstStreakDateId] = useState<string | null>(
    null,
  );
  const [pastMonthAmount, setPastMonthAmount] = useState<number | null>(null);
  const [streaks, setStreaks] = useState<CalendarActiveDateRange[]>([]);

  useEffect(() => {
    (async () => {
      const streaks = await getAllStreaks();
      const fetchedId = streaks[0] || null;
      setPastMonthAmount(12);
      setStreaks(buildRangesFromStreaks(streaks));
      if (!fetchedId) return;

      const today = convertDateIdToDate(params.dateId);
      const firstStreakDate = convertDateIdToDate(fetchedId);
      setPastMonthAmount(diffInMonths(firstStreakDate, today) + 12);
      setFirstStreakDateId(fetchedId);
    })();
  }, [params.dateId]);

  if (!pastMonthAmount) return <View />;

  return (
    <View className="m-4 flex-1">
      <Calendar.List
        calendarFirstDayOfWeek="monday"
        theme={linearTheme}
        onCalendarDayPress={(dateId) => navigateHome(dateId)}
        calendarSpacing={68}
        calendarMonthHeaderHeight={0}
        calendarAdditionalHeight={45}
        calendarRowHorizontalSpacing={14}
        calendarRowVerticalSpacing={14}
        calendarMonthId={params.dateId}
        calendarActiveDateRanges={streaks}
        getCalendarWeekDayFormat={formatWeekDay}
        calendarPastScrollRangeInMonths={pastMonthAmount}
        calendarMinDateId={
          firstStreakDateId
            ? subtractMonths(firstStreakDateId.slice(0, -2) + "01", 12)
            : undefined
        }
        renderItem={({ item }) => (
          <Card className="mb-[20px] py-[24px]">
            <CardTitle className="mb-[16px] h-[28px] text-center">
              {formatMonth(convertDateIdToDate(item.id))}
            </CardTitle>
            <Calendar calendarMonthId={item.id} {...item.calendarProps} />
          </Card>
        )}
      />
    </View>
  );
}

function buildRangesFromStreaks(streaks: string[]): CalendarActiveDateRange[] {
  const ranges: CalendarActiveDateRange[] = [];
  let currentRange: CalendarActiveDateRange | null = null;

  streaks.forEach((dateId) => {
    if (!currentRange) {
      currentRange = {
        startId: dateId,
        endId: dateId,
      };
    } else if (offsetDateIdByDays(currentRange.endId!, 1) === dateId) {
      currentRange.endId = dateId;
    } else {
      ranges.push(currentRange);
      currentRange = {
        startId: dateId,
        endId: dateId,
      };
    }
  });
  if (currentRange) {
    ranges.push(currentRange);
  }

  return ranges;
}

function subtractMonths(dateId: string, months: number): string {
  const date = convertDateIdToDate(dateId);
  date.setMonth(date.getMonth() - months);
  return getDateIdFromDate(0, date);
}

function diffInMonths(date1, date2) {
  const years = date2.getFullYear() - date1.getFullYear();
  const months = date2.getMonth() - date1.getMonth();
  return years * 12 + months;
}

function navigateHome(dateId: string) {
  router.dismissAll();

  router.replace({
    pathname: "/",
    params: { dateId: dateId },
  });
}

function formatWeekDay(date: Date): string {
  return date.toLocaleDateString(locales[0].languageTag, {
    weekday: "short",
  });
}

function formatMonth(date: Date): string {
  return date.toLocaleDateString(locales[0].languageTag, {
    month: "long",
    year: "numeric",
  });
}

export const linearTheme: CalendarTheme = {
  rowWeek: {
    container: {
      borderBottomWidth: 1,
      borderBottomColor: "rgb(136,136,136)",
      borderStyle: "solid",
    },
  },
  itemWeekName: { content: { color: "rgb(136,136,136)" } },
};
