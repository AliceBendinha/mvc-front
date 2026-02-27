import { apiClient } from './api'
import { Estoque } from '@/types'

type RelatorioResumoResponse = {
  periodo: {
    inicio: string
    fim: string
  }
  resumo: {
    total_produtos: number
    total_registros_estoque: number
    estoques_em_falta: number
    valor_total_estoque: string | number
  }
  alertas: {
    produtos_vencidos: number
    estoques_criticos: number
  }
}

type RelatorioEstoquesEmFaltaResponse = {
  title: string
  total_em_falta: number
  data: {
    data: Estoque[]
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export const relatorioService = {
  async resumo(farmaciaId?: number) {
    const params = new URLSearchParams()
    if (farmaciaId) params.append('farmacia_id', farmaciaId.toString())

    const response = await apiClient.get<RelatorioResumoResponse>(
      `/relatorios/resumo${params.toString() ? `?${params.toString()}` : ''}`
    )
    return response.data
  },

  async estoquesEmFalta(farmaciaId?: number, perPage = 15) {
    const params = new URLSearchParams()
    params.append('per_page', perPage.toString())
    if (farmaciaId) params.append('farmacia_id', farmaciaId.toString())

    const response = await apiClient.get<RelatorioEstoquesEmFaltaResponse>(
      `/relatorios/estoques-em-falta?${params.toString()}`
    )
    return response.data
  },
}
