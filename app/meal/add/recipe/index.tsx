import { router, useLocalSearchParams } from "expo-router";
import { KeyboardShift } from "~/components/keyboard-shift";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addCustomFood,
  getCustomFood,
  updateRecipeProps,
  updateRecipeServings,
} from "~/utils/querying";
import { Food } from "~/db/schema";
import { Form, FormCategory } from "~/components/index/meal/add/form";
import {
  enrichFormConfigWithDefaultValues,
  RecipeFormConfig,
} from "~/types/FormConfig";
import { RecipeFoodComponents } from "~/components/index/meal/add/recipe/recipe-food-components";
import { createRecipeFood } from "~/utils/defaultFood";
import { MacroHeader } from "~/components/index/meal/macro-header";
import { useRelationalLiveQuery } from "~/db/queries/useRelationalLiveQuery";
import { recipeEntriesQuery } from "~/db/queries/recipeEntriesQuery";

export default function RecipeScreen() {
  const params = useLocalSearchParams();
  const [foodId, setFoodId] = useState<string | null>(
    params.foodId ? (params.foodId as string) : null,
  );
  const [edit, setEdit] = useState<boolean>(!!foodId);
  const [food, setFood] = useState<Food | undefined>(undefined);
  const [formConfig, setFormConfig] =
    useState<FormCategory[]>(RecipeFormConfig);
  const { data: recipeEntries, error: recipeEntriesQueryError } =
    useRelationalLiveQuery(recipeEntriesQuery(foodId ?? ""), [foodId]);

  useEffect(() => {
    if (recipeEntriesQueryError) {
      console.error("Error fetching recipe entries: ", recipeEntriesQueryError);
    }
  }, [recipeEntriesQueryError]);

  useEffect(() => {
    void (async () => {
      if (!edit) {
        return;
      }
      try {
        const food = await getCustomFood(foodId!);
        setFood(food);
      } catch {
        console.error("Error fetching food with id ", foodId);
        return;
      }
    })();
  }, []);

  useEffect(() => {
    if (food) {
      setFormConfig(
        enrichFormConfigWithDefaultValues(formConfig, {
          name: food.name,
          servingQuantity: food.recipeServingQuantity?.toString() ?? "1",
        }),
      );
    }
  }, [food]);

  const onAddIngredient = useCallback(() => {
    router.navigate({
      pathname: "/meal/add",
      params: { recipeFoodId: foodId },
    });
  }, [foodId]);

  const { energy, carbs, protein, fat, totalWeight } = useMemo<{
    energy: number;
    carbs: number;
    protein: number;
    fat: number;
    totalWeight: number;
  }>(() => {
    const initial: {
      energy: number;
      carbs: number;
      protein: number;
      fat: number;
      totalWeight: number;
    } = {
      energy: 0,
      carbs: 0,
      protein: 0,
      fat: 0,
      totalWeight: 0,
    };
    if (!recipeEntries || recipeEntries.length === 0) {
      return initial;
    }
    return recipeEntries.reduce((acc, entry) => {
      acc.energy +=
        (entry.component.energy ?? 0) * entry.servingQuantity * entry.amount;
      acc.carbs +=
        (entry.component.carb ?? 0) * entry.servingQuantity * entry.amount;
      acc.protein +=
        (entry.component.protein ?? 0) * entry.servingQuantity * entry.amount;
      acc.fat +=
        (entry.component.fat ?? 0) * entry.servingQuantity * entry.amount;
      acc.totalWeight += entry.servingQuantity * entry.amount;
      return acc;
    }, initial);
  }, [recipeEntries]);

  const onSubmit = useCallback(
    async (values: Record<string, string>) => {
      if (!edit) {
        const newFood = createRecipeFood(
          values.name,
          Number(values.servingQuantity) || 1,
        );
        await addCustomFood(newFood);
        setFoodId(newFood.id);
        setFood(newFood);
        setEdit(true);
      } else {
        await updateRecipeProps(
          food!.id,
          values.name,
          Number(values.servingQuantity) || 1,
        );
        await updateRecipeServings(food!.id, totalWeight);
        router.dismiss();
      }
    },
    [edit, food, totalWeight],
  );

  return (
    <KeyboardShift>
      <Form
        headerComponent={
          <MacroHeader
            energy={energy}
            carbs={carbs}
            protein={protein}
            fat={fat}
          />
        }
        formConfig={formConfig}
        onSubmit={onSubmit}
        footerComponent={
          edit && (
            <RecipeFoodComponents
              onAddIngredient={onAddIngredient}
              recipeEntries={recipeEntries}
            />
          )
        }
        edit={edit}
      />
    </KeyboardShift>
  );
}
