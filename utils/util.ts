import {getLocales} from 'expo-localization';

const locale = getLocales();

export function formatToLocaleString(num: number): string {
    return num > 999 ? num.toLocaleString(locale[0].languageTag) : num.toString();
}

export function roundToInt(num: number, decimals: number = 0): number {
    const factor = Math.pow(10, decimals);
    return Math.round((num + Number.EPSILON) * factor) / factor;
}

export function formatNumber(num: number, decimals: number = 0): string {
    return formatToLocaleString(roundToInt(num, decimals));
}