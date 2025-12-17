import { NextResponse } from 'next/server';
import { InMemoryHospitalRepository } from '@/infrastructure/repositories/InMemoryHospitalRepository';
import { GetAllHospitals } from '@/core/use-cases/GetAllHospitals';

export async function GET() {
    const repository = new InMemoryHospitalRepository();
    const useCase = new GetAllHospitals(repository);

    const hospitals = await useCase.execute();

    return NextResponse.json({
        success: true,
        data: hospitals.map(h => ({
            id: h.id,
            name: h.name,
            location: h.location,
            tier: h.tier,
            isActive: h.isActive,
            isEligible: h.isEligibleForTraining(),
        })),
    });
}
