import { Text } from "~/components/ui/text";
import { Keyboard, ScrollView, TouchableOpacity, View } from "react-native";
import { FoodSearchResultDto } from "~/api/types/FoodSearchResultDto";
import { Card } from "~/components/ui/card";
import {
  ClockFadingIcon,
  LoaderCircleIcon,
  PlusIcon,
  VerifiedIcon,
} from "lucide-nativewind";
import { formatNumber } from "~/utils/formatting";
import { Separator } from "~/components/ui/separator";
import { router } from "expo-router";
import { useState } from "react";
import Animated, { FadeOut, LightSpeedInLeft } from "react-native-reanimated";
import { formatServing } from "~/utils/serving";
import { FoodTabs } from "~/components/index/meal/add/food-tabs";
import { MealType } from "~/types/MealType";

type SearchProductsProps = {
  products: FoodSearchResultDto[];
  loading: boolean;
  notFound: boolean;
  onAddProduct: (product: FoodSearchResultDto) => Promise<void>;
  meal: string;
  date: string;
  searchFocused: boolean;
};

export const SearchProducts = ({
  products,
  loading,
  notFound,
  onAddProduct,
  meal,
  date,
  searchFocused,
}: SearchProductsProps) => {
  return loading ? (
    <View className="flex-1 items-center mt-10">
      <Text className="text-primary text-lg font-semibold">Loading...</Text>
    </View>
  ) : notFound ? (
    <View className="flex-1 items-center mt-10">
      <Text className="text-primary text-lg font-semibold">
        No results found
      </Text>
      <Text className="text-muted-foreground text-sm">
        Try a different search
      </Text>
    </View>
  ) : products.length === 0 ? (
    searchFocused ? (
      <View className="flex-1 items-center mt-10">
        <Text className="text-primary text-lg font-semibold">
          Scan a barcode
        </Text>
        <Text className="text-muted-foreground text-sm">
          or search for a product
        </Text>
      </View>
    ) : (
      <FoodTabs mealType={meal as MealType} date={date} />
    )
  ) : (
    <ScrollView
      showsVerticalScrollIndicator={false}
      onScrollBeginDrag={() => Keyboard.dismiss()}
    >
      <Animated.View
        className="pb-10"
        entering={LightSpeedInLeft}
        exiting={FadeOut}
      >
        {products.map((product) => (
          <SearchProduct
            key={product.productId}
            product={product}
            meal={meal}
            onAddProduct={onAddProduct}
            date={date}
          />
        ))}
      </Animated.View>
    </ScrollView>
  );
};

function SearchProduct({
  product,
  meal,
  date,
  onAddProduct,
}: {
  product: FoodSearchResultDto;
  meal: string;
  date: string;
  onAddProduct: (product: FoodSearchResultDto) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  async function localOnAddProduct(product: FoodSearchResultDto) {
    setLoading(true);
    await onAddProduct(product);
    setLoading(false);
  }

  return (
    <TouchableOpacity
      onPress={() =>
        router.navigate({
          pathname: "/meal/add/product",
          params: {
            edit: "false",
            productId: product.productId,
            date: date,
            mealName: meal,
          },
        })
      }
    >
      <Card className="flex items-start justify-between px-3 py-2 bg-secondary rounded-lg mb-2">
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
            {product.serving === "gram"
              ? "g"
              : product.serving === "milliliter"
                ? "ml"
                : formatServing(
                    product.serving,
                    product.amount,
                    product.baseUnit,
                  )}
          </Text>
          <ClockFadingIcon className="text-primary w-4 h-4 ml-1" />
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
