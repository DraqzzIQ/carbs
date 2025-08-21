import { getLocales } from "expo-localization";

const locales = getLocales();

export function formatToLocaleString(num: number): string {
  return num.toLocaleString(locales[0].languageTag);
}

export function roundToInt(num: number, decimals = 0): number {
  const factor = Math.pow(10, decimals);
  return Math.round((num + Number.EPSILON) * factor) / factor;
}

export function formatNumber(num: number, decimals = 0): string {
  return formatToLocaleString(roundToInt(num, decimals));
}

export function getDateIdFromDate(offset = 0, date: Date = new Date()): string {
  date.setDate(date.getDate() + offset);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}

export function convertDateIdToDate(date: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function offsetDateIdByDays(dateId: string, offset: number): string {
  const dateObj = convertDateIdToDate(dateId);
  return getDateIdFromDate(offset, dateObj);
}

export function getDateSlug(dateId: string): string {
  if (dateId === getDateIdFromDate()) {
    return "Today";
  }
  if (dateId === getDateIdFromDate(-1)) {
    return "Yesterday";
  }
  if (dateId === getDateIdFromDate(1)) {
    return "Tomorrow";
  }

  const dateObj = convertDateIdToDate(dateId);
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
  const baseUnits = ["gram", "milliliter", "ounce", "fluid-ounce"];
  return baseUnits.includes(serving.toLowerCase());
}

export function getVolumeUnitForLocale(): string {
  return locales[0].languageTag === "en-US" ? "oz" : "ml";
}
