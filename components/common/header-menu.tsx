import { GraduationCap } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { Avatar, Text, XStack } from "tamagui";

export default function HeaderMenu() {
  const router = useRouter();

  const handleNavigation = (route: any) => {
    router.push(route);
  };

  return (
    <XStack
      height="10%"
      items={"center"}
      justify={"space-between"}
      px="$2"
      borderTopWidth={2}
      borderTopColor="#f1f1f1"
      gap="$3"
    >
      <XStack items="center" gap="$3" p="$2" cursor="pointer">
        <Avatar circular bg={"#074b83"} size="$5">
          <GraduationCap size="$2.5" color={"#fff"} />
        </Avatar>
        <Text fontWeight={600} fontSize={"$8"}>
          Escola PUC Minas
        </Text>
      </XStack>

      <XStack
        items="center"
        p="$2"
        onPress={() => handleNavigation("/(app)/(tabs)/my-account")}
        cursor="pointer"
      >
        <Avatar circular bg={"#e0e0e0"} size="$5">
          <Text fontWeight={"700"} fontSize={"$5"}>
            GG
          </Text>
        </Avatar>
      </XStack>
    </XStack>
  );
}
