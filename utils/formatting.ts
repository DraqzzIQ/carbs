import { getLocales } from "expo-localization";

const locales = getLocales();

export function formatToLocaleString(num: number): string {
  return num.toLocaleString(locales[0].languageTag);
}

export function roundToInt(num: number, decimals: number = 0): number {
  const factor = Math.pow(10, decimals);
  return Math.round((num + Number.EPSILON) * factor) / factor;
}

export function formatNumber(num: number, decimals: number = 0): string {
  return formatToLocaleString(roundToInt(num, decimals));
}

export function getCurrentDayFormattedDate(
  offset: number = 0,
  date: Date = new Date(),
): string {
  date.setDate(date.getDate() + offset);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export function convertDayFormatToDate(date: string): Date {
  const [day, month, year] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function offsetDateByDays(date: string, offset: number): string {
  const dateObj = convertDayFormatToDate(date);
  return getCurrentDayFormattedDate(offset, dateObj);
}

export function getDateSlug(date: string): string {
  if (date === getCurrentDayFormattedDate()) {
    return "Today";
  }
  if (date === getCurrentDayFormattedDate(-1)) {
    return "Yesterday";
  }
  if (date === getCurrentDayFormattedDate(1)) {
    return "Tomorrow";
  }

  const dateObj = convertDayFormatToDate(date);
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  };
  if (dateObj.getFullYear() !== now.getFullYear()) {
    options.year = "2-digit";
  }
  return dateObj.toLocaleDateString(locales[0].languageTag, options);
}

export function isBaseUnit(serving: string): boolean {
  const baseUnits = ["gram", "milliliter"];
  return baseUnits.includes(serving.toLowerCase());
}
