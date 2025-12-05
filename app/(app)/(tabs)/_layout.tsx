import MainStructure from "@/components/common/main-structure";
import { Slot } from "expo-router";
import { View } from "tamagui";

export default function TabsLayout() {
  return (
    <View flex={1} justify="flex-end" background={"white"}>
      <MainStructure>
        <Slot />
      </MainStructure>
    </View>
  );
}
