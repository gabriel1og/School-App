import { authService } from "@/src/services";
import { User } from "@/src/types/auth.types";
import { User as UserIcon } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Avatar, Text, XStack } from "tamagui";
import logo from "../../assets/images/logo.png";

export default function HeaderMenu() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    };
    loadUser();
  }, []);

  const handleNavigation = (route: any) => {
    router.push(route);
  };

  const getUserInitials = () => {
    if (!user?.name) return "GG";
    const nameParts = user.name.trim().split(" ");
    if (nameParts.length === 1) {
      return nameParts[0].substring(0, 2).toUpperCase();
    }
    return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
  };

  return (
    <XStack
      height="12.5%"
      items={"center"}
      justify={"space-between"}
      px="$2"
      borderTopWidth={2}
      borderTopColor="#f1f1f1"
      gap="$3"
    >
      <XStack items="center" gap="$3" p="$2" cursor="pointer">
        <Avatar circular bg={"#ffffff"} size="$10">
          <Avatar.Image src={logo} />
        </Avatar>
      </XStack>

      <XStack
        items="center"
        p="$2"
        onPress={() => handleNavigation("/(app)/(tabs)/my-account")}
        cursor="pointer"
      >
        <Avatar circular bg={"#e0e0e0"} size="$6">
          <UserIcon size="$1" />
          <Text fontWeight={"600"} fontSize={"$5"}>
            {getUserInitials()}
          </Text>
        </Avatar>
      </XStack>
    </XStack>
  );
}
