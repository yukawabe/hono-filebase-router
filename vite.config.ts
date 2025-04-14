import { defineConfig } from 'vite'
import reactStack from 'hono-vite-react-stack'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import { apiTypePlugin } from './plugin'

export default defineConfig({
  plugins: [
    reactStack(),
    TanStackRouterVite({
      routesDirectory: './src/client/routes',
      generatedRouteTree: './src/client/routeTree.gen.ts',
    }),
    apiTypePlugin({
    }),
  ],
  build: {
    cssCodeSplit: true
  }
})
