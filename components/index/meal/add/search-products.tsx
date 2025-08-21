import { Text } from "~/components/ui/text";
import { Keyboard, TouchableOpacity, View } from "react-native";
import { FoodSearchResultDto } from "~/api/types/FoodSearchResultDto";
import { Card } from "~/components/ui/card";
import {
  HistoryIcon,
  LoaderCircleIcon,
  PenIcon,
  PlusIcon,
  VerifiedIcon,
} from "lucide-nativewind";
import { formatNumber } from "~/utils/formatting";
import { Separator } from "~/components/ui/separator";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import Animated, {
  LightSpeedInLeft,
  LightSpeedOutRight,
  LinearTransition,
} from "react-native-reanimated";
import { getServingUnitLabel } from "~/utils/serving";
import { FoodTabs } from "~/components/index/meal/add/food-tabs";
import { MealType } from "~/types/MealType";
import { getRecentFoods } from "~/utils/querying";
import { Toggle } from "~/components/ui/toggle";
import { FlashList } from "@shopify/flash-list";

interface SearchProductsProps {
  products: FoodSearchResultDto[];
  loading: boolean;
  notFound: boolean;
  onAddProduct: (product: FoodSearchResultDto) => Promise<void>;
  meal: string;
  dateId: string;
  searchFocused: boolean;
  onSetOnlyCustomProducts: (onlyCustom: boolean) => void;
}

export const SearchProducts = ({
  products,
  loading,
  notFound,
  onAddProduct,
  meal,
  dateId,
  searchFocused,
  onSetOnlyCustomProducts,
}: SearchProductsProps) => {
  const [recents, setRecents] = useState<Set<string>>(new Set());
  const [onlyCustomProducts, setOnlyCustomProducts] = useState(false);

  useEffect(() => {
    getRecentFoods(products.map((product) => product.productId)).then(
      setRecents,
    );
  }, [products]);

  const displayFoodTabs =
    !searchFocused && products.length === 0 && !loading && !notFound;

  return displayFoodTabs ? (
    <FoodTabs mealType={meal as MealType} dateId={dateId} />
  ) : (
    <>
      <Toggle
        size="sm"
        variant="outline"
        pressed={onlyCustomProducts}
        onPressedChange={(pressed) => {
          setOnlyCustomProducts(pressed);
          onSetOnlyCustomProducts(pressed);
        }}
        className="self-start rounded-full"
      >
        <View className="flex-row items-center">
          <PenIcon className="mr-1 h-4 w-4 text-primary" />
          <Text>Custom only</Text>
        </View>
      </Toggle>
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
      ) : products.length === 0 ? (
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
          data={products}
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
}: {
  product: FoodSearchResultDto;
  meal: string;
  dateId: string;
  onAddProduct: (product: FoodSearchResultDto) => Promise<void>;
  isRecent: boolean;
}) {
  const [loading, setLoading] = useState(false);

  async function localOnAddProduct(product: FoodSearchResultDto) {
    setLoading(true);
    await onAddProduct(product);
    setLoading(false);
  }

  return (
    <TouchableOpacity
      className="p-0.5"
      onPress={() =>
        router.navigate({
          pathname: "/meal/add/product",
          params: {
            edit: "false",
            productId: product.productId,
            dateId: dateId,
            mealName: meal,
            custom: product.score === -1 ? "true" : "false",
          },
        })
      }
    >
      <Card className="mb-2 flex items-start justify-between rounded-lg bg-secondary px-2.5 py-1.5">
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
          <View className="flex-grow" />
          <Text className="text-primary">
            {formatNumber(product.nutrients.energy * product.amount)} kcal
          </Text>
        </View>
        <Separator className="my-2" />
        <View className="flex-row items-center">
          <View className="items-center">
            <Text className="text-primary">
              {formatNumber(product.nutrients.carb * product.amount, 1)} g
            </Text>
            <Text className="text-sm text-muted-foreground">Carbs</Text>
          </View>
          <View className="flex-grow" />
          <View className="items-center">
            <Text className="text-primary">
              {formatNumber(product.nutrients.protein * product.amount, 1)} g
            </Text>
            <Text className="text-sm text-muted-foreground">Protein</Text>
          </View>
          <View className="flex-grow" />
          <View className="items-center">
            <Text className="text-primary">
              {formatNumber(product.nutrients.fat * product.amount, 1)} g
            </Text>
            <Text className="text-sm text-muted-foreground">Fat</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
