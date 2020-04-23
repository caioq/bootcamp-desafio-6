import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.createQueryBuilder('balance')
      .select('SUM(balance.value), balance.type')
      .groupBy('balance.type')
      .getRawMany();

    let income = 0;
    let outcome = 0;
    transactions.forEach(transaction => {
      switch (transaction.type) {
        case 'income':
          income += transaction.sum;
          break;
        case 'outcome':
          outcome += transaction.sum;
          break;
        default:
          break;
      }
    });

    const balance = {
      income,
      outcome,
      total: income - outcome,
    };

    return balance;
  }
}

export default TransactionsRepository;
