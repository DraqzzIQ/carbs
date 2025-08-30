import { FlameIcon, SettingsIcon } from "lucide-nativewind";
import { TouchableOpacity, View } from "react-native";
import { Text } from "~/components/ui/text";
import { router } from "expo-router";
import { getStreakCount } from "~/utils/streak";
import { useRelationalLiveQuery } from "~/db/queries/useRelationalLiveQuery";
import { desc } from "drizzle-orm";
import { streaks } from "~/db/schema";
import { db } from "~/db/client";
import { useEffect } from "react";

export const HeaderRight = () => {
  const { data: streakDays, error: queryError } = useRelationalLiveQuery(
    db.select().from(streaks).orderBy(desc(streaks.dateId)),
    [],
  );

  useEffect(() => {
    if (queryError) {
      console.error("Error fetching streaks:", queryError);
    }
  }, [queryError]);

  return (
    <>
      <View className="mr-3 flex-row items-center">
        <FlameIcon className="text-primary" />
        <Text className="text-xl font-semibold text-primary">
          {getStreakCount(streakDays)}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => router.navigate({ pathname: "/settings" })}
      >
        <View className="h-10 w-10 items-center justify-center">
          <SettingsIcon className="text-primary" />
        </View>
      </TouchableOpacity>
    </>
  );
};
