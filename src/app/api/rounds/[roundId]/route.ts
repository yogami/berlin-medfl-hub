import { NextRequest, NextResponse } from 'next/server';
import { InMemoryModelUpdateRepository } from '@/infrastructure/repositories/InMemoryModelUpdateRepository';
import { AggregateModelUpdates } from '@/core/use-cases/AggregateModelUpdates';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ roundId: string }> }
) {
    const { roundId } = await params;
    const roundIdNum = parseInt(roundId, 10);

    if (isNaN(roundIdNum)) {
        return NextResponse.json({ success: false, error: 'Invalid round ID' }, { status: 400 });
    }

    const repository = new InMemoryModelUpdateRepository();
    const useCase = new AggregateModelUpdates(repository);

    const result = await useCase.execute(roundIdNum);

    return NextResponse.json({
        success: true,
        data: result,
    });
}
