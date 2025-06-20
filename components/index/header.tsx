import { CalendarIcon, FlameIcon, SettingsIcon } from "lucide-nativewind";
import { TouchableOpacity, View } from "react-native";
import { Text } from "~/components/ui/text";
import { router } from "expo-router";
import { getStreakCount } from "~/utils/streak";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { desc } from "drizzle-orm";
import { streaks } from "~/db/schema";
import { db } from "~/db/client";
import { useEffect } from "react";

type HeaderProps = {
  date: string;
};

export const Header = ({ date }: HeaderProps) => {
  const { data: streakDays, error: queryError } = useLiveQuery(
    db.select().from(streaks).orderBy(desc(streaks.id)),
  );

  useEffect(() => {
    if (queryError) {
      console.error("Error fetching streaks:", queryError);
    }
  }, [queryError]);

  return (
    <View className="flex-row w-full items-center">
      <Text className="text-xl font-semibold">{date}</Text>
      <CalendarIcon className="text-primary ml-3" />
      <View className="grow" />
      <View className="flex-row mr-3 items-center">
        <FlameIcon className="text-primary" />
        <Text className="text-xl font-semibold text-primary">
          {getStreakCount(streakDays)}
        </Text>
      </View>
      <TouchableOpacity onPress={() => router.push("/settings")}>
        <View className="w-10 h-10 items-center justify-center">
          <SettingsIcon className="text-primary" />
        </View>
      </TouchableOpacity>
    </View>
  );
};
