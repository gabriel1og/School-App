import { useEffect, useState } from 'react';
import { teacherService } from '@/src/services/teacher.service';
import type { Teacher } from '@/src/types/teacher.types';
import { useAuth } from '@/src/hooks/useAuth';
import { Redirect } from 'expo-router';
import {
  Button,
  Input,
  ScrollView,
  Sheet,
  Text,
  View,
  XStack,
  YStack,
} from 'tamagui';

export default function ProfessoresScreen() {
  const { user, loading } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      const data = await teacherService.getAll();
      setTeachers(data);
    } catch (e) {
      console.error('Erro ao buscar professores:', e);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!email.trim()) newErrors.email = 'E-mail é obrigatório';
    if (!password.trim()) newErrors.password = 'Senha é obrigatória';
    if (!passwordConfirmation.trim()) newErrors.passwordConfirmation = 'Confirmação de senha é obrigatória';
    if (password.trim() && passwordConfirmation.trim() && password !== passwordConfirmation) {
      newErrors.passwordConfirmation = 'Senhas não coincidem';
    }
    if (!address.trim()) newErrors.address = 'Endereço é obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveTeacher = async () => {
    if (!validate()) return;

    try {
      setSaving(true);
      await teacherService.create({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        school_id: user?.school_id || '',
        address: address,
      });
      setOpen(false);
      // reset
      setName('');
      setEmail('');
      setPassword('');
      setPasswordConfirmation('');
      setAddress('');
      setErrors({});
      await loadTeachers();
    } catch (e: any) {
      console.error('Erro ao cadastrar professor:', e);
    } finally {
      setSaving(false);
    }
  };

  // Guard de rota: apenas admin pode acessar
  if (!loading && user?.user_type !== 'admin') {
    return <Redirect href="/(app)/(tabs)" />;
  }

  return (
    <View flex={1} background="white" p="$4">
      <XStack justify="space-between" items="center" mb="$4">
        <Text fontSize="$8" fontWeight="bold" color="#0960a7">Professores</Text>
        <Button onPress={() => setOpen(true)}>Novo</Button>
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
              <Text fontSize="$6" fontWeight="700" color="#111827">{t.name}</Text>
              <Text color="#6B7280">{t.email}</Text>
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
            <Text fontSize="$7" fontWeight="700">Cadastro de Professor</Text>
            <YStack>
              <Input
                placeholder="Nome"
                value={name}
                onChangeText={(v) => {
                  setName(v);
                  if (errors.name) setErrors((e) => ({ ...e, name: '' }));
                }}
              />
              {!!errors.name && <Text color="#DC2626" fontSize="$2">{errors.name}</Text>}
            </YStack>

            <YStack>
              <Input
                placeholder="E-mail"
                value={email}
                onChangeText={(v) => {
                  setEmail(v);
                  if (errors.email) setErrors((e) => ({ ...e, email: '' }));
                }}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              {!!errors.email && <Text color="#DC2626" fontSize="$2">{errors.email}</Text>}
            </YStack>

            <YStack>
              <Input
                placeholder="Senha"
                value={password}
                onChangeText={(v) => {
                  setPassword(v);
                  if (errors.password) setErrors((e) => ({ ...e, password: '' }));
                }}
                secureTextEntry
              />
              {!!errors.password && <Text color="#DC2626" fontSize="$2">{errors.password}</Text>}
            </YStack>

            <YStack>
              <Input
                placeholder="Confirmar senha"
                value={passwordConfirmation}
                onChangeText={(v) => {
                  setPasswordConfirmation(v);
                  if (errors.passwordConfirmation) setErrors((e) => ({ ...e, passwordConfirmation: '' }));
                }}
                secureTextEntry
              />
              {!!errors.passwordConfirmation && <Text color="#DC2626" fontSize="$2">{errors.passwordConfirmation}</Text>}
            </YStack>

            <YStack>
              <Input
                placeholder="Endereço"
                value={address}
                onChangeText={(v) => {
                  setAddress(v);
                  if (errors.address) setErrors((e) => ({ ...e, address: '' }));
                }}
              />
              {!!errors.address && <Text color="#DC2626" fontSize="$2">{errors.address}</Text>}
            </YStack>

            <XStack gap="$2" mt="$2">
              <Button flex={1} onPress={() => setOpen(false)} disabled={saving}>
                Cancelar
              </Button>
              <Button flex={1} onPress={saveTeacher} disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar'}
              </Button>
            </XStack>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </View>
  );
}
