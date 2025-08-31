import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { formatNumber } from "~/utils/formatting";
import { Card } from "~/components/ui/card";

interface MacroHeaderProps {
  energy: number;
  carbs: number;
  protein: number;
  fat: number;
}

export const MacroHeader = ({
  energy,
  carbs,
  protein,
  fat,
}: MacroHeaderProps) => {
  return (
    <Card className="m-1 border-2 border-foreground bg-secondary p-2">
      <View className="flex-row justify-between">
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
