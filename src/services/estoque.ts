import { apiClient } from './api'
import {
  Estoque,
  CreateEstoqueRequest,
  ReporEstoqueRequest,
  PaginatedResponse,
} from '@/types'

export const estoqueService = {
  async getAll(page = 1, limit = 10) {
    const response = await apiClient.get<PaginatedResponse<Estoque>>(
      `/estoques?page=${page}&per_page=${limit}`
    )
    return response.data
  },

  async getByFarmacia(farmaciaId: number, page = 1, limit = 10) {
    const response = await apiClient.get<PaginatedResponse<Estoque>>(
      `/farmacias/${farmaciaId}/estoques?page=${page}&per_page=${limit}`
    )
    return response.data
  },

  async getById(id: number) {
    const response = await apiClient.get<Estoque>(`/estoques/${id}`)
    return response.data
  },

  async create(data: CreateEstoqueRequest) {
    const response = await apiClient.post<Estoque>('/estoques', data)
    return response.data
  },

  async update(id: number, data: Partial<CreateEstoqueRequest>) {
    const response = await apiClient.put<Estoque>(`/estoques/${id}`, data)
    return response.data
  },

  async delete(id: number) {
    await apiClient.delete(`/estoques/${id}`)
  },

  async repor(id: number, data: ReporEstoqueRequest) {
    const response = await apiClient.post<Estoque>(`/estoques/${id}/repor`, data)
    return response.data
  },

  async remover(id: number, data: ReporEstoqueRequest) {
    const response = await apiClient.post<Estoque>(`/estoques/${id}/remover`, data)
    return response.data
  },

  async getEmFalta(farmaciaId?: number) {
    const url = farmaciaId
      ? `/farmacias/${farmaciaId}/estoques?em_falta=true`
      : `/estoques?em_falta=true`

    const response = await apiClient.get<PaginatedResponse<Estoque>>(url)
    return response.data
  },
}
