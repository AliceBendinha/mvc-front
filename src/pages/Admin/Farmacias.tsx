import React from 'react'
import { Layout } from '@/components/Layout/Layout'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { LoadingSpinner, EmptyState } from '@/components/States'
import { farmaciaService } from '@/services/farmacia'
import { Farmacia } from '@/types'
import { Plus, Edit2, Trash2, Users } from 'lucide-react'

export const AdminFarmaciasPage: React.FC = () => {
  const [farmacias, setFarmacias] = React.useState<Farmacia[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [showForm, setShowForm] = React.useState(false)
  const [editingFarmacia, setEditingFarmacia] = React.useState<Farmacia | null>(null)
  const [formError, setFormError] = React.useState<string | null>(null)
  const [form, setForm] = React.useState({
    nome: '',
    localizacao: '',
  })

  React.useEffect(() => {
    loadFarmacias()
  }, [])

  const loadFarmacias = async () => {
    setIsLoading(true)
    try {
      const response = await farmaciaService.getAll()
      setFarmacias(response.data)
    } catch (error) {
      console.error('Erro ao carregar farmácias:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFormChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setForm({ nome: '', localizacao: '' })
    setEditingFarmacia(null)
    setFormError(null)
  }

  const handleEdit = (farmacia: Farmacia) => {
    setEditingFarmacia(farmacia)
    setForm({
      nome: farmacia.nome,
      localizacao: farmacia.localizacao || '',
    })
    setShowForm(true)
    setFormError(null)
  }

  const handleDelete = async (farmaciaId: number) => {
    const confirmDelete = window.confirm('Tem certeza que deseja excluir esta farmácia?')
    if (!confirmDelete) return

    try {
      await farmaciaService.delete(farmaciaId)
      setFarmacias((prev) => prev.filter((f) => f.id !== farmaciaId))
    } catch (error) {
      console.error('Erro ao excluir farmácia:', error)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setFormError(null)

    if (!form.nome.trim() || !form.localizacao.trim()) {
      setFormError('Nome e localização são obrigatórios.')
      return
    }

    setIsSubmitting(true)
    try {
      if (editingFarmacia) {
        await farmaciaService.update(editingFarmacia.id, {
          nome: form.nome.trim(),
          localizacao: form.localizacao.trim(),
        })
      } else {
        await farmaciaService.create({
          nome: form.nome.trim(),
          localizacao: form.localizacao.trim(),
        })
      }

      await loadFarmacias()
      resetForm()
      setShowForm(false)
    } catch (error: any) {
      setFormError(error.response?.data?.message || 'Erro ao salvar farmácia.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return <LoadingSpinner fullScreen />

  return (
    <Layout>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-neutral-text">Gestão de Farmácias</h1>
        <Button
          variant="primary"
          icon={<Plus className="w-5 h-5" />}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Fechar' : 'Adicionar Farmácia'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <h2 className="text-lg font-semibold text-neutral-text mb-4">
            {editingFarmacia ? 'Editar Farmácia' : 'Nova Farmácia'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nome"
                placeholder="Ex: Farmácia Central"
                required
                value={form.nome}
                onChange={(e) => handleFormChange('nome', e.target.value)}
              />
              <Input
                label="Localização"
                placeholder="Ex: Rua Principal, 123"
                required
                value={form.localizacao}
                onChange={(e) => handleFormChange('localizacao', e.target.value)}
              />
            </div>
            {formError && <p className="text-sm text-error">{formError}</p>}
            <div className="flex gap-2">
              <Button type="submit" variant="primary" isLoading={isSubmitting}>
                {editingFarmacia ? 'Atualizar' : 'Salvar'}
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

      {farmacias.length === 0 ? (
        <EmptyState
          icon={<Users className="w-12 h-12" />}
          title="Nenhuma farmácia cadastrada"
          description="Comece adicionando a primeira farmácia"
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-border">
                  <th className="text-left py-3 px-4 font-semibold text-neutral-text">Nome</th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-text">Localização</th>
                  <th className="text-center py-3 px-4 font-semibold text-neutral-text">Ações</th>
                </tr>
              </thead>
              <tbody>
                {farmacias.map((farmacia) => (
                  <tr key={farmacia.id} className="border-b border-neutral-border hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-neutral-text">{farmacia.nome}</td>
                    <td className="py-3 px-4 text-neutral-muted">
                      {farmacia.localizacao || '-'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded"
                          aria-label="Editar farmácia"
                          onClick={() => handleEdit(farmacia)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-error hover:bg-red-50 rounded"
                          aria-label="Excluir farmácia"
                          onClick={() => handleDelete(farmacia.id)}
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
