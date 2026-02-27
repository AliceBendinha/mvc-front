import { apiClient } from './api'
import {
  Produto,
  CreateProdutoRequest,
  PaginatedResponse,
  ProdutoComDisponibilidade,
} from '@/types'

export const produtoService = {
  async getAll(page = 1, limit = 10, filtros?: any) {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('per_page', limit.toString())

    if (filtros?.categoria_id) params.append('categoria_id', filtros.categoria_id)
    if (filtros?.em_falta) params.append('em_falta', 'true')
    if (filtros?.preco_max) params.append('preco_max', filtros.preco_max)
    if (filtros?.termo) params.append('termo', filtros.termo)

    const response = await apiClient.get<PaginatedResponse<Produto>>(
      `/produtos?${params.toString()}`
    )
    return response.data
  },

  async getById(id: number) {
    const response = await apiClient.get<Produto>(`/produtos/${id}`)
    return response.data
  },

  async getByIdComDisponibilidade(id: number) {
    const response = await apiClient.get<ProdutoComDisponibilidade>(
      `/produtos/${id}/disponibilidade`
    )
    return response.data
  },

  async create(data: CreateProdutoRequest) {
    const response = await apiClient.post<Produto>('/produtos', data)
    return response.data
  },

  async update(id: number, data: Partial<CreateProdutoRequest>) {
    const response = await apiClient.put<Produto>(`/produtos/${id}`, data)
    return response.data
  },

  async delete(id: number) {
    await apiClient.delete(`/produtos/${id}`)
  },

  async search(termo: string, filtros?: any) {
    const params = new URLSearchParams()
    params.append('search', termo)

    if (filtros?.categoria_id) params.append('categoria_id', filtros.categoria_id)
    if (filtros?.em_falta) params.append('em_falta', 'true')
    if (filtros?.preco_max) params.append('preco_max', filtros.preco_max)

    const response = await apiClient.get<PaginatedResponse<Produto>>(
      `/produtos?${params.toString()}`
    )
    return response.data
  },
}
