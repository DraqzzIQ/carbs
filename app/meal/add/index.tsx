import { Keyboard, TouchableOpacity, View } from "react-native";
import {
  router,
  Stack,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { SearchIcon, XIcon, ScanBarcodeIcon } from "lucide-nativewind";
import { useCameraPermission } from "react-native-vision-camera";
import { Input } from "~/components/ui/input";
import { SearchProducts } from "~/components/index/meal/add/search-products";
import { FoodSearchResultDto } from "~/api/types/FoodSearchResultDto";
import { yazioSearchFoods } from "~/api/yazio";
import { KeyboardShift } from "~/components/keyboard-shift";
import { FloatingActionButton } from "~/components/floating-action-button";
import { useEffect, useState } from "react";
import { addFoodToMeal } from "~/utils/querying";
import { MealType } from "~/types/MealType";
import { ThreeDotMenu } from "~/components/index/meal/add/three-dot-menu";
import { BarcodeScanner } from "~/components/index/meal/add/barcode-scanner";

export default function AddToMealScreen() {
  const params = useLocalSearchParams();
  const meal = params["mealName"] as string;
  const date = params["date"] as string;
  const { hasPermission, requestPermission } = useCameraPermission();
  const [barCodeScannerOpen, setBarCodeScannerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<FoodSearchResultDto[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const noResults = products.length === 0 && searchQuery !== "";

  useEffect(() => {
    if (searchQuery === "" && products.length > 0) {
      setProducts([]);
    }
  }, [products]);

  const navigation = useNavigation();
  useEffect(() => {
    return navigation.addListener("focus", () => {
      setBarCodeScannerOpen(false);
      if (!hasPermission) {
        (async () => {
          await requestPermission();
        })();
      }
    });
  }, [navigation]);

  const onSearchQueryChange = async (text: string) => {
    setSearchQuery(text);
    await searchProducts(text);
  };

  let abortController: AbortController | null = null;
  const searchProducts = async (query: string, scanned: boolean = false) => {
    if (abortController) {
      abortController.abort();
    }

    if (query.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    abortController = new AbortController();
    const { signal } = abortController;

    setLoading(true);
    try {
      const response = await yazioSearchFoods(query, { signal });
      if (response.length === 1 && scanned) {
        router.navigate({
          pathname: "/meal/add/product",
          params: {
            edit: "false",
            productId: response[0].productId,
            date: date,
            mealName: meal,
          },
        });
      }
      setProducts(response);
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Failed to search products:", error);
      }
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  async function onAddProduct(food: FoodSearchResultDto) {
    // search api returns quantity and amount as 100 in some cases,
    // probably for '100 (unit)' type of servings
    let servingQuantity = 1;
    let amount = food.amount;
    if (food.servingQuantity === 100 && food.amount === 100) {
      servingQuantity = 100;
      amount = 1;
    }
    await addFoodToMeal(
      meal as MealType,
      food.productId,
      servingQuantity,
      amount,
      food.serving,
      date,
    );
  }

  const onScan = async (code: string) => {
    setBarCodeScannerOpen(false);
    setSearchQuery(code);
    await searchProducts(code, true);
  };

  return (
    <KeyboardShift>
      <View className="p-4 bg-secondary h-full">
        <Stack.Screen
          options={{
            title: `${meal}`,
            headerRight: () => <ThreeDotMenu date={date} mealName={meal} />,
          }}
        />
        <View className="flex-row justify-center items-center border border-muted-foreground px-4 rounded-lg bg-secondary">
          <SearchIcon className="text-primary" />
          <Input
            onFocus={() => setSearchFocused(true)}
            onEndEditing={() => setSearchFocused(false)}
            selectTextOnFocus={true}
            className="flex-1 ml-4 border-0 bg-secondary"
            placeholder="Search Product"
            onChangeText={(text: string) => onSearchQueryChange(text)}
            value={searchQuery}
            autoCorrect={false}
          />
          <TouchableOpacity
            onPress={async () => {
              await onSearchQueryChange("");
              Keyboard.dismiss();
            }}
          >
            <XIcon className="text-primary" />
          </TouchableOpacity>
        </View>
        <View className="h-full w-full mt-2">
          {barCodeScannerOpen ? (
            <BarcodeScanner
              barCodeScannerOpen={barCodeScannerOpen}
              onScan={onScan}
            />
          ) : (
            <SearchProducts
              date={date}
              products={products}
              loading={loading}
              notFound={noResults}
              onAddProduct={onAddProduct}
              meal={meal}
              searchFocused={searchFocused}
            />
          )}
        </View>
        <FloatingActionButton
          onPress={() => {
            setBarCodeScannerOpen((prev) => !prev);
          }}
        >
          {barCodeScannerOpen ? (
            <XIcon className="text-secondary h-9 w-9" />
          ) : (
            <ScanBarcodeIcon className="text-secondary h-9 w-9" />
          )}
        </FloatingActionButton>
      </View>
    </KeyboardShift>
  );
}
