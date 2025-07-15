import { FlatList, View } from "react-native";
import { useMemo } from "react";
import { formatNumber } from "~/utils/formatting";
import { cn } from "~/lib/utils";
import { Text } from "~/components/ui/text";
import { Food } from "~/db/schema";

const nutritionTemplate = {
  energy: { value: 0, unit: "kcal" },
  carb: { value: 0, unit: "g" },
  protein: { value: 0, unit: "g" },
  dietaryFiber: { value: 0, unit: "g" },
  sugar: { value: 0, unit: "g" },
  totalFat: { value: 0, unit: "g" },
  saturatedFat: { value: 0, unit: "g" },
  monoUnsaturatedFat: { value: 0, unit: "g" },
  polyUnsaturatedFat: { value: 0, unit: "g" },
  transFat: { value: 0, unit: "g" },
  alcohol: { value: 0, unit: "g" },
  cholesterol: { value: 0, unit: "mg" },
  sodium: { value: 0, unit: "mg" },
  salt: { value: 0, unit: "g" },
  water: { value: 0, unit: "g" },
  vitaminA: { value: 0, unit: "µg" },
  vitaminB1: { value: 0, unit: "mg" },
  vitaminB11: { value: 0, unit: "µg" },
  vitaminB12: { value: 0, unit: "µg" },
  vitaminB2: { value: 0, unit: "mg" },
  vitaminB3: { value: 0, unit: "mg" },
  vitaminB5: { value: 0, unit: "mg" },
  vitaminB6: { value: 0, unit: "mg" },
  vitaminB7: { value: 0, unit: "µg" },
  vitaminC: { value: 0, unit: "mg" },
  vitaminD: { value: 0, unit: "µg" },
  vitaminE: { value: 0, unit: "mg" },
  vitaminK: { value: 0, unit: "µg" },
  arsenic: { value: 0, unit: "µg" },
  biotin: { value: 0, unit: "µg" },
  boron: { value: 0, unit: "mg" },
  calcium: { value: 0, unit: "mg" },
  chlorine: { value: 0, unit: "mg" },
  choline: { value: 0, unit: "mg" },
  chrome: { value: 0, unit: "µg" },
  cobalt: { value: 0, unit: "µg" },
  copper: { value: 0, unit: "mg" },
  fluoride: { value: 0, unit: "mg" },
  fluorine: { value: 0, unit: "mg" },
  iodine: { value: 0, unit: "µg" },
  iron: { value: 0, unit: "mg" },
  magnesium: { value: 0, unit: "mg" },
  manganese: { value: 0, unit: "mg" },
  molybdenum: { value: 0, unit: "µg" },
  phosphorus: { value: 0, unit: "mg" },
  potassium: { value: 0, unit: "mg" },
  rubidium: { value: 0, unit: "mg" },
  selenium: { value: 0, unit: "µg" },
  silicon: { value: 0, unit: "mg" },
  sulfur: { value: 0, unit: "mg" },
  tin: { value: 0, unit: "mg" },
  vanadium: { value: 0, unit: "µg" },
  zinc: { value: 0, unit: "mg" },
};

const nutritionGroups: Record<
  string,
  { title?: string; keys: (keyof typeof nutritionTemplate)[] }
> = {
  General: {
    keys: ["energy", "carb", "protein", "dietaryFiber", "sugar"],
  },
  Fat: {
    title: "Fat",
    keys: [
      "totalFat",
      "saturatedFat",
      "monoUnsaturatedFat",
      "polyUnsaturatedFat",
      "transFat",
    ],
  },
  Miscellaneous: {
    title: "Miscellaneous",
    keys: ["alcohol", "cholesterol", "sodium", "salt", "water"],
  },
  Vitamins: {
    title: "Vitamins",
    keys: [
      "vitaminA",
      "vitaminB1",
      "vitaminB11",
      "vitaminB12",
      "vitaminB2",
      "vitaminB3",
      "vitaminB5",
      "vitaminB6",
      "vitaminB7",
      "vitaminC",
      "vitaminD",
      "vitaminE",
      "vitaminK",
    ],
  },
  Minerals: {
    title: "Minerals",
    keys: [
      "arsenic",
      "biotin",
      "boron",
      "calcium",
      "chlorine",
      "choline",
      "chrome",
      "cobalt",
      "copper",
      "fluoride",
      "fluorine",
      "iodine",
      "iron",
      "magnesium",
      "manganese",
      "molybdenum",
      "phosphorus",
      "potassium",
      "rubidium",
      "selenium",
      "silicon",
      "sulfur",
      "tin",
      "vanadium",
      "zinc",
    ],
  },
};

type NutritionFactsProps = {
  foods: (Food & { amount: number; servingQuantity: number })[];
  className?: string;
};

export const NutritionFacts = ({ foods, className }: NutritionFactsProps) => {
  if (foods.length === 0) {
    return <View />;
  }

  const totalNutrition = useMemo(() => {
    const totals = JSON.parse(JSON.stringify(nutritionTemplate));
    const unitMultiplier: Record<string, number> = {
      kcal: 1,
      g: 1,
      mg: 1000,
      "\u00B5g": 1_000_000,
    };

    foods.forEach((food) => {
      const quantity = food.servingQuantity * food.amount;
      Object.keys(totals).forEach((key) => {
        totals[key as keyof typeof totals].value +=
          ((food as any)[key.replace("totalF", "f")] ?? 0) *
          quantity *
          (unitMultiplier[totals[key as keyof typeof totals].unit] || 1);
      });
    });
    return totals;
  }, [foods]);

  type NutritionDataItem =
    | { type: "header"; key: string; title: string }
    | { type: "item"; key: keyof typeof nutritionTemplate };

  const nutritionData: NutritionDataItem[] = Object.entries(nutritionGroups)
    .flatMap(([groupKey, group]) => [
      group.title
        ? { type: "header", key: `${groupKey}-header`, title: group.title }
        : null,
      ...group.keys.map((key) => ({
        type: "item",
        key,
      })),
    ])
    .filter((item): item is NutritionDataItem => item !== null);

  return (
    <>
      <Text
        className={cn(
          "text-center font-semibold text-primary text-lg mt-5",
          className,
        )}
      >
        Nutrition Facts
      </Text>
      <FlatList
        scrollEnabled={false}
        data={nutritionData}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => {
          if (item.type === "header") {
            return (
              <Text className="font-semibold mt-2 mb-1 text-primary">
                {item.title}
              </Text>
            );
          }
          return (
            <View className="p-2 flex-row justify-between">
              <Text className="text-sm capitalize text-primary">
                {item.key.replace(/([A-Z])/g, " $1")}
              </Text>
              {totalNutrition[item.key].value === 0 ? (
                <Text className="text-sm text-primary">-</Text>
              ) : (
                <Text className="text-sm text-primary">
                  {formatNumber(totalNutrition[item.key].value, 1)}{" "}
                  {totalNutrition[item.key].unit}
                </Text>
              )}
            </View>
          );
        }}
      />
    </>
  );
};
