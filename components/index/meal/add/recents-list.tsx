import { Text } from "~/components/ui/text";
import { LoaderCircleIcon, PlusIcon } from "lucide-nativewind";
import { FlatList, TouchableOpacity, View } from "react-native";
import { RecentsQueryType } from "~/db/queries/recentsQuery";
import { formatServing } from "~/utils/serving";
import {
  formatNumber,
  getCurrentDayFormattedDate,
  getDateSlug,
} from "~/utils/formatting";
import { useRelationalLiveQuery } from "~/db/queries/useRelationalLiveQuery";
import React, { useEffect, useState } from "react";
import { addFoodToMeal } from "~/utils/querying";
import { MealType } from "~/types/MealType";
import { router } from "expo-router";

type RecentsListProps = {
  query: any;
  mealType: MealType;
  date: string;
  enableDateHeader?: boolean;
  enableAlphabetHeader?: boolean;
};

export const RecentsList = ({
  query,
  mealType,
  date,
  enableDateHeader,
  enableAlphabetHeader,
}: RecentsListProps) => {
  const { data: recents, error: recentsError } = useRelationalLiveQuery(query);

  useEffect(() => {
    if (recentsError) {
      console.error("Error fetching frequents:", recentsError);
    }
  }, [recentsError]);

  if (!recents || recents.length === 0) {
    return (
      <View className="flex-1 items-center mt-10">
        <Text className="text-muted-foreground">Nothing logged.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={recents}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
      ListFooterComponent={<View className="h-36" />}
      renderItem={({ item, index }) => {
        let displayHeader = false;
        let currentDate = "";
        let displayAlphabetHeader = false;
        let firstLetter = "";

        if (enableDateHeader) {
          currentDate = getDateSlug(
            getCurrentDayFormattedDate(0, new Date(item.updatedAt)),
          );
          displayHeader =
            index === 0 ||
            getDateSlug(
              getCurrentDayFormattedDate(
                0,
                new Date(recents[index - 1].updatedAt),
              ),
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
            {displayHeader && (
              <Text className="text-lg mt-8">{currentDate}</Text>
            )}
            {displayAlphabetHeader && (
              <Text className="text-lg mt-8">{firstLetter}</Text>
            )}
            <Recent recent={item} mealType={mealType} date={date} />
          </React.Fragment>
        );
      }}
    />
  );
};

const Recent = ({
  recent,
  mealType,
  date,
}: {
  recent: RecentsQueryType[number];
  mealType: MealType;
  date: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const onAddPress = async () => {
    setIsLoading(true);
    await addFoodToMeal(
      mealType,
      recent.foodId,
      recent.servingQuantity,
      recent.amount,
      recent.serving,
      date,
      recent.food,
    );
    setIsLoading(false);
  };

  return (
    <TouchableOpacity
      onPress={() =>
        router.navigate({
          pathname: "/meal/add/product",
          params: {
            productId: recent.foodId,
            date: date,
            mealName: mealType,
            edit: "false",
            serving: recent.serving,
            amount: recent.amount,
            servingQuantity: recent.servingQuantity,
            custom: recent.food.isCustom ? "true" : "false",
          },
        })
      }
    >
      <View className="flex-row w-full mt-5">
        <View className="flex w-2/3 flex-grow">
          <Text className="text-primary text-xl">{recent.food.name}</Text>
          <Text className="text-primary text-base">
            {recent.food.producer ? `${recent.food.producer}, ` : ""}
            {recent.servingQuantity}{" "}
            {recent.amount === 1
              ? recent.food.baseUnit
              : formatServing(
                  recent.serving,
                  recent.amount * recent.servingQuantity,
                  recent.food.baseUnit,
                  recent.servingQuantity > 1,
                )}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-primary mr-2">
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
