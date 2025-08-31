const pluralMap: Record<string, string> = {
  glass: "glasses",
  each: "each",
  half: "halves",
};

export function pluralizeServingType(type: string): string {
  return pluralMap[type] || `${type}s`;
}
