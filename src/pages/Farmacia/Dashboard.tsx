import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '@/components/Layout/Layout'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { LoadingSpinner } from '@/components/States'
import { useAuthStore } from '@/stores/authStore'
import { BarChart3, AlertTriangle, Package, TrendingUp } from 'lucide-react'
import { Estoque } from '@/types'
import { generateCSV } from '@/utils/export'
import { relatorioService } from '@/services/relatorios'

export const FarmaciaDashboardPage: React.FC = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = React.useState(true)
  const [stats, setStats] = React.useState({
    totalProdutos: 0,
    produtosEmFalta: 0,
    totalEstoque: 0,
    valorEstoque: 0,
  })
  const [produtosEmFalta, setProdutosEmFalta] = React.useState<Estoque[]>([])

  const farmaciaId = user?.farmacias?.[0]?.id

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [resumo, estoquesEmFalta] = await Promise.all([
          relatorioService.resumo(farmaciaId),
          relatorioService.estoquesEmFalta(farmaciaId, 10),
        ])

        const valorTotal = Number(resumo.resumo.valor_total_estoque) || 0

        setStats({
          totalProdutos: resumo.resumo.total_produtos,
          produtosEmFalta: resumo.resumo.estoques_em_falta,
          totalEstoque: resumo.resumo.total_registros_estoque,
          valorEstoque: valorTotal,
        })

        setProdutosEmFalta(estoquesEmFalta.data.data)
      } catch (error) {
        console.error('Erro ao carregar relatórios:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [farmaciaId])

  if (isLoading) return <LoadingSpinner fullScreen />

  const handleGerarRelatorio = async () => {
    try {
      const [resumo, estoquesEmFalta] = await Promise.all([
        relatorioService.resumo(farmaciaId),
        relatorioService.estoquesEmFalta(farmaciaId, 100),
      ])

      const csvRows = [
        {
          tipo: 'Resumo',
          total_produtos: resumo.resumo.total_produtos,
          total_registros_estoque: resumo.resumo.total_registros_estoque,
          estoques_em_falta: resumo.resumo.estoques_em_falta,
          valor_total_estoque: resumo.resumo.valor_total_estoque,
          periodo_inicio: resumo.periodo.inicio,
          periodo_fim: resumo.periodo.fim,
        },
        ...estoquesEmFalta.data.data.map((estoque) => ({
          tipo: 'Em falta',
          farmacia: estoque.farmacia?.nome || '',
          produto: estoque.produto?.nome || '',
          quantidade: estoque.quantidade,
          estoque_minimo: estoque.stock_minimo,
        })),
      ]

      generateCSV(csvRows, 'relatorio-farmacia.csv')
    } catch (error) {
      console.error('Erro ao gerar relatório:', error)
    }
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-text">Dashboard</h1>
        <p className="text-neutral-muted mt-2">
          Bem-vindo, {user?.name}! Aqui está um resumo da sua farmácia.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-neutral-muted">Total de Produtos</p>
              <p className="text-3xl font-bold text-neutral-text mt-2">
                {stats.totalProdutos}
              </p>
            </div>
            <Package className="w-10 h-10 text-primary-200" />
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-neutral-muted">Em Falta</p>
              <p className="text-3xl font-bold text-alert mt-2">
                {stats.produtosEmFalta}
              </p>
            </div>
            <AlertTriangle className="w-10 h-10 text-alert/20" />
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-neutral-muted">Total em Estoque</p>
              <p className="text-3xl font-bold text-neutral-text mt-2">
                {stats.totalEstoque}
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-success/20" />
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-neutral-muted">Valor Total</p>
              <p className="text-2xl font-bold text-primary-600 mt-2">
                R$ {stats.valorEstoque.toFixed(2)}
              </p>
            </div>
            <BarChart3 className="w-10 h-10 text-primary-200" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ações Rápidas */}
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-lg font-semibold text-neutral-text mb-4">Ações Rápidas</h2>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => navigate('/farmacia/produtos?novo=1')}
              >
                Adicionar Produto
              </Button>
              <Button
                variant="secondary"
                fullWidth
                onClick={() => navigate('/farmacia/estoques')}
              >
                Repor Estoque
              </Button>
              <Button
                variant="secondary"
                fullWidth
                onClick={() => navigate('/search')}
              >
                Ver Pesquisas
              </Button>
              <Button variant="secondary" fullWidth onClick={handleGerarRelatorio}>
                Gerar Relatório
              </Button>
            </div>
          </Card>
        </div>

        {/* Sidebar - Alertas */}
        <Card>
          <h3 className="text-lg font-semibold text-neutral-text mb-4">Alertas</h3>
          {produtosEmFalta.length === 0 ? (
            <p className="text-sm text-neutral-muted">Nenhum alerta no momento</p>
          ) : (
            <div className="space-y-3">
              {produtosEmFalta.map((estoque) => (
                <div
                  key={estoque.id}
                  className="p-3 bg-alert/10 border border-alert/20 rounded-lg"
                >
                  <p className="text-sm font-medium text-alert">Stock baixo</p>
                  <p className="text-xs text-neutral-muted mt-1">
                    {estoque.produto?.nome} - {estoque.quantidade} un.
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </Layout>
  )
}
