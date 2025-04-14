import { Hono } from 'hono'
import { createApp } from '../../plugin/router'
import { renderer } from './renderer'
import { showRoutes } from 'hono/dev'

const app = new Hono()
app.route('/api', createApp())

app.use(renderer)

app.get('/*', (c) => {
  return c.render(
    <>
      <div id="root"></div>
    </>
  )
})

showRoutes(app)

export default app
