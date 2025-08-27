import { Pressable, View } from "react-native";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { MoonStarIcon } from "lucide-nativewind";
import { SunIcon } from "lucide-nativewind";
import { useColorScheme } from "~/lib/useColorScheme";
import { cn } from "~/lib/utils";

export function ThemeToggle() {
  const { isDarkColorScheme, setColorScheme } = useColorScheme();

  function toggleColorScheme() {
    const newTheme = isDarkColorScheme ? "light" : "dark";
    setColorScheme(newTheme);
    setAndroidNavigationBar(newTheme).catch((e) => {
      console.log("Failed to set navigation bar color", e);
    });
  }

  return (
    <Pressable
      onPressIn={toggleColorScheme}
      className="web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2"
    >
      {({ pressed }) => (
        <View
          className={cn(
            "aspect-square h-10 w-10 flex-1 items-start justify-center pt-0.5 web:px-5",
            pressed && "opacity-70",
          )}
        >
          {isDarkColorScheme ? (
            <MoonStarIcon
              className="text-foreground"
              size={23}
              strokeWidth={1.25}
            />
          ) : (
            <SunIcon className="text-foreground" size={24} strokeWidth={1.25} />
          )}
        </View>
      )}
    </Pressable>
  );
}
