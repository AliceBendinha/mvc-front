import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '@/components/Layout/Layout'
import { Button } from '@/components/Button'
import { SearchBar } from '@/components/SearchBar'
import { ArrowRight, MapPin, Package, Pill } from 'lucide-react'

export const HomePage: React.FC = () => {
  const navigate = useNavigate()

  const handleSearch = (termo: string) => {
    navigate(`/search?termo=${encodeURIComponent(termo)}`)
  }

  return (
    <Layout>
      {/* Hero Section */}
      <div className="mb-12">
        <div className="relative bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0"
              style={{
              backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"><defs><pattern id="grid" width="40" height="40"patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40"fill="none" stroke="white" stroke-width="1"/></pattern></defs><rect width="1200" height="600" fill="url(#grid)" /></svg>
              `)})`,
              }}/>

          </div>

          <div className="relative px-6 sm:px-12 py-16 text-white">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Encontre Farmácias e Medicamentos</h1>
            <p className="text-lg text-primary-100 mb-8 max-w-2xl">
              Busque medicamentos, serviços farmacêuticos e farmácias perto de você em tempo real.
            </p>

            <div className="max-w-2xl">
              <SearchBar
                onSearch={handleSearch}
                placeholder="O que você procura? (ex: Dipirona, Farmácia Central...)"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-lg p-6 border border-neutral-border hover:shadow-md transition-shadow">
          <Pill className="w-12 h-12 text-primary-600 mb-4" />
          <h3 className="text-lg font-semibold text-neutral-text mb-2">Medicamentos</h3>
          <p className="text-sm text-neutral-muted">
            Busque medicamentos e encontre farmácias com disponibilidade em sua região.
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-neutral-border hover:shadow-md transition-shadow">
          <MapPin className="w-12 h-12 text-primary-600 mb-4" />
          <h3 className="text-lg font-semibold text-neutral-text mb-2">Localização</h3>
          <p className="text-sm text-neutral-muted">
            Veja farmácias próximas a você e trace rotas para visitá-las.
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-neutral-border hover:shadow-md transition-shadow">
          <Package className="w-12 h-12 text-primary-600 mb-4" />
          <h3 className="text-lg font-semibold text-neutral-text mb-2">Serviços</h3>
          <p className="text-sm text-neutral-muted">
            Descubra serviços farmacêuticos disponíveis nas farmácias próximas.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-50 rounded-lg p-8 border border-primary-200">
        <h2 className="text-2xl font-bold text-neutral-text mb-4">Comece sua Busca Agora</h2>
        <p className="text-neutral-muted mb-6">
          Use a barra de busca acima para encontrar medicamentos, farmácias e serviços.
        </p>
        <Button
          onClick={() => navigate('/search')}
          icon={<ArrowRight className="w-5 h-5" />}
        >
          Ir para Busca Completa
        </Button>
      </div>
    </Layout>
  )
}
