import { Document } from 'mongoose';

export interface Ingestion extends Document {
    readonly name: String,
    readonly governmentId: String,
    readonly email: String,
    readonly debtAmount: String,
    readonly debtDueDate: String,
    readonly debtId: String
}