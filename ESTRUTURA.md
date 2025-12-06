# 📦 Estrutura Completa dos Serviços

## 🎯 Visão Geral

Todos os serviços necessários para consumir a **API Notas Online** foram criados e estão prontos para integração no front-end React Native.

```
src/
├── 📂 services/           # Serviços da API
│   ├── api.ts            # ⚙️  Cliente Axios + Interceptadores JWT
│   ├── auth.service.ts   # 🔐 Login, Registro, Logout, Perfil
│   ├── school.service.ts # 🏫 CRUD de Escolas
│   ├── student.service.ts# 👨‍🎓 CRUD de Alunos
│   ├── subject.service.ts# 📚 CRUD de Disciplinas
│   ├── grade.service.ts  # 📊 CRUD de Notas + Operações
│   ├── user.service.ts   # 👥 CRUD de Usuários
│   └── index.ts          # 📤 Exportações
│
├── 📂 types/             # Tipos TypeScript
│   ├── auth.types.ts     # LoginCredentials, User, AuthResponse
│   ├── school.types.ts   # School, CreateSchoolData
│   ├── student.types.ts  # Student, CreateStudentData
│   ├── subject.types.ts  # Subject, CreateSubjectData
│   ├── grade.types.ts    # Grade, AddScoreData, UpdateScoreData
│   ├── user.types.ts     # User, UpdateUserData
│   └── index.ts          # 📤 Exportações
│
├── 📂 storage/           # Gerenciamento de Storage
│   └── tokenStorage.ts   # 💾 AsyncStorage para JWT
│
├── 📂 contexts/          # Context API
│   └── AuthContext.tsx   # 🔄 Context de Autenticação
│
├── 📂 hooks/             # Hooks Customizados
│   └── useAuth.ts        # 🎣 Hook de Autenticação
│
├── index.ts              # 📦 Exportação Principal
├── examples.ts           # 📝 Exemplos de Uso
├── tests.ts              # 🧪 Testes de Validação
└── README.md             # 📖 Documentação Completa
```

## ✅ O Que Foi Implementado

### 🔐 Autenticação JWT
- ✅ Login com email e senha
- ✅ Registro de novos usuários
- ✅ Logout
- ✅ Obter perfil do usuário
- ✅ Persistência de token no AsyncStorage
- ✅ Interceptador para adicionar token automaticamente
- ✅ Interceptador para tratar erro 401 (token expirado)

### 🏫 Escolas (Schools)
- ✅ Criar escola (público)
- ✅ Listar escolas
- ✅ Ver escola específica
- ✅ Atualizar escola (admin)
- ✅ Deletar escola (admin)

### 👨‍🎓 Alunos (Students)
- ✅ Criar aluno
- ✅ Listar alunos
- ✅ Ver aluno específico
- ✅ Atualizar aluno
- ✅ Deletar aluno (admin)

### 📚 Disciplinas (Subjects)
- ✅ Criar disciplina
- ✅ Listar disciplinas (admin vê todas, professor vê suas)
- ✅ Ver disciplina específica
- ✅ Atualizar disciplina
- ✅ Deletar disciplina

### 📊 Notas (Grades)
- ✅ Criar registro de notas
- ✅ Listar notas (com filtros)
- ✅ Filtrar por aluno
- ✅ Filtrar por disciplina
- ✅ Ver nota específica
- ✅ Adicionar nova nota ao registro
- ✅ Atualizar nota específica
- ✅ Atualizar todas as notas
- ✅ Deletar registro de notas

### 👥 Usuários (Users)
- ✅ Listar usuários (admin)
- ✅ Ver usuário específico
- ✅ Atualizar usuário
- ✅ Deletar usuário (admin)

### 🎣 Context & Hooks
- ✅ AuthContext com estado global de autenticação
- ✅ useAuth hook para fácil acesso aos dados de auth
- ✅ Loading states
- ✅ Estados de autenticação

## 🚀 Como Usar

### Importação Simples

```typescript
// Importar tudo de uma vez
import { 
  authService, 
  studentService, 
  gradeService,
  useAuth 
} from '@/src';

// Ou importar individualmente
import { authService } from '@/src/services';
import { Student } from '@/src/types';
import { useAuth } from '@/src/hooks/useAuth';
```

### Exemplo de Uso

```typescript
// Em um componente React Native
import { useAuth } from '@/src/hooks/useAuth';
import { studentService } from '@/src/services';

function MyComponent() {
  const { user, signIn, isAuthenticated } = useAuth();
  
  const handleLogin = async () => {
    await signIn({ 
      email: 'user@email.com', 
      password: 'senha123' 
    });
  };
  
  const loadStudents = async () => {
    const students = await studentService.getAll();
    console.log(students);
  };
  
  // ... resto do componente
}
```

## 📋 Endpoints Cobertos

| Método | Endpoint | Serviço | Método |
|--------|----------|---------|--------|
| POST | `/users/login` | authService | `login()` |
| POST | `/users` | authService | `register()` |
| GET | `/users/me` | authService | `getProfile()` |
| POST | `/schools` | schoolService | `create()` |
| GET | `/schools` | schoolService | `getAll()` |
| GET | `/schools/:id` | schoolService | `getById()` |
| PUT | `/schools/:id` | schoolService | `update()` |
| DELETE | `/schools/:id` | schoolService | `delete()` |
| POST | `/students` | studentService | `create()` |
| GET | `/students` | studentService | `getAll()` |
| GET | `/students/:id` | studentService | `getById()` |
| PUT | `/students/:id` | studentService | `update()` |
| DELETE | `/students/:id` | studentService | `delete()` |
| POST | `/subjects` | subjectService | `create()` |
| GET | `/subjects` | subjectService | `getAll()` |
| GET | `/subjects/:id` | subjectService | `getById()` |
| PUT | `/subjects/:id` | subjectService | `update()` |
| DELETE | `/subjects/:id` | subjectService | `delete()` |
| POST | `/grades` | gradeService | `create()` |
| GET | `/grades` | gradeService | `getAll()` |
| GET | `/grades?student_id=X` | gradeService | `getAll({ student_id })` |
| GET | `/grades?subject_id=X` | gradeService | `getAll({ subject_id })` |
| GET | `/grades/:id` | gradeService | `getById()` |
| PUT | `/grades/:id` | gradeService | `addScore()` / `updateScore()` |
| DELETE | `/grades/:id` | gradeService | `delete()` |
| GET | `/users` | userService | `getAll()` |
| GET | `/users/:id` | userService | `getById()` |
| PUT | `/users/:id` | userService | `update()` |
| DELETE | `/users/:id` | userService | `delete()` |

## 🔧 Funcionalidades Extras

### Token Automático
O token JWT é gerenciado automaticamente:
- Salvo no AsyncStorage após login/registro
- Adicionado automaticamente em TODAS as requisições
- Removido automaticamente quando expira (401)

### Tipagem TypeScript
Todos os serviços têm tipagem completa para:
- ✅ Type safety
- ✅ Autocomplete no IDE
- ✅ Documentação inline
- ✅ Redução de erros

### Tratamento de Erros
Interceptadores tratam automaticamente:
- ❌ Erro 401 - Token expirado
- ❌ Timeout de requisição (10s)
- ❌ Erros de rede

## 📚 Arquivos de Referência

### Documentação
- **`src/README.md`** - Documentação completa de todos os serviços
- **`INSTALACAO.md`** - Guia rápido de instalação

### Exemplos
- **`src/examples.ts`** - Exemplos práticos de uso de cada serviço
- **`src/tests.ts`** - Testes de validação dos serviços

### Configuração
- **`src/services/api.ts`** - Configurar URL base da API
- **`package.json`** - Dependências atualizadas

## ⚙️ Próximos Passos

1. **Instalar dependências**
   ```bash
   npm install
   ```

2. **Configurar URL da API**
   Edite `src/services/api.ts`

3. **Adicionar AuthProvider**
   Envolva seu app com `<AuthProvider>`

4. **Implementar telas**
   - Login/Registro
   - Lista de alunos
   - Lista de disciplinas
   - Notas

5. **Testar integração**
   Use `src/tests.ts` para validar

## 🎉 Status

**✅ 100% COMPLETO E PRONTO PARA INTEGRAÇÃO!**

Todos os serviços foram implementados seguindo as melhores práticas de:
- Clean Code
- TypeScript
- React Native
- Arquitetura limpa
- Documentação completa

---

**Desenvolvido com ❤️ para o projeto School-App**
