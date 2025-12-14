import { gradeService } from "@/src/services/grade.service";
import { studentService } from "@/src/services/student.service";
import { subjectService } from "@/src/services/subject.service";
import { CreateGradeData, Grade } from "@/src/types/grade.types";
import { Student } from "@/src/types/student.types";
import { Subject } from "@/src/types/subject.types";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Button, Spinner, Text, View, XStack } from "tamagui";

type FilterType = "all" | "student" | "subject";

export default function NotasScreen() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [filterType, setFilterType] = useState<FilterType>("all");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");

  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addScoreModalVisible, setAddScoreModalVisible] = useState(false);
  const [editAllScoresModalVisible, setEditAllScoresModalVisible] =
    useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentGrade, setCurrentGrade] = useState<Grade | null>(null);
  const [editAllScoresData, setEditAllScoresData] = useState<number[]>([]);

  const [formData, setFormData] = useState<CreateGradeData>({
    student_id: "",
    subject_id: "",
    scores: [],
  });
  const [scoreInput, setScoreInput] = useState("");
  const [editScoreIndex, setEditScoreIndex] = useState<number | null>(null);
  const [editScoreValue, setEditScoreValue] = useState("");
  const [addScoreValue, setAddScoreValue] = useState("");

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (filterType === "student" && selectedStudentId) {
      loadGrades();
    } else if (filterType === "subject" && selectedSubjectId) {
      loadGrades();
    } else if (filterType === "all") {
      loadGrades();
    }
  }, [filterType, selectedStudentId, selectedSubjectId]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [gradesData, studentsData, subjectsData] = await Promise.all([
        gradeService.getAll(),
        studentService.getAll(),
        subjectService.getAll(),
      ]);
      setGrades(gradesData);
      setStudents(studentsData);
      setSubjects(subjectsData);
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const loadGrades = async () => {
    setRefreshing(true);
    try {
      let gradesData: Grade[];
      if (filterType === "student" && selectedStudentId) {
        gradesData = await gradeService.getAll({
          student_id: selectedStudentId,
        });
      } else if (filterType === "subject" && selectedSubjectId) {
        gradesData = await gradeService.getAll({
          subject_id: selectedSubjectId,
        });
      } else {
        gradesData = await gradeService.getAll();
      }
      setGrades(gradesData);
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao carregar notas");
    } finally {
      setRefreshing(false);
    }
  };

  const handleCreateGrade = async () => {
    if (!formData.student_id || !formData.subject_id) {
      Alert.alert("Atenção", "Selecione um aluno e uma disciplina");
      return;
    }
    if (formData.scores.length === 0) {
      Alert.alert("Atenção", "Adicione pelo menos uma nota");
      return;
    }

    try {
      setLoading(true);
      await gradeService.create(formData);
      Alert.alert("Sucesso", "Nota criada com sucesso!");
      setModalVisible(false);
      resetForm();
      loadGrades();
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao criar nota");
    } finally {
      setLoading(false);
    }
  };

  const handleAddScore = () => {
    const score = parseFloat(scoreInput);
    if (isNaN(score) || score < 0 || score > 10) {
      Alert.alert("Atenção", "Digite uma nota válida entre 0 e 10");
      return;
    }
    setFormData({
      ...formData,
      scores: [...formData.scores, score],
    });
    setScoreInput("");
  };

  const handleRemoveScore = (index: number) => {
    setFormData({
      ...formData,
      scores: formData.scores.filter((_, i) => i !== index),
    });
  };

  const handleEditScore = async () => {
    if (!currentGrade || editScoreIndex === null) return;

    const score = parseFloat(editScoreValue);
    if (isNaN(score) || score < 0 || score > 10) {
      Alert.alert("Atenção", "Digite uma nota válida entre 0 e 10");
      return;
    }

    try {
      setLoading(true);
      await gradeService.updateScore(currentGrade.id, {
        score_index: editScoreIndex,
        update_score: score,
      });
      Alert.alert("Sucesso", "Nota atualizada com sucesso!");
      setEditModalVisible(false);
      setEditScoreIndex(null);
      setEditScoreValue("");
      loadGrades();
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao atualizar nota");
    } finally {
      setLoading(false);
    }
  };

  const handleAddScoreToGrade = (grade: Grade) => {
    setCurrentGrade(grade);
    setAddScoreValue("");
    setAddScoreModalVisible(true);
  };

  const confirmAddScore = async () => {
    if (!currentGrade) return;

    const score = parseFloat(addScoreValue);
    if (isNaN(score) || score < 0 || score > 10) {
      Alert.alert("Atenção", "Digite uma nota válida entre 0 e 10");
      return;
    }

    try {
      setLoading(true);
      await gradeService.addScore(currentGrade.id, { add_score: score });
      Alert.alert("Sucesso", "Nota adicionada com sucesso!");
      setAddScoreModalVisible(false);
      setAddScoreValue("");
      setCurrentGrade(null);
      loadGrades();
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao adicionar nota");
    } finally {
      setLoading(false);
    }
  };

  const openEditAllScoresModal = (grade: Grade) => {
    setCurrentGrade(grade);
    setEditAllScoresData([...grade.scores]);
    setEditAllScoresModalVisible(true);
  };

  const handleUpdateScoreInList = (index: number, value: string) => {
    const newScores = [...editAllScoresData];
    const score = parseFloat(value);
    if (!isNaN(score) && score >= 0 && score <= 10) {
      newScores[index] = score;
      setEditAllScoresData(newScores);
    }
  };

  const handleAddScoreToList = () => {
    setEditAllScoresData([...editAllScoresData, 0]);
  };

  const handleRemoveScoreFromList = (index: number) => {
    setEditAllScoresData(editAllScoresData.filter((_, i) => i !== index));
  };

  const handleSaveAllScores = async () => {
    if (!currentGrade) return;

    if (editAllScoresData.length === 0) {
      Alert.alert("Atenção", "Adicione pelo menos uma nota");
      return;
    }

    const hasInvalidScore = editAllScoresData.some(
      (score) => isNaN(score) || score < 0 || score > 10
    );
    if (hasInvalidScore) {
      Alert.alert("Atenção", "Todas as notas devem estar entre 0 e 10");
      return;
    }

    try {
      setLoading(true);
      await gradeService.updateAllScores(currentGrade.id, {
        scores: editAllScoresData,
      });
      Alert.alert("Sucesso", "Notas atualizadas com sucesso!");
      setEditAllScoresModalVisible(false);
      setEditAllScoresData([]);
      setCurrentGrade(null);
      loadGrades();
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao atualizar notas");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGrade = async (id: string) => {
    Alert.alert(
      "Confirmar",
      "Deseja realmente deletar este registro de notas?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await gradeService.delete(id);
              Alert.alert("Sucesso", "Nota deletada com sucesso!");
              loadGrades();
            } catch (error: any) {
              Alert.alert("Erro", error.message || "Erro ao deletar nota");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const openEditModal = (grade: Grade, scoreIndex: number) => {
    setCurrentGrade(grade);
    setEditScoreIndex(scoreIndex);
    setEditScoreValue(grade.scores[scoreIndex].toString());
    setEditModalVisible(true);
  };

  const resetForm = () => {
    setFormData({
      student_id: "",
      subject_id: "",
      scores: [],
    });
    setScoreInput("");
  };

  const getStudentName = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    return student?.name || "Desconhecido";
  };

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find((s) => s.id === subjectId);
    return subject?.name || "Desconhecida";
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "approved":
        return { color: "#10B981", bg: "#D1FAE5", text: "Aprovado", icon: "✓" };
      case "recovery":
        return {
          color: "#F59E0B",
          bg: "#FEF3C7",
          text: "Recuperação",
          icon: "⚠",
        };
      case "failed":
        return {
          color: "#EF4444",
          bg: "#FEE2E2",
          text: "Reprovado",
          icon: "✕",
        };
      default:
        return {
          color: "#6B7280",
          bg: "#F3F4F6",
          text: "Incompleto",
          icon: "⏳",
        };
    }
  };

  const groupGradesByStudent = () => {
    const grouped: { [key: string]: Grade[] } = {};
    grades.forEach((grade) => {
      if (!grouped[grade.student_id]) {
        grouped[grade.student_id] = [];
      }
      grouped[grade.student_id].push(grade);
    });
    return Object.entries(grouped).map(([studentId, studentGrades]) => ({
      studentId,
      studentName: getStudentName(studentId),
      grades: studentGrades,
    }));
  };

  const groupedGrades = groupGradesByStudent();

  const renderStudentGrades = ({
    item,
  }: {
    item: { studentId: string; studentName: string; grades: Grade[] };
  }) => (
    <View style={styles.card}>
      <Text style={styles.studentName}>{item.studentName}</Text>

      {item.grades.map((grade, gradeIndex) => (
        <View key={grade.id} style={styles.subjectContainer}>
          <XStack justify="space-between" items="center" mb="$2">
            <Text style={styles.subjectName}>
              {getSubjectName(grade.subject_id)}
            </Text>
            <XStack gap="$2" items="center">
              <TouchableOpacity
                onPress={() => openEditAllScoresModal(grade)}
                style={styles.editButton}
              >
                <Text style={styles.editButtonText}>Editar</Text>
              </TouchableOpacity>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusInfo(grade.status).bg },
                ]}
              >
                <Text
                  style={[
                    styles.statusIcon,
                    { color: getStatusInfo(grade.status).color },
                  ]}
                >
                  {getStatusInfo(grade.status).icon}
                </Text>
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusInfo(grade.status).color },
                  ]}
                >
                  {getStatusInfo(grade.status).text}
                </Text>
              </View>
            </XStack>
          </XStack>

          <XStack gap="$2" flexWrap="wrap" items="center">
            {grade.scores.map((score, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => openEditModal(grade, index)}
                style={styles.scoreChip}
              >
                <Text style={styles.scoreText}>{score.toFixed(1)}</Text>
              </TouchableOpacity>
            ))}
            <Text style={styles.averageText}>
              Média: {grade.average.toFixed(2)}
            </Text>
          </XStack>
        </View>
      ))}
    </View>
  );

  return (
    <View flex={1} bg="$background">
      <View style={styles.header}>
        <Text
          fontSize="$8"
          fontWeight="bold"
          color="#0e2b5a"
          style={{ fontFamily: "Montserrat-Regular" }}
        >
          Notas
        </Text>
        <Button
          size="$4"
          bg="#0075BE"
          color="white"
          hoverStyle={{ bg: "#0e2b5a" }}
          onPress={() => setModalVisible(true)}
          disabled={loading}
        >
          <Text
            color="white"
            fontWeight={"600"}
            style={{ fontFamily: "Montserrat-Regular" }}
          >
            + Nova Nota
          </Text>
        </Button>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <XStack gap="$2" p="$2">
            <Button
              size="$3"
              bg={filterType === "all" ? "#0075BE" : "#e5efff"}
              hoverStyle={{ bg: "#0075BE" }}
              onPress={() => {
                setFilterType("all");
                setSelectedStudentId("");
                setSelectedSubjectId("");
              }}
            >
              <Text
                color={filterType === "all" ? "#fff" : "#0e2b5a"}
                hoverStyle={{ color: "#fff" }}
                fontWeight={"600"}
                style={{ fontFamily: "Montserrat-Regular" }}
              >
                Todas
              </Text>
            </Button>
            <Button
              size="$3"
              bg={filterType === "student" ? "#0075BE" : "#e5efff"}
              hoverStyle={{ bg: "#0075BE" }}
              onPress={() => setFilterType("student")}
            >
              <Text
                color={filterType === "student" ? "#fff" : "#0e2b5a"}
                hoverStyle={{ color: "#fff" }}
                fontWeight={"600"}
                style={{ fontFamily: "Montserrat-Regular" }}
              >
                Por Aluno
              </Text>
            </Button>
            <Button
              size="$3"
              bg={filterType === "subject" ? "#0075BE" : "#e5efff"}
              hoverStyle={{ bg: "#0075BE" }}
              onPress={() => setFilterType("subject")}
            >
              <Text
                color={filterType === "subject" ? "#fff" : "#0e2b5a"}
                hoverStyle={{ color: "#fff" }}
                fontWeight={"600"}
                style={{ fontFamily: "Montserrat-Regular" }}
              >
                Por Disciplina
              </Text>
            </Button>
          </XStack>
        </ScrollView>

        {filterType === "student" && (
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Selecione o Aluno:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <XStack gap="$2" p="$2">
                {students.map((student) => (
                  <Button
                    key={student.id}
                    size="$3"
                    bg={
                      selectedStudentId === student.id ? "#4CAF50" : "#F5F5F5"
                    }
                    hoverStyle={{ bg: "#4CAF50" }}
                    onPress={() => setSelectedStudentId(student.id)}
                  >
                    <Text
                      color={
                        selectedStudentId === student.id ? "white" : "black"
                      }
                      fontSize="$2"
                      fontWeight={"600"}
                      style={{ fontFamily: "Montserrat-Regular" }}
                    >
                      {student.name}
                    </Text>
                  </Button>
                ))}
              </XStack>
            </ScrollView>
          </View>
        )}

        {filterType === "subject" && (
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Selecione a Disciplina:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <XStack gap="$2" p="$2">
                {subjects.map((subject) => (
                  <Button
                    key={subject.id}
                    size="$3"
                    bg={
                      selectedSubjectId === subject.id ? "#4CAF50" : "#F5F5F5"
                    }
                    onPress={() => setSelectedSubjectId(subject.id)}
                  >
                    <Text
                      color={
                        selectedSubjectId === subject.id ? "white" : "black"
                      }
                      fontSize="$2"
                      fontWeight={"600"}
                      style={{ fontFamily: "Montserrat-Regular" }}
                    >
                      {subject.name}
                    </Text>
                  </Button>
                ))}
              </XStack>
            </ScrollView>
          </View>
        )}
      </View>

      {loading && grades.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Spinner size="large" color="#0960a7" />
          <Text mt="$3">Carregando notas...</Text>
        </View>
      ) : (
        <FlatList
          data={groupedGrades}
          keyExtractor={(item) => item.studentId}
          renderItem={renderStudentGrades}
          contentContainerStyle={styles.listContainer}
          refreshing={refreshing}
          onRefresh={loadGrades}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text
                fontSize="$6"
                color="#666"
                fontWeight={"600"}
                style={{ fontFamily: "Montserrat-Regular" }}
              >
                Nenhuma nota encontrada
              </Text>
              <Text
                fontSize="$4"
                color="#999"
                mt="$2"
                fontWeight={"600"}
                style={{ fontFamily: "Montserrat-Regular" }}
              >
                Toque em {'" + Nova Nota"'} para adicionar
              </Text>
            </View>
          }
        />
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Nova Nota</Text>

              <Text style={styles.label}>Aluno:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <XStack gap="$2" mb="$3">
                  {students.map((student) => (
                    <Button
                      key={student.id}
                      size="$3"
                      bg={
                        formData.student_id === student.id
                          ? "#0960a7"
                          : "#F5F5F5"
                      }
                      hoverStyle={{ bg: "#0960a7" }}
                      onPress={() =>
                        setFormData({ ...formData, student_id: student.id })
                      }
                    >
                      <Text
                        color={
                          formData.student_id === student.id
                            ? "white"
                            : "#0e2b5a"
                        }
                        fontSize="$2"
                        fontWeight={"600"}
                        style={{ fontFamily: "Montserrat-Regular" }}
                      >
                        {student.name}
                      </Text>
                    </Button>
                  ))}
                </XStack>
              </ScrollView>

              <Text style={styles.label}>Disciplina:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <XStack gap="$2" mb="$3">
                  {subjects.map((subject) => (
                    <Button
                      key={subject.id}
                      size="$3"
                      bg={
                        formData.subject_id === subject.id
                          ? "#0960a7"
                          : "#F5F5F5"
                      }
                      onPress={() =>
                        setFormData({ ...formData, subject_id: subject.id })
                      }
                    >
                      <Text
                        color={
                          formData.subject_id === subject.id ? "white" : "black"
                        }
                        fontSize="$2"
                        style={{ fontFamily: "Montserrat-Regular" }}
                      >
                        {subject.name}
                      </Text>
                    </Button>
                  ))}
                </XStack>
              </ScrollView>

              <Text style={styles.label}>Notas:</Text>
              <XStack gap="$2" mb="$2">
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Digite a nota (0-10)"
                  keyboardType="numeric"
                  value={scoreInput}
                  onChangeText={setScoreInput}
                />
                <Button size="$3" bg="#4CAF50" onPress={handleAddScore}>
                  <Text color="white">+</Text>
                </Button>
              </XStack>

              {formData.scores.length > 0 && (
                <View style={styles.scoresListContainer}>
                  <XStack gap="$2" flexWrap="wrap">
                    {formData.scores.map((score, index) => (
                      <View key={index} style={styles.scoreChipWithRemove}>
                        <Text style={styles.scoreText}>{score.toFixed(1)}</Text>
                        <TouchableOpacity
                          onPress={() => handleRemoveScore(index)}
                        >
                          <Text style={styles.removeScoreText}>×</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </XStack>
                </View>
              )}

              <XStack gap="$3" mt="$4">
                <Button
                  flex={1}
                  size="$4"
                  bg="#E0E0E0"
                  onPress={() => {
                    setModalVisible(false);
                    resetForm();
                  }}
                >
                  <Text
                    color="black"
                    fontWeight={"600"}
                    style={{ fontFamily: "Montserrat-Regular" }}
                  >
                    Cancelar
                  </Text>
                </Button>
                <Button
                  flex={1}
                  size="$4"
                  bg="#0960a7"
                  hoverStyle={{ bg: "#0e2b5a" }}
                  onPress={handleCreateGrade}
                  disabled={loading}
                >
                  {loading ? (
                    <Spinner color="white" />
                  ) : (
                    <Text
                      color="white"
                      fontWeight={"600"}
                      style={{ fontFamily: "Montserrat-Regular" }}
                    >
                      Criar
                    </Text>
                  )}
                </Button>
              </XStack>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={editModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.smallModalContent}>
            <Text style={styles.modalTitle}>Editar Nota</Text>
            <Text style={styles.label}>
              Nota {editScoreIndex !== null ? editScoreIndex + 1 : ""}:
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Digite a nova nota (0-10)"
              keyboardType="numeric"
              value={editScoreValue}
              onChangeText={setEditScoreValue}
            />
            <XStack gap="$3" mt="$4">
              <Button
                flex={1}
                size="$4"
                bg="#E0E0E0"
                onPress={() => {
                  setEditModalVisible(false);
                  setEditScoreIndex(null);
                  setEditScoreValue("");
                }}
              >
                <Text color="black">Cancelar</Text>
              </Button>
              <Button
                flex={1}
                size="$4"
                bg="#0960a7"
                onPress={handleEditScore}
                disabled={loading}
              >
                {loading ? (
                  <Spinner color="white" />
                ) : (
                  <Text color="white" fontWeight="bold">
                    Salvar
                  </Text>
                )}
              </Button>
            </XStack>
          </View>
        </View>
      </Modal>

      <Modal
        visible={addScoreModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setAddScoreModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.smallModalContent}>
            <Text style={styles.modalTitle}>Adicionar Nota</Text>
            {currentGrade && (
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 14, color: "#666", marginBottom: 4 }}>
                  Aluno: {getStudentName(currentGrade.student_id)}
                </Text>
                <Text style={{ fontSize: 14, color: "#666" }}>
                  Disciplina: {getSubjectName(currentGrade.subject_id)}
                </Text>
              </View>
            )}
            <Text style={styles.label}>Nova Nota (0-10):</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite a nota"
              keyboardType="numeric"
              value={addScoreValue}
              onChangeText={setAddScoreValue}
              autoFocus
            />
            <XStack gap="$3" mt="$4">
              <Button
                flex={1}
                size="$4"
                bg="#E0E0E0"
                onPress={() => {
                  setAddScoreModalVisible(false);
                  setAddScoreValue("");
                  setCurrentGrade(null);
                }}
              >
                <Text color="black">Cancelar</Text>
              </Button>
              <Button
                flex={1}
                size="$4"
                bg="#4CAF50"
                onPress={confirmAddScore}
                disabled={loading}
              >
                {loading ? (
                  <Spinner color="white" />
                ) : (
                  <Text color="white" fontWeight="bold">
                    Adicionar
                  </Text>
                )}
              </Button>
            </XStack>
          </View>
        </View>
      </Modal>

      <Modal
        visible={editAllScoresModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditAllScoresModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Editar Notas</Text>
              {currentGrade && (
                <View style={{ marginBottom: 16 }}>
                  <Text
                    style={{ fontSize: 14, color: "#666", marginBottom: 4 }}
                  >
                    Aluno: {getStudentName(currentGrade.student_id)}
                  </Text>
                  <Text style={{ fontSize: 14, color: "#666" }}>
                    Disciplina: {getSubjectName(currentGrade.subject_id)}
                  </Text>
                </View>
              )}

              <Text style={styles.label}>Notas (0-10):</Text>
              {editAllScoresData.map((score, index) => (
                <XStack key={index} gap="$2" mb="$2" alignItems="center">
                  <Text style={{ width: 60, fontSize: 14, fontWeight: "600" }}>
                    Nota {index + 1}:
                  </Text>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="0.0"
                    keyboardType="numeric"
                    value={score.toString()}
                    onChangeText={(value) =>
                      handleUpdateScoreInList(index, value)
                    }
                  />
                  <TouchableOpacity
                    onPress={() => handleRemoveScoreFromList(index)}
                    style={styles.removeButton}
                  >
                    <Text
                      style={{
                        color: "#F44336",
                        fontSize: 20,
                        fontWeight: "bold",
                      }}
                    >
                      ×
                    </Text>
                  </TouchableOpacity>
                </XStack>
              ))}

              <Button
                size="$3"
                bg="#4CAF50"
                onPress={handleAddScoreToList}
                mt="$2"
                mb="$3"
              >
                <Text color="white">+ Adicionar Nota</Text>
              </Button>

              <XStack gap="$3" mt="$4">
                <Button
                  flex={1}
                  size="$4"
                  bg="#E0E0E0"
                  onPress={() => {
                    setEditAllScoresModalVisible(false);
                    setEditAllScoresData([]);
                    setCurrentGrade(null);
                  }}
                >
                  <Text color="black">Cancelar</Text>
                </Button>
                <Button
                  flex={1}
                  size="$4"
                  bg="#0960a7"
                  onPress={handleSaveAllScores}
                  disabled={loading}
                >
                  {loading ? (
                    <Spinner color="white" />
                  ) : (
                    <Text color="white" fontWeight="bold">
                      Salvar
                    </Text>
                  )}
                </Button>
              </XStack>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    fontFamily: "Montserrat-Regular",
  },
  filterContainer: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  pickerContainer: {
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    paddingHorizontal: 8,
    marginBottom: 4,
    fontFamily: "Montserrat-Regular",
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  subjectContainer: {
    paddingTop: 14,
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  studentName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0960a7",
    marginBottom: 14,
    fontFamily: "Montserrat-Regular",
  },
  subjectName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    fontFamily: "Montserrat-Regular",
  },
  editButton: {
    backgroundColor: "#0960a7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  editButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Montserrat-Regular",
  },
  removeButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    gap: 6,
  },
  statusIcon: {
    fontSize: 12,
    fontWeight: "bold",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.3,
    fontFamily: "Montserrat-Regular",
  },
  scoreChip: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginRight: 8,
    marginBottom: 6,
    fontFamily: "Montserrat-Regular",
  },
  scoreText: {
    color: "#0960a7",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Montserrat-Regular",
  },
  averageText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginLeft: 6,
    fontFamily: "Montserrat-Regular",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    width: "90%",
    maxHeight: "80%",
  },
  smallModalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    width: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0960a7",
    marginBottom: 20,
    fontFamily: "Montserrat-Regular",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    fontFamily: "Montserrat-Regular",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#F5F5F5",
    fontFamily: "Montserrat-Regular",
  },
  scoresListContainer: {
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    fontFamily: "Montserrat-Regular",
  },
  scoreChipWithRemove: {
    backgroundColor: "#E3F2FD",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 12,
    paddingRight: 8,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  removeScoreText: {
    color: "#F44336",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 8,
    fontFamily: "Montserrat-Regular",
  },
});
