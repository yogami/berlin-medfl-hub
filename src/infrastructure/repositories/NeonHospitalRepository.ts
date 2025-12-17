import { eq } from 'drizzle-orm';
import { db, schema } from '../db';
import { IHospitalRepository } from '../../core/interfaces/IHospitalRepository';
import { Hospital } from '../../core/entities/Hospital';

export class NeonHospitalRepository implements IHospitalRepository {
    async getAll(): Promise<Hospital[]> {
        const rows = await db.select().from(schema.hospitals).where(eq(schema.hospitals.isActive, true));
        return rows.map(row => new Hospital(
            row.id,
            row.name,
            row.location,
            row.tier as 'startup' | 'hospital' | 'university',
            row.isActive
        ));
    }

    async getById(id: string): Promise<Hospital | null> {
        const rows = await db.select().from(schema.hospitals).where(eq(schema.hospitals.id, id));
        if (rows.length === 0) return null;
        const row = rows[0];
        return new Hospital(row.id, row.name, row.location, row.tier as 'startup' | 'hospital' | 'university', row.isActive);
    }

    async register(hospital: Hospital): Promise<void> {
        await db.insert(schema.hospitals).values({
            id: hospital.id,
            name: hospital.name,
            location: hospital.location,
            tier: hospital.tier,
            isActive: hospital.isActive,
        });
    }

    async validateApiKey(hospitalId: string, apiKeyHash: string): Promise<boolean> {
        const rows = await db.select().from(schema.hospitals)
            .where(eq(schema.hospitals.id, hospitalId));
        if (rows.length === 0) return false;
        return rows[0].apiKeyHash === apiKeyHash;
    }
}
