import { BookOpen, ChartColumn, Users, GraduationCap } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { Heading, Text, View, XStack, YStack } from "tamagui";
import { useAuth } from "@/src/hooks/useAuth";

interface QuickActionItem {
  id: string;
  label: string;
  icon: any;
  iconColor: string;
  bgColor: string;
  route: string;
}

const quickActions: QuickActionItem[] = [
  {
    id: "students",
    label: "Alunos",
    icon: Users,
    iconColor: "white",
    bgColor: "#3B82F6",
    route: "/(app)/(tabs)/alunos",
  },
  {
    id: "subjects",
    label: "Disciplinas",
    icon: BookOpen,
    iconColor: "white",
    bgColor: "#10B981",
    route: "/(app)/(tabs)/disciplinas",
  },
  {
    id: "teachers",
    label: "Professores",
    icon: GraduationCap,
    iconColor: "white",
    bgColor: "#8B5CF6",
    route: "/(app)/(tabs)/professores",
  },
  {
    id: "grades",
    label: "Notas",
    icon: ChartColumn,
    iconColor: "white",
    bgColor: "#F97316",
    route: "/(app)/(tabs)/notas",
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const handleActionPress = (route: any) => {
    router.push(route);
  };

  return (
    <View flex={1} background="white" p="$4">
      <XStack justify="space-between" items="center" mb="$4">
        <Heading size="$7" fontWeight="700">
          Home
        </Heading>
      </XStack>

      <XStack flexWrap="wrap" gap="$3" justify="space-between">
        {(user?.user_type === 'admin' ? quickActions : quickActions.filter(a => a.id !== 'teachers')).map((action) => {
          const Icon = action.icon;
          return (
            <YStack
              key={action.id}
              width="48%"
              background="white"
              p="$4"
              items="center"
              justify="center"
              gap="$3"
              cursor="pointer"
              onPress={() => handleActionPress(action.route)}
              shadowColor="#000"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.05}
              shadowRadius={8}
              elevation={2}
              borderWidth={1}
              borderColor="#F3F4F6"
              hoverStyle={{
                shadowOpacity: 0.1,
                shadowRadius: 12,
                transform: [{ scale: 0.98 }],
              }}
              pressStyle={{
                transform: [{ scale: 0.95 }],
              }}
              style={{
                borderRadius: 16,
              }}
            >
              <View
                background={action.bgColor}
                width={64}
                height={64}
                items="center"
                justify="center"
                style={{
                  borderRadius: 16,
                }}
              >
                <Icon size={32} color={action.iconColor} />
              </View>
              <Text fontSize="$5" fontWeight="600" color="#1F2937">
                {action.label}
              </Text>
            </YStack>
          );
        })}
      </XStack>
    </View>
  );
}
