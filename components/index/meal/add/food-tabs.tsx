import {
  Animated,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import React, { useState } from "react";
import {
  NavigationState,
  SceneRendererProps,
  TabDescriptor,
  TabView,
} from "react-native-tab-view";
import { RecentsList } from "~/components/index/meal/add/recents-list";
import { recentsQuery } from "~/db/queries/recentsQuery";
import { favoritesQuery } from "~/db/queries/favoritesQuery";
import { frequentsQuery } from "~/db/queries/frequentsQuery";
import { MealType } from "~/types/MealType";

type FoodTabsProps = {
  mealType: MealType;
  date: string;
};

export const FoodTabs = ({ mealType, date }: FoodTabsProps) => {
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
                className="text-base font-semibold text-primary"
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

  const renderScene = ({
    route,
  }: {
    route: { key: string; title: string };
  }) => {
    switch (route.key) {
      case "frequents":
        return (
          <RecentsList
            query={frequentsQuery()}
            mealType={mealType}
            date={date}
          />
        );
      case "recents":
        return (
          <RecentsList
            query={recentsQuery()}
            mealType={mealType}
            date={date}
            enableDateHeader={true}
          />
        );
      case "favorites":
        return (
          <RecentsList
            query={favoritesQuery()}
            mealType={mealType}
            date={date}
            enableAlphabetHeader={true}
          />
        );
      default:
        return null;
    }
  };

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
