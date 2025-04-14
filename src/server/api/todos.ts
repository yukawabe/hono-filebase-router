import { Hono } from 'hono'

const todos = [
    { id: 1, title: 'Buy groceries', completed: true },
    { id: 2, title: 'Finish project', completed: false },
    { id: 3, title: 'Call the bank', completed: true },
]

const app = new Hono()
    .get((c) => {
  return c.json({ todos })
})

export default app