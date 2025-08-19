import { useRef, useTransition, useCallback } from "react";
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
import { addFoodToMeal, queryCustomFoods } from "~/utils/querying";
import { MealType } from "~/types/MealType";
import { ThreeDotMenu } from "~/components/index/meal/add/three-dot-menu";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { Text } from "~/components/ui/text";
import { BarcodeScanner } from "~/components/index/meal/add/barcode-scanner";
import { useSettings } from "~/contexts/AppSettingsContext";

export default function AddToMealScreen() {
  const params = useLocalSearchParams();
  const meal = params["mealName"] as string;
  const date = params["date"] as string;

  const { hasPermission, requestPermission } = useCameraPermission();
  const navigation = useNavigation();
  const { searchDebounceMs } = useSettings();

  const [barCodeScannerOpen, setBarCodeScannerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<FoodSearchResultDto[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [onlyCustomProducts, setOnlyCustomProducts] = useState(false);
  const [noResults, setNoResults] = useState(false);

  // Concurrency / cancellation tracking
  const abortRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);
  const cacheRef = useRef<Map<string, FoodSearchResultDto[]>>(new Map());
  const [_, startTransition] = useTransition();

  // Focus listener & camera permission
  useEffect(() => {
    return navigation.addListener("focus", () => {
      setBarCodeScannerOpen(false);
      if (!hasPermission) {
        (async () => {
          await requestPermission();
        })();
      }
    });
  }, [navigation, hasPermission, requestPermission]);

  // Clear products when query cleared manually
  useEffect(() => {
    if (searchQuery === "" && products.length > 0) {
      setProducts([]);
    }
  }, [searchQuery, products]);

  const performSearch = useCallback(
    async (
      rawQuery: string,
      scanned = false,
      onlyCustom = onlyCustomProducts,
    ) => {
      const query = rawQuery.trim();
      // Serve from cache if present and not scanned (still allow scan to refetch)
      const cacheKey = `${onlyCustom ? "custom|" : "all|"}${query.toLowerCase()}`;
      if (!scanned && cacheRef.current.has(cacheKey)) {
        setProducts(cacheRef.current.get(cacheKey)!);
        return;
      }

      requestIdRef.current += 1;
      const currentId = requestIdRef.current;

      // Abort previous
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      try {
        const remotePromise = onlyCustom
          ? Promise.resolve<FoodSearchResultDto[]>([])
          : yazioSearchFoods(query, { signal: controller.signal });

        const localPromise = queryCustomFoods(query, scanned);

        const [remote, local] = await Promise.all([
          remotePromise,
          localPromise,
        ]);

        if (controller.signal.aborted || currentId !== requestIdRef.current)
          return;

        // Merge & dedupe by productId (prefer local override if same id)
        const map = new Map<string, FoodSearchResultDto>();
        remote.forEach((r) => map.set(r.productId, r));
        local.forEach((l) => map.set(l.productId, l));
        const merged = Array.from(map.values());

        cacheRef.current.set(cacheKey, merged);

        startTransition(() => {
          setProducts(merged);
        });

        setNoResults(merged.length === 0);

        if (merged.length === 1 && scanned) {
          router.navigate({
            pathname: "/meal/add/product",
            params: {
              edit: "false",
              productId: merged[0].productId,
              date,
              mealName: meal,
              custom: merged[0].score === -1 ? "true" : "false",
            },
          });
        }
      } catch (e) {
        if (
          !(e instanceof Error && e.name === "AbortError") &&
          currentId === requestIdRef.current
        ) {
          console.error("Failed to search products:", e);
          setProducts([]);
          setNoResults(true);
        }
      } finally {
        if (currentId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [onlyCustomProducts, date, meal],
  );

  // Debounced search effect (keyboard input)
  useEffect(() => {
    if (searchQuery === "") {
      abortRef.current?.abort();
      setProducts([]);
      setNoResults(false);
      return;
    }
    const handle = setTimeout(() => {
      performSearch(searchQuery, false);
    }, searchDebounceMs);
    return () => clearTimeout(handle);
  }, [searchQuery, performSearch]);

  const onSearchQueryChange = (text: string) => {
    setSearchQuery(text);
  };

  const handleOnlyCustomChange = (value: boolean) => {
    setOnlyCustomProducts(value);
    setNoResults(false);
    // Re-run search immediately (respects debounce for typing already done)
    if (searchQuery.trim()) {
      performSearch(searchQuery, false, value);
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

  const onScan = (code: string) => {
    setBarCodeScannerOpen(false);
    setSearchQuery(code);
    // Immediate search: bypass debounce & cache
    performSearch(code, true);
  };

  return (
    <KeyboardShift>
      <View className="p-4 bg-secondary h-full">
        <Stack.Screen
          options={{
            title: `${meal}`,
            headerRight: () => (
              <ThreeDotMenu>
                <DropdownMenuItem>
                  <Text className="text-sm text-primary">Create Recipe</Text>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onPress={() =>
                    router.navigate({
                      pathname: "/meal/add/custom-food",
                      params: { date, mealName: meal },
                    })
                  }
                >
                  <Text className="text-sm text-primary">Create Food</Text>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onPress={() =>
                    router.navigate({
                      pathname: "/meal/add/quick-entry",
                      params: { date, mealName: meal },
                    })
                  }
                >
                  <Text className="text-sm text-primary">Quick Entry</Text>
                </DropdownMenuItem>
              </ThreeDotMenu>
            ),
          }}
        />
        <View className="flex-row justify-center items-center border border-muted-foreground px-4 rounded-lg bg-secondary">
          <SearchIcon className="text-primary" />
          <Input
            onFocus={() => setSearchFocused(true)}
            onEndEditing={() => setSearchFocused(false)}
            selectTextOnFocus
            className="flex-1 ml-4 border-0 bg-secondary"
            placeholder="Search Product"
            onChangeText={onSearchQueryChange}
            value={searchQuery}
            autoCorrect={false}
          />
          <TouchableOpacity
            onPress={() => {
              setSearchQuery("");
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
              onSetOnlyCustomProducts={handleOnlyCustomChange}
            />
          )}
        </View>
        <FloatingActionButton
          onPress={() => setBarCodeScannerOpen((prev) => !prev)}
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
