import { MongoClient } from 'mongodb';

// One client per server process (re-used across hot reloads in dev).
const g = globalThis as unknown as { _fixmateMongo?: MongoClient };

export const mongoClient: MongoClient =
  g._fixmateMongo ?? (g._fixmateMongo = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017'));

export const db = mongoClient.db(process.env.DB_NAME || 'fixmate');
