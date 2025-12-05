import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { defaultConfig } from "@tamagui/config/v4";
import { Slot } from "expo-router";
import "react-native-reanimated";
import { createTamagui, PortalProvider, TamaguiProvider } from "tamagui";

import { useColorScheme } from "@/hooks/use-color-scheme";

const config = createTamagui(defaultConfig);

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <TamaguiProvider config={config}>
      <PortalProvider shouldAddRootHost>
        <ThemeProvider
          value={colorScheme === "light" ? DarkTheme : DefaultTheme}
        >
          <Slot />
        </ThemeProvider>
      </PortalProvider>
    </TamaguiProvider>
  );
}
