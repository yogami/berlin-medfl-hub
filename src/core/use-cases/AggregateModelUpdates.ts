import { IModelUpdateRepository } from '../interfaces/IModelUpdateRepository';

export interface AggregationResult {
    roundId: number;
    globalAccuracy: number;
    participatingNodes: number;
    totalUpdates: number;
}

export class AggregateModelUpdates {
    constructor(private readonly modelUpdateRepository: IModelUpdateRepository) { }

    async execute(roundId: number): Promise<AggregationResult> {
        const updates = await this.modelUpdateRepository.getByRound(roundId);

        if (updates.length === 0) {
            return {
                roundId,
                globalAccuracy: 0,
                participatingNodes: 0,
                totalUpdates: 0,
            };
        }

        // Simple averaging aggregation (FedAvg-like)
        const totalAccuracy = updates.reduce((sum, u) => sum + u.accuracy, 0);
        const globalAccuracy = totalAccuracy / updates.length;

        const uniqueHospitals = new Set(updates.map(u => u.hospitalId));

        return {
            roundId,
            globalAccuracy: Math.round(globalAccuracy * 1000) / 1000,
            participatingNodes: uniqueHospitals.size,
            totalUpdates: updates.length,
        };
    }
}
