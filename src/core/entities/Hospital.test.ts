import { describe, it, expect } from 'vitest';
import { Hospital } from './Hospital';

describe('Hospital Entity', () => {
    it('should create a valid hospital instance', () => {
        const hospital = new Hospital('1', 'Charité', 'Berlin');
        expect(hospital.name).toBe('Charité');
        expect(hospital.isEligibleForTraining()).toBe(true);
    });

    it('should default to "hospital" tier', () => {
        const hospital = new Hospital('2', 'Test Clinic', 'Berlin');
        expect(hospital.tier).toBe('hospital');
    });

    it('should throw error if name is empty', () => {
        expect(() => new Hospital('3', '', 'Berlin')).toThrow('Hospital name is required');
    });
});
