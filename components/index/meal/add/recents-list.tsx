import { Text } from "~/components/ui/text";
import { LoaderCircleIcon, PlusIcon } from "lucide-nativewind";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { RecentsQueryType } from "~/db/queries/recentsQuery";
import { formatServing } from "~/utils/serving";
import {
  formatNumber,
  getCurrentDayFormattedDate,
  getDateSlug,
} from "~/utils/formatting";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
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
  const { data: recents, error: recentsError } = useLiveQuery(query);

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

  let lastDate = "";
  let lastFirstLetter = "";
  return (
    <ScrollView>
      {recents.map((recent: RecentsQueryType[number]) => {
        let displayHeader = false;
        let currentDate = "";
        if (enableDateHeader) {
          currentDate = getDateSlug(
            getCurrentDayFormattedDate(0, new Date(recent.updatedAt)),
          );
          displayHeader = currentDate !== lastDate;
          lastDate = currentDate;
        }
        let displayAlphabetHeader = false;
        let firstLetter = "";
        if (enableAlphabetHeader) {
          firstLetter = recent.food.name.charAt(0).toUpperCase();
          displayAlphabetHeader = firstLetter !== lastFirstLetter;
          lastFirstLetter = firstLetter;
        }
        return (
          <React.Fragment key={recent.id}>
            {displayHeader && (
              <Text className="text-lg mt-8">{currentDate}</Text>
            )}
            {displayAlphabetHeader && (
              <Text className="text-lg mt-8">{firstLetter}</Text>
            )}
            <Recent recent={recent} mealType={mealType} date={date} />
          </React.Fragment>
        );
      })}
    </ScrollView>
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
          },
        })
      }
    >
      <View className="flex-row w-full mt-5">
        <View className="flex flex-grow">
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
