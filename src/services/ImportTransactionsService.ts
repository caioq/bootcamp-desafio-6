import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';

import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

import uploadConfig from '../config/upload';

interface Request {
  filename: string;
}

class ImportTransactionsService {
  async execute({ filename }: Request): Promise<Transaction[]> {
    const csvFilePath = path.join(uploadConfig.directory, filename);

    const data = await this.loadCSV(csvFilePath);

    const transactions: Transaction[] = [];
    const createTransaction = new CreateTransactionService();

    for (const line of data) {
      const newTransaction = await createTransaction.execute({
        title: line[0],
        type: line[1] as 'income' | 'outcome',
        value: Number(line[2]),
        category: line[3],
      });

      transactions.push(newTransaction);
    }

    return transactions;
  }

  public async loadCSV(filePath: string): Promise<string[]> {
    const readCSVStream = fs.createReadStream(filePath);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const lines: string[] = [];

    parseCSV.on('data', line => {
      lines.push(line);
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    return lines;
  }
}

export default ImportTransactionsService;
