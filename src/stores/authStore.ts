import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthState, User } from '@/types'
import { authService } from '@/services/auth'
import { apiClient } from '@/services/api'

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  setUser: (user: User | null) => void
  setToken: (token: string) => void
  checkAuth: () => Promise<void>
  isLoading: boolean
  error: string | null
  authDisabled: boolean
}

const AUTH_DISABLED = true
const AUTH_DISABLED_USER: User = {
  id: 0,
  name: 'Acesso Livre',
  email: 'acesso@local',
  role: {
    id: 0,
    name: 'admin',
    description: 'Acesso sem autenticação',
  },
  created_at: '2026-02-26',
  updated_at: '2026-02-26',
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      user: AUTH_DISABLED ? AUTH_DISABLED_USER : null,
      role: AUTH_DISABLED ? 'admin' : null,
      isAuthenticated: AUTH_DISABLED,
      isLoading: false,
      error: null,
      authDisabled: AUTH_DISABLED,

      login: async (email: string, password: string) => {
        if (AUTH_DISABLED) {
          set({
            token: 'auth-disabled',
            user: AUTH_DISABLED_USER,
            role: 'admin',
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
          return
        }
        set({ isLoading: true, error: null })
        try {
          const response = await authService.login({ email, password })
          apiClient.setToken(response.token)
          set({
            token: response.token,
            isAuthenticated: true,
          })

          // Buscar dados do usuário
          try {
            const user = await authService.me()
            const role = user.role?.name?.toLowerCase() as 'admin' | 'gerente' | 'usuario' || 'usuario'
            set({ user, role })
          } catch (err) {
            console.error('Erro ao buscar dados do usuário:', err)
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Falha no login',
            isAuthenticated: false,
          })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      logout: async () => {
        if (AUTH_DISABLED) {
          set({
            token: 'auth-disabled',
            user: AUTH_DISABLED_USER,
            role: 'admin',
            isAuthenticated: true,
          })
          return
        }
        try {
          await authService.logout()
        } finally {
          set({
            token: null,
            user: null,
            role: null,
            isAuthenticated: false,
          })
        }
      },

      setUser: (user: User | null) => {
        if (user) {
          const role = user.role?.name?.toLowerCase() as 'admin' | 'gerente' | 'usuario' || 'usuario'
          set({ user, role })
        } else {
          set({ user: null, role: null })
        }
      },

      setToken: (token: string) => {
        if (AUTH_DISABLED) {
          set({
            token: 'auth-disabled',
            user: AUTH_DISABLED_USER,
            role: 'admin',
            isAuthenticated: true,
          })
          return
        }
        apiClient.setToken(token)
        set({ token, isAuthenticated: true })
      },

      checkAuth: async () => {
        if (AUTH_DISABLED) {
          set({
            token: 'auth-disabled',
            user: AUTH_DISABLED_USER,
            role: 'admin',
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
          return
        }
        const currentToken = get().token
        if (!currentToken) {
          set({ isAuthenticated: false })
          return
        }

        try {
          apiClient.setToken(currentToken)
          const user = await authService.me()
          const role = user.role?.name?.toLowerCase() as 'admin' | 'gerente' | 'usuario' || 'usuario'
          set({ user, role, isAuthenticated: true })
        } catch (error) {
          set({
            token: null,
            user: null,
            role: null,
            isAuthenticated: false,
          })
        }
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          apiClient.setToken(state.token)
        } else {
          apiClient.clearToken()
        }
      },
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
