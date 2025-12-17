import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/infrastructure/db';
import { eq, sql } from 'drizzle-orm';
import { createHash } from 'crypto';

interface SubmitPayload {
    hospitalId: string;
    apiKey: string;
    weightsUrl: string;
    accuracy: number;
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ roundId: string }> }
) {
    const { roundId } = await params;
    const roundIdNum = parseInt(roundId, 10);

    if (isNaN(roundIdNum)) {
        return NextResponse.json({ success: false, error: 'Invalid round ID' }, { status: 400 });
    }

    let body: SubmitPayload;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
    }

    const { hospitalId, apiKey, weightsUrl, accuracy } = body;

    // Validate required fields
    if (!hospitalId || !apiKey || !weightsUrl || typeof accuracy !== 'number') {
        return NextResponse.json({
            success: false,
            error: 'Missing required fields: hospitalId, apiKey, weightsUrl, accuracy'
        }, { status: 400 });
    }

    // Validate accuracy range
    if (accuracy < 0 || accuracy > 1) {
        return NextResponse.json({ success: false, error: 'Accuracy must be between 0 and 1' }, { status: 400 });
    }

    // Validate API key
    const apiKeyHash = createHash('sha256').update(apiKey).digest('hex');
    const hospitalRows = await db.select().from(schema.hospitals)
        .where(eq(schema.hospitals.id, hospitalId));

    if (hospitalRows.length === 0) {
        return NextResponse.json({ success: false, error: 'Hospital not found' }, { status: 404 });
    }

    if (hospitalRows[0].apiKeyHash !== apiKeyHash) {
        return NextResponse.json({ success: false, error: 'Invalid API key' }, { status: 401 });
    }

    // Check if round exists
    const roundRows = await db.select().from(schema.trainingRounds)
        .where(eq(schema.trainingRounds.id, roundIdNum));

    if (roundRows.length === 0) {
        return NextResponse.json({ success: false, error: 'Round not found' }, { status: 404 });
    }

    const round = roundRows[0];
    if (round.status !== 'open') {
        return NextResponse.json({ success: false, error: 'Round is not accepting submissions' }, { status: 400 });
    }

    // Insert the model update
    await db.insert(schema.modelUpdates).values({
        hospitalId,
        roundId: roundIdNum,
        weightsUrl,
        accuracy,
    });

    // Check if we have enough updates to trigger aggregation
    const countResult = await db.select({ count: sql<number>`count(*)` })
        .from(schema.modelUpdates)
        .where(eq(schema.modelUpdates.roundId, roundIdNum));

    const updateCount = Number(countResult[0]?.count ?? 0);

    if (updateCount >= round.minUpdatesRequired) {
        // Trigger aggregation
        const updates = await db.select().from(schema.modelUpdates)
            .where(eq(schema.modelUpdates.roundId, roundIdNum));

        const totalAccuracy = updates.reduce((sum, u) => sum + u.accuracy, 0);
        const globalAccuracy = totalAccuracy / updates.length;

        await db.update(schema.trainingRounds)
            .set({
                status: 'completed',
                aggregatedAt: new Date(),
                globalAccuracy: Math.round(globalAccuracy * 1000) / 1000,
            })
            .where(eq(schema.trainingRounds.id, roundIdNum));

        return NextResponse.json({
            success: true,
            message: 'Update submitted. Aggregation completed!',
            aggregation: {
                roundId: roundIdNum,
                globalAccuracy: Math.round(globalAccuracy * 1000) / 1000,
                participatingNodes: updates.length,
            },
        });
    }

    return NextResponse.json({
        success: true,
        message: 'Update submitted successfully',
        pending: round.minUpdatesRequired - updateCount,
    });
}
