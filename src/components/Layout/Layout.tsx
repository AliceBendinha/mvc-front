import React from 'react'

interface LayoutProps {
  children: React.ReactNode
  sidebar?: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children, sidebar }) => {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-bg">
      {/* Sidebar (opcional) */}
      {sidebar && (
        <div className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-neutral-border hidden lg:block overflow-y-auto">
          {sidebar}
        </div>
      )}

      {/* Main Content */}
      <main className={`flex-1 pt-16 ${sidebar ? 'lg:ml-64' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-border mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-neutral-text mb-4">Sobre</h3>
              <p className="text-sm text-neutral-muted">Sistema de gestão de farmácias com busca, controle de estoque e serviços.</p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-text mb-4">Links Rápidos</h3>
              <ul className="space-y-2 text-sm text-neutral-muted">
                <li><a href="/" className="hover:text-primary-600">Home</a></li>
                <li><a href="/search" className="hover:text-primary-600">Buscar</a></li>
                <li><a href="/login" className="hover:text-primary-600">Login</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-text mb-4">Contato</h3>
              <ul className="space-y-2 text-sm text-neutral-muted">
                <li>Email: info@farmacia.com</li>
                <li>Telefone: (11) 99999-9999</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-border pt-8 flex items-center justify-between">
            <p className="text-sm text-neutral-muted">© 2026 Farmácia. Todos os direitos reservados.</p>
            <div className="flex gap-4">
              <a href="#" className="text-neutral-muted hover:text-primary-600 text-sm">Privacidade</a>
              <a href="#" className="text-neutral-muted hover:text-primary-600 text-sm">Termos</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
