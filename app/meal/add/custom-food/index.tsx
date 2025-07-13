import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Text } from "~/components/ui/text";
import { FormConfigs } from "~/types/FormConfigs";
import { MealSelectorHeader } from "~/components/index/meal/add/meal-selector-header";
import { KeyboardShift } from "~/components/keyboard-shift";
import { Form } from "~/components/index/meal/add/form";
import { MealType } from "~/types/MealType";
import { Input } from "~/components/ui/input";
import { ScanBarcodeIcon } from "lucide-nativewind";

export default function CustomFoodScreen() {
  const params = useLocalSearchParams();
  const date = params["date"] as string;
  const mealName = params["mealName"] as string;
  const [mealType, setMealType] = useState<MealType>(mealName as MealType);
  const [barcode, setBarcode] = useState<string>("");

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
      <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-semibold text-center">
          Add Custom Food
        </Text>
        <View className="mt-6 mb-2 flex-row gap-2 items-center">
          <Input
            className="flex-1"
            placeholder="Barcode (optional)"
            onChangeText={setBarcode}
            keyboardType="numeric"
          />
          <TouchableOpacity>
            <ScanBarcodeIcon className="w-10 h-10 text-primary" />
          </TouchableOpacity>
        </View>
        <Form
          formConfig={FormConfigs}
          onSubmit={async (values) => console.log(values)}
        />
      </ScrollView>
    </KeyboardShift>
  );
}
