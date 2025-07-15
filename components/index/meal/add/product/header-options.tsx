import { DeleteIcon, EditIcon, HeartIcon } from "lucide-nativewind";
import { TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { addFavorite, getIsFavorite, removeFavorite } from "~/utils/querying";
import { ThreeDotMenu } from "~/components/index/meal/add/three-dot-menu";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { Text } from "~/components/ui/text";

type HeaderOptionProps = {
  foodId: string;
  servingQuantity: number;
  serving: string;
  amount: number;
  isCustom?: boolean;
};

export const HeaderOptions = ({
  foodId,
  servingQuantity,
  serving,
  amount,
  isCustom = false,
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

  return (
    <View className="flex-row">
      <TouchableOpacity onPress={onPress}>
        <HeartIcon
          className={`h-8 w-8 text-primary${isFavorite ? " fill-primary" : ""}`}
        />
      </TouchableOpacity>
      {isCustom ? (
        <ThreeDotMenu>
          <DropdownMenuItem onPress={() => {}}>
            <View className="flex-row">
              <EditIcon className="h-8 w-8 text-primary" />
              <Text className="text-primary">Edit</Text>
            </View>
          </DropdownMenuItem>
          <DropdownMenuItem onPress={() => {}}>
            <View className="flex-row">
              <DeleteIcon className="h-8 w-8 text-primary" />
              <Text className="text-primary">Delete</Text>
            </View>
          </DropdownMenuItem>
        </ThreeDotMenu>
      ) : null}
    </View>
  );
};
