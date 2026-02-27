import { apiClient } from './api'
import {
  Categoria,
  Servico,
  CreateServicoRequest,
  PaginatedResponse,
} from '@/types'

export const categoriaService = {
  async getAll() {
    const response = await apiClient.get<Categoria[]>('/categorias')
    return response.data
  },

  async getById(id: number) {
    const response = await apiClient.get<Categoria>(`/categorias/${id}`)
    return response.data
  },

  async create(data: Omit<Categoria, 'id'>) {
    const response = await apiClient.post<Categoria>('/categorias', data)
    return response.data
  },

  async update(id: number, data: Partial<Omit<Categoria, 'id'>>) {
    const response = await apiClient.put<Categoria>(`/categorias/${id}`, data)
    return response.data
  },

  async delete(id: number) {
    await apiClient.delete(`/categorias/${id}`)
  },
}

export const servicoService = {
  async getAll(page = 1, limit = 10) {
    const response = await apiClient.get<PaginatedResponse<Servico>>(
      `/servicos?page=${page}&per_page=${limit}`
    )
    return response.data
  },

  async getByFarmacia(farmaciaId: number) {
    const response = await apiClient.get<Servico[]>(
      `/servicos?farmacia_id=${farmaciaId}`
    )
    return response.data
  },

  async getById(id: number) {
    const response = await apiClient.get<Servico>(`/servicos/${id}`)
    return response.data
  },

  async create(data: CreateServicoRequest) {
    const response = await apiClient.post<Servico>('/servicos', data)
    return response.data
  },

  async update(id: number, data: Partial<CreateServicoRequest>) {
    const response = await apiClient.put<Servico>(`/servicos/${id}`, data)
    return response.data
  },

  async delete(id: number) {
    await apiClient.delete(`/servicos/${id}`)
  },
}
