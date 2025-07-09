import { HeartIcon } from "lucide-nativewind";
import { TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { addFavorite, getIsFavorite, removeFavorite } from "~/utils/querying";

type FavoriteIndicatorProps = {
  foodId: string;
  servingQuantity: number;
  serving: string;
  amount: number;
};

export const FavoriteIndicator = ({
  foodId,
  servingQuantity,
  serving,
  amount,
}: FavoriteIndicatorProps) => {
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
    <TouchableOpacity onPress={onPress}>
      <HeartIcon
        className={`h-8 w-8 text-primary${isFavorite ? " fill-primary" : ""}`}
      />
    </TouchableOpacity>
  );
};
