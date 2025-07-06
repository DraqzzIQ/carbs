import { pluralizeServingType } from "~/utils/plurals";

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
  plural: boolean = false,
): string {
  serving = serving[0].toUpperCase() + serving.slice(1);
  const parts = serving.split(".");
  if (plural) {
    parts[0] = pluralizeServingType(parts[0]);
  }
  if (parts.length > 1) {
    serving = parts[0] + ", " + parts[1];
  }

  if (serving !== "Gram" && serving !== "Milliliter") {
    return `${serving} (${amount} ${baseUnit})`;
  }

  return serving;
}
