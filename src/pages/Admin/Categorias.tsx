import React from 'react'
import { Layout } from '@/components/Layout/Layout'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { LoadingSpinner, EmptyState } from '@/components/States'
import { categoriaService } from '@/services/categoria-servico'
import { Categoria } from '@/types'
import { Plus, Edit2, Trash2, Tag } from 'lucide-react'

export const AdminCategoriasPage: React.FC = () => {
  const [categorias, setCategorias] = React.useState<Categoria[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [showForm, setShowForm] = React.useState(false)
  const [editingCategoria, setEditingCategoria] = React.useState<Categoria | null>(null)
  const [formError, setFormError] = React.useState<string | null>(null)
  const [form, setForm] = React.useState({ nome: '' })

  React.useEffect(() => {
    loadCategorias()
  }, [])

  const loadCategorias = async () => {
    setIsLoading(true)
    try {
      const response = await categoriaService.getAll()
      setCategorias(response)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFormChange = (value: string) => {
    setForm({ nome: value })
  }

  const resetForm = () => {
    setForm({ nome: '' })
    setEditingCategoria(null)
    setFormError(null)
  }

  const handleEdit = (categoria: Categoria) => {
    setEditingCategoria(categoria)
    setForm({ nome: categoria.nome })
    setShowForm(true)
    setFormError(null)
  }

  const handleDelete = async (categoriaId: number) => {
    const confirmDelete = window.confirm('Tem certeza que deseja excluir esta categoria?')
    if (!confirmDelete) return

    try {
      await categoriaService.delete(categoriaId)
      setCategorias((prev) => prev.filter((c) => c.id !== categoriaId))
    } catch (error) {
      console.error('Erro ao excluir categoria:', error)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setFormError(null)

    if (!form.nome.trim()) {
      setFormError('Nome da categoria é obrigatório.')
      return
    }

    setIsSubmitting(true)
    try {
      if (editingCategoria) {
        await categoriaService.update(editingCategoria.id, { nome: form.nome.trim() })
      } else {
        await categoriaService.create({ nome: form.nome.trim() })
      }

      await loadCategorias()
      resetForm()
      setShowForm(false)
    } catch (error: any) {
      setFormError(error.response?.data?.message || 'Erro ao salvar categoria.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return <LoadingSpinner fullScreen />

  return (
    <Layout>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-neutral-text">Gestão de Categorias</h1>
        <Button
          variant="primary"
          icon={<Plus className="w-5 h-5" />}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Fechar' : 'Adicionar Categoria'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <h2 className="text-lg font-semibold text-neutral-text mb-4">
            {editingCategoria ? 'Editar Categoria' : 'Nova Categoria'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nome"
              placeholder="Ex: Analgésicos"
              required
              value={form.nome}
              onChange={(e) => handleFormChange(e.target.value)}
            />
            {formError && <p className="text-sm text-error">{formError}</p>}
            <div className="flex gap-2">
              <Button type="submit" variant="primary" isLoading={isSubmitting}>
                {editingCategoria ? 'Atualizar' : 'Salvar'}
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

      {categorias.length === 0 ? (
        <EmptyState
          icon={<Tag className="w-12 h-12" />}
          title="Nenhuma categoria cadastrada"
          description="Comece adicionando a primeira categoria"
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-border">
                  <th className="text-left py-3 px-4 font-semibold text-neutral-text">Nome</th>
                  <th className="text-center py-3 px-4 font-semibold text-neutral-text">Ações</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map((categoria) => (
                  <tr key={categoria.id} className="border-b border-neutral-border hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-neutral-text">{categoria.nome}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded"
                          aria-label="Editar categoria"
                          onClick={() => handleEdit(categoria)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-error hover:bg-red-50 rounded"
                          aria-label="Excluir categoria"
                          onClick={() => handleDelete(categoria.id)}
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
