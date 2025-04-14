import { StrictMode } from 'react'
import { RouterProvider, createRouter } from '@tanstack/react-router'

import { routeTree } from './routeTree.gen'
const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const App = () => (
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)

export default App