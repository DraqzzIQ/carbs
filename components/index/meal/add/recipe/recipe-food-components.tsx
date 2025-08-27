import { Card, CardTitle } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { TouchableOpacity, View } from "react-native";
import { RecipeEntriesQueryType } from "~/db/queries/recipeEntriesQuery";
import { Button } from "~/components/ui/button";
import { formatFoodSubtitle } from "~/utils/serving";
import { XCircleIcon } from "lucide-nativewind";
import { deleteRecipeEntry } from "~/utils/querying";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { formatNumber } from "~/utils/formatting";
import React from "react";
import { NutritionFacts } from "~/components/index/meal/nutrition-facts";
import { router } from "expo-router";

interface RecipeFoodComponentsProps {
  onAddIngredient: () => void;
  recipeEntries: RecipeEntriesQueryType;
}

export const RecipeFoodComponents = ({
  onAddIngredient,
  recipeEntries,
}: RecipeFoodComponentsProps) => {
  return (
    <>
      <Card className="mt-4 p-4 pt-6">
        <CardTitle className="mb-4 text-center">Ingredients</CardTitle>
        {recipeEntries.length === 0 ? (
          <Text className="mt-4 text-center text-muted-foreground">
            No ingredients added yet.
          </Text>
        ) : (
          recipeEntries.map((entry) => (
            <Animated.View
              key={entry.id}
              className="mt-2 rounded-lg bg-card px-2 py-1 shadow-sm shadow-primary/40"
              layout={LinearTransition}
              entering={FadeIn}
              exiting={FadeOut}
            >
              <TouchableOpacity
                onPress={() =>
                  router.navigate({
                    pathname: "/meal/add/product",
                    params: {
                      recipeEntryId: entry.id,
                    },
                  })
                }
              >
                <View className="flex-row items-center">
                  <View className="flex w-2/3 flex-grow">
                    <Text className="text-xl text-primary">
                      {entry.component.name}
                    </Text>
                    <Text className="text-base text-primary">
                      {formatFoodSubtitle(
                        entry.component,
                        entry.serving,
                        entry.servingQuantity,
                        entry.amount,
                      )}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="mr-2 text-primary">
                      {formatNumber(
                        entry.component.energy *
                          entry.amount *
                          entry.servingQuantity,
                      )}{" "}
                      kcal
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        void deleteRecipeEntry(entry.id);
                      }}
                    >
                      <XCircleIcon className="h-6 w-6 text-primary" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))
        )}
        <Button className="mt-16" onPress={onAddIngredient}>
          <Text>Add ingredient</Text>
        </Button>
      </Card>
      <NutritionFacts
        className="mt-4"
        foods={recipeEntries.map((entry) => ({
          ...entry.component,
          amount: entry.amount,
          servingQuantity: entry.servingQuantity,
        }))}
      />
    </>
  );
};
