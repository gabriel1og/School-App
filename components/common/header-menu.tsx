import logo from "@/assets/images/logo.png";
import { authService } from "@/src/services";
import { User } from "@/src/types/auth.types";
import { User as UserIcon } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Avatar, Text, XStack } from "tamagui";

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
      bg="#003866"
      borderBottomWidth={4}
      borderBottomColor="#8c8c8c1b"
      style={{
        boxShadow: " #8c8c8c1b 0px -10px 15px",
      }}
    >
      <XStack
        items="center"
        p="$2"
        cursor="pointer"
        onPress={() => handleNavigation("/(app)/(tabs)/")}
      >
        <Avatar circular size="$10">
          <Avatar.Image src={logo} />
        </Avatar>
      </XStack>

      <XStack items="center" p="$3" cursor="pointer">
        <Avatar circular bg={"#fff"} size="$5">
          <UserIcon size="$1" color={"#003866"} />
          <Text fontWeight={"600"} fontSize={"$4"} color={"#003866"}>
            {getUserInitials()}
          </Text>
        </Avatar>
      </XStack>
    </XStack>
  );
}
