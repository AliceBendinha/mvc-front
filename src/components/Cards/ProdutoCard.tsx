import React from 'react'
import { AlertCircle, Check } from 'lucide-react'
import { Card } from '../Card'
import { Produto, Estoque } from '@/types'

interface ProdutoCardProps {
  produto: Produto
  estoque?: Estoque
  onClick?: (id: number) => void
  showPrice?: boolean
  showAvailability?: boolean
}

export const ProdutoCard: React.FC<ProdutoCardProps> = ({
  produto,
  estoque,
  onClick,
  showPrice = true,
  showAvailability = true,
}) => {
  const isAvailable = estoque ? estoque.quantidade > 0 : true
  const isLowStock = estoque && estoque.quantidade <= estoque.stock_minimo

  return (
    <Card
      className="hover:shadow-lg transition-all cursor-pointer"
      onClick={() => onClick?.(produto.id)}
    >
      <div className="space-y-2">
        <div>
          <h4 className="font-semibold text-neutral-text truncate">{produto.nome}</h4>
          <p className="text-xs text-neutral-muted">Cod: {produto.codigo}</p>
        </div>

        {showPrice && (
          <p className="text-lg font-bold text-primary-600">R$ {produto.preco.toFixed(2)}</p>
        )}

        {showAvailability && estoque && (
          <div className="pt-2 border-t border-neutral-border">
            {isLowStock && (
              <div className="flex items-center gap-2 text-xs text-alert">
                <AlertCircle className="w-4 h-4" />
                Stock baixo ({estoque.quantidade} un.)
              </div>
            )}
            {isAvailable && !isLowStock && (
              <div className="flex items-center gap-2 text-xs text-success">
                <Check className="w-4 h-4" />
                {estoque.quantidade} unidades disponíveis
              </div>
            )}
            {!isAvailable && (
              <div className="flex items-center gap-2 text-xs text-disabled">
                <AlertCircle className="w-4 h-4" />
                Indisponível
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
