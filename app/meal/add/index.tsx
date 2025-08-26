import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Keyboard, TouchableOpacity, View } from "react-native";
import {
  router,
  Stack,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { ScanBarcodeIcon, SearchIcon, XIcon } from "lucide-nativewind";
import { useCameraPermission } from "react-native-vision-camera";
import { Input } from "~/components/ui/input";
import { SearchProducts } from "~/components/index/meal/add/search-products";
import { FoodSearchResultDto } from "~/api/types/FoodSearchResultDto";
import { yazioSearchFoods } from "~/api/yazio";
import { KeyboardShift } from "~/components/keyboard-shift";
import { FloatingActionButton } from "~/components/floating-action-button";
import {
  addFoodToMeal,
  addRecipeEntry,
  getCustomFood,
  getFavoriteFoods,
  getRecentFoods,
  queryCustomFoods,
} from "~/utils/querying";
import { MealType } from "~/types/MealType";
import { ThreeDotMenu } from "~/components/index/meal/add/three-dot-menu";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { Text } from "~/components/ui/text";
import { BarcodeScanner } from "~/components/index/meal/add/barcode-scanner";
import { useSettings } from "~/contexts/AppSettingsContext";
import { getIsLocalSearchType, SearchFilterType } from "~/types/SearchFilter";

export default function AddToMealScreen() {
  const params = useLocalSearchParams();
  const mealName = params.mealName as string;
  const dateId = params.dateId as string;
  const recipeFoodId = params.recipeFoodId
    ? (params.recipeFoodId as string)
    : null;

  const { hasPermission, requestPermission } = useCameraPermission();
  const navigation = useNavigation();
  const { searchDebounceMs } = useSettings();

  const [barCodeScannerOpen, setBarCodeScannerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<FoodSearchResultDto[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [noResults, setNoResults] = useState(false);

  const [recents, setRecents] = useState<Set<string>>(new Set());
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const searchFilterRef = useRef(SearchFilterType.NONE);

  // Concurrency / cancellation tracking
  const abortRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);
  const cacheRef = useRef<Map<string, FoodSearchResultDto[]>>(new Map());
  const [, startTransition] = useTransition();

  const setProductsWrapper = useCallback((products: FoodSearchResultDto[]) => {
    startTransition(() => {
      setProducts(products);
    });
  }, []);

  const updateFavoritesAndRecents = useCallback(
    async (products: FoodSearchResultDto[]) => {
      const productIds = products.map((p) => p.productId);
      const [recents, favorites] = await Promise.all([
        getRecentFoods(productIds),
        getFavoriteFoods(productIds),
      ]);
      setRecents(recents);
      setFavorites(favorites);
    },
    [],
  );

  const filterProducts = useCallback(
    async (products: FoodSearchResultDto[], filter: SearchFilterType) => {
      const productIds = products.map((p) => p.productId);
      const [recents, favorites] = await Promise.all([
        getRecentFoods(productIds),
        getFavoriteFoods(productIds),
      ]);
      setRecents(recents);
      setFavorites(favorites);
      return getIsLocalSearchType(filter)
        ? products
        : products.filter((product) => {
            if (filter === SearchFilterType.FAVORITES) {
              return favorites.has(product.productId);
            }
            if (filter === SearchFilterType.RECENTS) {
              return recents.has(product.productId);
            }
            return true;
          });
    },
    [],
  );

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
      setProductsWrapper([]);
    }
  }, [searchQuery, products]);

  const performSearch = useCallback(
    async (rawQuery: string, scanned = false) => {
      const effectiveSearchFilter = searchFilterRef.current;
      const query = rawQuery.trim();

      // Serve from cache if present and not scanned (still allow scan to refetch)
      const cacheKey = `${effectiveSearchFilter}|${query.toLowerCase()}`;

      requestIdRef.current += 1;
      const currentId = requestIdRef.current;

      // Abort previous
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      if (!scanned && cacheRef.current.has(cacheKey)) {
        const cached = cacheRef.current.get(cacheKey)!;
        setProductsWrapper(cached);
        await updateFavoritesAndRecents(cached);
        setNoResults(cached.length === 0);
        return;
      }

      setLoading(true);
      try {
        const isLocalSearchType = getIsLocalSearchType(effectiveSearchFilter);
        const remotePromise = isLocalSearchType
          ? Promise.resolve<FoodSearchResultDto[]>([])
          : yazioSearchFoods(query, { signal: controller.signal });

        const localPromise = queryCustomFoods(
          query,
          scanned,
          !isLocalSearchType
            ? undefined
            : effectiveSearchFilter == SearchFilterType.RECIPES,
        );
        const [remote, local] = await Promise.all([
          remotePromise,
          localPromise,
        ]);

        if (controller.signal.aborted || currentId !== requestIdRef.current) {
          return;
        }

        // Merge & dedupe by productId (prefer local override if same id)
        const map = new Map<string, FoodSearchResultDto>();
        remote.forEach((r) => map.set(r.productId, r));
        local.forEach((l) => map.set(l.productId, l));
        const merged = Array.from(map.values());
        const filtered = await filterProducts(merged, effectiveSearchFilter);

        cacheRef.current.set(cacheKey, filtered);

        setProductsWrapper(filtered);

        setNoResults(filtered.length === 0);

        if (filtered.length === 1 && scanned) {
          router.navigate({
            pathname: "/meal/add/product",
            params: {
              productId: filtered[0].productId,
              dateId: dateId,
              mealName: mealName,
              custom: filtered[0].score === -1 ? "true" : "false",
            },
          });
        }
      } catch (e) {
        if (
          !(e instanceof Error && e.name === "AbortError") &&
          currentId === requestIdRef.current
        ) {
          console.error("Failed to search products:", e);
          setProductsWrapper([]);
          setNoResults(true);
        }
      } finally {
        if (currentId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [dateId, mealName],
  );

  // Debounced search effect (keyboard input)
  useEffect(() => {
    if (searchQuery === "") {
      abortRef.current?.abort();
      setProductsWrapper([]);
      setNoResults(false);
      return;
    }
    const handle = setTimeout(() => {
      performSearch(searchQuery, false);
    }, searchDebounceMs);
    return () => clearTimeout(handle);
  }, [searchQuery, performSearch, searchDebounceMs]);

  const onSearchQueryChange = (text: string) => {
    setSearchQuery(text);
  };

  const handleOnlyCustomChange = (value: SearchFilterType) => {
    searchFilterRef.current = value;
    setNoResults(false);
    // Re-run search immediately (respects debounce for typing already done)
    if (searchQuery.trim()) {
      // read from ref inside performSearch
      performSearch(searchQuery, false);
    }
  };

  async function onAddProduct(searchResult: FoodSearchResultDto) {
    // search api returns quantity and amount as 100 in some cases,
    // probably for '100 (unit)' type of servings
    let servingQuantity = searchResult.servingQuantity;
    let amount = searchResult.amount;
    if (searchResult.servingQuantity === 100 && searchResult.amount === 100) {
      servingQuantity = 100;
      amount = 1;
    }
    const food =
      searchResult.score === -1
        ? await getCustomFood(searchResult.productId)
        : undefined;

    await (recipeFoodId
      ? addRecipeEntry(
          recipeFoodId,
          searchResult.productId,
          servingQuantity,
          amount,
          searchResult.serving,
          food,
        )
      : addFoodToMeal(
          mealName as MealType,
          searchResult.productId,
          servingQuantity,
          amount,
          searchResult.serving,
          dateId,
          food,
        ));
  }

  const onScan = (code: string) => {
    setBarCodeScannerOpen(false);
    setSearchQuery(code);
    // Immediate search: bypass debounce & cache
    performSearch(code, true);
  };

  return (
    <KeyboardShift>
      <View className="h-full bg-secondary p-4">
        <Stack.Screen
          options={{
            title: recipeFoodId ? "Add Ingredient" : mealName,
            headerRight: recipeFoodId
              ? undefined
              : () => (
                  <ThreeDotMenu>
                    <DropdownMenuItem
                      onPress={() =>
                        router.navigate({
                          pathname: "/meal/add/recipe",
                          params: { dateId: dateId, mealName: mealName },
                        })
                      }
                    >
                      <Text className="text-sm text-primary">
                        Create Recipe
                      </Text>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onPress={() =>
                        router.navigate({
                          pathname: "/meal/add/custom-food",
                          params: { dateId: dateId, mealName: mealName },
                        })
                      }
                    >
                      <Text className="text-sm text-primary">Create Food</Text>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onPress={() =>
                        router.navigate({
                          pathname: "/meal/add/quick-entry",
                          params: { dateId: dateId, mealName: mealName },
                        })
                      }
                    >
                      <Text className="text-sm text-primary">Quick Entry</Text>
                    </DropdownMenuItem>
                  </ThreeDotMenu>
                ),
          }}
        />
        <View className="flex-row items-center justify-center rounded-lg border border-muted-foreground bg-secondary px-4">
          <SearchIcon className="text-primary" />
          <Input
            onFocus={() => setSearchFocused(true)}
            onEndEditing={() => setSearchFocused(false)}
            selectTextOnFocus
            className="ml-4 flex-1 border-0 bg-secondary"
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
        <View className="mt-2 h-full w-full">
          {barCodeScannerOpen ? (
            <BarcodeScanner
              barCodeScannerOpen={barCodeScannerOpen}
              onScan={onScan}
            />
          ) : (
            <SearchProducts
              dateId={dateId}
              products={products}
              loading={loading}
              notFound={noResults}
              onAddProduct={onAddProduct}
              meal={mealName}
              searchFocused={searchFocused}
              onSetSearchFilter={handleOnlyCustomChange}
              initialSearchFilter={searchFilterRef.current}
              recents={recents}
              favorites={favorites}
              recipeFoodId={recipeFoodId}
            />
          )}
        </View>
        <FloatingActionButton
          onPress={() => setBarCodeScannerOpen((prev) => !prev)}
        >
          {barCodeScannerOpen ? (
            <XIcon className="h-9 w-9 text-secondary" />
          ) : (
            <ScanBarcodeIcon className="h-9 w-9 text-secondary" />
          )}
        </FloatingActionButton>
      </View>
    </KeyboardShift>
  );
}
