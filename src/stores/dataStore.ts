import { create } from 'zustand'
import { Farmacia, Produto, Estoque } from '@/types'

interface DataStore {
  // Farmacias
  farmacias: Farmacia[]
  setFarmacias: (farmacias: Farmacia[]) => void
  addFarmacia: (farmacia: Farmacia) => void
  updateFarmacia: (id: number, farmacia: Partial<Farmacia>) => void
  removeFarmacia: (id: number) => void

  // Produtos
  produtos: Produto[]
  setProdutos: (produtos: Produto[]) => void
  addProduto: (produto: Produto) => void
  updateProduto: (id: number, produto: Partial<Produto>) => void
  removeProduto: (id: number) => void

  // Estoques
  estoques: Estoque[]
  setEstoques: (estoques: Estoque[]) => void
  addEstoque: (estoque: Estoque) => void
  updateEstoque: (id: number, estoque: Partial<Estoque>) => void
  removeEstoque: (id: number) => void

  // Búsquedas
  searchResults: any[]
  setSearchResults: (results: any[]) => void
  clearSearchResults: () => void
}

export const useDataStore = create<DataStore>((set) => ({
  farmacias: [],
  setFarmacias: (farmacias) => set({ farmacias }),
  addFarmacia: (farmacia) => set((state) => ({ farmacias: [...state.farmacias, farmacia] })),
  updateFarmacia: (id, farmacia) =>
    set((state) => ({
      farmacias: state.farmacias.map((f) => (f.id === id ? { ...f, ...farmacia } : f)),
    })),
  removeFarmacia: (id) =>
    set((state) => ({ farmacias: state.farmacias.filter((f) => f.id !== id) })),

  produtos: [],
  setProdutos: (produtos) => set({ produtos }),
  addProduto: (produto) => set((state) => ({ produtos: [...state.produtos, produto] })),
  updateProduto: (id, produto) =>
    set((state) => ({
      produtos: state.produtos.map((p) => (p.id === id ? { ...p, ...produto } : p)),
    })),
  removeProduto: (id) =>
    set((state) => ({ produtos: state.produtos.filter((p) => p.id !== id) })),

  estoques: [],
  setEstoques: (estoques) => set({ estoques }),
  addEstoque: (estoque) => set((state) => ({ estoques: [...state.estoques, estoque] })),
  updateEstoque: (id, estoque) =>
    set((state) => ({
      estoques: state.estoques.map((e) => (e.id === id ? { ...e, ...estoque } : e)),
    })),
  removeEstoque: (id) =>
    set((state) => ({ estoques: state.estoques.filter((e) => e.id !== id) })),

  searchResults: [],
  setSearchResults: (searchResults) => set({ searchResults }),
  clearSearchResults: () => set({ searchResults: [] }),
}))
