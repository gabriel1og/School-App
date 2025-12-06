import MainStructure from "@/components/common/main-structure";
import { Redirect, Slot } from "expo-router";
import { View } from "tamagui";
import { useAuth } from "@/src/hooks/useAuth";

export default function TabsLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (!loading && !isAuthenticated) {
    return <Redirect href="/auth/sign-in" />;
  }

  return (
    <View flex={1} justify="flex-end" background={"white"}>
      <MainStructure>
        <Slot />
      </MainStructure>
    </View>
  );
}
