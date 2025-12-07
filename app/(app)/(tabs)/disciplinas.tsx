import { subjectService } from "@/src/services/subject.service";
import { CreateSubjectData, Subject } from "@/src/types/subject.types";
import { useEffect, useState } from "react";
import {
  Button,
  Input,
  ScrollView,
  Sheet,
  Text,
  View,
  XStack,
  YStack,
} from "tamagui";

export default function DisciplinasScreen() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Campos do formulário
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [numberOfGrades, setNumberOfGrades] = useState("1");
  const [passingAverage, setPassingAverage] = useState("60");
  const [recoveryAverage, setRecoveryAverage] = useState("50");
  const [teacherId, setTeacherId] = useState("");

  // editar
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const handleEdit = (subj: Subject) => {
    setEditingSubjectId(subj.id);
    setName(subj.name);
    setCode(subj.code);
    setNumberOfGrades(String(subj.number_of_grades));
    setPassingAverage(String(subj.passing_average));
    setRecoveryAverage(String(subj.recovery_average));
    setTeacherId(subj.teacher_id);
    setOpen(true);
  };


  // Estados para Alert customizado
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertButtons, setAlertButtons] = useState<{text: string, onPress?: () => void, style?: string}[]>([]);

  const showAlert = (title: string, message: string, buttons?: {text: string, onPress?: () => void, style?: string}[]) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertButtons(buttons || [{text: 'OK', onPress: () => setAlertVisible(false)}]);
    setAlertVisible(true);
  };

  // Carregar disciplinas ao abrir tela
  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const data = await subjectService.getAll();
      setSubjects(data);
    } catch (error) {
      console.error("Erro ao buscar disciplinas:", error);
    }
  };

  const saveSubject = async () => {
    if (!name.trim() || !code.trim() || !teacherId.trim()) {
      console.warn("Preencha os campos obrigatórios!");
      return;
    }

    const payload: CreateSubjectData = {
      name,
      code,
      number_of_grades: Number(numberOfGrades),
      passing_average: Number(passingAverage),
      recovery_average: Number(recoveryAverage),
      teacher_id: teacherId,
    };

    try {
      setLoading(true);

      if (editingSubjectId) {
        await subjectService.update(editingSubjectId, payload);
        showAlert("Sucesso", "Disciplina atualizada com sucesso!");
      } else {
        showAlert("Sucesso", "Disciplina criada com sucesso!");
        await subjectService.create(payload);
      }

      setOpen(false);
      setEditingSubjectId(null);

      // Resetando campos
      setName("");
      setCode("");
      setNumberOfGrades("");
      setPassingAverage("");
      setRecoveryAverage("");
      setTeacherId("");

      await loadSubjects();
    } catch (error: any) {
      console.error('Erro em disciplinas:', error);

      const errorMessage = error.response?.data?.errors 
        ? error.response.data.errors.join('\n')
        : error.response?.data?.error || 'Erro ao criar/atualizar disciplina';

      if (error.response?.data?.errors) {
        showAlert('Erro em Disciplina', errorMessage);
      } else {
        showAlert('Erro em Disciplina', errorMessage);
      }
    }finally{
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    showAlert(
      "Confirmação",
      "Tem certeza que deseja deletar esta disciplina?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          onPress: async () => {
            try {
              await subjectService.delete(id);
              await loadSubjects();
            } catch (error) {
              console.error("Erro ao deletar disciplina:", error);
              showAlert("Erro", "Não foi possível deletar a disciplina.");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <View flex={1} background="white" p="$4">
      <YStack gap="$4">
        {/* Título */}
        <Text fontSize="$8" fontWeight="bold" color="#0960a7">
          Disciplinas
        </Text>
        <Text fontSize="$5" color="#666">
          Lista de disciplinas disponíveis
        </Text>

        {/* Botão */}
        <Button
          onPress={() => setOpen(true)}
          backgroundColor="#0960a7"
          color="white"
          borderRadius="$4"
        >
          + Nova disciplina
        </Button>

        {/* Lista */}
        <ScrollView>
          {subjects.map((subj) => (
            <YStack
              key={subj.id}
              p="$3"
              mb="$2"
              backgroundColor="#f3f3f3"
              borderRadius="$3"
            >
              <Text fontSize="$6" fontWeight="bold">{subj.name}</Text>
              <Text color="#666">{subj.code}</Text>
              <Text color="#555">
                Notas: {subj.number_of_grades} | Média: {subj.passing_average}
              </Text>

              <XStack mt="$2" gap="$2">
                <Button
                  backgroundColor="#f59e0b"
                  onPress={() => handleEdit(subj)}
                >
                  Editar
                </Button>

                <Button
                  backgroundColor="#dc2626"
                  onPress={() => handleDelete(subj.id)}
                >
                  Deletar
                </Button>
              </XStack>
            </YStack>
          ))}
        </ScrollView>
      </YStack>

      {/* Modal */}
      <Sheet
        forceRemoveScrollEnabled
        open={open}
        onOpenChange={setOpen}
        snapPoints={[100]}
        animation="medium"
      >
        <Sheet.Overlay disableTap/>
        <Sheet.Frame p="$4" backgroundColor="white">
          <YStack gap="$3">
            <Text fontSize="$7" fontWeight="bold">
              Nova Disciplina
            </Text>

            <Input placeholder="Nome" value={name} onChangeText={setName} />

            <Input placeholder="Código" value={code} onChangeText={setCode} />

            <Input
              placeholder="Quantidade de notas"
              keyboardType="numeric"
              value={numberOfGrades}
              onChangeText={setNumberOfGrades}
            />

            <Input
              placeholder="Média para passar"
              keyboardType="numeric"
              value={passingAverage}
              onChangeText={setPassingAverage}
            />

            <Input
              placeholder="Média de recuperação"
              keyboardType="numeric"
              value={recoveryAverage}
              onChangeText={setRecoveryAverage}
            />

            <Input
              placeholder="ID do professor"
              value={teacherId}
              onChangeText={setTeacherId}
            />

            <XStack justifyContent="flex-end" gap="$3" mt="$2">
              <Button backgroundColor="#ccc" onPress={() => setOpen(false)}>
                Cancelar
              </Button>

              <Button backgroundColor="#0960a7" color="white" onPress={saveSubject}>
                Salvar
              </Button>
            </XStack>
          </YStack>
        </Sheet.Frame>
      </Sheet>
      
      {/* ALERT CUSTOMIZADO */}
      {alertVisible && (
        <View
          position="absolute"
          top={40}
          left={20}
          right={20}
          padding="$4"
          backgroundColor="#fee2e2"
          borderRadius="$4"
          borderWidth={1}
          borderColor="#fca5a5"
          zIndex={999999}
          elevation={20}
          pointerEvents="auto"
        >
          <Text fontSize="$6" fontWeight="bold" color="#b91c1c">
            {alertTitle}
          </Text>

          <Text mt="$2" color="#7f1d1d">
            {alertMessage}
          </Text>

          <XStack justifyContent="flex-end" mt="$3">
            {alertButtons.map((btn, index) => (
              <Button
                key={index}
                onPress={() => {
                  btn.onPress?.();
                  setAlertVisible(false);
                }}
                ml="$2"
                backgroundColor="#b91c1c"
                color="white"
              >
                {btn.text}
              </Button>
            ))}
          </XStack>
        </View>
      )}
    </View>
  );
}
