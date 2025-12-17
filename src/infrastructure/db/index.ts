import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Lazy initialization to allow build without DATABASE_URL
let _db: NeonHttpDatabase<typeof schema> | null = null;

export function getDb(): NeonHttpDatabase<typeof schema> {
    if (!_db) {
        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL environment variable is not set');
        }
        const sql = neon(process.env.DATABASE_URL);
        _db = drizzle(sql, { schema });
    }
    return _db;
}

// For backward compatibility, use getter
export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
    get(_, prop) {
        return (getDb() as never)[prop];
    },
});

// Export schema for convenience
export { schema };

