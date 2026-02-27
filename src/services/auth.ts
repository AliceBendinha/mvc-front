import { apiClient } from './api'
import { LoginRequest, AuthResponse, User } from '@/types'

type RawAuthResponse =
  | AuthResponse
  | {
      access_token?: string
      token_type?: string
      expires_in?: number
      token?: string
      type?: string
    }
  | {
      data?: {
        access_token?: string
        token_type?: string
        expires_in?: number
        token?: string
        type?: string
      }
    }

type AuthPayload = {
  access_token?: string
  token_type?: string
  expires_in?: number
  token?: string
  type?: string
}

const normalizeAuthResponse = (payload: RawAuthResponse): AuthResponse => {
  const body: AuthPayload =
    typeof payload === 'object' && payload && 'data' in payload
      ? payload.data || {}
      : (payload as AuthPayload)

  const token = body?.token || body?.access_token
  if (!token) {
    throw new Error('Resposta de login sem token')
  }

  return {
    token,
    type: (body?.type || body?.token_type || 'bearer') as 'bearer',
    expires_in: body?.expires_in || 0,
  }
}

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<RawAuthResponse>('/auth/login', credentials)
    return normalizeAuthResponse(response.data)
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout')
    } finally {
      apiClient.clearToken()
    }
  },

  async refresh(): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/refresh')
    return response.data
  },

  async me(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me')
    return response.data
  },

  isAuthenticated(): boolean {
    return !!apiClient.getToken()
  },
}
