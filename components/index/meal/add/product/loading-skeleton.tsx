import { View } from "react-native";
import { Skeleton } from "~/components/ui/skeleton";

export const ProductDetailsLoadingSkeleton = () => {
  return (
    <View className="items-center">
      <Skeleton className="h-8 w-full bg-muted" />
      <Skeleton className="h-7 w-5/6 bg-muted mt-2" />
      <Skeleton className="h-6 w-full bg-muted mt-8" />
      <Skeleton className="h-16 w-full bg-muted mt-2" />
      <Skeleton className="h-8 w-1/2 bg-muted mt-10" />
      <View className="w-full">
        {Array.from({ length: 20 }).map((_, i) => (
          <Skeleton
            key={i}
            className={`h-5 ${i % 5 === 0 ? "w-1/3" : "w-full"} bg-muted mt-5`}
          />
        ))}
      </View>
    </View>
  );
};
