import React from 'react'
import { Layout } from '@/components/Layout/Layout'
import { Card } from '@/components/Card'
import { BarChart3, Users, Store, TrendingUp } from 'lucide-react'

export const AdminDashboardPage: React.FC = () => {
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-text">Dashboard Admin</h1>
        <p className="text-neutral-muted mt-2">
          Visão geral do sistema de farmácias
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-neutral-muted">Total de Farmácias</p>
              <p className="text-3xl font-bold text-neutral-text mt-2">12</p>
            </div>
            <Store className="w-10 h-10 text-primary-200" />
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-neutral-muted">Usuários Ativos</p>
              <p className="text-3xl font-bold text-neutral-text mt-2">48</p>
            </div>
            <Users className="w-10 h-10 text-primary-200" />
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-neutral-muted">Produtos Cadastrados</p>
              <p className="text-3xl font-bold text-neutral-text mt-2">543</p>
            </div>
            <TrendingUp className="w-10 h-10 text-success/20" />
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-neutral-muted">Buscas Hoje</p>
              <p className="text-3xl font-bold text-primary-600 mt-2">1,234</p>
            </div>
            <BarChart3 className="w-10 h-10 text-primary-200" />
          </div>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-neutral-text mb-4">Atividade por Dia</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <p className="text-neutral-muted">Gráfico de linha</p>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-neutral-text mb-4">Distribuição de Farmácias</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <p className="text-neutral-muted">Gráfico de pizza</p>
          </div>
        </Card>
      </div>
    </Layout>
  )
}
