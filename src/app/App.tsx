import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { useEffect } from 'react'
import { CategoryLayout } from '../cases/categories/components/category-layout'
import { CategoryForm } from '../cases/categories/components/category-form'
import { BrandLayout } from '../cases/brands/components/brand-layout'
import { BrandForm } from '../cases/brands/components/brand-form'
import { ProductLayout } from '../cases/products/components/product-layout'
import { ProductForm } from '../cases/products/components/product-form'
import { CustomerLayout } from '../cases/customers/components/customer-layout'
import { CustomerForm } from '../cases/customers/components/customer-form'
import { OrderLayout } from '../cases/orders/components/order-layout'
import { OrderForm } from '../cases/orders/components/order-form'
import { QuickOrderCreate } from '../cases/orders/components/quick-order-create'
import { ReportsPage } from '../cases/reports/pages/reports'
import { LoginPage } from '../cases/auth/LoginPage'
import { SidebarProvider } from '../components/ui/sidebar'
import { AppSidebar } from '../components/layout/app-sidebar'
import { useAuthStore } from '../cases/auth/useAuthStore'

function AppLayout() {
  return (
    <div className="wrapper">
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <Routes>
            <Route
              path="/"
              element={<QuickOrderCreate />}
            />
            <Route
              path="/categories"
              element={<CategoryLayout />}
            >
              <Route
                path="new"
                element={<CategoryForm />}
              />
              <Route
                path=":id"
                element={<CategoryForm />}
              />
            </Route>

            <Route
              path="/brands"
              element={<BrandLayout />}
            >
              <Route
                path="new"
                element={<BrandForm />}
              />
              <Route
                path=":id"
                element={<BrandForm />}
              />
            </Route>

            <Route
              path="/products"
              element={<ProductLayout />}
            >
              <Route
                path="new"
                element={<ProductForm />}
              />
              <Route
                path=":id"
                element={<ProductForm />}
              />
            </Route>

            <Route
              path="/customers"
              element={<CustomerLayout />}
            >
              <Route
                path="new"
                element={<CustomerForm />}
              />
              <Route
                path=":id"
                element={<CustomerForm />}
              />
            </Route>

            <Route
              path="/orders"
              element={<OrderLayout />}
            >
              <Route
                path="quick"
                element={<QuickOrderCreate />}
              />
              <Route
                path="new"
                element={<OrderForm />}
              />
              <Route
                path=":id"
                element={<OrderForm />}
              />
            </Route>

            <Route
              path="/reports"
              element={<ReportsPage />}
            />
          </Routes>
        </main>
      </SidebarProvider>
      <ToastContainer />
    </div>
  )
}

function App() {
  const { initializeAuth, isAuthenticated } = useAuthStore()

  useEffect(() => {
    initializeAuth()
  }, [])

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route
          path="/*"
          element={<LoginPage />}
        />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={<LoginPage />}
      />
      <Route
        path="/*"
        element={<AppLayout />}
      />
    </Routes>
  )
}

export default App
