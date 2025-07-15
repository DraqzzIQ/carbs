import { router, Stack } from "expo-router";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "~/components/ui/text";
import { FormConfigs } from "~/types/FormConfigs";
import { KeyboardShift } from "~/components/keyboard-shift";
import { Form } from "~/components/index/meal/add/form";
import { Input } from "~/components/ui/input";
import { ScanBarcodeIcon, XIcon } from "lucide-nativewind";
import { BarcodeScanner } from "~/components/index/meal/add/barcode-scanner";
import { createCustomFood } from "~/utils/defaultFood";
import { addCustomFood, addFavorite } from "~/utils/querying";

export default function CustomFoodScreen() {
  const [barcode, setBarcode] = useState<string | undefined>(undefined);
  const [barCodeScannerOpen, setBarCodeScannerOpen] = useState(false);

  async function onSubmit(values: Record<string, string>) {
    console.log(values);
    const food = createCustomFood(values, barcode);
    console.log(food);
    try {
      await addCustomFood(food);
      const serving =
        food.servings.length > 0
          ? food.servings[0]
          : { amount: 100, serving: "gram" };
      await addFavorite(food.id, 1, serving.amount, serving.serving);
      router.dismiss();
    } catch (error) {
      console.error("Error creating custom food:", error);
    }
  }

  return (
    <KeyboardShift>
      <Stack.Screen
        options={{
          headerTitle: (_) => (
            <Text className="text-2xl font-semibold">Create Custom Food</Text>
          ),
        }}
      />
      <Form formConfig={FormConfigs} onSubmit={onSubmit}>
        <Text className="text-base text-primary">Barcode</Text>
        <View className="mb-2 flex-row gap-2 items-center">
          <Input
            className="flex-1 bg-secondary"
            placeholder="(optional)"
            value={barcode}
            onChangeText={setBarcode}
            keyboardType="numeric"
          />
          <TouchableOpacity
            onPress={() => setBarCodeScannerOpen((prev) => !prev)}
          >
            {barCodeScannerOpen ? (
              <XIcon className="text-primary h-10 w-10" />
            ) : (
              <ScanBarcodeIcon className="text-primary h-10 w-10" />
            )}
          </TouchableOpacity>
        </View>
        {barCodeScannerOpen && (
          <>
            <BarcodeScanner
              barCodeScannerOpen={barCodeScannerOpen}
              onScan={(barcode) => {
                setBarcode(barcode);
                setBarCodeScannerOpen(false);
              }}
            />
            <View className="h-8" />
          </>
        )}
      </Form>
    </KeyboardShift>
  );
}
