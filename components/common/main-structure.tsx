import { YStack } from "tamagui";
import FooterMenu from "./footer-menu";

interface MainStructureProps {
  children: React.ReactNode;
}

export default function MainStructure({ children }: MainStructureProps) {
  return (
    <YStack flex={1} height="100%" position="relative">
      <YStack bg="#bdbdd1" height="90%" p="$2">
        {children}
      </YStack>

      <FooterMenu />
    </YStack>
  );
}
