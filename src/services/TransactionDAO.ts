import { ITransaction } from "../interfaces/ITransaction"

export interface TransactionDAO {
  save(transaction: ITransaction): Promise<void>
  findById(id: string): Promise<ITransaction | null>
  findAll(): Promise<ITransaction[]>
  sumary(sessionId: string): Promise<{ total: number }>
}