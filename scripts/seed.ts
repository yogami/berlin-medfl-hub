import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { hospitals, trainingRounds } from '../src/infrastructure/db/schema';
import { createHash } from 'crypto';

const DATABASE_URL = process.env.DATABASE_URL!;

async function seed() {
    const sql = neon(DATABASE_URL);
    const db = drizzle(sql);

    console.log('Seeding hospitals...');

    // Create API keys and hash them
    const apiKeys = {
        charite: 'charite-secret-key-123',
        bih: 'bih-secret-key-456',
        vivantes: 'vivantes-secret-key-789',
    };

    await db.insert(hospitals).values([
        {
            name: 'Charité Berlin',
            location: 'Berlin',
            tier: 'university',
            apiKeyHash: createHash('sha256').update(apiKeys.charite).digest('hex'),
            isActive: true,
        },
        {
            name: 'BIH (Berlin Institute of Health)',
            location: 'Berlin',
            tier: 'university',
            apiKeyHash: createHash('sha256').update(apiKeys.bih).digest('hex'),
            isActive: true,
        },
        {
            name: 'Vivantes Klinikum',
            location: 'Berlin',
            tier: 'hospital',
            apiKeyHash: createHash('sha256').update(apiKeys.vivantes).digest('hex'),
            isActive: true,
        },
    ]).onConflictDoNothing();

    console.log('Seeding training round...');
    await db.insert(trainingRounds).values({
        id: 42,
        status: 'open',
        minUpdatesRequired: 3,
    }).onConflictDoNothing();

    console.log('Seed complete!');
    console.log('API Keys for testing:');
    console.log('  Charité:', apiKeys.charite);
    console.log('  BIH:', apiKeys.bih);
    console.log('  Vivantes:', apiKeys.vivantes);
}

seed().catch(console.error);
