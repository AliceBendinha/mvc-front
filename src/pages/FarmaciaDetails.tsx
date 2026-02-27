import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Layout } from '@/components/Layout/Layout'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { LoadingSpinner, ErrorState } from '@/components/States'
import { farmaciaService } from '@/services/farmacia'
import { servicoService } from '@/services/categoria-servico'
import { Farmacia, Servico } from '@/types'
import { MapPin, Phone, Mail, ArrowLeft, Navigation } from 'lucide-react'

export const FarmaciaDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [farmacia, setFarmacia] = React.useState<Farmacia | null>(null)
  const [servicos, setServicos] = React.useState<Servico[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const loadData = async () => {
      if (!id) return

      setIsLoading(true)
      setError(null)

      try {
        const farmaciaData = await farmaciaService.getById(parseInt(id))
        setFarmacia(farmaciaData)

        const servicosData = await servicoService.getByFarmacia(parseInt(id))
        setServicos(servicosData)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao carregar farmácia')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [id])

  if (isLoading) return <LoadingSpinner fullScreen />
  if (error) return <Layout><ErrorState title="Erro" message={error} onRetry={() => window.location.reload()} /></Layout>
  if (!farmacia) return <Layout><ErrorState title="Farmácia não encontrada" message="A farmácia solicitada não existe" /></Layout>

  return (
    <Layout>
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          icon={<ArrowLeft className="w-5 h-5" />}
        >
          Voltar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h1 className="text-3xl font-bold text-neutral-text mb-4">{farmacia.nome}</h1>

            <div className="space-y-3">
              {farmacia.localizacao && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-neutral-text">Localização</p>
                    <p className="text-neutral-muted">{farmacia.localizacao}</p>
                  </div>
                </div>
              )}

              {farmacia.telefone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary-600" />
                  <a href={`tel:${farmacia.telefone}`} className="text-primary-600 hover:underline">
                    {farmacia.telefone}
                  </a>
                </div>
              )}

              {farmacia.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary-600" />
                  <a href={`mailto:${farmacia.email}`} className="text-primary-600 hover:underline">
                    {farmacia.email}
                  </a>
                </div>
              )}
            </div>
          </Card>

          {/* Mapa */}
          {farmacia.latitude && farmacia.longitude && (
            <Card>
              <h2 className="text-lg font-semibold text-neutral-text mb-4">Localização no Mapa</h2>
              <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                <p className="text-neutral-muted">
                  Mapa: {farmacia.latitude}, {farmacia.longitude}
                </p>
              </div>
              <Button
                className="w-full mt-4"
                icon={<Navigation className="w-5 h-5" />}
                onClick={() => {
                  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${farmacia.latitude},${farmacia.longitude}`
                  window.open(mapsUrl, '_blank')
                }}
              >
                Traçar Rota
              </Button>
            </Card>
          )}

          {/* Serviços */}
          {servicos.length > 0 && (
            <Card>
              <h2 className="text-lg font-semibold text-neutral-text mb-4">Serviços</h2>
              <div className="space-y-3">
                {servicos.map((servico) => (
                  <div key={servico.id} className="p-3 border border-neutral-border rounded-lg">
                    <h3 className="font-medium text-neutral-text">{servico.nome}</h3>
                    {servico.descricao && (
                      <p className="text-sm text-neutral-muted mt-1">{servico.descricao}</p>
                    )}
                    {servico.preco && (
                      <p className="text-lg font-bold text-primary-600 mt-2">
                        R$ {servico.preco.toFixed(2)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <h3 className="font-semibold text-neutral-text mb-3">Informações Gerais</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-neutral-muted">ID</p>
                <p className="font-medium text-neutral-text">#{farmacia.id}</p>
              </div>
              {farmacia.created_at && (
                <div>
                  <p className="text-neutral-muted">Cadastro</p>
                  <p className="font-medium text-neutral-text">
                    {new Date(farmacia.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              )}
            </div>
          </Card>

          <Button
            variant="primary"
            fullWidth
            onClick={() => navigate('/search')}
          >
            Continuar Buscando
          </Button>
        </div>
      </div>
    </Layout>
  )
}
