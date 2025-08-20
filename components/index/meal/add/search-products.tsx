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

type SearchProductsProps = {
  products: FoodSearchResultDto[];
  loading: boolean;
  notFound: boolean;
  onAddProduct: (product: FoodSearchResultDto) => Promise<void>;
  meal: string;
  date: string;
  searchFocused: boolean;
  onSetOnlyCustomProducts: (onlyCustom: boolean) => void;
};

export const SearchProducts = ({
  products,
  loading,
  notFound,
  onAddProduct,
  meal,
  date,
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
    <FoodTabs mealType={meal as MealType} date={date} />
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
          <PenIcon className="text-primary h-4 w-4 mr-1" />
          <Text>Custom only</Text>
        </View>
      </Toggle>
      {loading ? (
        <View className="flex-1 items-center mt-10">
          <Text className="text-primary text-lg font-semibold">Loading...</Text>
        </View>
      ) : notFound ? (
        <View
          className="flex-1 items-center mt-10"
          onTouchStart={() => Keyboard.dismiss()}
        >
          <Text className="text-primary text-lg font-semibold">
            No results found
          </Text>
          <Text className="text-muted-foreground text-sm">
            Try a different search
          </Text>
        </View>
      ) : products.length === 0 ? (
        <View
          className="flex-1 items-center mt-10"
          onTouchStart={() => Keyboard.dismiss()}
        >
          <Text className="text-primary text-lg font-semibold">
            Scan a barcode
          </Text>
          <Text className="text-muted-foreground text-sm">
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
                date={date}
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
  date,
  onAddProduct,
  isRecent,
}: {
  product: FoodSearchResultDto;
  meal: string;
  date: string;
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
            date: date,
            mealName: meal,
            custom: product.score === -1 ? "true" : "false",
          },
        })
      }
    >
      <Card className="flex items-start justify-between px-2.5 py-1.5 bg-secondary rounded-lg mb-2">
        <View className="flex-row items-center">
          <Text className="text-primary font-semibold max-w-[90%] flex-shrink">
            {`${product.name} `}
            {product.isVerified && (
              <View className="justify-end">
                <VerifiedIcon className="text-primary h-4" />
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
          <Text className="text-muted-foreground text-sm">
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
          {isRecent && <HistoryIcon className="text-primary w-4 h-4 ml-1" />}
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
