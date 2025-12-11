import { env } from './env'
import { app } from './app'

const start = async () => {
  console.log(`Server is running on port ${env?.PORT}`)
  try {
    app.log.info(`Server is running on port ${env?.PORT}`)
    await app.listen({ port: env?.PORT })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
