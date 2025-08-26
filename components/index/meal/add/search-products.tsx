import { Text } from "~/components/ui/text";
import { Keyboard, TouchableOpacity, View } from "react-native";
import { FoodSearchResultDto } from "~/api/types/FoodSearchResultDto";
import { Card } from "~/components/ui/card";
import {
  ChefHatIcon,
  HeartIcon,
  HistoryIcon,
  LoaderCircleIcon,
  PenIcon,
  PlusIcon,
  VerifiedIcon,
} from "lucide-nativewind";
import { formatNumber } from "~/utils/formatting";
import { Separator } from "~/components/ui/separator";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import Animated, {
  LightSpeedInLeft,
  LightSpeedOutRight,
  LinearTransition,
} from "react-native-reanimated";
import { getServingUnitLabel } from "~/utils/serving";
import { FoodTabs } from "~/components/index/meal/add/food-tabs";
import { MealType } from "~/types/MealType";
import { FlashList } from "@shopify/flash-list";
import { getIsLocalSearchType, SearchFilterType } from "~/types/SearchFilter";
import { SearchFilterToggle } from "~/components/index/meal/add/search-filter-toggle";

interface SearchProductsProps {
  products: FoodSearchResultDto[];
  loading: boolean;
  notFound: boolean;
  onAddProduct: (product: FoodSearchResultDto) => Promise<void>;
  meal: string;
  dateId: string;
  searchFocused: boolean;
  onSetSearchFilter: (filter: SearchFilterType) => void;
  initialSearchFilter?: SearchFilterType;
  favorites: Set<string>;
  recents: Set<string>;
  recipeFoodId: string | null;
}

export const SearchProducts = ({
  products,
  loading,
  notFound,
  onAddProduct,
  meal,
  dateId,
  searchFocused,
  onSetSearchFilter,
  initialSearchFilter = SearchFilterType.NONE,
  favorites,
  recents,
  recipeFoodId,
}: SearchProductsProps) => {
  const [searchFilter, setSearchFilter] = useState(initialSearchFilter);

  const displayFoodTabs =
    !searchFocused && products.length === 0 && !loading && !notFound;

  const setSearchFilterWrapper = useCallback(
    (filter: SearchFilterType) => {
      if (searchFilter !== filter) {
        setSearchFilter(filter);
        onSetSearchFilter(filter);
      } else {
        setSearchFilter(SearchFilterType.NONE);
        onSetSearchFilter(SearchFilterType.NONE);
      }
    },
    [searchFilter, onSetSearchFilter],
  );

  const filteredProducts = getIsLocalSearchType(searchFilter)
    ? products
    : products.filter((product) => {
        if (searchFilter === SearchFilterType.FAVORITES) {
          return favorites.has(product.productId);
        }
        if (searchFilter === SearchFilterType.RECENTS) {
          return recents.has(product.productId);
        }
        return true;
      });

  return displayFoodTabs ? (
    <FoodTabs
      mealType={meal as MealType}
      dateId={dateId}
      recipeFoodId={recipeFoodId}
    />
  ) : (
    <>
      <View className="flex-row items-center justify-between">
        <SearchFilterToggle
          selectedSearchFilter={searchFilter}
          searchFilter={SearchFilterType.CUSTOM}
          onSetSearchFilter={setSearchFilterWrapper}
          content="Created food"
          icon={(className) => {
            return <PenIcon className={className} />;
          }}
        />
        <SearchFilterToggle
          selectedSearchFilter={searchFilter}
          searchFilter={SearchFilterType.FAVORITES}
          onSetSearchFilter={setSearchFilterWrapper}
          content="Favorites"
          icon={(className) => {
            return <HeartIcon className={className} />;
          }}
        />
        <SearchFilterToggle
          selectedSearchFilter={searchFilter}
          searchFilter={SearchFilterType.RECENTS}
          onSetSearchFilter={setSearchFilterWrapper}
          content="Recents"
          icon={(className) => {
            return <HistoryIcon className={className} />;
          }}
        />
        <SearchFilterToggle
          selectedSearchFilter={searchFilter}
          searchFilter={SearchFilterType.RECIPES}
          onSetSearchFilter={setSearchFilterWrapper}
          content="Recipes"
          icon={(className) => {
            return <ChefHatIcon className={className} />;
          }}
          disabled={!!recipeFoodId}
        />
      </View>
      {loading ? (
        <View className="mt-10 flex-1 items-center">
          <Text className="text-lg font-semibold text-primary">Loading...</Text>
        </View>
      ) : notFound ? (
        <View
          className="mt-10 flex-1 items-center"
          onTouchStart={() => Keyboard.dismiss()}
        >
          <Text className="text-lg font-semibold text-primary">
            No results found
          </Text>
          <Text className="text-sm text-muted-foreground">
            Try a different search
          </Text>
        </View>
      ) : filteredProducts.length === 0 ? (
        <View
          className="mt-10 flex-1 items-center"
          onTouchStart={() => Keyboard.dismiss()}
        >
          <Text className="text-lg font-semibold text-primary">
            Scan a barcode
          </Text>
          <Text className="text-sm text-muted-foreground">
            or search for a product
          </Text>
        </View>
      ) : (
        <FlashList
          estimatedItemSize={120}
          className="mt-2"
          extraData={{ recents, favorites }}
          data={filteredProducts}
          keyExtractor={(item) => item.productId}
          showsVerticalScrollIndicator={false}
          onScrollBeginDrag={() => Keyboard.dismiss()}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <Animated.View
              layout={LinearTransition}
              entering={LightSpeedInLeft}
              exiting={LightSpeedOutRight}
            >
              <SearchProduct
                product={item}
                meal={meal}
                onAddProduct={onAddProduct}
                dateId={dateId}
                isRecent={recents.has(item.productId)}
                isFavorite={favorites.has(item.productId)}
                recipeFoodId={recipeFoodId}
              />
            </Animated.View>
          )}
        />
      )}
    </>
  );
};

function SearchProduct({
  product,
  meal,
  dateId,
  onAddProduct,
  isRecent,
  isFavorite,
  recipeFoodId,
}: {
  product: FoodSearchResultDto;
  meal: string;
  dateId: string;
  onAddProduct: (product: FoodSearchResultDto) => Promise<void>;
  isRecent: boolean;
  isFavorite: boolean;
  recipeFoodId: string | null;
}) {
  const [loading, setLoading] = useState(false);

  async function localOnAddProduct(product: FoodSearchResultDto) {
    setLoading(true);
    await onAddProduct(product);
    setLoading(false);
  }

  return (
    <Card className="m-1 px-2.5 py-1.5">
      <TouchableOpacity
        className="flex items-start justify-between"
        onPress={() =>
          router.navigate({
            pathname: "/meal/add/product",
            params: {
              productId: product.productId,
              dateId: dateId,
              mealName: meal,
              custom: product.score === -1 ? "true" : "false",
              recipeFoodId: recipeFoodId ?? undefined,
            },
          })
        }
      >
        <View className="flex-row items-center">
          <Text className="max-w-[90%] flex-shrink font-semibold text-primary">
            {`${product.name} `}
            {product.isVerified && (
              <View className="justify-end">
                <VerifiedIcon className="h-4 text-primary" />
              </View>
            )}
          </Text>
          <View className="flex-grow" />
          <TouchableOpacity
            disabled={loading}
            onPress={async () => await localOnAddProduct(product)}
          >
            {loading ? (
              <View className="animate-spin">
                <LoaderCircleIcon className="text-primary" />
              </View>
            ) : (
              <PlusIcon className="text-primary" />
            )}
          </TouchableOpacity>
        </View>
        {product.producer && (
          <Text className="text-sm text-muted-foreground">
            {product.producer}
          </Text>
        )}
        <View className="flex-row items-center">
          <Text className="text-primary">
            {product.servingQuantity}{" "}
            {getServingUnitLabel(
              product.serving,
              product.amount,
              product.baseUnit,
            )}
          </Text>
          {isRecent && <HistoryIcon className="ml-1 h-4 w-4 text-primary" />}
          {isFavorite && <HeartIcon className="ml-1 h-4 w-4 text-primary" />}
          <View className="flex-grow" />
          <Text className="text-primary">
            {formatNumber(
              product.nutrients.energy *
                product.amount *
                product.servingQuantity,
            )}{" "}
            kcal
          </Text>
        </View>
        <Separator className="my-2" />
        <View className="flex-row items-center">
          <View className="items-center">
            <Text className="text-primary">
              {formatNumber(
                product.nutrients.carb *
                  product.amount *
                  product.servingQuantity,
                1,
              )}{" "}
              g
            </Text>
            <Text className="text-sm text-muted-foreground">Carbs</Text>
          </View>
          <View className="flex-grow" />
          <View className="items-center">
            <Text className="text-primary">
              {formatNumber(
                product.nutrients.protein *
                  product.amount *
                  product.servingQuantity,
                1,
              )}{" "}
              g
            </Text>
            <Text className="text-sm text-muted-foreground">Protein</Text>
          </View>
          <View className="flex-grow" />
          <View className="items-center">
            <Text className="text-primary">
              {formatNumber(
                product.nutrients.fat *
                  product.amount *
                  product.servingQuantity,
                1,
              )}{" "}
              g
            </Text>
            <Text className="text-sm text-muted-foreground">Fat</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );
}
