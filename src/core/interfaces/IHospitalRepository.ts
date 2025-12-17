import { Hospital } from '../entities/Hospital';

export interface IHospitalRepository {
    getAll(): Promise<Hospital[]>;
    getById(id: string): Promise<Hospital | null>;
    register(hospital: Hospital): Promise<void>;
}
