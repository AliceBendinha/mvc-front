import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { useAuthStore } from '@/stores/authStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { Mail, Lock, ArrowRight } from 'lucide-react'

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { isAuthenticated, login, isLoading } = useAuthStore()
  const { addNotification } = useNotificationStore()

  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!formData.email) {
      setErrors((prev) => ({ ...prev, email: 'Email é obrigatório' }))
      return
    }
    if (!formData.password) {
      setErrors((prev) => ({ ...prev, password: 'Senha é obrigatória' }))
      return
    }

    try {
      await login(formData.email, formData.password)
      addNotification({
        type: 'success',
        message: 'Login realizado com sucesso!',
        duration: 3000,
      })
      navigate('/')
    } catch (error: any) {
      addNotification({
        type: 'error',
        message: error.response?.data?.message || 'Erro ao fazer login',
        duration: 5000,
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-lg mb-4">
            <span className="text-3xl font-bold text-white">F</span>
          </div>
          <h1 className="text-3xl font-bold text-neutral-text">Farmácia</h1>
          <p className="text-neutral-muted mt-2">Sistema de Gestão de Farmácias</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-neutral-text mb-1">Bem-vindo</h2>
              <p className="text-sm text-neutral-muted">Faça login para continuar</p>
            </div>

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={<Mail className="w-5 h-5" />}
              placeholder="seu@email.com"
              required
            />

            <Input
              label="Senha"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon={<Lock className="w-5 h-5" />}
              placeholder="Digite sua senha"
              required
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Entrar
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-neutral-border">
            <p className="text-sm text-neutral-muted text-center">
              Dados de teste:
              <br />
              <strong>admin@farmacia.com</strong> (Admin)
              <br />
              <strong>joao@farmacia.com</strong> (Farmácia)
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-neutral-border">
            <p className="text-xs text-neutral-muted text-center">
              Senha padrão: <strong>password123</strong>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
