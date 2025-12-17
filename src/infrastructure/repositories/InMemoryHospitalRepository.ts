import { Hospital } from '../../core/entities/Hospital';
import { IHospitalRepository } from '../../core/interfaces/IHospitalRepository';

// In-memory mock implementation
const mockHospitals: Hospital[] = [
    new Hospital('1', 'Charité Berlin', 'Berlin', 'university', true),
    new Hospital('2', 'BIH (Berlin Institute of Health)', 'Berlin', 'university', true),
    new Hospital('3', 'Vivantes Klinikum', 'Berlin', 'hospital', true),
    new Hospital('4', 'Fraunhofer HHI', 'Berlin', 'startup', true),
    new Hospital('5', 'Startup Alpha', 'Berlin', 'startup', false),
];

export class InMemoryHospitalRepository implements IHospitalRepository {
    private hospitals: Hospital[] = [...mockHospitals];

    async getAll(): Promise<Hospital[]> {
        return this.hospitals.filter(h => h.isActive);
    }

    async getById(id: string): Promise<Hospital | null> {
        return this.hospitals.find(h => h.id === id) || null;
    }

    async register(hospital: Hospital): Promise<void> {
        this.hospitals.push(hospital);
    }
}
