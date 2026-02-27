import React from 'react'
import { Search } from 'lucide-react'
import { Input } from './Input'

interface SearchBarProps {
  onSearch: (termo: string) => void
  placeholder?: string
  isLoading?: boolean
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Buscar produtos, farmácias ou serviços...',
  isLoading = false,
}) => {
  const [termo, setTermo] = React.useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (termo.trim()) {
      onSearch(termo)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Input
        type="text"
        placeholder={placeholder}
        value={termo}
        onChange={(e) => setTermo(e.target.value)}
        icon={<Search className="w-5 h-5" />}
        disabled={isLoading}
      />
    </form>
  )
}
