import { Hospital } from '../entities/Hospital';
import { IHospitalRepository } from '../interfaces/IHospitalRepository';

export class GetAllHospitals {
    constructor(private readonly hospitalRepository: IHospitalRepository) { }

    async execute(): Promise<Hospital[]> {
        return this.hospitalRepository.getAll();
    }
}
