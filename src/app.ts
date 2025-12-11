import fastify from 'fastify'
import { transactionRoutes } from './routes/transaction'
import cookie from '@fastify/cookie'

export const app = fastify({
  logger: true,
})

app.register(cookie)
app.register(transactionRoutes, { prefix: '/transactions' })

