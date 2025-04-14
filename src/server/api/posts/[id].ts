import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const paramsSchema = z.object({
  id: z.string()
})
const app = new Hono()
  .get(zValidator('param', paramsSchema), (c) => {
    const { id } = c.req.valid('param');
    // response dummy data
    return c.json({
      id,
      title: `Post ${id}`,
      content: `This is the content of post ${id}`,
      author: `Author ${id}`,
      createdAt: new Date().toISOString()
    },
    200
  )
})

export default app
