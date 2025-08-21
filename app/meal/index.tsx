import { Animated, View } from "react-native";
import ScrollView = Animated.ScrollView;
import { router, Stack, useLocalSearchParams } from "expo-router";
import { MealDetails } from "~/components/index/meal/meal-details";
import { FloatingActionButton } from "~/components/floating-action-button";
import { PlusIcon } from "lucide-nativewind";
import { MealType } from "~/types/MealType";

export default function MealScreen() {
  const params = useLocalSearchParams();
  const name = params["mealName"] as string;
  const dateId = params["dateId"] as string;

  return (
    <>
      <Stack.Screen
        options={{
          title: `${name}`,
        }}
      />
      <ScrollView
        className="h-full bg-secondary p-3"
        showsVerticalScrollIndicator={false}
      >
        <MealDetails dateId={dateId} mealType={name as MealType} />
        <View className="mb-20" />
      </ScrollView>
      <FloatingActionButton
        onPress={() =>
          router.navigate({
            pathname: "/meal/add",
            params: { mealName: name, dateId: dateId },
          })
        }
      >
        <PlusIcon className="h-9 w-9 text-secondary" />
      </FloatingActionButton>
    </>
  );
}
