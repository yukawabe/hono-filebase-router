import { Hono } from 'hono'
import type { Hono as HonoType, Context } from 'hono'
import { filePathToPath } from './util'

type RouteFile = {
    default?: ((c: Context) => Response | Promise<Response>) | HonoType
}

export const createApp = () => {
    const ROUTES = import.meta.glob<RouteFile>('/src/server/api/**/[a-z0-9[-][a-z0-9[_-]*.(ts|tsx)', {
        eager: true
    })

    const app = new Hono()

    for (const [key, route] of Object.entries(ROUTES)) {
        const path = filePathToPath(key.replace(/^\/src\/server\/api/, ''))
        if (typeof route.default === 'function') {
            app.get(path, route.default)
        } else if (route.default instanceof Hono) {
            app.route(path, route.default)
        }
    }

    return app
}
