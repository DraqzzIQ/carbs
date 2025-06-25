import { Streak } from "~/db/schema";
import {
  convertDayFormatToDate,
  getCurrentDayFormattedDate,
} from "~/utils/formatting";

export function getStreakCount(streakDays: Streak[]): number {
  if (streakDays.length === 0) {
    return 0;
  }

  streakDays.sort((a, b) => {
    return +convertDayFormatToDate(b.day) - +convertDayFormatToDate(a.day);
  });

  const today = getCurrentDayFormattedDate();
  const yesterday = getCurrentDayFormattedDate(-1);

  const firstStreakIndex = streakDays.findIndex(
    (streak) => streak.day === today || streak.day === yesterday,
  );
  if (firstStreakIndex === -1) {
    return 0;
  }

  let count = 1;
  let currentDayDate = convertDayFormatToDate(streakDays[firstStreakIndex].day);
  for (let i = firstStreakIndex + 1; i < streakDays.length; i++) {
    const previousDayDate = currentDayDate;
    currentDayDate = convertDayFormatToDate(streakDays[i].day);

    if (
      previousDayDate.getTime() - currentDayDate.getTime() ===
      24 * 60 * 60 * 1000
    ) {
      count++;
    } else {
      break;
    }
  }
  return count;
}
