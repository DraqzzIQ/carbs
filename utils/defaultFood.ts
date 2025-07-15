import { Food } from "~/db/schema";

export const defaultFood: Food = {
  id: Date.now().toString(),
  name: "",
  energy: 0,
  carb: 0,
  protein: 0,
  fat: 0,
  updatedAt: new Date().toISOString(),
  isCustom: true,
  isVerified: false,
  hasEan: false,
  eans: null,
  producer: null,
  category: "",
  baseUnit: "g",
  servings: [],
  dietaryFiber: null,
  sugar: 0,
  saturatedFat: 0,
  monoUnsaturatedFat: null,
  polyUnsaturatedFat: null,
  transFat: null,
  alcohol: null,
  cholesterol: null,
  sodium: null,
  salt: 0,
  water: null,
  vitaminA: null,
  vitaminB1: null,
  vitaminB11: null,
  vitaminB12: null,
  vitaminB2: null,
  vitaminB3: null,
  vitaminB5: null,
  vitaminB6: null,
  vitaminB7: null,
  vitaminC: null,
  vitaminD: null,
  vitaminE: null,
  vitaminK: null,
  arsenic: null,
  biotin: null,
  boron: null,
  calcium: null,
  chlorine: null,
  choline: null,
  chrome: null,
  cobalt: null,
  copper: null,
  fluoride: null,
  fluorine: null,
  iodine: null,
  iron: null,
  magnesium: null,
  manganese: null,
  molybdenum: null,
  phosphorus: null,
  potassium: null,
  rubidium: null,
  selenium: null,
  silicon: null,
  sulfur: null,
  tin: null,
  vanadium: null,
  zinc: null,
};

export function createCustomFood(
  values: Record<string, string>,
  barcode: string | undefined,
): Food {
  const valuesPer = parseFloat(values["valuesPer"]) || 1;
  const amount = parseFloat(values["amount"]);
  const serving = values["serving"];
  return {
    ...defaultFood,
    name: values["name"],
    energy: (parseFloat(values["energy"]) || 0) / valuesPer,
    carb: (parseFloat(values["carb"]) || 0) / valuesPer,
    protein: (parseFloat(values["protein"]) || 0) / valuesPer,
    fat: (parseFloat(values["fat"]) || 0) / valuesPer,
    hasEan: !!barcode,
    eans: barcode ? [barcode] : [],
    producer: values["producer"] || null,
    baseUnit: values["unit"] || "g",
    servings:
      amount && serving?.length > 0
        ? [{ amount: amount, serving: serving }]
        : [],
    dietaryFiber: values["dietaryFiber"]
      ? parseFloat(values["dietaryFiber"]) / valuesPer
      : null,
    sugar: (parseFloat(values["sugar"]) || 0) / valuesPer,
    saturatedFat: (parseFloat(values["saturatedFat"]) || 0) / valuesPer,
    monoUnsaturatedFat: values["monoUnsaturatedFat"]
      ? parseFloat(values["monoUnsaturatedFat"]) / valuesPer
      : null,
    polyUnsaturatedFat: values["polyUnsaturatedFat"]
      ? parseFloat(values["polyUnsaturatedFat"]) / valuesPer
      : null,
    transFat: values["transFat"]
      ? parseFloat(values["transFat"]) / valuesPer
      : null,
    alcohol: values["alcohol"]
      ? parseFloat(values["alcohol"]) / valuesPer
      : null,
    cholesterol: values["cholesterol"]
      ? parseFloat(values["cholesterol"]) / valuesPer
      : null,
    sodium: values["sodium"] ? parseFloat(values["sodium"]) / valuesPer : null,
    salt: (parseFloat(values["salt"]) || 0) / valuesPer,
    water: values["water"] ? parseFloat(values["water"]) / valuesPer : null,
    vitaminA: values["vitaminA"]
      ? parseFloat(values["vitaminA"]) / valuesPer
      : null,
    vitaminB1: values["vitaminB1"]
      ? parseFloat(values["vitaminB1"]) / valuesPer
      : null,
    vitaminB11: values["vitaminB11"]
      ? parseFloat(values["vitaminB11"]) / valuesPer
      : null,
    vitaminB12: values["vitaminB12"]
      ? parseFloat(values["vitaminB12"]) / valuesPer
      : null,
    vitaminB2: values["vitaminB2"]
      ? parseFloat(values["vitaminB2"]) / valuesPer
      : null,
    vitaminB3: values["vitaminB3"]
      ? parseFloat(values["vitaminB3"]) / valuesPer
      : null,
    vitaminB5: values["vitaminB5"]
      ? parseFloat(values["vitaminB5"]) / valuesPer
      : null,
    vitaminB6: values["vitaminB6"]
      ? parseFloat(values["vitaminB6"]) / valuesPer
      : null,
    vitaminB7: values["vitaminB7"]
      ? parseFloat(values["vitaminB7"]) / valuesPer
      : null,
    vitaminC: values["vitaminC"]
      ? parseFloat(values["vitaminC"]) / valuesPer
      : null,
    vitaminD: values["vitaminD"]
      ? parseFloat(values["vitaminD"]) / valuesPer
      : null,
    vitaminE: values["vitaminE"]
      ? parseFloat(values["vitaminE"]) / valuesPer
      : null,
    vitaminK: values["vitaminK"]
      ? parseFloat(values["vitaminK"]) / valuesPer
      : null,
    arsenic: values["arsenic"]
      ? parseFloat(values["arsenic"]) / valuesPer
      : null,
    biotin: values["biotin"] ? parseFloat(values["biotin"]) / valuesPer : null,
    boron: values["boron"] ? parseFloat(values["boron"]) / valuesPer : null,
    calcium: values["calcium"]
      ? parseFloat(values["calcium"]) / valuesPer
      : null,
    chlorine: values["chlorine"]
      ? parseFloat(values["chlorine"]) / valuesPer
      : null,
    choline: values["choline"]
      ? parseFloat(values["choline"]) / valuesPer
      : null,
    chrome: values["chrome"] ? parseFloat(values["chrome"]) / valuesPer : null,
    cobalt: values["cobalt"] ? parseFloat(values["cobalt"]) / valuesPer : null,
    copper: values["copper"] ? parseFloat(values["copper"]) / valuesPer : null,
    fluoride: values["fluoride"]
      ? parseFloat(values["fluoride"]) / valuesPer
      : null,
    fluorine: values["fluorine"]
      ? parseFloat(values["fluorine"]) / valuesPer
      : null,
    iodine: values["iodine"] ? parseFloat(values["iodine"]) / valuesPer : null,
    iron: values["iron"] ? parseFloat(values["iron"]) / valuesPer : null,
    magnesium: values["magnesium"]
      ? parseFloat(values["magnesium"]) / valuesPer
      : null,
    manganese: values["manganese"]
      ? parseFloat(values["manganese"]) / valuesPer
      : null,
    molybdenum: values["molybdenum"]
      ? parseFloat(values["molybdenum"]) / valuesPer
      : null,
    phosphorus: values["phosphorus"]
      ? parseFloat(values["phosphorus"]) / valuesPer
      : null,
    potassium: values["potassium"]
      ? parseFloat(values["potassium"]) / valuesPer
      : null,
    rubidium: values["rubidium"]
      ? parseFloat(values["rubidium"]) / valuesPer
      : null,
    selenium: values["selenium"]
      ? parseFloat(values["selenium"]) / valuesPer
      : null,
    silicon: values["silicon"]
      ? parseFloat(values["silicon"]) / valuesPer
      : null,
    sulfur: values["sulfur"] ? parseFloat(values["sulfur"]) / valuesPer : null,
    tin: values["tin"] ? parseFloat(values["tin"]) / valuesPer : null,
    vanadium: values["vanadium"]
      ? parseFloat(values["vanadium"]) / valuesPer
      : null,
    zinc: values["zinc"] ? parseFloat(values["zinc"]) / valuesPer : null,
  };
}
