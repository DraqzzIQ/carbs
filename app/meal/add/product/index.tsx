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
import { Food } from "~/db/schema";
import {
  addFoodToMeal,
  getAndSaveFood,
  getCustomFood,
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

export default function ProductDetailScreen() {
  const params = useLocalSearchParams<{
    date: string;
    edit: string;
    mealName: string;
    mealId?: string;
    productId?: string;
    amount?: string;
    servingQuantity?: string;
    serving?: string;
    custom?: string;
  }>();
  const edit = params.edit === "true";
  const mealId = edit ? parseInt(params.mealId!, 10) : null;
  const custom = params.custom === "true";

  const [meal, setMeal] = useState<MealQueryType | undefined>(undefined);
  const [food, setFood] = useState<Food | undefined>(undefined);
  const [servingQuantity, setServingQuantity] = useState<number>(
    params.servingQuantity ? parseFloat(params.servingQuantity) : 1,
  );
  const [amount, setAmount] = useState<number>(
    params.amount ? parseFloat(params.amount) : 1,
  );
  const [serving, setServing] = useState<string>(params.serving || "Gram");
  const [mealType, setMealType] = useState<MealType>(
    params.mealName as MealType,
  );
  const [foodIsRecent, setFoodIsRecent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      (async () => handleEffect())();
    }, []),
  );

  useEffect(() => {
    (async () => handleEffect())();
  }, [edit, params.productId]);

  // i hate this
  async function handleEffect() {
    let fetchedFood: Food | undefined;
    let meal: MealQueryType | undefined;
    if (edit) {
      try {
        const mealData = await mealQuery(mealId!);
        setMeal(mealData);
        meal = mealData;
        fetchedFood = mealData?.food;
        if (mealData?.food) {
          setFoodIsRecent(await isRecent(mealData.food.id));
        }
      } catch {
        console.error("Error fetching meal with meal id ", mealId);
        return;
      }
    } else {
      if (custom) {
        fetchedFood = await getCustomFood(params.productId!);
      } else {
        fetchedFood = await getAndSaveFood(params.productId!);
      }
      if (fetchedFood) {
        setFoodIsRecent(await isRecent(fetchedFood.id));
      }
    }

    if (fetchedFood) {
      setFood(fetchedFood);
      if (!params.serving) {
        const initialServing = meal
          ? { serving: meal.serving, amount: meal.amount }
          : (fetchedFood.servings?.[0] ?? {
              serving: getDefaultServing(fetchedFood.baseUnit),
              amount: 1,
            });
        setServing(initialServing.serving);
        setAmount(initialServing.amount);
        setServingQuantity(
          meal
            ? meal.servingQuantity
            : isBaseUnit(initialServing.serving)
              ? 100
              : 1,
        );
      }
    }
  }

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
    if (edit && meal) {
      return { serving: meal.serving, amount: meal.amount };
    }
    if (params.serving) {
      return {
        serving: params.serving,
        amount: params.amount ? parseFloat(params.amount) : 1,
      };
    }
    return undefined;
  }, [edit, meal, params.serving, params.amount]);

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
          headerRight: (_) => (
            <HeaderOptions
              foodId={food?.id || ""}
              servingQuantity={servingQuantity}
              serving={serving}
              amount={amount}
              isCustom={food?.isCustom}
              isDeleted={!!food?.deletedAt}
              eans={food?.eans}
            />
          ),
        }}
      />
      <ScrollView
        className="p-4 bg-secondary h-full"
        showsVerticalScrollIndicator={false}
      >
        {food === undefined ? (
          <ProductDetailsLoadingSkeleton />
        ) : (
          <>
            <Text className="text-primary text-2xl text-center font-semibold">
              {food.name}
            </Text>
            <Text className="text-muted-foreground text-xl text-center font-semibold mb-8">
              {food.producer}
            </Text>
            <View className="flex flex-row justify-center mb-4">
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
                ? meal!.servingQuantity.toString()
                : params.servingQuantity
                  ? params.servingQuantity
                  : undefined
            }
            onServingChange={handleServingChange}
            onServingQuantityChange={handleServingQuantityChange}
            baseUnit={food.baseUnit}
          />
          <FloatingActionButton
            onPress={async () => {
              setIsLoading(true);
              if (edit) {
                await updateMeal(
                  meal!.id,
                  servingQuantity,
                  amount,
                  serving,
                  mealType,
                );
              } else {
                await addFoodToMeal(
                  mealType,
                  food.id,
                  servingQuantity,
                  amount,
                  serving,
                  params.date,
                  food,
                );
              }
              router.dismiss(1);
            }}
            bottom="bottom-20"
            loading={isLoading}
            disabled={isLoading}
          >
            {edit ? (
              <SaveIcon className="text-secondary h-9 w-9" />
            ) : (
              <PlusIcon className="text-secondary h-9 w-9" />
            )}
          </FloatingActionButton>
        </>
      )}
    </KeyboardShift>
  );
}
