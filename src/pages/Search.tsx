import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Layout } from '@/components/Layout/Layout'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Select } from '@/components/Select'
import { LoadingSpinner, EmptyState, ErrorState } from '@/components/States'
import { FarmaciaCard } from '@/components/Cards/FarmaciaCard'
import { ProdutoCard } from '@/components/Cards/ProdutoCard'
import { ServicoCard } from '@/components/Cards/ServicoCard'
import { farmaciaService } from '@/services/farmacia'
import { produtoService } from '@/services/produto'
import { servicoService } from '@/services/categoria-servico'
import { Farmacia, Produto, Servico } from '@/types'
import { Search, Filter } from 'lucide-react'

export const SearchPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const termo = searchParams.get('termo') || ''

  const [searchType, setSearchType] = React.useState<'all' | 'farmacia' | 'produto' | 'servico'>('all')
  const [farmacias, setFarmacias] = React.useState<Farmacia[]>([])
  const [produtos, setProdutos] = React.useState<Produto[]>([])
  const [servicos, setServicos] = React.useState<Servico[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSearch = React.useCallback(async () => {
    if (!termo.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      if (searchType === 'all' || searchType === 'farmacia') {
        const result = await farmaciaService.search(termo)
        setFarmacias(result.data)
      }
      if (searchType === 'all' || searchType === 'produto') {
        const result = await produtoService.search(termo)
        setProdutos(result.data)
      }
      if (searchType === 'all' || searchType === 'servico') {
        const result = await servicoService.getAll(1, 10)
        setServicos(result.data.filter((s) => s.nome.toLowerCase().includes(termo.toLowerCase())))
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao buscar')
    } finally {
      setIsLoading(false)
    }
  }, [termo, searchType])

  React.useEffect(() => {
    if (termo) {
      handleSearch()
    }
  }, [termo, searchType, handleSearch])

  const totalResults = farmacias.length + produtos.length + servicos.length

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-text mb-4">Buscar</h1>

        {/* Search Bar and Filters */}
        <div className="bg-white rounded-lg p-6 border border-neutral-border mb-6 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Buscar..."
                value={termo}
                onChange={(e) => {
                  const newTermo = e.target.value
                  navigate(`/search?termo=${encodeURIComponent(newTermo)}`)
                }}
                icon={<Search className="w-5 h-5" />}
              />
            </div>
            <Button variant="primary" onClick={handleSearch} isLoading={isLoading}>
              <Filter className="w-5 h-5" />
              Buscar
            </Button>
          </div>

          <Select
            label="Tipo de Busca"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as any)}
            options={[
              { value: 'all', label: 'Tudo' },
              { value: 'farmacia', label: 'Farmácias' },
              { value: 'produto', label: 'Produtos' },
              { value: 'servico', label: 'Serviços' },
            ]}
          />
        </div>

        {/* Results */}
        {isLoading ? (
          <LoadingSpinner fullScreen />
        ) : error ? (
          <ErrorState
            title="Erro na Busca"
            message={error}
            onRetry={handleSearch}
          />
        ) : totalResults === 0 && termo ? (
          <EmptyState
            icon={<Search className="w-12 h-12" />}
            title="Nenhum resultado encontrado"
            description={`Não encontramos nada para "${termo}"`}
          />
        ) : (
          <div className="space-y-8">
            {/* Farmácias */}
            {farmacias.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-neutral-text mb-4">Farmácias ({farmacias.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {farmacias.map((farmacia) => (
                    <FarmaciaCard
                      key={farmacia.id}
                      farmacia={farmacia}
                      onView={(id) => navigate(`/farmacia/${id}`)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Produtos */}
            {produtos.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-neutral-text mb-4">Produtos ({produtos.length})</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {produtos.map((produto) => (
                    <ProdutoCard
                      key={produto.id}
                      produto={produto}
                      onClick={(id) => navigate(`/produto/${id}`)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Serviços */}
            {servicos.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-neutral-text mb-4">Serviços ({servicos.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {servicos.map((servico) => (
                    <ServicoCard
                      key={servico.id}
                      servico={servico}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}
