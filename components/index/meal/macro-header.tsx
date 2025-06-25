import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { formatNumber } from "~/utils/formatting";
import { Card } from "~/components/ui/card";

type MacroHeaderProps = {
  energy: number;
  carbs: number;
  protein: number;
  fat: number;
};

export const MacroHeader = ({
  energy,
  carbs,
  protein,
  fat,
}: MacroHeaderProps) => {
  return (
    <Card className="p-2 mb-1 bg-secondary border-2 border-foreground flex-1">
      <View className="flex-1 flex-row justify-between">
        <View className="items-center">
          <Text className="font-semibold">{formatNumber(energy)} kcal</Text>
          <Text className="text-xs">Calories</Text>
        </View>
        <View className="items-center">
          <Text className="font-semibold">{formatNumber(carbs, 1)} g</Text>
          <Text className="text-xs">Carbs</Text>
        </View>
        <View className="items-center">
          <Text className="font-semibold">{formatNumber(protein, 1)} g</Text>
          <Text className="text-xs">Protein</Text>
        </View>
        <View className="items-center">
          <Text className="font-semibold">{formatNumber(fat, 1)} g</Text>
          <Text className="text-xs">Fat</Text>
        </View>
      </View>
    </Card>
  );
};
