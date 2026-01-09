import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GetAllHospitals } from './GetAllHospitals';
import { Hospital } from '../entities/Hospital';
import { IHospitalRepository } from '../interfaces/IHospitalRepository';

describe('GetAllHospitals Use Case', () => {
    const mockHospitals: Hospital[] = [
        new Hospital('hosp-1', 'Charité Berlin', 'berlin', 'university', true),
        new Hospital('hosp-2', 'Vivantes Neukölln', 'berlin', 'hospital', true),
        new Hospital('hosp-3', 'DRK Kliniken', 'berlin', 'startup', false),
    ];

    let mockRepository: {
        getAll: ReturnType<typeof vi.fn>;
        getById: ReturnType<typeof vi.fn>;
        register: ReturnType<typeof vi.fn>;
    };
    let useCase: GetAllHospitals;

    beforeEach(() => {
        mockRepository = {
            getAll: vi.fn(),
            getById: vi.fn(),
            register: vi.fn(),
        };

        useCase = new GetAllHospitals(mockRepository);
    });

    it('should return all hospitals from repository', async () => {
        mockRepository.getAll.mockResolvedValue(mockHospitals);

        const result = await useCase.execute();

        expect(result).toEqual(mockHospitals);
        expect(result).toHaveLength(3);
        expect(mockRepository.getAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no hospitals exist', async () => {
        mockRepository.getAll.mockResolvedValue([]);

        const result = await useCase.execute();

        expect(result).toEqual([]);
        expect(result).toHaveLength(0);
    });

    it('should propagate repository errors', async () => {
        mockRepository.getAll.mockRejectedValue(new Error('Database connection failed'));

        await expect(useCase.execute()).rejects.toThrow('Database connection failed');
    });
});
