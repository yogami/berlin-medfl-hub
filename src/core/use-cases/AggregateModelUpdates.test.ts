import { describe, it, expect, vi } from 'vitest';
import { AggregateModelUpdates } from './AggregateModelUpdates';
import { ModelUpdate } from '../entities/ModelUpdate';
import { IModelUpdateRepository } from '../interfaces/IModelUpdateRepository';

describe('AggregateModelUpdates Use Case', () => {
    const mockRepository: IModelUpdateRepository = {
        getByRound: vi.fn(),
        submit: vi.fn(),
    };

    it('should calculate correct global accuracy from multiple updates', async () => {
        const updates: ModelUpdate[] = [
            new ModelUpdate('1', 'hospital-1', 42, '/path/1', new Date(), 0.85),
            new ModelUpdate('2', 'hospital-2', 42, '/path/2', new Date(), 0.90),
            new ModelUpdate('3', 'hospital-3', 42, '/path/3', new Date(), 0.88),
        ];
        vi.mocked(mockRepository.getByRound).mockResolvedValue(updates);

        const useCase = new AggregateModelUpdates(mockRepository);
        const result = await useCase.execute(42);

        expect(result.roundId).toBe(42);
        expect(result.globalAccuracy).toBeCloseTo(0.877, 2);
        expect(result.participatingNodes).toBe(3);
        expect(result.totalUpdates).toBe(3);
    });

    it('should return zero values for empty round', async () => {
        vi.mocked(mockRepository.getByRound).mockResolvedValue([]);

        const useCase = new AggregateModelUpdates(mockRepository);
        const result = await useCase.execute(1);

        expect(result.globalAccuracy).toBe(0);
        expect(result.participatingNodes).toBe(0);
    });
});
