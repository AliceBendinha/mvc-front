import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { Layout } from '@/components/Layout/Layout'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Select } from '@/components/Select'
import { LoadingSpinner, EmptyState } from '@/components/States'
import { produtoService } from '@/services/produto'
import { categoriaService } from '@/services/categoria-servico'
import { Categoria, Produto } from '@/types'
import { Plus, Edit2, Trash2, Search } from 'lucide-react'

export const FarmaciaProductsPage: React.FC = () => {
  const [produtos, setProdutos] = React.useState<Produto[]>([])
  const [categorias, setCategorias] = React.useState<Categoria[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [showForm, setShowForm] = React.useState(false)
  const [editingProduto, setEditingProduto] = React.useState<Produto | null>(null)
  const [formError, setFormError] = React.useState<string | null>(null)
  const [searchParams] = useSearchParams()
  const [form, setForm] = React.useState({
    nome: '',
    codigo: '',
    preco: '',
    data_validade: '',
    categoria_id: '',
    descricao: '',
  })

  React.useEffect(() => {
    loadProdutos()
    loadCategorias()
  }, [])

  React.useEffect(() => {
    if (searchParams.get('novo') === '1') {
      setShowForm(true)
    }
  }, [searchParams])

  const loadProdutos = async () => {
    setIsLoading(true)
    try {
      const response = await produtoService.getAll()
      setProdutos(response.data)
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadCategorias = async () => {
    try {
      const response = await categoriaService.getAll()
      setCategorias(response)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  }

  const handleFormChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setForm({
      nome: '',
      codigo: '',
      preco: '',
      data_validade: '',
      categoria_id: '',
      descricao: '',
    })
    setEditingProduto(null)
    setFormError(null)
  }

  const handleEdit = (produto: Produto) => {
    setEditingProduto(produto)
    setForm({
      nome: produto.nome,
      codigo: produto.codigo,
      preco: produto.preco.toString(),
      data_validade: produto.data_validade || '',
      categoria_id: produto.categoria_id.toString(),
      descricao: produto.descricao || '',
    })
    setShowForm(true)
    setFormError(null)
  }

  const handleDelete = async (produtoId: number) => {
    const confirmDelete = window.confirm('Tem certeza que deseja excluir este produto?')
    if (!confirmDelete) return

    try {
      await produtoService.delete(produtoId)
      setProdutos((prev) => prev.filter((p) => p.id !== produtoId))
    } catch (error) {
      console.error('Erro ao excluir produto:', error)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setFormError(null)

    if (!form.nome.trim() || !form.codigo.trim() || !form.preco || !form.categoria_id) {
      setFormError('Preencha os campos obrigatórios.')
      return
    }

    const preco = Number(form.preco)
    const categoriaId = Number(form.categoria_id)

    if (Number.isNaN(preco) || preco <= 0) {
      setFormError('Informe um preço válido.')
      return
    }

    if (Number.isNaN(categoriaId)) {
      setFormError('Selecione uma categoria válida.')
      return
    }

    const payload: any = {
      nome: form.nome.trim(),
      codigo: form.codigo.trim(),
      preco,
      categoria_id: categoriaId,
    }

    if (form.data_validade) payload.data_validade = form.data_validade
    if (form.descricao?.trim()) payload.descricao = form.descricao.trim()

    setIsSubmitting(true)
    try {
      if (editingProduto) {
        await produtoService.update(editingProduto.id, payload)
      } else {
        await produtoService.create(payload)
      }
      await loadProdutos()
      resetForm()
      setShowForm(false)
    } catch (error: any) {
      setFormError(error.response?.data?.message || 'Erro ao salvar produto.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredProdutos = produtos.filter(
    (p) =>
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) return <LoadingSpinner fullScreen />

  return (
    <Layout>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-neutral-text">Produtos</h1>
        <Button
          variant="primary"
          icon={<Plus className="w-5 h-5" />}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Fechar' : 'Adicionar Produto'}
        </Button>
      </div>

      {/* Formulário */}
      {showForm && (
        <Card className="mb-6">
          <h2 className="text-lg font-semibold text-neutral-text mb-4">
            {editingProduto ? 'Editar Produto' : 'Novo Produto'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nome"
                placeholder="Ex: Dipirona 500mg"
                required
                value={form.nome}
                onChange={(e) => handleFormChange('nome', e.target.value)}
              />
              <Input
                label="Código"
                placeholder="Ex: DIP-500-001"
                required
                value={form.codigo}
                onChange={(e) => handleFormChange('codigo', e.target.value)}
              />
              <Input
                label="Preço"
                type="number"
                step="0.01"
                placeholder="0.00"
                required
                value={form.preco}
                onChange={(e) => handleFormChange('preco', e.target.value)}
              />
              <Input
                label="Validade"
                type="date"
                value={form.data_validade}
                onChange={(e) => handleFormChange('data_validade', e.target.value)}
              />
              <Select
                label="Categoria"
                required
                value={form.categoria_id}
                onChange={(e) => handleFormChange('categoria_id', e.target.value)}
                options={categorias.map((categoria) => ({
                  value: categoria.id,
                  label: categoria.nome,
                }))}
                placeholder={
                  categorias.length === 0
                    ? 'Sem categorias cadastradas'
                    : 'Selecione uma categoria'
                }
              />
            </div>
            <Input
              label="Descrição"
              placeholder="Descrição do produto"
              value={form.descricao}
              onChange={(e) => handleFormChange('descricao', e.target.value)}
            />
            {formError && <p className="text-sm text-error">{formError}</p>}
            <div className="flex gap-2">
              <Button type="submit" variant="primary" isLoading={isSubmitting}>
                {editingProduto ? 'Atualizar' : 'Salvar'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  resetForm()
                  setShowForm(false)
                }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Busca */}
      <Card className="mb-6">
        <Input
          type="text"
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search className="w-5 h-5" />}
        />
      </Card>

      {/* Tabela */}
      {filteredProdutos.length === 0 ? (
        <EmptyState icon={<Search className="w-12 h-12" />} title="Nenhum produto encontrado" />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-border">
                  <th className="text-left py-3 px-4 font-semibold text-neutral-text">Nome</th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-text">Código</th>
                  <th className="text-right py-3 px-4 font-semibold text-neutral-text">Preço</th>
                  <th className="text-center py-3 px-4 font-semibold text-neutral-text">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProdutos.map((produto) => (
                  <tr key={produto.id} className="border-b border-neutral-border hover:bg-gray-50">
                    <td className="py-3 px-4 text-neutral-text">{produto.nome}</td>
                    <td className="py-3 px-4 text-neutral-muted text-sm">{produto.codigo}</td>
                    <td className="py-3 px-4 text-right font-semibold text-primary-600">
                      R$ {produto.preco.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded"
                          onClick={() => handleEdit(produto)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-error hover:bg-red-50 rounded"
                          onClick={() => handleDelete(produto.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </Layout>
  )
}
