/// <reference types="vite/client" />
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { AuthResponse } from '@/types'


class ApiClient {
  private instance: AxiosInstance
  private baseURL: string

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || '/api'
    
    this.instance = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    // Interceptador para adicionar token
    this.instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('auth_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Interceptador para renovar token
    this.instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
        const requestUrl = originalRequest?.url || ''
        const isAuthEndpoint = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/refresh')
        
        if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
          originalRequest._retry = true
          
          try {
            const response = await this.instance.post<AuthResponse>('/auth/refresh')
            const { token } = response.data
            
            localStorage.setItem('auth_token', token)
            originalRequest.headers.Authorization = `Bearer ${token}`
            
            return this.instance(originalRequest)
          } catch (refreshError) {
            localStorage.removeItem('auth_token')
            window.location.href = '/login'
            return Promise.reject(refreshError)
          }
        }
        
        return Promise.reject(error)
      }
    )
  }

  get<T>(url: string, config = {}) {
    return this.instance.get<T>(url, config)
  }

  post<T>(url: string, data?: any, config = {}) {
    return this.instance.post<T>(url, data, config)
  }

  put<T>(url: string, data?: any, config = {}) {
    return this.instance.put<T>(url, data, config)
  }

  patch<T>(url: string, data?: any, config = {}) {
    return this.instance.patch<T>(url, data, config)
  }

  delete<T>(url: string, config = {}) {
    return this.instance.delete<T>(url, config)
  }

  setToken(token: string) {
    localStorage.setItem('auth_token', token)
    this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  clearToken() {
    localStorage.removeItem('auth_token')
    delete this.instance.defaults.headers.common['Authorization']
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token')
  }
}

export const apiClient = new ApiClient()
