import { Animated, TouchableOpacity, View, Keyboard } from "react-native";
import ScrollView = Animated.ScrollView;
import {
  router,
  Stack,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import {
  SearchIcon,
  XIcon,
  ScanBarcodeIcon,
  FlashlightIcon,
  FlashlightOffIcon,
} from "lucide-nativewind";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";
import { Input } from "~/components/ui/input";
import { SearchProducts } from "~/components/index/meal/add/search-products";
import { FoodSearchResult } from "~/api/types/FoodSearchResult";
import { yazioSearchFoods } from "~/api/yazio";
import { KeyboardShift } from "~/components/keyboard-shift";
import { FloatingActionButton } from "~/components/floating-action-button";
import { useEffect, useState } from "react";
import { addFoodToMeal } from "~/utils/querying";
import { MealType } from "~/types/MealType";
import { ThreeDotMenu } from "~/components/index/meal/add/three-dot-menu";

export default function AddToMealScreen() {
  const params = useLocalSearchParams();
  const meal = params["mealName"] as string;
  const date = params["date"] as string;
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("back");
  const [barCodeScannerOpen, setBarCodeScannerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<FoodSearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isTorchEnabled, setIsTorchEnabled] = useState(false);
  const noResults = products.length === 0 && searchQuery !== "";

  useEffect(() => {
    if (barCodeScannerOpen && !hasPermission) {
      (async () => {
        await requestPermission();
      })();
    }
  }, [barCodeScannerOpen]);

  useEffect(() => {
    if (searchQuery === "" && products.length > 0) {
      setProducts([]);
    }
  }, [products]);

  const codeScanner = useCodeScanner({
    codeTypes: ["ean-13", "ean-8", "upc-a", "upc-e"],
    onCodeScanned: async (codes) => {
      if (codes.length > 0 && codes[0].value !== undefined) {
        setBarCodeScannerOpen(false);
        // if the code is ean-13 and starts with 0, remove the first character
        // this works around ios api interpreting upc-a as ean-13
        let data = codes[0].value;
        if (codes[0].type === "ean-13" && data[0] === "0") {
          data = data.substring(1);
        }
        setSearchQuery(data);
        await searchProducts(data, true);
      }
    },
  });

  const navigation = useNavigation();
  useEffect(() => {
    return navigation.addListener("focus", () => {
      setBarCodeScannerOpen(false);
      setIsTorchEnabled(false);
      if (!hasPermission) {
        (async () => {
          await requestPermission();
        })();
      }
    });
  }, [navigation]);

  if (!device) {
    return;
  }

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
        router.push(
          `/meal/add/product?edit=false&productId=${response[0].productId}&date=${date}&mealName=${meal}`,
        );
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

  async function onAddProduct(food: FoodSearchResult) {
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
            selectTextOnFocus={true}
            className="flex-1 ml-4 border-0 bg-secondary"
            placeholder="Search Product"
            onChangeText={(text: string) => onSearchQueryChange(text)}
            value={searchQuery}
            autoCorrect={false}
          />
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <XIcon className="text-primary" />
          </TouchableOpacity>
        </View>
        <ScrollView
          className="h-full w-full mt-2"
          showsVerticalScrollIndicator={false}
          onScrollBeginDrag={() => Keyboard.dismiss()}
        >
          {barCodeScannerOpen ? (
            <View className="items-center">
              <View className="min-h-56 w-full my-10 border border-border rounded-lg overflow-hidden">
                <Camera
                  codeScanner={codeScanner}
                  style={{ flex: 1 }}
                  device={device}
                  isActive={barCodeScannerOpen}
                  onError={(error) => {
                    console.error("Camera error:", error);
                  }}
                  torch={isTorchEnabled ? "on" : "off"}
                />
              </View>
              <TouchableOpacity
                onPress={() => setIsTorchEnabled(!isTorchEnabled)}
              >
                {isTorchEnabled ? (
                  <FlashlightIcon className="text-primary" size={32} />
                ) : (
                  <FlashlightOffIcon className="text-primary" size={32} />
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <SearchProducts
              date={date}
              products={products}
              loading={loading}
              notFound={noResults}
              onAddProduct={onAddProduct}
              meal={meal}
            />
          )}
        </ScrollView>
        <FloatingActionButton
          onPress={() => {
            setBarCodeScannerOpen(!barCodeScannerOpen);
            setIsTorchEnabled(false);
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
