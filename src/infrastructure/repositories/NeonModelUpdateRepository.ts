import { eq, sql } from 'drizzle-orm';
import { db, schema } from '../db';
import { IModelUpdateRepository } from '../../core/interfaces/IModelUpdateRepository';
import { ModelUpdate } from '../../core/entities/ModelUpdate';

export class NeonModelUpdateRepository implements IModelUpdateRepository {
    async getByRound(roundId: number): Promise<ModelUpdate[]> {
        const rows = await db.select().from(schema.modelUpdates)
            .where(eq(schema.modelUpdates.roundId, roundId));

        return rows.map(row => new ModelUpdate(
            row.id,
            row.hospitalId,
            row.roundId,
            row.weightsUrl,
            row.createdAt,
            row.accuracy
        ));
    }

    async submit(update: ModelUpdate): Promise<void> {
        await db.insert(schema.modelUpdates).values({
            id: update.id,
            hospitalId: update.hospitalId,
            roundId: update.roundId,
            weightsUrl: update.weightsPath,
            accuracy: update.accuracy,
        });
    }

    async countByRound(roundId: number): Promise<number> {
        const result = await db.select({ count: sql<number>`count(*)` })
            .from(schema.modelUpdates)
            .where(eq(schema.modelUpdates.roundId, roundId));
        return result[0]?.count ?? 0;
    }
}
