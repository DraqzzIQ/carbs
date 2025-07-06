import { router, Stack, useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";
import { KeyboardShift } from "~/components/keyboard-shift";
import { useEffect, useState } from "react";
import { MealSelectorHeader } from "~/components/index/meal/add/product/meal-selector-header";
import { PlusIcon, SaveIcon } from "lucide-nativewind";
import { FloatingActionButton } from "~/components/floating-action-button";
import { MealType } from "~/types/MealType";
import { Text } from "~/components/ui/text";
import { NumericInput } from "~/components/numeric-input";
import { Input } from "~/components/ui/input";
import {
  addCustomFood,
  addFoodToMeal,
  updateCustomFood,
  updateMeal,
} from "~/utils/querying";
import { Food } from "~/db/schema";
import { defaultFood } from "~/utils/defaultFood";
import { mealQuery } from "~/db/queries/mealQuery";

export default function QuickEntryScreen() {
  const params = useLocalSearchParams();
  const date = params["date"] as string;
  const mealName = params["mealName"] as string;
  const edit = (params["edit"] as string) == "true";
  const mealId = edit ? parseInt(params["mealId"] as string, 10) : null;
  const [mealType, setMealType] = useState<MealType>(mealName as MealType);
  const [description, setDescription] = useState<string>("");
  const [energy, setEnergy] = useState<number | null>(null);
  const [carbs, setCarbs] = useState<number | null>(null);
  const [protein, setProtein] = useState<number | null>(null);
  const [fat, setFat] = useState<number | null>(null);
  const descriptionError = description === "";
  const energyError = energy === null;
  const [displayError, setDisplayError] = useState<boolean>(false);
  const [food, setFood] = useState<Food | undefined>(undefined);

  useEffect(() => {
    (async () => {
      if (!edit) {
        return;
      }
      try {
        const meal = await mealQuery(mealId!);
        setFood(meal?.food);
        if (meal?.food) {
          setDescription(meal.food.name);
          setEnergy(meal.food.energy);
          setCarbs(meal.food.carb);
          setProtein(meal.food.protein);
          setFat(meal.food.fat);
        }
      } catch {
        console.error("Error fetching meal with meal id ", mealId);
        return;
      }
    })();
  }, []);
  async function onAddQuickEntry(): Promise<boolean> {
    if (descriptionError || energyError) {
      setDisplayError(true);
      return false;
    }

    if (edit) {
      if (!food) {
        console.error("Food is undefined, cannot update meal.");
        return true;
      }
      food.name = description;
      food.energy = energy;
      food.carb = carbs || 0;
      food.protein = protein || 0;
      food.fat = fat || 0;
      await updateCustomFood(food);
      await updateMeal(mealId!, 1, 1, "Gram", mealType);
      return true;
    }

    const addedFood: Food = {
      ...defaultFood,
      name: description,
      energy: energy,
      carb: carbs || 0,
      protein: protein || 0,
      fat: fat || 0,
      producer: "Quick Entry",
      category: "quick-entry",
    };

    await addCustomFood(addedFood);

    await addFoodToMeal(mealType, addedFood.id, 1, 1, "Gram", date, addedFood);

    return true;
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
        <Input
          placeholder="Description"
          className={`mt-8 ${descriptionError && displayError ? "border-red-500 bg-red-50" : ""}`}
          value={description}
          onChangeText={setDescription}
        />
        <NumericInput
          defaultValue={energy?.toString() ?? undefined}
          allowNegative={true}
          allowDecimal={true}
          onValueChange={setEnergy}
          placeholder="Energy (kcal)"
          className={`mt-4 ${energyError && displayError ? "border-red-500 bg-red-50" : ""}`}
        />
        <NumericInput
          defaultValue={carbs?.toString() ?? undefined}
          allowNegative={true}
          allowDecimal={true}
          onValueChange={setCarbs}
          placeholder="Carbs (g)"
          className="mt-4"
        />
        <NumericInput
          defaultValue={protein?.toString() ?? undefined}
          allowNegative={true}
          allowDecimal={true}
          onValueChange={setProtein}
          placeholder="Protein (g)"
          className="mt-4"
        />
        <NumericInput
          defaultValue={fat?.toString() ?? undefined}
          allowNegative={true}
          allowDecimal={true}
          onValueChange={setFat}
          placeholder="Fat (g)"
          className="mt-4"
        />
      </ScrollView>

      <FloatingActionButton
        onPress={async () => {
          if (await onAddQuickEntry()) {
            router.dismiss(1);
          }
        }}
      >
        {edit ? (
          <SaveIcon className="text-secondary h-9 w-9" />
        ) : (
          <PlusIcon className="text-secondary h-9 w-9" />
        )}
      </FloatingActionButton>
    </KeyboardShift>
  );
}
