import { FastifyInstance } from "fastify"
import { TransactionController } from "../controller/TransactionController"
import { TransactionService } from "../services/TransactionService"
import { TransactionDAODatabase } from "../services/TransactionDAODatabase";
import { getSessionId } from "../middlewares/getSessionId";

export async function transactionRoutes(app: FastifyInstance) {
  const transactionController = new TransactionController(new TransactionService(new TransactionDAODatabase()))
  app.post('/', async (request, reply) => await transactionController.create(request, reply));
  app.get('/:id', { preHandler: [getSessionId] }, async (request, reply) => await transactionController.findById(request, reply));
  app.get('/', { preHandler: [getSessionId] }, async (request, reply) => await transactionController.findAll(request, reply));
  app.get('/summary', { preHandler: [getSessionId] }, async (request, reply) => await transactionController.sumary(request, reply));
}