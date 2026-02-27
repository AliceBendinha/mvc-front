// Autenticação
export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  type: 'bearer'
  expires_in: number
}

export interface AuthState {
  token: string | null
  user: User | null
  role: 'admin' | 'gerente' | 'usuario' | null
  isAuthenticated: boolean
}

// Usuário
export interface User {
  id: number
  name: string
  email: string
  role: Role
  farmacias?: Farmacia[]
  created_at: string
  updated_at: string
}

export interface Role {
  id: number
  name: string
  description: string
}

// Farmácia
export interface Farmacia {
  id: number
  nome: string
  localizacao?: string
  telefone?: string
  email?: string
  avaliacao?: number
  latitude?: number
  longitude?: number
  user_id: number
  created_at: string
  updated_at: string
}

export interface CreateFarmaciaRequest {
  nome: string
  localizacao?: string
  telefone?: string
  email?: string
  latitude?: number
  longitude?: number
}

// Localização
export interface Localizacao {
  id: number
  farmacia_id: number
  endereco: string
  cidade: string
  estado: string
  cep: string
  latitude: number
  longitude: number
}

// Produto
export interface Produto {
  id: number
  nome: string
  codigo: string
  preco: number
  categoria_id: number
  data_validade: string
  descricao?: string
  created_at: string
  updated_at: string
}

export interface CreateProdutoRequest {
  nome: string
  codigo: string
  preco: number
  categoria_id: number
  data_validade: string
  descricao?: string
}

// Categoria
export interface Categoria {
  id: number
  nome: string
  descricao?: string
}

// Estoque
export interface Estoque {
  id: number
  farmacia_id: number
  produto_id: number
  quantidade: number
  stock_minimo: number
  em_falta?: boolean
  percentual_estoque?: number
  produto?: Produto
  farmacia?: Farmacia
  created_at: string
  updated_at: string
}

export interface CreateEstoqueRequest {
  farmacia_id: number
  produto_id: number
  quantidade: number
  stock_minimo: number
}

export interface ReporEstoqueRequest {
  quantidade: number
}

// Serviço
export interface Servico {
  id: number
  farmacia_id: number
  nome: string
  descricao?: string
  preco?: number
  disponivel: boolean
  created_at: string
  updated_at: string
}

export interface CreateServicoRequest {
  farmacia_id: number
  nome: string
  descricao?: string
  preco?: number
  disponivel?: boolean
}

// Pesquisa
export interface Pesquisa {
  id: number
  user_id: number
  termo: string
  tipo: 'produto' | 'farmacia' | 'servico'
  resultados_count: number
  created_at: string
}

// Relatorio
export interface Relatorio {
  id: number
  farmacia_id: number
  periodo_inicio: string
  periodo_fim: string
  total_vendas: number
  produtos_mais_vendidos: any[]
  status_estoque: any
  created_at: string
}

// API Response
export interface ApiResponse<T> {
  data: T
  message?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  from: number
  last_page: number
  per_page: number
  to: number
  total: number
}

// Busca
export interface SearchFilters {
  termo?: string
  tipo?: 'produto' | 'farmacia' | 'servico'
  categoria_id?: number
  preco_min?: number
  preco_max?: number
  em_stock?: boolean
  latitude?: number
  longitude?: number
  raio_km?: number
}

// Dashboard
export interface DashboardStats {
  total_farmacias: number
  total_produtos: number
  total_estoque: number
  produtos_em_falta: number
  pesquisas_mes: number
}

export interface ProdutoComDisponibilidade {
  produto: Produto
  disponibilidades: {
    farmacia_id: number
    farmacia_nome: string
    quantidade: number
    em_falta: boolean
    preco?: number
  }[]
}
