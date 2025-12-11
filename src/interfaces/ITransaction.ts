export enum TransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
}

export interface ITransactionDTO {
  title: string
  amount: number
  type: TransactionType
  sessionId?: string
}

export interface ITransaction {
  id: string
  title: string
  amount: number
  created_at: string
  session_id?: string
}