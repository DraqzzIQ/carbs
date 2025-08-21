import { router, Stack, useLocalSearchParams } from "expo-router";
import { KeyboardShift } from "~/components/keyboard-shift";
import { useEffect, useState } from "react";
import { MealSelectorHeader } from "~/components/index/meal/add/meal-selector-header";
import { MealType } from "~/types/MealType";
import {
  addCustomFood,
  addFoodToMeal,
  updateCustomFood,
  updateMeal,
} from "~/utils/querying";
import { Food } from "~/db/schema";
import { createDefaultFood } from "~/utils/defaultFood";
import { mealQuery } from "~/db/queries/mealQuery";
import { Form, FormCategory } from "~/components/index/meal/add/form";
import {
  enrichFormConfigWithDefaultValues,
  QuickEntryFormConfig,
} from "~/types/FormConfig";

export default function QuickEntryScreen() {
  const params = useLocalSearchParams();
  const dateId = params["dateId"] as string;
  const mealName = params["mealName"] as string;
  const edit = (params["edit"] as string) == "true";
  const mealId = edit ? parseInt(params["mealId"] as string, 10) : null;
  const [mealType, setMealType] = useState<MealType>(mealName as MealType);
  const [food, setFood] = useState<Food | undefined>(undefined);
  const [formConfig, setFormConfig] =
    useState<FormCategory[]>(QuickEntryFormConfig);

  useEffect(() => {
    (async () => {
      if (!edit) {
        return;
      }
      try {
        const meal = await mealQuery(mealId!);
        setFood(meal?.food);
        if (meal?.food) {
          setFormConfig(
            enrichFormConfigWithDefaultValues(formConfig, {
              description: meal.food.name,
              energy: meal.food.energy.toString(),
              carb: meal.food.carb.toString(),
              protein: meal.food.protein.toString(),
              fat: meal.food.fat.toString(),
            }),
          );
        }
      } catch {
        console.error("Error fetching meal with meal id ", mealId);
        return;
      }
    })();
  }, []);

  async function onSubmit(values: Record<string, string>) {
    const { description, energy, carb, protein, fat } = values;

    if (edit) {
      if (!food) {
        console.error("Food is undefined, cannot update meal.");
        return;
      }
      food.name = description;
      food.energy = Number(energy);
      food.carb = Number(carb);
      food.protein = Number(protein);
      food.fat = Number(fat);
      await updateCustomFood(food);
      await updateMeal(mealId!, 1, 1, "Gram", mealType);
    } else {
      const addedFood: Food = {
        ...createDefaultFood(),
        name: description,
        energy: Number(energy),
        carb: Number(carb) || 0,
        protein: Number(protein) || 0,
        fat: Number(fat) || 0,
        producer: "Quick Entry",
        category: "quick-entry",
      };

      await addCustomFood(addedFood);
      await addFoodToMeal(
        mealType,
        addedFood.id,
        1,
        1,
        "Gram",
        dateId,
        addedFood,
      );
    }

    router.dismiss(1);
  }

  return (
    <KeyboardShift>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <MealSelectorHeader
              onSelect={(mealType) => setMealType(mealType)}
              defaultSelection={mealType}
            />
          ),
        }}
      />
      <Form formConfig={formConfig} onSubmit={onSubmit} edit={edit} />
    </KeyboardShift>
  );
}
