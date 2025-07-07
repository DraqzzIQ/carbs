import { router, Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import { KeyboardShift } from "~/components/keyboard-shift";
import { Text } from "~/components/ui/text";
import { mealQuery, MealQueryType } from "~/db/queries/mealQuery";
import { useEffect, useState } from "react";
import { MealSelectorHeader } from "~/components/index/meal/add/product/meal-selector-header";
import { MealType } from "~/types/MealType";
import { Food } from "~/db/schema";
import {
  addFoodToMeal,
  getAndSaveFood,
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

export default function ProductDetailScreen() {
  const params = useLocalSearchParams();
  const date = params["date"] as string;
  const edit = (params["edit"] as string) == "true";
  const mealName = params["mealName"] as string;
  const mealId = edit ? parseInt(params["mealId"] as string, 10) : null;
  const productId = edit ? null : (params["productId"] as string);

  const [meal, setMeal] = useState<MealQueryType | undefined>(undefined);
  const [food, setFood] = useState<Food | undefined>(undefined);
  const [servingQuantity, setServingQuantity] = useState<number>(1);
  const [amount, setAmount] = useState<number>(100);
  const [serving, setServing] = useState<string>("Gram");
  const [mealType, setMealType] = useState<MealType>(mealName as MealType);
  const [foodIsRecent, setFoodIsRecent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (edit) {
        try {
          const meal = await mealQuery(mealId!);
          setMeal(meal);
          setFood(meal?.food);
          if (meal?.food) {
            setFoodIsRecent(await isRecent(meal.food.id));
          }
        } catch {
          console.error("Error fetching meal with meal id ", mealId);
          return;
        }
      } else {
        setFood(await getAndSaveFood(productId!));
        setFoodIsRecent(await isRecent(productId!));
      }
    })();
  }, []);

  if (food === undefined) {
    return (
      <ScrollView className="p-4 bg-secondary h-full">
        <Text className="text-2xl font-semibold text-primary text-center">
          Product Not Found
        </Text>
        <Text className="text-xl text-primary text-center">
          ProductId: {productId}
        </Text>
        <Text className="text-xl text-primary text-center">
          MealId: {mealId}
        </Text>
      </ScrollView>
    );
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
          {food.name}
        </Text>
        <Text className="text-muted-foreground text-xl text-center font-semibold mb-8">
          {food.producer}
        </Text>
        <View className="flex flex-row justify-center mb-4">
          {food.isVerified && (
            <View className="flex flex-row items-center">
              <VerifiedIcon className="h-5" />
              <Text className="text-primary">Verified nutrition facts</Text>
            </View>
          )}
          {food.isVerified && foodIsRecent && <View className="mx-2" />}
          {foodIsRecent && (
            <View className="flex flex-row items-center">
              <HistoryIcon className="h-5" />
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
      </ScrollView>
      <ServingSelector
        servingOptions={food.servings}
        defaultServing={
          edit ? { serving: meal!.serving, amount: meal!.amount } : undefined
        }
        defaultServingQuantity={edit ? meal!.servingQuantity : undefined}
        servingQuantity={servingQuantity}
        onServingChange={(serving) => {
          setAmount(serving.amount);
          setServing(serving.serving);
        }}
        onServingQuantityChange={(servingQuantity) => {
          setServingQuantity(servingQuantity);
        }}
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
              date,
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
    </KeyboardShift>
  );
}
