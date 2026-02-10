import { createRoot } from 'react-dom/client'
import App from './app/App'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'

import './index.css'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        richColors
        position="top-right"
      />
    </QueryClientProvider>
  </BrowserRouter>,
)
