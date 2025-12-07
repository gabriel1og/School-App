import { YStack } from "tamagui";
import FooterMenu from "./footer-menu";
import HeaderMenu from "./header-menu";

interface MainStructureProps {
  children: React.ReactNode;
}

export default function MainStructure({ children }: MainStructureProps) {
  return (
    <YStack flex={1} height="100%" position="relative">
      <HeaderMenu />

      <YStack bg="#bdbdd1" height="80%" p="$2">
        {children}
      </YStack>

      <FooterMenu />
    </YStack>
  );
}
