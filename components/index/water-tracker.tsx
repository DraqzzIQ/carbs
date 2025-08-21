import React from "react";
import { Text } from "~/components/ui/text";
import { FluidIntake } from "~/db/schema";
import { Card } from "~/components/ui/card";
import { TouchableOpacity, View } from "react-native";
import { GlassWaterIcon, TrashIcon } from "lucide-nativewind";
import { useSettings } from "~/contexts/AppSettingsContext";
import { getVolumeUnitForLocale } from "~/utils/formatting";
import { addFluidIntake, deleteFluidIntake } from "~/utils/querying";
import { Separator } from "~/components/ui/separator";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";

interface WaterTrackerProps {
  dateId: string;
  fluidIntake: FluidIntake[];
}

export const WaterTracker = ({ dateId, fluidIntake }: WaterTrackerProps) => {
  const { fluidSizes } = useSettings();
  const unit = getVolumeUnitForLocale();

  const order: (keyof typeof fluidSizes)[] = ["xs", "s", "m", "l", "xl", "xxl"];
  const sizeClasses: Record<keyof typeof fluidSizes, string> = {
    xs: "w-6 h-6",
    s: "w-7 h-7",
    m: "w-8 h-8",
    l: "w-9 h-9",
    xl: "w-10 h-10",
    xxl: "w-11 h-11",
  };

  return (
    <>
      <Text className="mt-7 w-full text-xl font-semibold">Water</Text>
      <Card className="mt-1 w-full gap-3 rounded-2xl p-4 pb-6">
        <View className="flex-row items-end">
          {order.map((k, i) => (
            <React.Fragment key={k}>
              <TouchableOpacity
                onPress={async () => {
                  await addFluidIntake(fluidSizes[k], dateId);
                }}
                className="items-center"
              >
                <GlassWaterIcon className={`text-primary ${sizeClasses[k]}`} />
                <Text>
                  {fluidSizes[k]} {unit}
                </Text>
              </TouchableOpacity>
              {i < order.length - 1 && <View className="flex-grow" />}
            </React.Fragment>
          ))}
        </View>
        {fluidIntake.length > 0 && (
          <>
            <Separator />
            {fluidIntake.map((item) => (
              <Animated.View
                key={item.id}
                layout={LinearTransition}
                entering={FadeIn}
                exiting={FadeOut}
              >
                <View className="flex-row items-center rounded-lg bg-card p-2 shadow-sm shadow-primary/40">
                  <GlassWaterIcon className="h-8 w-8 text-primary" />
                  <Text className="ml-2 text-primary">
                    {item.amount} {unit}
                  </Text>
                  <View className="flex-grow" />
                  <TouchableOpacity
                    onPress={async () => deleteFluidIntake(item.id)}
                  >
                    <TrashIcon className="h-8 w-8 text-primary" />
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ))}
          </>
        )}
      </Card>
    </>
  );
};
