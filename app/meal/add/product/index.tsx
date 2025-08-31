import {
  router,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import { ScrollView, View } from "react-native";
import { KeyboardShift } from "~/components/keyboard-shift";
import { Text } from "~/components/ui/text";
import { mealQuery, MealQueryType } from "~/db/queries/mealQuery";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MealSelectorHeader } from "~/components/index/meal/add/meal-selector-header";
import { MealType } from "~/types/MealType";
import { Food, RecipeEntry } from "~/db/schema";
import {
  addFoodToMeal,
  addRecipeEntry,
  editRecipeEntry,
  getAndSaveFood,
  getCustomFood,
  getRecipeEntry,
  isRecent,
  updateMeal,
} from "~/utils/querying";
import { NutritionFacts } from "~/components/index/meal/nutrition-facts";
import {
  HistoryIcon,
  PlusIcon,
  SaveIcon,
  VerifiedIcon,
} from "lucide-nativewind";
import { FloatingActionButton } from "~/components/floating-action-button";
import { ServingSelector } from "~/components/index/meal/add/product/serving-selector";
import { MacroHeader } from "~/components/index/meal/macro-header";
import { ProductDetailsLoadingSkeleton } from "~/components/index/meal/add/product/loading-skeleton";
import { HeaderOptions } from "~/components/index/meal/add/product/header-options";
import { getDefaultServing } from "~/utils/serving";
import { isBaseUnit } from "~/utils/formatting";
import { requestAllWidgetsUpdate } from "~/components/widgets/widget-task-handler";

export default function ProductDetailScreen() {
  const params = useLocalSearchParams<{
    dateId: string;
    mealName: string;
    mealId?: string;
    productId?: string;
    amount?: string;
    servingQuantity?: string;
    serving?: string;
    custom?: string;
    recipeFoodId?: string;
    recipeEntryId?: string;
  }>();
  const mealId = params.mealId ? parseInt(params.mealId, 10) : null;
  const edit = !!mealId || !!params.recipeEntryId;
  const custom = params.custom === "true";
  const isRecipeFood = !!params.recipeFoodId || !!params.recipeEntryId;

  const [recipeEntry, setRecipeEntry] = useState<RecipeEntry | undefined>(
    undefined,
  );
  const [meal, setMeal] = useState<MealQueryType | undefined>(undefined);
  const [food, setFood] = useState<Food | undefined>(undefined);
  const [servingQuantity, setServingQuantity] = useState<number>(
    params.servingQuantity ? parseFloat(params.servingQuantity) : 1,
  );
  const [amount, setAmount] = useState<number>(
    params.amount ? parseFloat(params.amount) : 1,
  );
  const [serving, setServing] = useState<string>(params.serving ?? "Gram");
  const [mealType, setMealType] = useState<MealType>(
    params.mealName as MealType,
  );
  const [foodIsRecent, setFoodIsRecent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      void handleEffect();
    }, []),
  );

  useEffect(() => {
    void handleEffect();
  }, [edit, params.productId]);

  // i hate this
  const handleEffect = useCallback(async () => {
    let fetchedFood: Food | undefined;
    let mealLocal: MealQueryType | undefined;
    let recipeEntry: RecipeEntry | undefined;

    if (edit) {
      if (params.recipeEntryId) {
        try {
          const recipeEntryId = parseInt(params.recipeEntryId, 10);
          const recipeEntryData = await getRecipeEntry(recipeEntryId);
          if (recipeEntryData) {
            recipeEntry = recipeEntryData;
            fetchedFood = recipeEntryData?.component;
            setRecipeEntry(recipeEntryData);
          }
        } catch {
          console.error(
            "Error fetching recipe entry with id ",
            params.recipeEntryId,
          );
          return;
        }
      } else {
        try {
          const mealData = await mealQuery(mealId!);
          setMeal(mealData);
          mealLocal = mealData;
          fetchedFood = mealData?.food;
          if (mealData?.food) {
            setFoodIsRecent(await isRecent(mealData.food.id));
          }
        } catch {
          console.error("Error fetching meal with meal id ", mealId);
          return;
        }
      }
    } else {
      fetchedFood = custom
        ? await getCustomFood(params.productId!)
        : await getAndSaveFood(params.productId!);

      if (fetchedFood) {
        setFoodIsRecent(await isRecent(fetchedFood.id));
      }
    }

    if (fetchedFood) {
      setFood(fetchedFood);
      if (!params.serving) {
        const initialServing = recipeEntry
          ? { serving: recipeEntry.serving, amount: recipeEntry.amount }
          : mealLocal
            ? { serving: mealLocal.serving, amount: mealLocal.amount }
            : (fetchedFood.servings?.[0] ?? {
                serving: getDefaultServing(fetchedFood.baseUnit),
                amount: 1,
              });

        setServing(initialServing.serving);
        setAmount(initialServing.amount);
        setServingQuantity(
          recipeEntry
            ? recipeEntry.servingQuantity
            : mealLocal
              ? mealLocal.servingQuantity
              : isBaseUnit(initialServing.serving)
                ? 100
                : 1,
        );
      }
    }
  }, [
    edit,
    mealId,
    custom,
    params.productId,
    params.serving,
    params.recipeEntryId,
  ]);

  const handleServingChange = useCallback(
    (serving: { serving: string; amount: number }) => {
      setAmount(serving.amount);
      setServing(serving.serving);
    },
    [],
  );

  const handleServingQuantityChange = useCallback((servingQuantity: number) => {
    setServingQuantity(servingQuantity);
  }, []);

  const defaultServing = useMemo(() => {
    if (edit) {
      if (meal) {
        return { serving: meal.serving, amount: meal.amount };
      }
      if (recipeEntry) {
        return { serving: recipeEntry.serving, amount: recipeEntry.amount };
      }
    }
    if (params.serving) {
      return {
        serving: params.serving,
        amount: params.amount ? parseFloat(params.amount) : 1,
      };
    }
    return undefined;
  }, [edit, meal, params.serving, params.amount, recipeEntry]);

  const handleSubmit = useCallback(async () => {
    if (food === undefined) {
      return;
    }
    setIsLoading(true);
    if (edit) {
      await (params.recipeEntryId
        ? editRecipeEntry(
            Number(params.recipeEntryId),
            servingQuantity,
            amount,
            serving,
          )
        : updateMeal(meal!.id, servingQuantity, amount, serving, mealType));
    } else {
      await (isRecipeFood
        ? addRecipeEntry(
            params.recipeFoodId!,
            food.id,
            servingQuantity,
            amount,
            serving,
            food,
          )
        : addFoodToMeal(
            mealType,
            food.id,
            servingQuantity,
            amount,
            serving,
            params.dateId,
            food,
          ));
    }
    await requestAllWidgetsUpdate();
    router.dismiss();
  }, [
    edit,
    params.recipeEntryId,
    servingQuantity,
    amount,
    serving,
    meal,
    mealType,
    isRecipeFood,
    params.recipeFoodId,
    food,
    params.dateId,
  ]);

  return (
    <KeyboardShift>
      <Stack.Screen
        options={{
          title: isRecipeFood
            ? params.recipeEntryId
              ? "Edit Ingredient"
              : "Add Ingredient"
            : undefined,
          headerTitle: isRecipeFood
            ? undefined
            : () => (
                <MealSelectorHeader
                  onSelect={(mealType) => setMealType(mealType)}
                  defaultSelection={mealType}
                />
              ),
          headerRight: () => (
            <HeaderOptions
              foodId={food?.id ?? ""}
              servingQuantity={servingQuantity}
              serving={serving}
              amount={amount}
              isCustom={food?.isCustom}
              isRecipe={food?.isRecipe}
              isDeleted={!!food?.deletedAt}
              eans={food?.eans ?? undefined}
            />
          ),
        }}
      />
      <ScrollView
        className="h-full bg-secondary p-4"
        showsVerticalScrollIndicator={false}
      >
        {food === undefined ? (
          <ProductDetailsLoadingSkeleton />
        ) : (
          <>
            <Text className="text-center text-2xl font-semibold text-primary">
              {food.name}
            </Text>
            <Text className="mb-8 text-center text-xl font-semibold text-muted-foreground">
              {food.producer}
            </Text>
            <View className="mb-4 flex flex-row justify-center">
              {food.isVerified && (
                <View className="flex flex-row items-center">
                  <VerifiedIcon className="h-5 text-primary" />
                  <Text className="text-primary">Verified nutrition facts</Text>
                </View>
              )}
              {food.isVerified && foodIsRecent && <View className="mx-2" />}
              {foodIsRecent && (
                <View className="flex flex-row items-center">
                  <HistoryIcon className="h-5 text-primary" />
                  <Text className="text-primary">Recently logged</Text>
                </View>
              )}
            </View>
            <MacroHeader
              energy={food.energy * amount * servingQuantity}
              carbs={food.carb * amount * servingQuantity}
              protein={food.protein * amount * servingQuantity}
              fat={food.fat * amount * servingQuantity}
            />
            <NutritionFacts
              foods={[{ ...food, amount, servingQuantity }]}
              className="mt-8"
            />
            <View className="mb-36" />
          </>
        )}
      </ScrollView>
      {food !== undefined && (
        <>
          <ServingSelector
            servingOptions={food.servings}
            defaultServing={defaultServing}
            defaultServingQuantity={
              edit
                ? recipeEntry
                  ? recipeEntry.servingQuantity.toString()
                  : meal!.servingQuantity.toString()
                : (params.servingQuantity ?? undefined)
            }
            onServingChange={handleServingChange}
            onServingQuantityChange={handleServingQuantityChange}
            baseUnit={food.baseUnit}
          />
          <FloatingActionButton
            onPress={() => {
              void handleSubmit();
            }}
            bottom="bottom-20"
            loading={isLoading}
            disabled={isLoading}
          >
            {edit ? (
              <SaveIcon className="h-9 w-9 text-secondary" />
            ) : (
              <PlusIcon className="h-9 w-9 text-secondary" />
            )}
          </FloatingActionButton>
        </>
      )}
    </KeyboardShift>
  );
}
