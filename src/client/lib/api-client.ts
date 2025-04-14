import { hc } from 'hono/client'
import app from './api'

export const apiClient = hc<typeof app>('/api')