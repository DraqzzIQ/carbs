import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";
import "@expo/metro-runtime";
import { registerWidgetTaskHandler } from "react-native-android-widget";
import { widgetTaskHandler } from "./components/widgets/widget-task-handler";

// https://docs.expo.dev/router/reference/troubleshooting/#expo_router_app_root-not-defined

// Must be exported or Fast Refresh won't update the context
export function App() {
  const ctx = require.context("./app");
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
registerWidgetTaskHandler(widgetTaskHandler);
