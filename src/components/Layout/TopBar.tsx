import React from 'react'
import { LogOut, Menu, X, Home, Settings, Users, BarChart3, Box, ShoppingCart } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  requiredRole?: string[]
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/', icon: <Home className="w-5 h-5" /> },
  { label: 'Buscar', href: '/search', icon: <ShoppingCart className="w-5 h-5" /> },
]

const PHARMACY_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/farmacia/dashboard', icon: <BarChart3 className="w-5 h-5" /> },
  { label: 'Produtos', href: '/farmacia/produtos', icon: <Box className="w-5 h-5" /> },
  { label: 'Estoques', href: '/farmacia/estoques', icon: <ShoppingCart className="w-5 h-5" /> },
  { label: 'Serviços', href: '/farmacia/servicos', icon: <Settings className="w-5 h-5" /> },
]

const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: <BarChart3 className="w-5 h-5" /> },
  { label: 'Farmácias', href: '/admin/farmacias', icon: <Home className="w-5 h-5" /> },
  { label: 'Produtos', href: '/admin/produtos', icon: <Box className="w-5 h-5" /> },
  { label: 'Categorias', href: '/admin/categorias', icon: <Settings className="w-5 h-5" /> },
  { label: 'Usuários', href: '/admin/users', icon: <Users className="w-5 h-5" /> },
]

export const TopBar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const { user, role, logout, authDisabled } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const getNavItems = () => {
    if (role === 'gerente') return PHARMACY_NAV_ITEMS
    if (role === 'admin') return ADMIN_NAV_ITEMS
    return NAV_ITEMS
  }

  const navItems = authDisabled
    ? [...NAV_ITEMS, ...PHARMACY_NAV_ITEMS, ...ADMIN_NAV_ITEMS]
    : getNavItems()

  const roleLabel = authDisabled
    ? 'Acesso livre'
    : role === 'admin'
      ? 'Administrador'
      : role === 'gerente'
        ? 'Farmácia'
        : 'Usuário'

  const roleStyles = authDisabled
    ? 'bg-neutral-100 text-neutral-700'
    : role === 'admin'
      ? 'bg-amber-100 text-amber-800'
      : role === 'gerente'
        ? 'bg-emerald-100 text-emerald-800'
        : 'bg-slate-100 text-slate-700'

  const avatarStyles = authDisabled
    ? 'bg-neutral-200 text-neutral-800'
    : role === 'admin'
      ? 'bg-amber-200 text-amber-900'
      : role === 'gerente'
        ? 'bg-emerald-200 text-emerald-900'
        : 'bg-slate-200 text-slate-800'

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">F</span>
            </div>
            <span className="text-lg font-bold text-neutral-text hidden sm:inline">Farmácia</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.href
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-neutral-text hover:bg-gray-100'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-neutral-text">{user.name}</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${roleStyles}`}>
                      {roleLabel}
                    </span>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${avatarStyles}`}>
                    <span className="text-sm font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                {!authDisabled && (
                  <button
                    onClick={handleLogout}
                    className="p-2 text-neutral-text hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                )}
              </>
            ) : !authDisabled ? (
              <Link
                to="/login"
                className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700"
              >
                Login
              </Link>
            ) : null}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-neutral-text hover:bg-gray-100 rounded-md"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-neutral-border">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
                  location.pathname === item.href
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-neutral-text'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
