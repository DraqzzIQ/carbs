export function getDefaultServing(baseUnit: string): string {
  switch (baseUnit) {
    case "g":
      return "Gram";
    case "ml":
      return "Milliliter";
    default:
      return "Gram";
  }
}

export function formatServing(
  serving: string,
  amount: number,
  baseUnit: string,
): string {
  serving = serving[0].toUpperCase() + serving.slice(1);
  const parts = serving.split(".");
  if (parts.length > 1) {
    serving = parts[0] + ", " + parts[1];
  }

  if (serving !== "Gram" && serving !== "Milliliter") {
    return `${serving} (${amount} ${baseUnit})`;
  }

  return serving;
}
