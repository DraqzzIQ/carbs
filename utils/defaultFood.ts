import { Food } from "~/db/schema";
import { roundToInt } from "~/utils/formatting";

export function createDefaultFood(): Food {
  return {
    ...defaultFood,
    id: Date.now().toString(),
    updatedAt: new Date().toISOString(),
  };
}

const defaultFood: Food = {
  id: Date.now().toString(),
  isRecipe: false,
  recipeServingQuantity: null,
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
  const valuesPer = parseFloat(values.valuesPer) || 1;
  const amount = parseFloat(values.amount);
  const serving = values.serving;
  return {
    ...createDefaultFood(),
    name: values.name,
    energy: (parseFloat(values.energy) || 0) / valuesPer,
    carb: (parseFloat(values.carb) || 0) / valuesPer,
    protein: (parseFloat(values.protein) || 0) / valuesPer,
    fat: (parseFloat(values.fat) || 0) / valuesPer,
    hasEan: !!barcode,
    eans: barcode ? [barcode] : [],
    valuesPer: valuesPer,
    producer: values.producer || null,
    baseUnit: values.unit || "g",
    servings:
      amount && serving?.length > 0
        ? [{ amount: amount, serving: serving }]
        : [],
    dietaryFiber: values.dietaryFiber
      ? parseFloat(values.dietaryFiber) / valuesPer
      : null,
    sugar: (parseFloat(values.sugar) || 0) / valuesPer,
    saturatedFat: (parseFloat(values.saturatedFat) || 0) / valuesPer,
    monoUnsaturatedFat: values.monoUnsaturatedFat
      ? parseFloat(values.monoUnsaturatedFat) / valuesPer
      : null,
    polyUnsaturatedFat: values.polyUnsaturatedFat
      ? parseFloat(values.polyUnsaturatedFat) / valuesPer
      : null,
    transFat: values.transFat ? parseFloat(values.transFat) / valuesPer : null,
    alcohol: values.alcohol ? parseFloat(values.alcohol) / valuesPer : null,
    cholesterol: values.cholesterol
      ? parseFloat(values.cholesterol) / 1_000 / valuesPer
      : null,
    sodium: values.sodium
      ? parseFloat(values.sodium) / 1_000 / valuesPer
      : null,
    salt: (parseFloat(values.salt) || 0) / valuesPer,
    water: values.water ? parseFloat(values.water) / valuesPer : null,
    vitaminA: values.vitaminA
      ? parseFloat(values.vitaminA) / 1_000_000 / valuesPer
      : null,
    vitaminB1: values.vitaminB1
      ? parseFloat(values.vitaminB1) / 1_000 / valuesPer
      : null,
    vitaminB11: values.vitaminB11
      ? parseFloat(values.vitaminB11) / 1_000_000 / valuesPer
      : null,
    vitaminB12: values.vitaminB12
      ? parseFloat(values.vitaminB12) / 1_000_000 / valuesPer
      : null,
    vitaminB2: values.vitaminB2
      ? parseFloat(values.vitaminB2) / 1_000 / valuesPer
      : null,
    vitaminB3: values.vitaminB3
      ? parseFloat(values.vitaminB3) / 1_000 / valuesPer
      : null,
    vitaminB5: values.vitaminB5
      ? parseFloat(values.vitaminB5) / 1_000 / valuesPer
      : null,
    vitaminB6: values.vitaminB6
      ? parseFloat(values.vitaminB6) / 1_000 / valuesPer
      : null,
    vitaminB7: values.vitaminB7
      ? parseFloat(values.vitaminB7) / 1_000_000 / valuesPer
      : null,
    vitaminC: values.vitaminC
      ? parseFloat(values.vitaminC) / 1_000 / valuesPer
      : null,
    vitaminD: values.vitaminD
      ? parseFloat(values.vitaminD) / 1_000_000 / valuesPer
      : null,
    vitaminE: values.vitaminE
      ? parseFloat(values.vitaminE) / 1_000 / valuesPer
      : null,
    vitaminK: values.vitaminK
      ? parseFloat(values.vitaminK) / 1_000_000 / valuesPer
      : null,
    arsenic: values.arsenic
      ? parseFloat(values.arsenic) / 1_000_000 / valuesPer
      : null,
    biotin: values.biotin
      ? parseFloat(values.biotin) / 1_000_000 / valuesPer
      : null,
    boron: values.boron ? parseFloat(values.boron) / 1_000 / valuesPer : null,
    calcium: values.calcium
      ? parseFloat(values.calcium) / 1_000 / valuesPer
      : null,
    chlorine: values.chlorine
      ? parseFloat(values.chlorine) / 1_000 / valuesPer
      : null,
    choline: values.choline
      ? parseFloat(values.choline) / 1_000 / valuesPer
      : null,
    chrome: values.chrome
      ? parseFloat(values.chrome) / 1_000_000 / valuesPer
      : null,
    cobalt: values.cobalt
      ? parseFloat(values.cobalt) / 1_000_000 / valuesPer
      : null,
    copper: values.copper
      ? parseFloat(values.copper) / 1_000 / valuesPer
      : null,
    fluoride: values.fluoride
      ? parseFloat(values.fluoride) / 1_000 / valuesPer
      : null,
    fluorine: values.fluorine
      ? parseFloat(values.fluorine) / 1_000 / valuesPer
      : null,
    iodine: values.iodine
      ? parseFloat(values.iodine) / 1_000_000 / valuesPer
      : null,
    iron: values.iron ? parseFloat(values.iron) / 1_000 / valuesPer : null,
    magnesium: values.magnesium
      ? parseFloat(values.magnesium) / 1_000 / valuesPer
      : null,
    manganese: values.manganese
      ? parseFloat(values.manganese) / 1_000 / valuesPer
      : null,
    molybdenum: values.molybdenum
      ? parseFloat(values.molybdenum) / 1_000_000 / valuesPer
      : null,
    phosphorus: values.phosphorus
      ? parseFloat(values.phosphorus) / 1_000 / valuesPer
      : null,
    potassium: values.potassium
      ? parseFloat(values.potassium) / 1_000 / valuesPer
      : null,
    rubidium: values.rubidium
      ? parseFloat(values.rubidium) / 1_000 / valuesPer
      : null,
    selenium: values.selenium
      ? parseFloat(values.selenium) / 1_000_000 / valuesPer
      : null,
    silicon: values.silicon
      ? parseFloat(values.silicon) / 1_000 / valuesPer
      : null,
    sulfur: values.sulfur
      ? parseFloat(values.sulfur) / 1_000 / valuesPer
      : null,
    tin: values.tin ? parseFloat(values.tin) / 1_000 / valuesPer : null,
    vanadium: values.vanadium
      ? parseFloat(values.vanadium) / 1_000_000 / valuesPer
      : null,
    zinc: values.zinc ? parseFloat(values.zinc) / 1_000 / valuesPer : null,
  };
}

export function foodToFormValues(food: Food): Record<string, string> {
  return {
    name: food.name,
    energy: roundToInt(food.energy * food.valuesPer, 2).toString(),
    carb: roundToInt(food.carb * food.valuesPer, 2).toString(),
    protein: roundToInt(food.protein * food.valuesPer, 2).toString(),
    fat: roundToInt(food.fat * food.valuesPer, 2).toString(),
    valuesPer: food.valuesPer.toString(),
    producer: food.producer ?? "",
    unit: food.baseUnit || "g",
    amount: food.servings.length > 0 ? food.servings[0].amount.toString() : "",
    serving: food.servings.length > 0 ? food.servings[0].serving : "",
    dietaryFiber: food.dietaryFiber
      ? roundToInt(food.dietaryFiber * food.valuesPer, 2).toString()
      : "",
    sugar: roundToInt(food.sugar * food.valuesPer, 2).toString(),
    saturatedFat: roundToInt(food.saturatedFat * food.valuesPer, 2).toString(),
    monoUnsaturatedFat: food.monoUnsaturatedFat
      ? roundToInt(food.monoUnsaturatedFat * food.valuesPer, 2).toString()
      : "",
    polyUnsaturatedFat: food.polyUnsaturatedFat
      ? roundToInt(food.polyUnsaturatedFat * food.valuesPer, 2).toString()
      : "",
    transFat: food.transFat
      ? roundToInt(food.transFat * food.valuesPer, 2).toString()
      : "",
    alcohol: food.alcohol
      ? roundToInt(food.alcohol * food.valuesPer, 2).toString()
      : "",
    cholesterol: food.cholesterol
      ? roundToInt(food.cholesterol * 1_000 * food.valuesPer, 2).toString()
      : "",
    sodium: food.sodium
      ? roundToInt(food.sodium * 1_000 * food.valuesPer, 2).toString()
      : "",
    salt: roundToInt(food.salt * food.valuesPer, 2).toString(),
    water: food.water
      ? roundToInt(food.water * food.valuesPer, 2).toString()
      : "",
    vitaminA: food.vitaminA
      ? roundToInt(food.vitaminA * 1_000_000 * food.valuesPer, 2).toString()
      : "",
    vitaminB1: food.vitaminB1
      ? roundToInt(food.vitaminB1 * 1_000 * food.valuesPer, 2).toString()
      : "",
    vitaminB11: food.vitaminB11
      ? roundToInt(food.vitaminB11 * 1_000_000 * food.valuesPer, 2).toString()
      : "",
    vitaminB12: food.vitaminB12
      ? roundToInt(food.vitaminB12 * 1_000_000 * food.valuesPer, 2).toString()
      : "",
    vitaminB2: food.vitaminB2
      ? roundToInt(food.vitaminB2 * 1_000 * food.valuesPer, 2).toString()
      : "",
    vitaminB3: food.vitaminB3
      ? roundToInt(food.vitaminB3 * 1_000 * food.valuesPer, 2).toString()
      : "",
    vitaminB5: food.vitaminB5
      ? roundToInt(food.vitaminB5 * 1_000 * food.valuesPer, 2).toString()
      : "",
    vitaminB6: food.vitaminB6
      ? roundToInt(food.vitaminB6 * 1_000 * food.valuesPer, 2).toString()
      : "",
    vitaminB7: food.vitaminB7
      ? roundToInt(food.vitaminB7 * 1_000_000 * food.valuesPer, 2).toString()
      : "",
    vitaminC: food.vitaminC
      ? roundToInt(food.vitaminC * 1_000 * food.valuesPer, 2).toString()
      : "",
    vitaminD: food.vitaminD
      ? roundToInt(food.vitaminD * 1_000_000 * food.valuesPer, 2).toString()
      : "",
    vitaminE: food.vitaminE
      ? roundToInt(food.vitaminE * 1_000 * food.valuesPer, 2).toString()
      : "",
    vitaminK: food.vitaminK
      ? roundToInt(food.vitaminK * 1_000_000 * food.valuesPer, 2).toString()
      : "",
    arsenic: food.arsenic
      ? roundToInt(food.arsenic * 1_000_000 * food.valuesPer, 2).toString()
      : "",
    biotin: food.biotin
      ? roundToInt(food.biotin * 1_000_000 * food.valuesPer, 2).toString()
      : "",
    boron: food.boron
      ? roundToInt(food.boron * 1_000 * food.valuesPer, 2).toString()
      : "",
    calcium: food.calcium
      ? roundToInt(food.calcium * 1_000 * food.valuesPer, 2).toString()
      : "",
    chlorine: food.chlorine
      ? roundToInt(food.chlorine * 1_000 * food.valuesPer, 2).toString()
      : "",
    choline: food.choline
      ? roundToInt(food.choline * 1_000 * food.valuesPer, 2).toString()
      : "",
    chrome: food.chrome
      ? roundToInt(food.chrome * 1_000_000 * food.valuesPer, 2).toString()
      : "",
    cobalt: food.cobalt
      ? roundToInt(food.cobalt * 1_000_000 * food.valuesPer, 2).toString()
      : "",
    copper: food.copper
      ? roundToInt(food.copper * 1_000 * food.valuesPer, 2).toString()
      : "",
    fluoride: food.fluoride
      ? roundToInt(food.fluoride * 1_000 * food.valuesPer, 2).toString()
      : "",
    fluorine: food.fluorine
      ? roundToInt(food.fluorine * 1_000 * food.valuesPer, 2).toString()
      : "",
    iodine: food.iodine
      ? roundToInt(food.iodine * 1_000_000 * food.valuesPer, 2).toString()
      : "",
    iron: food.iron
      ? roundToInt(food.iron * 1_000 * food.valuesPer, 2).toString()
      : "",
    magnesium: food.magnesium
      ? roundToInt(food.magnesium * 1_000 * food.valuesPer, 2).toString()
      : "",
    manganese: food.manganese
      ? roundToInt(food.manganese * 1_000 * food.valuesPer, 2).toString()
      : "",
    molybdenum: food.molybdenum
      ? roundToInt(food.molybdenum * 1_000_000 * food.valuesPer, 2).toString()
      : "",
    phosphorus: food.phosphorus
      ? roundToInt(food.phosphorus * 1_000 * food.valuesPer, 2).toString()
      : "",
    potassium: food.potassium
      ? roundToInt(food.potassium * 1_000 * food.valuesPer, 2).toString()
      : "",
    rubidium: food.rubidium
      ? roundToInt(food.rubidium * 1_000 * food.valuesPer, 2).toString()
      : "",
    selenium: food.selenium
      ? roundToInt(food.selenium * 1_000_000 * food.valuesPer, 2).toString()
      : "",
    silicon: food.silicon
      ? roundToInt(food.silicon * 1_000 * food.valuesPer, 2).toString()
      : "",
    sulfur: food.sulfur
      ? roundToInt(food.sulfur * 1_000 * food.valuesPer, 2).toString()
      : "",
    tin: food.tin
      ? roundToInt(food.tin * 1_000 * food.valuesPer, 2).toString()
      : "",
    vanadium: food.vanadium
      ? roundToInt(food.vanadium * 1_000_000 * food.valuesPer, 2).toString()
      : "",
    zinc: food.zinc
      ? roundToInt(food.zinc * 1_000 * food.valuesPer, 2).toString()
      : "",
  };
}

export function createRecipeFood(
  name: string,
  recipeServingQuantity: number,
): Food {
  return {
    ...createDefaultFood(),
    name: name,
    isRecipe: true,
    recipeServingQuantity: recipeServingQuantity,
    category: "custom-recipe",
    producer: "Recipe",
  };
}
