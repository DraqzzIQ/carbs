import { EditIcon, HeartIcon, TrashIcon } from "lucide-nativewind";
import { TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import {
  addFavorite,
  deleteCustomFood,
  getIsFavorite,
  removeFavorite,
} from "~/utils/querying";
import { ThreeDotMenu } from "~/components/index/meal/add/three-dot-menu";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { Text } from "~/components/ui/text";
import { router } from "expo-router";

type HeaderOptionProps = {
  foodId: string;
  servingQuantity: number;
  serving: string;
  amount: number;
  isCustom?: boolean;
  isDeleted?: boolean;
};

export const HeaderOptions = ({
  foodId,
  servingQuantity,
  serving,
  amount,
  isCustom = false,
  isDeleted = false,
}: HeaderOptionProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (foodId === "") {
      return;
    }
    (async () => {
      setIsFavorite(await getIsFavorite(foodId));
    })();
  }, [foodId]);

  const onPress = async () => {
    if (isFavorite) {
      await removeFavorite(foodId);
    } else {
      await addFavorite(foodId, servingQuantity, amount, serving);
    }
    setIsFavorite(!isFavorite);
  };

  if (isDeleted) {
    return null;
  }

  return (
    <View className="flex-row gap-5">
      <TouchableOpacity onPress={onPress}>
        <HeartIcon
          className={`h-8 w-8 text-primary${isFavorite ? " fill-primary" : ""}`}
        />
      </TouchableOpacity>
      {isCustom ? (
        <ThreeDotMenu>
          <DropdownMenuItem
            onPress={() => {
              router.navigate({
                pathname: "/meal/add/custom-food",
                params: {
                  edit: "true",
                  foodId: foodId,
                },
              });
            }}
          >
            <View className="flex-row gap-2">
              <EditIcon className="h-6 w-6 text-primary" />
              <Text className="text-primary text-base">Edit product</Text>
            </View>
          </DropdownMenuItem>
          <DropdownMenuItem
            onPress={async () => {
              await deleteCustomFood(foodId);
              router.dismiss();
            }}
          >
            <View className="flex-row gap-2">
              <TrashIcon className="h-6 w-6 text-red-500" />
              <Text className="text-red-500 text-base">Delete product</Text>
            </View>
          </DropdownMenuItem>
        </ThreeDotMenu>
      ) : null}
    </View>
  );
};
