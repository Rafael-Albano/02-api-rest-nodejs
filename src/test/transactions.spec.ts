import {afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../app'
import { ITransactionDTO, TransactionType } from '../interfaces/ITransaction'
import { execSync } from 'node:child_process'

const createTransaction = async (transactionBody: ITransactionDTO) => {
  return await request(app.server)
    .post('/transactions')
    .send(transactionBody)
    .expect(201)
}

describe('Suite Test - Transactions Routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('pnpm migrate:rollback --all')
    execSync('pnpm migrate:latest')
  })

  it('should be able to create a new transaction', async () => {
    await createTransaction({
      title: `Transaction - ${Math.random().toString().slice(2, 10)}`,
      amount: Math.abs(Math.floor(Math.random() * 1000)),
      type: TransactionType.CREDIT,
    })
  })

  it('should be able to list all transactions', async () => {
    const createTransactionResponse = await createTransaction({
      title: `Transaction - ${Math.random().toString().slice(2, 10)}`,
      amount: Math.abs(Math.floor(Math.random() * 1000)),
      type: TransactionType.DEBIT,
    })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const transactions = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies!)
      .expect(200)

    expect(transactions.body.transactions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          amount: expect.any(Number),
          created_at: expect.any(String),
          id: expect.any(String),
          session_id: expect.any(String),
          title: expect.any(String),
        })
      ])
    )
  })

  it('should be able to get a specific transaction', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies!)
      .expect(200)

    const transactionId = listTransactionsResponse.body.transactions[0].id

    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies!)
      .expect(200)

    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'New transaction',
        amount: 5000,
      }),
    )
  })

  it('should be able to get the summary', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Credit transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies!)
      .send({
        title: 'Debit transaction',
        amount: 2000,
        type: 'debit',
      })

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies!)
      .expect(200)

    expect(summaryResponse.body.summary).toEqual({
      total: 3000,
    })
  })
})