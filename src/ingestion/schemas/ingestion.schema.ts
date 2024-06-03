import * as mongoose from 'mongoose';

export const IngestionSchema = new mongoose.Schema({
  name: String,
  governmentId: String,
  email: String,
  debtAmount: String,
  debtDueDate: String,
  debtId: String
});