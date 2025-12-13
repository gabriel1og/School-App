import { subjectService } from "@/src/services/subject.service";
import { teacherService } from "@/src/services/teacher.service";
import { CreateSubjectData, Subject } from "@/src/types/subject.types";
import type { Teacher } from "@/src/types/teacher.types";
import { useAuth } from "@/src/hooks/useAuth";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
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
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const isAdmin = user?.user_type === 'admin';
  const isTeacher = user?.user_type === 'teacher';

  // Campos do formulário
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [numberOfGrades, setNumberOfGrades] = useState("");
  const [passingAverage, setPassingAverage] = useState("");
  const [recoveryAverage, setRecoveryAverage] = useState("");
  const [teacherId, setTeacherId] = useState("");

  // Lista de professores (para admin)
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [teachersMessage, setTeachersMessage] = useState<string | null>(null);
  const [isTeacherListOpen, setIsTeacherListOpen] = useState(false);

  // editar
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setEditingSubjectId(null);
    setName("");
    setCode("");
    setNumberOfGrades("");
    setPassingAverage("");
    setRecoveryAverage("");
    setTeacherId("");
    setIsTeacherListOpen(false);
    setErrors({});
  };

  const handleEdit = (subj: Subject) => {
    setEditingSubjectId(subj.id);
    setName(subj.name);
    setCode(subj.code);
    setNumberOfGrades(String(subj.number_of_grades));
    setPassingAverage(String(subj.passing_average));
    setRecoveryAverage(String(subj.recovery_average));
    setTeacherId(subj.teacher_id);
    setErrors({});
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

  // Carregar professores quando admin abrir o modal
  useEffect(() => {
    const loadTeachers = async () => {
      try {
        setLoadingTeachers(true);
        setTeachersMessage(null);
        const data = await teacherService.getAll();
        setTeachers(data);
        setTeachersMessage(data.length === 0 ? 'Nenhum professor encontrado.' : null);
      } catch (e) {
        console.error('Erro ao carregar professores:', e);
        setTeachersMessage('Não foi possível carregar professores.');
      } finally {
        setLoadingTeachers(false);
      }
    };
    if (open && isAdmin) {
      loadTeachers();
    }
  }, [open, isAdmin]);

  const loadSubjects = async () => {
    try {
      const data = await subjectService.getAll();
      setSubjects(data);
    } catch (error) {
      console.error("Erro ao buscar disciplinas:", error);
    }
  };

  const saveSubject = async () => {
    // validação
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Nome é obrigatório";
    if (!code.trim()) newErrors.code = "Código é obrigatório";
    if (!numberOfGrades.trim()) newErrors.numberOfGrades = "Quantidade de notas é obrigatória";
    if (!passingAverage.trim()) newErrors.passingAverage = "Média para passar é obrigatória";
    if (!recoveryAverage.trim()) newErrors.recoveryAverage = "Média de recuperação é obrigatória";
    // Se for admin, precisa selecionar um professor
    if (isAdmin && !teacherId.trim()) newErrors.teacherId = "Professor é obrigatório";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // teacher_id: se for professor logado, usa o próprio id; se admin, usa o selecionado
    const teacherIdForPayload = isTeacher ? (user?.id || "") : teacherId;

    const payload: CreateSubjectData = {
      name,
      code,
      number_of_grades: Number(numberOfGrades),
      passing_average: Number(passingAverage),
      recovery_average: Number(recoveryAverage),
      teacher_id: teacherIdForPayload,
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
      resetForm();

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
      <XStack justify="space-between" items="center" mb="$4">
        <Text fontSize="$8" fontWeight="bold" color="#0960a7">Disciplinas</Text>
        <Button onPress={() => { resetForm(); setOpen(true); }}>Nova</Button>
      </XStack>

      {/* Lista */}
      <ScrollView>
        <YStack gap="$3">
          {subjects.map((subj) => (
            <YStack
              key={subj.id}
              p="$3"
              background="#fff"
              borderWidth={1}
              borderColor="#F3F4F6"
              style={{ borderRadius: 12 }}
              shadowColor="#000"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.05}
              shadowRadius={8}
            >
              <Text fontSize="$6" fontWeight="700" color="#111827">{subj.name}</Text>
              <Text color="#6B7280">{subj.code}</Text>
              <Text color="#6B7280">Notas: {subj.number_of_grades} · Média: {subj.passing_average}</Text>

              <XStack mt="$2" gap="$2">
                <Button theme="alt1" onPress={() => handleEdit(subj)}>
                  Editar
                </Button>
                <Button theme="red" onPress={() => handleDelete(subj.id)}>
                  Deletar
                </Button>
              </XStack>
            </YStack>
          ))}
          {subjects.length === 0 && (
            <Text color="#6B7280">Nenhuma disciplina encontrada.</Text>
          )}
        </YStack>
      </ScrollView>

      {/* Modal */}
      <Sheet modal open={open} onOpenChange={(val) => { setOpen(val); if (!val) resetForm(); }} snapPoints={[85]}>
        <Sheet.Frame p="$4" background="#fff">
          <YStack gap="$3">
            <Text fontSize="$7" fontWeight="700">
              {editingSubjectId ? 'Editar Disciplina' : 'Cadastro de Disciplina'}
            </Text>

            <Input placeholder="Nome" value={name} onChangeText={(v) => { setName(v); if (errors.name) setErrors(prev => ({...prev, name: ''})); }} />
            {errors.name ? (
              <Text color="#b91c1c" fontSize="$3">{errors.name}</Text>
            ) : null}

            <Input placeholder="Código" value={code} onChangeText={(v) => { setCode(v); if (errors.code) setErrors(prev => ({...prev, code: ''})); }} />
            {errors.code ? (
              <Text color="#b91c1c" fontSize="$3">{errors.code}</Text>
            ) : null}

            <Input
              placeholder="Quantidade de notas"
              keyboardType="numeric"
              value={numberOfGrades}
              onChangeText={(v) => { setNumberOfGrades(v); if (errors.numberOfGrades) setErrors(prev => ({...prev, numberOfGrades: ''})); }}
            />
            {errors.numberOfGrades ? (
              <Text color="#b91c1c" fontSize="$3">{errors.numberOfGrades}</Text>
            ) : null}

            <Input
              placeholder="Média para passar"
              keyboardType="numeric"
              value={passingAverage}
              onChangeText={(v) => { setPassingAverage(v); if (errors.passingAverage) setErrors(prev => ({...prev, passingAverage: ''})); }}
            />
            {errors.passingAverage ? (
              <Text color="#b91c1c" fontSize="$3">{errors.passingAverage}</Text>
            ) : null}

            <Input
              placeholder="Média de recuperação"
              keyboardType="numeric"
              value={recoveryAverage}
              onChangeText={(v) => { setRecoveryAverage(v); if (errors.recoveryAverage) setErrors(prev => ({...prev, recoveryAverage: ''})); }}
            />
            {errors.recoveryAverage ? (
              <Text color="#b91c1c" fontSize="$3">{errors.recoveryAverage}</Text>
            ) : null}

            {/* Seleção de professor apenas para ADMIN (Dropdown) */}
            {isAdmin && (
              <YStack gap="$2">
                <Text fontWeight="700">Professor:</Text>
                <YStack borderWidth={1} borderColor="#E5E7EB" borderRadius={8}>
                  <TouchableOpacity
                    onPress={() => {
                      if (!loadingTeachers && !teachersMessage && teachers.length > 0) {
                        setIsTeacherListOpen((o) => !o);
                      }
                    }}
                    style={{ padding: 12, backgroundColor: '#f9fafb', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    <Text color="#6b7280">
                      {loadingTeachers
                        ? 'Carregando professores...'
                        : (teacherId
                            ? (teachers.find((t) => t.id === teacherId)?.name || 'Selecione um professor')
                            : (teachersMessage ?? 'Selecione um professor'))}
                    </Text>
                    <Text color="#9ca3af">{isTeacherListOpen ? '▲' : '▼'}</Text>
                  </TouchableOpacity>
                  {!loadingTeachers && !teachersMessage && teachers.length > 0 && isTeacherListOpen ? (
                    <ScrollView style={{ maxHeight: 200 }}>
                      {teachers.map((t) => (
                        <TouchableOpacity
                          key={t.id}
                          onPress={() => {
                            setTeacherId(t.id);
                            if (errors.teacherId) setErrors((prev) => ({ ...prev, teacherId: '' }));
                            setIsTeacherListOpen(false);
                          }}
                          style={{ padding: 12, backgroundColor: teacherId === t.id ? '#eef2ff' : 'white' }}
                        >
                          <Text>{t.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  ) : null}
                </YStack>
                {errors.teacherId ? (
                  <Text color="#b91c1c" fontSize="$3">{errors.teacherId}</Text>
                ) : null}
              </YStack>
            )}

            <XStack gap="$2" mt="$2">
              <Button flex={1} theme="alt1" onPress={() => setOpen(false)} disabled={loading}>
                Cancelar
              </Button>
              <Button flex={1} onPress={saveSubject} disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
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
