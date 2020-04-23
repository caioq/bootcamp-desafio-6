// import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({title value, type, category}: Request): Promise<Transaction> {
    // busco categoria

    // se nao existir categoria, salvo nova categoria

    // salvo transacao

    // return transaction
  }
}

export default CreateTransactionService;
