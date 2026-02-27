import { apiClient } from './api'
import {
  Farmacia,
  CreateFarmaciaRequest,
  PaginatedResponse,
  Localizacao,
} from '@/types'

export const farmaciaService = {
  async getAll(page = 1, limit = 10) {
    const response = await apiClient.get<PaginatedResponse<Farmacia>>(
      `/farmacias?page=${page}&per_page=${limit}`
    )
    return response.data
  },

  async getById(id: number) {
    const response = await apiClient.get<Farmacia>(`/farmacias/${id}`)
    return response.data
  },

  async create(data: CreateFarmaciaRequest) {
    const response = await apiClient.post<Farmacia>('/farmacias', data)
    return response.data
  },

  async update(id: number, data: Partial<CreateFarmaciaRequest>) {
    const response = await apiClient.put<Farmacia>(`/farmacias/${id}`, data)
    return response.data
  },

  async delete(id: number) {
    await apiClient.delete(`/farmacias/${id}`)
  },

  async getLocalizacoes(farmaciaId: number) {
    const response = await apiClient.get<Localizacao[]>(
      `/farmacias/${farmaciaId}/localizacoes`
    )
    return response.data
  },

  async search(termo: string, raio_km?: number, latitude?: number, longitude?: number) {
    const params = new URLSearchParams()
    params.append('search', termo)
    if (raio_km) params.append('raio_km', raio_km.toString())
    if (latitude) params.append('latitude', latitude.toString())
    if (longitude) params.append('longitude', longitude.toString())

    const response = await apiClient.get<PaginatedResponse<Farmacia>>(
      `/farmacias?${params.toString()}`
    )
    return response.data
  },
}
