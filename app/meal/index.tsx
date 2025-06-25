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
  const date = params["date"] as string;

  return (
    <>
      <Stack.Screen
        options={{
          title: `${name}`,
        }}
      />
      <ScrollView
        className="p-3 bg-secondary h-full"
        showsVerticalScrollIndicator={false}
      >
        <MealDetails date={date} mealType={name as MealType} />
        <View className="mb-20" />
      </ScrollView>
      <FloatingActionButton
        onPress={() => router.push(`/meal/add?mealName=${name}&date=${date}`)}
      >
        <PlusIcon className="text-secondary h-9 w-9" />
      </FloatingActionButton>
    </>
  );
}
