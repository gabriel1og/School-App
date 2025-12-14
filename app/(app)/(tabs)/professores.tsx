import { useAuth } from "@/src/hooks/useAuth";
import { teacherService } from "@/src/services/teacher.service";
import type { Teacher } from "@/src/types/teacher.types";
import { Redirect } from "expo-router";
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

export default function ProfessoresScreen() {
  const { user, loading } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      const data = await teacherService.getAll();
      setTeachers(data);
    } catch (e) {
      console.error("Erro ao buscar professores:", e);
    }
  };

  const saveTeacher = async () => {
    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !passwordConfirmation.trim()
    ) {
      console.warn("Preencha os campos obrigatórios!");
      return;
    }
    if (password !== passwordConfirmation) {
      console.warn("Senhas não coincidem.");
      return;
    }

    try {
      setSaving(true);
      await teacherService.create({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        school_id: user?.school_id || "",
        address: address || undefined,
        phone: phone || undefined,
      });
      setOpen(false);
      // reset
      setName("");
      setEmail("");
      setPassword("");
      setPasswordConfirmation("");
      setAddress("");
      setPhone("");
      await loadTeachers();
    } catch (e: any) {
      console.error("Erro ao cadastrar professor:", e);
    } finally {
      setSaving(false);
    }
  };

  // Guard de rota: apenas admin pode acessar
  if (!loading && user?.user_type !== "admin") {
    return <Redirect href="/(app)/(tabs)/" />;
  }

  return (
    <View flex={1} background="white" p="$4">
      <XStack justify="space-between" items="center" mb="$4">
        <Text
          fontSize="$8"
          fontWeight="bold"
          color="#0960a7"
          style={{ fontFamily: "Montserrat-Regular" }}
        >
          Professores
        </Text>
        <Button onPress={() => setOpen(true)}>
          <Text fontWeight={"600"} style={{ fontFamily: "Montserrat-Regular" }}>
            Novo
          </Text>
        </Button>
      </XStack>

      <ScrollView>
        <YStack gap="$3">
          {teachers.map((t) => (
            <YStack
              key={t.id}
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
              <Text
                fontSize="$6"
                fontWeight="700"
                color="#111827"
                style={{ fontFamily: "Montserrat-Regular" }}
              >
                {t.name}
              </Text>
              <Text
                color="#6B7280"
                style={{ fontFamily: "Montserrat-Regular" }}
              >
                {t.email}
              </Text>
            </YStack>
          ))}
          {teachers.length === 0 && (
            <Text color="#6B7280">Nenhum professor encontrado.</Text>
          )}
        </YStack>
      </ScrollView>

      <Sheet modal open={open} onOpenChange={setOpen} snapPoints={[85]}>
        <Sheet.Frame p="$4" background="#fff">
          <YStack gap="$3">
            <Text
              fontSize="$7"
              fontWeight="700"
              style={{ fontFamily: "Montserrat-Regular" }}
            >
              Cadastro de Professor
            </Text>
            <Input
              placeholder="Nome"
              value={name}
              onChangeText={setName}
              style={{ fontFamily: "Montserrat-Regular" }}
            />
            <Input
              placeholder="E-mail"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={{ fontFamily: "Montserrat-Regular" }}
            />
            <Input
              placeholder="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={{ fontFamily: "Montserrat-Regular" }}
            />
            <Input
              placeholder="Confirmar senha"
              value={passwordConfirmation}
              onChangeText={setPasswordConfirmation}
              secureTextEntry
              style={{ fontFamily: "Montserrat-Regular" }}
            />
            <Input
              placeholder="Endereço (opcional)"
              value={address}
              onChangeText={setAddress}
              style={{ fontFamily: "Montserrat-Regular" }}
            />
            <Input
              placeholder="Telefone (opcional)"
              value={phone}
              onChangeText={setPhone}
              style={{ fontFamily: "Montserrat-Regular" }}
            />

            <XStack gap="$2" mt="$2">
              <Button
                flex={1}
                theme="red"
                onPress={() => setOpen(false)}
                disabled={saving}
              >
                <Text
                  fontWeight={"600"}
                  style={{ fontFamily: "Montserrat-Regular" }}
                >
                  Cancelar
                </Text>
              </Button>
              <Button flex={1} onPress={saveTeacher} disabled={saving}>
                <Text
                  fontWeight={"600"}
                  style={{ fontFamily: "Montserrat-Regular" }}
                >
                  {saving ? "Salvando..." : "Salvar"}
                </Text>
              </Button>
            </XStack>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </View>
  );
}
