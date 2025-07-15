import { Food } from "~/db/schema";

export function createDefaultFood(): Food {
  return {
    ...defaultFood,
    id: Date.now().toString(),
    updatedAt: new Date().toISOString(),
  };
}

const defaultFood: Food = {
  id: Date.now().toString(),
  name: "",
  energy: 0,
  carb: 0,
  protein: 0,
  fat: 0,
  updatedAt: new Date().toISOString(),
  deletedAt: null,
  isCustom: true,
  isVerified: false,
  hasEan: false,
  eans: null,
  valuesPer: 1,
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
    ...createDefaultFood(),
    name: values["name"],
    energy: (parseFloat(values["energy"]) || 0) / valuesPer,
    carb: (parseFloat(values["carb"]) || 0) / valuesPer,
    protein: (parseFloat(values["protein"]) || 0) / valuesPer,
    fat: (parseFloat(values["fat"]) || 0) / valuesPer,
    hasEan: !!barcode,
    eans: barcode ? [barcode] : [],
    valuesPer: valuesPer,
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

export function foodToFormValues(food: Food): Record<string, string> {
  return {
    name: food.name,
    energy: (food.energy * food.valuesPer).toString(),
    carb: (food.carb * food.valuesPer).toString(),
    protein: (food.protein * food.valuesPer).toString(),
    fat: (food.fat * food.valuesPer).toString(),
    valuesPer: food.valuesPer.toString(),
    producer: food.producer || "",
    unit: food.baseUnit || "g",
    amount: food.servings.length > 0 ? food.servings[0].amount.toString() : "",
    serving: food.servings.length > 0 ? food.servings[0].serving : "",
    dietaryFiber: food.dietaryFiber
      ? (food.dietaryFiber * food.valuesPer).toString()
      : "",
    sugar: (food.sugar * food.valuesPer).toString(),
    saturatedFat: (food.saturatedFat * food.valuesPer).toString(),
    monoUnsaturatedFat: food.monoUnsaturatedFat
      ? (food.monoUnsaturatedFat * food.valuesPer).toString()
      : "",
    polyUnsaturatedFat: food.polyUnsaturatedFat
      ? (food.polyUnsaturatedFat * food.valuesPer).toString()
      : "",
    transFat: food.transFat ? (food.transFat * food.valuesPer).toString() : "",
    alcohol: food.alcohol ? (food.alcohol * food.valuesPer).toString() : "",
    cholesterol: food.cholesterol
      ? (food.cholesterol * food.valuesPer).toString()
      : "",
    sodium: food.sodium ? (food.sodium * food.valuesPer).toString() : "",
    salt: (food.salt * food.valuesPer).toString(),
    water: food.water ? (food.water * food.valuesPer).toString() : "",
    vitaminA: food.vitaminA ? (food.vitaminA * food.valuesPer).toString() : "",
    vitaminB1: food.vitaminB1
      ? (food.vitaminB1 * food.valuesPer).toString()
      : "",
    vitaminB11: food.vitaminB11
      ? (food.vitaminB11 * food.valuesPer).toString()
      : "",
    vitaminB12: food.vitaminB12
      ? (food.vitaminB12 * food.valuesPer).toString()
      : "",
    vitaminB2: food.vitaminB2
      ? (food.vitaminB2 * food.valuesPer).toString()
      : "",
    vitaminB3: food.vitaminB3
      ? (food.vitaminB3 * food.valuesPer).toString()
      : "",
    vitaminB5: food.vitaminB5
      ? (food.vitaminB5 * food.valuesPer).toString()
      : "",
    vitaminB6: food.vitaminB6
      ? (food.vitaminB6 * food.valuesPer).toString()
      : "",
    vitaminB7: food.vitaminB7
      ? (food.vitaminB7 * food.valuesPer).toString()
      : "",
    vitaminC: food.vitaminC ? (food.vitaminC * food.valuesPer).toString() : "",
    vitaminD: food.vitaminD ? (food.vitaminD * food.valuesPer).toString() : "",
    vitaminE: food.vitaminE ? (food.vitaminE * food.valuesPer).toString() : "",
    vitaminK: food.vitaminK ? (food.vitaminK * food.valuesPer).toString() : "",
    arsenic: food.arsenic ? (food.arsenic * food.valuesPer).toString() : "",
    biotin: food.biotin ? (food.biotin * food.valuesPer).toString() : "",
    boron: food.boron ? (food.boron * food.valuesPer).toString() : "",
    calcium: food.calcium ? (food.calcium * food.valuesPer).toString() : "",
    chlorine: food.chlorine ? (food.chlorine * food.valuesPer).toString() : "",
    choline: food.choline ? (food.choline * food.valuesPer).toString() : "",
    chrome: food.chrome ? (food.chrome * food.valuesPer).toString() : "",
    cobalt: food.cobalt ? (food.cobalt * food.valuesPer).toString() : "",
    copper: food.copper ? (food.copper * food.valuesPer).toString() : "",
    fluoride: food.fluoride ? (food.fluoride * food.valuesPer).toString() : "",
    fluorine: food.fluorine ? (food.fluorine * food.valuesPer).toString() : "",
    iodine: food.iodine ? (food.iodine * food.valuesPer).toString() : "",
    iron: food.iron ? (food.iron * food.valuesPer).toString() : "",
    magnesium: food.magnesium
      ? (food.magnesium * food.valuesPer).toString()
      : "",
    manganese: food.manganese
      ? (food.manganese * food.valuesPer).toString()
      : "",
    molybdenum: food.molybdenum
      ? (food.molybdenum * food.valuesPer).toString()
      : "",
    phosphorus: food.phosphorus
      ? (food.phosphorus * food.valuesPer).toString()
      : "",
    potassium: food.potassium
      ? (food.potassium * food.valuesPer).toString()
      : "",
    rubidium: food.rubidium ? (food.rubidium * food.valuesPer).toString() : "",
    selenium: food.selenium ? (food.selenium * food.valuesPer).toString() : "",
    silicon: food.silicon ? (food.silicon * food.valuesPer).toString() : "",
    sulfur: food.sulfur ? (food.sulfur * food.valuesPer).toString() : "",
    tin: food.tin ? (food.tin * food.valuesPer).toString() : "",
    vanadium: food.vanadium ? (food.vanadium * food.valuesPer).toString() : "",
    zinc: food.zinc ? (food.zinc * food.valuesPer).toString() : "",
  };
}
