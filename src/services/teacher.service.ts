import { CreateTeacherData, Teacher, UpdateTeacherData } from '../types/teacher.types';
import api from './api';

// Função auxiliar para normalizar o ID (MongoDB retorna _id)
const normalizeTeacher = (data: any): Teacher => {
  if (data._id && !data.id) {
    data.id = data._id;
  }
  return data as Teacher;
};

export const teacherService = {
  /**
   * Criar professor (apenas admin)
   * POST /teachers
   */
  async create(teacherData: CreateTeacherData): Promise<Teacher> {
    const response = await api.post<any>('/teachers', { teacher: teacherData });
    return normalizeTeacher(response.data);
  },

  /**
   * Listar professores (apenas admin)
   * GET /teachers
   */
  async getAll(): Promise<Teacher[]> {
    const response = await api.get<any[]>('/teachers');
    return response.data.map(normalizeTeacher);
  },

  /**
   * Obter professor específico
   * GET /teachers/:id
   */
  async getById(id: string): Promise<Teacher> {
    const response = await api.get<any>(`/teachers/${id}`);
    return normalizeTeacher(response.data);
  },

  /**
   * Atualizar professor
   * PUT /teachers/:id
   */
  async update(id: string, teacherData: UpdateTeacherData): Promise<Teacher> {
    const response = await api.put<any>(`/teachers/${id}`, { teacher: teacherData });
    return normalizeTeacher(response.data);
  },

  /**
   * Deletar professor (apenas admin)
   * DELETE /teachers/:id
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/teachers/${id}`);
  }
};
