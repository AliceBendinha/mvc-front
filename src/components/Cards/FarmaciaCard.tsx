import React from 'react'
import { MapPin, Phone, Mail, Star } from 'lucide-react'
import { Card } from '../Card'
import { Button } from '../Button'
import { Farmacia } from '@/types'

interface FarmaciaCardProps {
  farmacia: Farmacia
  onView?: (id: number) => void
  onSelect?: (id: number) => void
}

export const FarmaciaCard: React.FC<FarmaciaCardProps> = ({ farmacia, onView, onSelect }) => {
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300'
            }`}
          />
        ))}
        <span className="text-sm text-neutral-muted ml-1">({rating.toFixed(1)})</span>
      </div>
    )
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-neutral-text">{farmacia.nome}</h3>
          {farmacia.avaliacao && renderStars(farmacia.avaliacao)}
          {farmacia.localizacao && (
            <p className="flex items-center gap-2 text-sm text-neutral-muted mt-1">
              <MapPin className="w-4 h-4" />
              {farmacia.localizacao}
            </p>
          )}
        </div>

        <div className="flex gap-4 text-sm text-neutral-muted">
          {farmacia.telefone && (
            <a href={`tel:${farmacia.telefone}`} className="flex items-center gap-1 hover:text-primary-600">
              <Phone className="w-4 h-4" />
              {farmacia.telefone}
            </a>
          )}
          {farmacia.email && (
            <a href={`mailto:${farmacia.email}`} className="flex items-center gap-1 hover:text-primary-600">
              <Mail className="w-4 h-4" />
              {farmacia.email}
            </a>
          )}
        </div>

        <div className="flex gap-2 pt-3 border-t border-neutral-border">
          {onView && (
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              onClick={() => onView(farmacia.id)}
            >
              Ver Detalhes
            </Button>
          )}
          {onSelect && (
            <Button
              variant="primary"
              size="sm"
              fullWidth
              onClick={() => onSelect(farmacia.id)}
            >
              Selecionar
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
