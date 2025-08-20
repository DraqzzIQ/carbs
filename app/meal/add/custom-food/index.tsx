import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "~/components/ui/text";
import {
  CustomFoodFormConfig,
  enrichFormConfigWithDefaultValues,
} from "~/types/FormConfig";
import { KeyboardShift } from "~/components/keyboard-shift";
import { Form, FormCategory } from "~/components/index/meal/add/form";
import { Input } from "~/components/ui/input";
import { ScanBarcodeIcon, XIcon } from "lucide-nativewind";
import { BarcodeScanner } from "~/components/index/meal/add/barcode-scanner";
import { createCustomFood, foodToFormValues } from "~/utils/defaultFood";
import {
  addCustomFood,
  addFavorite,
  getCustomFood,
  getIsFavorite,
  removeFavorite,
  updateCustomFood,
} from "~/utils/querying";
import { getDefaultServing } from "~/utils/serving";
import { Card, CardTitle } from "~/components/ui/card";

export default function CustomFoodScreen() {
  const params = useLocalSearchParams();
  const edit = (params["edit"] as string) === "true";
  const foodId = edit ? (params["foodId"] as string) : undefined;
  const [barcode, setBarcode] = useState<string | undefined>(undefined);
  const [barCodeScannerOpen, setBarCodeScannerOpen] = useState(false);
  const [formConfig, setFormConfig] =
    useState<FormCategory[]>(CustomFoodFormConfig);

  useEffect(() => {
    if (edit) {
      (async () => {
        try {
          const fetchedFood = await getCustomFood(foodId!);
          if (fetchedFood) {
            setBarcode(
              fetchedFood?.eans && fetchedFood.eans.length > 0
                ? fetchedFood.eans[0]
                : undefined,
            );
            setFormConfig(
              enrichFormConfigWithDefaultValues(
                formConfig,
                foodToFormValues(fetchedFood),
              ),
            );
          }
        } catch (error) {
          console.error("Error fetching custom food:", error);
        }
      })();
    }
  }, [edit]);

  async function onSubmit(values: Record<string, string>) {
    const food = createCustomFood(values, barcode);
    if (edit) {
      food.id = foodId!;
      try {
        await updateCustomFood(food);
      } catch (error) {
        console.error("Error updating custom food:", error);
      }
    } else {
      try {
        await addCustomFood(food);
      } catch (error) {
        console.error("Error creating custom food:", error);
      }
    }
    const serving =
      food.servings.length > 0
        ? food.servings[0]
        : {
            amount: 1,
            serving: getDefaultServing(food.baseUnit).toLowerCase(),
          };
    if (await getIsFavorite(food.id)) {
      await removeFavorite(food.id);
    }
    await addFavorite(
      food.id,
      serving.amount === 1 ? 100 : 1,
      serving.amount,
      serving.serving,
    );
    router.dismiss();
  }

  return (
    <KeyboardShift>
      <Stack.Screen
        options={{
          headerTitle: (_) => (
            <Text className="text-2xl font-semibold">{`${edit ? "Edit" : "Create"} Custom Food`}</Text>
          ),
        }}
      />
      <Form formConfig={formConfig} onSubmit={onSubmit} edit={edit}>
        <Card className="mb-2 p-4">
          <CardTitle className="text-lg">Barcode</CardTitle>
          <View className="mt-4 flex-row gap-2 items-center">
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
        </Card>
      </Form>
    </KeyboardShift>
  );
}
