import { knex } from "../infra/database";
import { ITransaction } from "../interfaces/ITransaction";
import { TransactionDAO } from "./TransactionDAO";

export class TransactionDAODatabase implements TransactionDAO {
  async save(transaction: ITransaction): Promise<void> {
    await knex('transactions').insert(transaction)
  }

  async findById(id: string): Promise<ITransaction | null> {
    const transaction = await knex('transactions').where('id', id).first()
    return transaction as ITransaction | null
  }

  async findAll(): Promise< ITransaction[]> {
    const transactions = await knex('transactions').select()
    return transactions
  }

  async sumary(sessionId: string): Promise<{ total: number }> {
    const summary = await knex('transactions').where('session_id', sessionId).sum('amount', { as: 'total' }).first()
    return { total: summary?.total ?? 0 }
  }
}