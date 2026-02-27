import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { TopBar } from '@/components/Layout/TopBar'
import { NotificationContainer } from '@/components/Notifications/NotificationContainer'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useAuthStore } from '@/stores/authStore'

// Public Pages
import { LoginPage } from '@/pages/Login'
import { HomePage } from '@/pages/Home'
import { SearchPage } from '@/pages/Search'
import { FarmaciaDetailsPage } from '@/pages/FarmaciaDetails'

// Farmacia Pages
import { FarmaciaDashboardPage } from '@/pages/Farmacia/Dashboard'
import { FarmaciaProductsPage } from '@/pages/Farmacia/Products'

// Admin Pages
import { AdminDashboardPage } from '@/pages/Admin/Dashboard'
import { AdminFarmaciasPage } from '@/pages/Admin/Farmacias'
import { AdminCategoriasPage } from '@/pages/Admin/Categorias'

export const App: React.FC = () => {
  const { isAuthenticated, checkAuth } = useAuthStore()

  React.useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <Router>
      <NotificationContainer />

      {/* Top Bar - aparece em todas as páginas exceto login */}
      {isAuthenticated && <TopBar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/farmacia/:id" element={<FarmaciaDetailsPage />} />

        {/* Farmacia Routes */}
        <Route
          path="/farmacia/dashboard"
          element={
            <ProtectedRoute requiredRole="gerente">
              <TopBar />
              <FarmaciaDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmacia/produtos"
          element={
            <ProtectedRoute requiredRole="gerente">
              <TopBar />
              <FarmaciaProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmacia/estoques"
          element={
            <ProtectedRoute requiredRole="gerente">
              <TopBar />
              <div className="p-8">Gestão de Estoques</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmacia/servicos"
          element={
            <ProtectedRoute requiredRole="gerente">
              <TopBar />
              <div className="p-8">Gestão de Serviços</div>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <TopBar />
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/farmacias"
          element={
            <ProtectedRoute requiredRole="admin">
              <TopBar />
              <AdminFarmaciasPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/produtos"
          element={
            <ProtectedRoute requiredRole="admin">
              <TopBar />
              <div className="p-8">Gestão de Produtos</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categorias"
          element={
            <ProtectedRoute requiredRole="admin">
              <TopBar />
              <AdminCategoriasPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requiredRole="admin">
              <TopBar />
              <div className="p-8">Gestão de Usuários</div>
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
