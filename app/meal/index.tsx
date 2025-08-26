import { Animated, View } from "react-native";
import ScrollView = Animated.ScrollView;
import { router, Stack, useLocalSearchParams } from "expo-router";
import { MealDetails } from "~/components/index/meal/meal-details";
import { FloatingActionButton } from "~/components/floating-action-button";
import { PlusIcon } from "lucide-nativewind";
import { MealType } from "~/types/MealType";

export default function MealScreen() {
  const params = useLocalSearchParams();
  const mealName = params.mealName as string;
  const dateId = params.dateId as string;

  return (
    <>
      <Stack.Screen
        options={{
          title: `${mealName}`,
        }}
      />
      <ScrollView
        className="h-full bg-secondary p-3"
        showsVerticalScrollIndicator={false}
      >
        <MealDetails dateId={dateId} mealType={mealName as MealType} />
        <View className="mb-20" />
      </ScrollView>
      <FloatingActionButton
        onPress={() =>
          router.navigate({
            pathname: "/meal/add",
            params: { mealName: mealName, dateId: dateId },
          })
        }
      >
        <PlusIcon className="h-9 w-9 text-secondary" />
      </FloatingActionButton>
    </>
  );
}
