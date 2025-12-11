import { FastifyReply, FastifyRequest } from "fastify";
import { uuid, z } from "zod";
import { TransactionService } from "../services/TransactionService";
import { TransactionType } from "../interfaces/ITransaction";
import { randomUUID } from "node:crypto";

export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  async create(request: FastifyRequest, reply: FastifyReply) {
    const {body} = request
    const createTransactionBodySchema = z.object({
      title: z.string().trim(),
      amount: z.number().positive().min(1),
      type: z.enum([TransactionType.CREDIT, TransactionType.DEBIT]),
    })

    let sessionId = request.cookies.sessionId
    if (!sessionId) {
      sessionId = randomUUID()
      const DAYS_IN_SECONDS = 60 * 60 * 24 * 7
      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: DAYS_IN_SECONDS, // 7 days
      })
    }

    const transaction = createTransactionBodySchema.parse(body)
    await this.transactionService.create({...transaction, sessionId })
    return reply.status(201).send()
  }


  async findById(request: FastifyRequest, reply: FastifyReply) {
    const idParamSchema = z.object({
      id: z.uuid(),
    })
    const {id} = idParamSchema.parse(request.params)
    const transaction = await this.transactionService.findById(id)
    if (!transaction) {
      return reply.status(404).send({ error: 'Transaction not found' })
    }
    return reply.status(200).send({ transaction })
  }

  async findAll(_: FastifyRequest, reply: FastifyReply) {
    const transactions = await this.transactionService.findAll()
    return reply.status(200).send({ transactions })
  }

  async sumary(request: FastifyRequest, reply: FastifyReply) {
    const sessionId = request.cookies.sessionId
    if (!sessionId) {
      return reply.status(401).send({ error: 'Unauthorized' })
    }
    const summary = await this.transactionService.sumary(sessionId)
    return reply.status(200).send({ summary })
  }
}