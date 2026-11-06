import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { router } from './app/router'
import { queryClient } from './lib/queryClient'
import { SessionProvider } from './lib/SessionProvider'
import './index.css'

// Order matters: SessionProvider uses TanStack Query (to call /auth/me),
// and the routes use the session (to guard pages).
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <RouterProvider router={router} />
      </SessionProvider>
    </QueryClientProvider>
  </StrictMode>,
)
