import { CalendarIcon, FlameIcon, SettingsIcon } from "lucide-nativewind";
import { TouchableOpacity, View } from "react-native";
import { Text } from "~/components/ui/text";
import { router } from "expo-router";
import { getStreakCount } from "~/utils/streak";
import { useRelationalLiveQuery } from "~/db/queries/useRelationalLiveQuery";
import { desc } from "drizzle-orm";
import { streaks } from "~/db/schema";
import { db } from "~/db/client";
import { useEffect } from "react";

interface HeaderProps {
  dateSlug: string;
  dateId: string;
}

export const Header = ({ dateSlug, dateId }: HeaderProps) => {
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
    <View className="w-full flex-row items-center">
      <Text className="text-xl font-semibold">{dateSlug}</Text>
      <TouchableOpacity
        onPress={() =>
          router.navigate({ pathname: "/calendar", params: { dateId: dateId } })
        }
      >
        <CalendarIcon className="ml-3 text-primary" />
      </TouchableOpacity>
      <View className="grow" />
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
    </View>
  );
};
