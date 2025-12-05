import { Text, View, YStack } from "tamagui";

export default function DisciplinasScreen() {
  return (
    <View flex={1} background="white" p="$4">
      <YStack gap="$4">
        <Text fontSize="$8" fontWeight="bold" color="#0960a7">
          Disciplinas
        </Text>
        <Text fontSize="$5" color="#666">
          Lista de disciplinas disponíveis
        </Text>
      </YStack>
    </View>
  );
}
