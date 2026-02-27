import React from 'react'
import { Servico } from '@/types'
import { Card } from '../Card'
import { Button } from '../Button'

interface ServicoCardProps {
  servico: Servico
  onSelect?: (id: number) => void
  onEdit?: (id: number) => void
}

export const ServicoCard: React.FC<ServicoCardProps> = ({ servico, onSelect, onEdit }) => {
  return (
    <Card>
      <div className="space-y-3">
        <div>
          <h4 className="font-semibold text-neutral-text">{servico.nome}</h4>
          {servico.descricao && (
            <p className="text-sm text-neutral-muted mt-1">{servico.descricao}</p>
          )}
        </div>

        {servico.preco && (
          <p className="text-lg font-bold text-primary-600">R$ {servico.preco.toFixed(2)}</p>
        )}

        <div className="flex items-center gap-2">
          {servico.disponivel ? (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
              Disponível
            </span>
          ) : (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              Indisponível
            </span>
          )}
        </div>

        {(onSelect || onEdit) && (
          <div className="flex gap-2 pt-3 border-t border-neutral-border">
            {onSelect && (
              <Button variant="primary" size="sm" fullWidth onClick={() => onSelect(servico.id)}>
                Selecionar
              </Button>
            )}
            {onEdit && (
              <Button variant="ghost" size="sm" fullWidth onClick={() => onEdit(servico.id)}>
                Editar
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
