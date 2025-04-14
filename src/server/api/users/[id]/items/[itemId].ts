import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const paramsSchema = z.object({
  id: z.string().pipe(z.coerce.number()),
  itemId: z.string().pipe(z.coerce.number())
})

const app = new Hono()
  .get(zValidator('param', paramsSchema), (c) => {
    const { id, itemId } = c.req.valid('param');
    
    // ダミーデータを返す
    return c.json({
      userId: id,
      itemId: itemId,
      name: `Item ${itemId}`,
      price: Math.floor(Math.random() * 10000) + 1000,
      description: `${id}ユーザーが所有しているアイテム ${itemId} の詳細情報です`,
      rating: (Math.random() * 5).toFixed(1),
      inStock: Math.random() > 0.3,
      createdAt: new Date().toISOString()
    }, 
    200)
  }
)

export default app
