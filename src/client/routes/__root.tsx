import { createRootRoute } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router' 

export const Route = createRootRoute({
  component: () => (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow p-2">
        <Outlet />
      </main>
    </div>
  ),
})
