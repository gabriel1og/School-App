import { Text, View, YStack } from "tamagui";

export default function NotasScreen() {
  return (
    <View flex={1} background="white" p="$4">
      <YStack gap="$4">
        <Text fontSize="$8" fontWeight="bold" color="#0960a7">
          Notas
        </Text>
        <Text fontSize="$5" color="#666">
          Visualização de notas dos alunos
        </Text>
      </YStack>
    </View>
  );
}
