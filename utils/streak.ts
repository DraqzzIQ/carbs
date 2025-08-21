import { Streak } from "~/db/schema";
import { convertDateIdToDate, getDateIdFromDate } from "~/utils/formatting";

export function getStreakCount(streakDays: Streak[]): number {
  if (streakDays.length === 0) {
    return 0;
  }

  const today = getDateIdFromDate();
  const yesterday = getDateIdFromDate(-1);

  const firstStreakIndex = streakDays.findIndex(
    (streak) => streak.dateId === today || streak.dateId === yesterday,
  );
  if (firstStreakIndex === -1) {
    return 0;
  }

  let count = 1;
  let currentDayDate = convertDateIdToDate(streakDays[firstStreakIndex].dateId);
  for (let i = firstStreakIndex + 1; i < streakDays.length; i++) {
    const previousDayDate = currentDayDate;
    currentDayDate = convertDateIdToDate(streakDays[i].dateId);

    const prevDay = toUtcDayMs(previousDayDate);
    const currDay = toUtcDayMs(currentDayDate);

    if (prevDay - currDay === 86_400_000) {
      count++;
    } else {
      break;
    }
  }
  return count;
}

const toUtcDayMs = (d: Date) =>
  Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
