// import AppError from '../errors/AppError';
import { getRepository, getCustomRepository } from 'typeorm';

import TransactionRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const categoryRepository = getRepository(Category);

    const hasCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    let category_id: string;

    if (!hasCategory) {
      const newCategory = categoryRepository.create({
        title: category,
      });

      const { id } = await categoryRepository.save(newCategory);
      category_id = id;
    } else {
      category_id = hasCategory.id;
    }

    const transactionRepository = getCustomRepository(TransactionRepository);

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id,
    });

    return transaction;
  }
}

export default CreateTransactionService;
