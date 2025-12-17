import { pgTable, text, timestamp, boolean, real, integer, uuid } from 'drizzle-orm/pg-core';

// Hospitals table
export const hospitals = pgTable('hospitals', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    location: text('location').notNull(),
    tier: text('tier').notNull().default('hospital'), // 'hospital' | 'university' | 'startup'
    apiKeyHash: text('api_key_hash'), // For authentication
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Training rounds table
export const trainingRounds = pgTable('training_rounds', {
    id: integer('id').primaryKey(),
    status: text('status').notNull().default('open'), // 'open' | 'aggregating' | 'completed'
    minUpdatesRequired: integer('min_updates_required').notNull().default(3),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    aggregatedAt: timestamp('aggregated_at'),
    globalAccuracy: real('global_accuracy'),
});

// Model updates table
export const modelUpdates = pgTable('model_updates', {
    id: uuid('id').primaryKey().defaultRandom(),
    hospitalId: uuid('hospital_id').notNull().references(() => hospitals.id),
    roundId: integer('round_id').notNull().references(() => trainingRounds.id),
    weightsUrl: text('weights_url').notNull(), // URL or path to weights file
    accuracy: real('accuracy').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Type exports for use in repositories
export type Hospital = typeof hospitals.$inferSelect;
export type NewHospital = typeof hospitals.$inferInsert;
export type TrainingRound = typeof trainingRounds.$inferSelect;
export type NewTrainingRound = typeof trainingRounds.$inferInsert;
export type ModelUpdate = typeof modelUpdates.$inferSelect;
export type NewModelUpdate = typeof modelUpdates.$inferInsert;
