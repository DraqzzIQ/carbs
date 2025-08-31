import { useColorScheme as useNativewindColorScheme } from "nativewind";

export function useColorScheme() {
  const scheme = useNativewindColorScheme();

  return {
    colorScheme: scheme.colorScheme ?? "dark",
    isDarkColorScheme: scheme.colorScheme === "dark",
    setColorScheme: (value: "system" | "light" | "dark") =>
      scheme.setColorScheme(value),
    toggleColorScheme: () => scheme.toggleColorScheme(),
  };
}
