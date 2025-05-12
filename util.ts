export function formatNumber(num: number): string {
    return num > 999 ? num.toLocaleString('de-DE') : num.toString();
}