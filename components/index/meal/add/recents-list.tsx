import { Text } from "~/components/ui/text";
import { LoaderCircleIcon, PlusIcon } from "lucide-nativewind";
import { TouchableOpacity, View } from "react-native";
import {
  formatFoodSubtitle,
  getDefaultValuesForServing,
} from "~/utils/serving";
import {
  formatNumber,
  getDateIdFromDate,
  getDateSlug,
} from "~/utils/formatting";
import { useRelationalLiveQuery } from "~/db/queries/useRelationalLiveQuery";
import React, { useCallback, useEffect, useState } from "react";
import { addRecipeEntry, addFoodToMeal } from "~/utils/querying";
import { MealType } from "~/types/MealType";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { FrequentsQueryType } from "~/db/queries/frequentsQuery";
import { FavoritesQueryType } from "~/db/queries/favoritesQuery";
import { RecentsQueryType } from "~/db/queries/recentsQuery";
import { CustomQueryType } from "~/db/queries/customQuery";

interface RecentsListProps {
  query:
    | FrequentsQueryType
    | RecentsQueryType
    | FavoritesQueryType
    | CustomQueryType;
  mealType: MealType;
  dateId: string;
  enableDateHeader?: boolean;
  enableAlphabetHeader?: boolean;
  recipeFoodId: string | null;
}

export const RecentsList = ({
  query,
  mealType,
  dateId,
  enableDateHeader,
  enableAlphabetHeader,
  recipeFoodId,
}: RecentsListProps) => {
  const { data: recents, error: recentsError } = useRelationalLiveQuery(query, [
    query,
  ]);

  useEffect(() => {
    if (recentsError) {
      console.error("Error fetching frequents:", recentsError);
    }
  }, [recentsError]);

  if (!recents || recents.length === 0) {
    return (
      <View className="mt-10 flex-1 items-center">
        <Text className="text-muted-foreground">Nothing logged.</Text>
      </View>
    );
  }

  return (
    <FlashList<unknown>
      estimatedItemSize={63}
      data={recents}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
      ListFooterComponent={<View className="h-36" />}
      renderItem={({ item, index }) => {
        let displayDateHeader = false;
        let currentDate = "";
        let displayAlphabetHeader = false;
        let firstLetter = "";

        if (enableDateHeader) {
          currentDate = getDateSlug(
            getDateIdFromDate(0, new Date(item.updatedAt)),
          );
          displayDateHeader =
            index === 0 ||
            getDateSlug(
              getDateIdFromDate(0, new Date(recents[index - 1].updatedAt)),
            ) !== currentDate;
        }
        if (enableAlphabetHeader) {
          firstLetter = item.food.name.charAt(0).toUpperCase();
          displayAlphabetHeader =
            index === 0 ||
            recents[index - 1].food.name.charAt(0).toUpperCase() !==
              firstLetter;
        }

        return (
          <React.Fragment>
            {displayDateHeader && (
              <Text className="mt-8 text-lg">{currentDate}</Text>
            )}
            {displayAlphabetHeader && (
              <Text className="mt-8 text-lg">{firstLetter}</Text>
            )}
            <Recent
              recent={item}
              mealType={mealType}
              dateId={dateId}
              recipeFoodId={recipeFoodId}
            />
          </React.Fragment>
        );
      }}
    />
  );
};

const Recent = ({
  recent,
  mealType,
  dateId,
  recipeFoodId,
}: {
  recent: RecentsQueryType[number];
  mealType: MealType;
  dateId: string;
  recipeFoodId: string | null;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const onAddPress = useCallback(async () => {
    setIsLoading(true);
    await (recipeFoodId
      ? addRecipeEntry(
          recipeFoodId,
          recent.foodId,
          recent.servingQuantity,
          recent.amount,
          recent.serving,
          recent.food,
        )
      : addFoodToMeal(
          mealType,
          recent.foodId,
          recent.servingQuantity,
          recent.amount,
          recent.serving,
          dateId,
          recent.food,
        ));
    setIsLoading(false);
  }, [mealType, recent, dateId, recipeFoodId]);

  if (!recent.servingQuantity) {
    const servingValues = getDefaultValuesForServing(
      recent.food.servings,
      recent.food.baseUnit,
    );
    recent.serving = servingValues.serving;
    recent.servingQuantity = servingValues.servingQuantity;
    recent.amount = servingValues.amount;
  }

  return (
    <TouchableOpacity
      onPress={() => {
        router.navigate({
          pathname: "/meal/add/product",
          params: {
            productId: recent.foodId,
            dateId: dateId,
            mealName: mealType,
            serving: recent.serving,
            amount: recent.amount,
            servingQuantity: recent.servingQuantity,
            custom: recent.food.isCustom ? "true" : "false",
            recipeFoodId: recipeFoodId ?? undefined,
          },
        });
      }}
    >
      <View className="mt-5 w-full flex-row">
        <View className="flex w-2/3 flex-grow">
          <Text className="text-xl text-primary">{recent.food.name}</Text>
          <Text className="text-base text-primary">
            {formatFoodSubtitle(
              recent.food,
              recent.serving,
              recent.servingQuantity,
              recent.amount,
            )}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Text className="mr-2 text-primary">
            {formatNumber(
              recent.food.energy * recent.amount * recent.servingQuantity,
            )}{" "}
            kcal
          </Text>
          <TouchableOpacity
            disabled={isLoading}
            onPress={async () => await onAddPress()}
          >
            {isLoading ? (
              <View className="animate-spin">
                <LoaderCircleIcon className="text-primary" />
              </View>
            ) : (
              <PlusIcon className="text-primary" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};
