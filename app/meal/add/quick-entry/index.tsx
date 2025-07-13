import { router, Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import { KeyboardShift } from "~/components/keyboard-shift";
import { useEffect, useState } from "react";
import { MealSelectorHeader } from "~/components/index/meal/add/meal-selector-header";
import { MealType } from "~/types/MealType";
import { Text } from "~/components/ui/text";
import {
  addCustomFood,
  addFoodToMeal,
  updateCustomFood,
  updateMeal,
} from "~/utils/querying";
import { Food } from "~/db/schema";
import { defaultFood } from "~/utils/defaultFood";
import { mealQuery } from "~/db/queries/mealQuery";
import { Form, FormCategory } from "~/components/index/meal/add/form";
import {
  enrichWithDefaultValues,
  QuickEntryFormConfig,
} from "~/types/FormConfigs";

export default function QuickEntryScreen() {
  const params = useLocalSearchParams();
  const date = params["date"] as string;
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
            enrichWithDefaultValues(formConfig, {
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
        ...defaultFood,
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
        date,
        addedFood,
      );
    }

    router.dismiss(1);
  }

  return (
    <KeyboardShift>
      <Stack.Screen
        options={{
          headerTitle: (_) => (
            <MealSelectorHeader
              onSelect={(mealType) => setMealType(mealType)}
              defaultSelection={mealType}
            />
          ),
        }}
      />
      <ScrollView
        className="p-4 bg-secondary h-full"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-primary text-2xl text-center font-semibold">
          Quick Entry
        </Text>
        <View className="flex-1">
          <Form formConfig={formConfig} onSubmit={onSubmit} edit={edit} />
        </View>
      </ScrollView>
    </KeyboardShift>
  );
}
