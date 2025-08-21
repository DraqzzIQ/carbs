import { View } from "react-native";
import { Skeleton } from "~/components/ui/skeleton";

export const ProductDetailsLoadingSkeleton = () => {
  return (
    <View className="items-center">
      <Skeleton className="h-8 w-full bg-muted" />
      <Skeleton className="mt-2 h-7 w-5/6 bg-muted" />
      <Skeleton className="mt-8 h-6 w-full bg-muted" />
      <Skeleton className="mt-2 h-16 w-full bg-muted" />
      <Skeleton className="mt-10 h-8 w-1/2 bg-muted" />
      <View className="w-full">
        {Array.from({ length: 20 }).map((_, i) => (
          <Skeleton
            key={i}
            className={`h-5 ${i % 5 === 0 ? "w-1/3" : "w-full"} mt-5 bg-muted`}
          />
        ))}
      </View>
    </View>
  );
};
