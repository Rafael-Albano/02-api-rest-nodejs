import { randomUUID } from "node:crypto";
import { ITransaction, ITransactionDTO, TransactionType } from "../interfaces/ITransaction";
import { TransactionDAO } from "./TransactionDAO";

export class TransactionService {
  constructor(private readonly transactionDAO: TransactionDAO) {}

  async create({title, amount, type, sessionId}: ITransactionDTO): Promise<void> {
    const transaction: ITransaction = {
      id: randomUUID(),
      title: title,
      amount: type === TransactionType.CREDIT ? amount : amount * -1,
      created_at: new Date().toISOString(),
      session_id: sessionId!,
    }

    await this.transactionDAO.save(transaction)
  }


  async findById(id: string): Promise<ITransaction | null> {
    const transaction = await this.transactionDAO.findById(id)
    return transaction
  }

  async findAll(): Promise<ITransaction[]> {
    return await this.transactionDAO.findAll()
  }

  async sumary(sessionId: string): Promise<{ total: number }> {
    return await this.transactionDAO.sumary(sessionId)
  }
}