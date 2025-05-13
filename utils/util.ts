export function formatNumber(num: number): string {
    return num > 999 ? num.toLocaleString('de-DE') : num.toString();
}

export function formatPercentage(num: number): string {
    return Math.round(num).toString();
}