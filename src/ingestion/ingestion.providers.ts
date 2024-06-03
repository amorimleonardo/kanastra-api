import { Connection } from 'mongoose';
import { IngestionSchema } from './schemas/ingestion.schema';

export const ingestionProviders = [
  {
    provide: 'INGESTION_MODEL',
    useFactory: (connection: Connection) => connection.model('Ingestion', IngestionSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];