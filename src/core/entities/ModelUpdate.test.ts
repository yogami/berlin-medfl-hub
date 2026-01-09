import { describe, it, expect } from 'vitest';
import { ModelUpdate } from './ModelUpdate';

describe('ModelUpdate Entity', () => {
    const validData = {
        id: 'update-1',
        hospitalId: 'hospital-1',
        roundId: 1,
        weightsPath: '/models/round1/weights.bin',
        accuracy: 0.85,
    };

    describe('constructor', () => {
        it('should create a valid ModelUpdate', () => {
            const update = new ModelUpdate(
                validData.id,
                validData.hospitalId,
                validData.roundId,
                validData.weightsPath,
                new Date(),
                validData.accuracy
            );

            expect(update.id).toBe(validData.id);
            expect(update.hospitalId).toBe(validData.hospitalId);
            expect(update.roundId).toBe(validData.roundId);
            expect(update.weightsPath).toBe(validData.weightsPath);
            expect(update.accuracy).toBe(validData.accuracy);
        });

        it('should throw error for accuracy > 1', () => {
            expect(() => new ModelUpdate(
                validData.id,
                validData.hospitalId,
                validData.roundId,
                validData.weightsPath,
                new Date(),
                1.5
            )).toThrow('Accuracy must be between 0 and 1');
        });

        it('should throw error for accuracy < 0', () => {
            expect(() => new ModelUpdate(
                validData.id,
                validData.hospitalId,
                validData.roundId,
                validData.weightsPath,
                new Date(),
                -0.1
            )).toThrow('Accuracy must be between 0 and 1');
        });

        it('should accept accuracy at boundary values (0 and 1)', () => {
            expect(() => new ModelUpdate(
                validData.id,
                validData.hospitalId,
                validData.roundId,
                validData.weightsPath,
                new Date(),
                0
            )).not.toThrow();

            expect(() => new ModelUpdate(
                validData.id,
                validData.hospitalId,
                validData.roundId,
                validData.weightsPath,
                new Date(),
                1
            )).not.toThrow();
        });
    });

    describe('isValid', () => {
        it('should return true when weightsPath is set', () => {
            const update = new ModelUpdate(
                validData.id,
                validData.hospitalId,
                validData.roundId,
                validData.weightsPath,
                new Date(),
                validData.accuracy
            );

            expect(update.isValid()).toBe(true);
        });

        it('should return false when weightsPath is empty', () => {
            const update = new ModelUpdate(
                validData.id,
                validData.hospitalId,
                validData.roundId,
                '',
                new Date(),
                validData.accuracy
            );

            expect(update.isValid()).toBe(false);
        });
    });
});
