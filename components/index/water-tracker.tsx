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
  LightSpeedInLeft,
  LightSpeedOutRight,
} from "react-native-reanimated";

type WaterTrackerProps = {
  date: string;
  fluidIntake: FluidIntake[];
};

export const WaterTracker = ({ date, fluidIntake }: WaterTrackerProps) => {
  const { fluidSizes } = useSettings();
  const unit = getVolumeUnitForLocale();

  const order: Array<keyof typeof fluidSizes> = [
    "xs",
    "s",
    "m",
    "l",
    "xl",
    "xxl",
  ];
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
      <Text className="font-semibold text-xl w-full mt-7">Water</Text>
      <Card className="w-full gap-3 p-4 pb-6 rounded-2xl mt-1">
        <View className="flex-row items-end">
          {order.map((k, i) => (
            <React.Fragment key={k}>
              <TouchableOpacity
                onPress={async () => {
                  await addFluidIntake(fluidSizes[k], date);
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
                entering={LightSpeedInLeft}
                exiting={LightSpeedOutRight}
              >
                <View className="flex-row items-center rounded-lg bg-card shadow-sm shadow-primary/40 p-2">
                  <GlassWaterIcon className="text-primary h-8 w-8" />
                  <Text className="text-primary ml-2">
                    {item.amount} {unit}
                  </Text>
                  <View className="flex-grow" />
                  <TouchableOpacity
                    onPress={async () => deleteFluidIntake(item.id)}
                  >
                    <TrashIcon className="text-primary h-8 w-8" />
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
