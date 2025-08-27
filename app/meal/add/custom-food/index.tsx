import { router, Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
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
  getCustomFood,
  getIsFavorite,
  updateCustomFood,
  updateFavorite,
} from "~/utils/querying";
import { Card, CardTitle } from "~/components/ui/card";
import { getDefaultServing } from "~/utils/serving";

export default function CustomFoodScreen() {
  const params = useLocalSearchParams();
  const foodId = params.foodId ? (params.foodId as string) : undefined;
  const edit = !!foodId;
  const [barcode, setBarcode] = useState<string | undefined>(undefined);
  const [barCodeScannerOpen, setBarCodeScannerOpen] = useState(false);
  const [formConfig, setFormConfig] =
    useState<FormCategory[]>(CustomFoodFormConfig);

  useEffect(() => {
    if (edit) {
      void (async () => {
        try {
          const fetchedFood = await getCustomFood(foodId);
          if (fetchedFood) {
            setBarcode(
              fetchedFood?.eans && fetchedFood.eans.length > 0
                ? fetchedFood.eans[0]
                : undefined,
            );
            setFormConfig(
              enrichFormConfigWithDefaultValues(
                CustomFoodFormConfig,
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

  const onSubmit = useCallback(
    async (values: Record<string, string>) => {
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
      if (await getIsFavorite(food.id)) {
        const serving =
          food.servings.length > 0
            ? food.servings[0]
            : {
                amount: 1,
                serving: getDefaultServing(food.baseUnit).toLowerCase(),
              };
        await updateFavorite(
          food.id,
          serving.amount === 1 ? 100 : 1,
          serving.amount,
          serving.serving,
        );
      }
      router.dismiss();
    },
    [edit, foodId, barcode],
  );

  return (
    <KeyboardShift>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <Text className="text-2xl font-semibold">{`${edit ? "Edit" : "Create"} Custom Food`}</Text>
          ),
        }}
      />
      <Form
        formConfig={formConfig}
        onSubmit={onSubmit}
        edit={edit}
        headerComponent={
          <Card className="mb-2 p-4">
            <CardTitle className="text-lg">Barcode</CardTitle>
            <View className="mt-4 flex-row items-center gap-2">
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
                  <XIcon className="h-10 w-10 text-primary" />
                ) : (
                  <ScanBarcodeIcon className="h-10 w-10 text-primary" />
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
        }
      ></Form>
    </KeyboardShift>
  );
}
