import { Text } from "~/components/ui/text";
import {
  Animated,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import React, { useState } from "react";
import {
  NavigationState,
  SceneMap,
  SceneRendererProps,
  TabDescriptor,
  TabView,
} from "react-native-tab-view";

type FoodTabsProps = {};

export const FoodTabs = ({}: FoodTabsProps) => {
  const [index, setIndex] = useState(0);
  const routes = [
    { key: "frequents", title: "Frequent" },
    { key: "recents", title: "Recent" },
    { key: "favorites", title: "Favorites" },
  ];

  const renderTabBar = (
    props: SceneRendererProps & {
      navigationState: NavigationState<(typeof routes)[number]>;
      options:
        | Record<string, TabDescriptor<(typeof routes)[number]>>
        | undefined;
    },
  ) => {
    const inputRange = props.navigationState.routes.map((_, i) => i);
    return (
      <View className="flex-row bg-secondary border-b border-border">
        {props.navigationState.routes.map((route, i) => {
          const opacity = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map((inputIndex) =>
              inputIndex === i ? 1 : 0.5,
            ),
          });
          return (
            <TouchableOpacity
              key={route.key}
              className={`flex-1 items-center p-2`}
              onPress={() => setIndex(i)}
            >
              <Animated.Text
                className="text-base font-semibold"
                style={{ opacity }}
              >
                {route.title}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderScene = SceneMap({
    frequents: FrequentsRoute,
    recents: RecentsRoute,
    favorites: FavoritesRoute,
  });

  const layout = useWindowDimensions();
  return (
    <TabView
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      initialLayout={{ width: layout.width }}
      className="h-full"
    />
  );
};

const FrequentsRoute = () => {
  return (
    <View className="flex-1 h-20 w-20 bg-red-400">
      <Text className="text-lg font-semibold text-primary">Frequent Foods</Text>
      {/* Render frequent foods here */}
    </View>
  );
};

const RecentsRoute = () => {
  return (
    <View className="flex-1 bg-amber-300">
      <Text className="text-lg font-semibold text-primary">Recent Foods</Text>
      {/* Render recent foods here */}
    </View>
  );
};

const FavoritesRoute = () => {
  return (
    <View className="flex-1">
      <Text className="text-lg font-semibold text-primary">Favorite Foods</Text>
      {/* Render favorite foods here */}
    </View>
  );
};
