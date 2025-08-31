import { pluralizeServingType } from "~/utils/plurals";
import { Food } from "~/db/schema";
import { ServingDto } from "~/api/types/FoodDetails";

export function getDefaultServing(baseUnit: string): string {
  switch (baseUnit) {
    case "g":
      return "Gram";
    case "ml":
      return "Milliliter";
    case "oz":
      return "Ounce";
    case "fl oz":
      return "Fluid Ounce";
    default:
      return "Gram";
  }
}

export function formatServing(
  serving: string,
  amount: number,
  baseUnit: string,
  plural = false,
): string {
  if (!serving) {
    return `${amount} ${baseUnit}`;
  }

  serving = serving[0].toUpperCase() + serving.slice(1);
  const parts = serving.split(".");
  if (plural) {
    parts[0] = pluralizeServingType(parts[0]);
  }
  if (parts.length > 1) {
    serving = parts[0] + ", " + parts[1];
  }

  if (
    serving !== "Gram" &&
    serving !== "Milliliter" &&
    serving !== "Ounce" &&
    serving !== "Fluid Ounce"
  ) {
    return `${serving} (${amount} ${baseUnit})`;
  }

  return serving;
}

export function getServingUnitLabel(
  serving: string,
  amount: number,
  baseUnit: string,
) {
  switch (serving) {
    case "gram":
      return "g";
    case "milliliter":
      return "ml";
    case "ounce":
      return "oz";
    case "fluid-ounce":
      return "fl oz";
    default:
      return formatServing(serving, amount, baseUnit);
  }
}

export const formatFoodSubtitle = (
  food: Food,
  serving: string,
  servingQuantity: number,
  amount: number,
) => {
  const producer = food.producer ? `${food.producer}, ` : "";
  const unit =
    amount === 1
      ? food.baseUnit
      : formatServing(
          serving,
          amount * servingQuantity,
          food.baseUnit,
          servingQuantity > 1,
        );
  return `${producer}${servingQuantity} ${unit}`;
};

export const getDefaultValuesForServing = (
  servings: ServingDto[],
  baseUnit: string,
): { serving: string; amount: number; servingQuantity: number } => {
  const amount = servings[0]?.amount ?? 1;
  const servingQuantity = amount === 1 ? 100 : 1;
  const serving = servings[0]?.serving ?? getDefaultServing(baseUnit);
  return { serving, amount, servingQuantity };
};
