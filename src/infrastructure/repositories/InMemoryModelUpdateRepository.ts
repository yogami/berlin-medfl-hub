import { ModelUpdate } from '../../core/entities/ModelUpdate';
import { IModelUpdateRepository } from '../../core/interfaces/IModelUpdateRepository';

// In-memory mock implementation with sample data
const mockUpdates: ModelUpdate[] = [
    new ModelUpdate('u1', '1', 42, '/models/charite/round42.pt', new Date(), 0.894),
    new ModelUpdate('u2', '2', 42, '/models/bih/round42.pt', new Date(), 0.912),
    new ModelUpdate('u3', '3', 42, '/models/vivantes/round42.pt', new Date(), 0.876),
    new ModelUpdate('u4', '4', 42, '/models/hhi/round42.pt', new Date(), 0.889),
];

export class InMemoryModelUpdateRepository implements IModelUpdateRepository {
    private updates: ModelUpdate[] = [...mockUpdates];

    async getByRound(roundId: number): Promise<ModelUpdate[]> {
        return this.updates.filter(u => u.roundId === roundId);
    }

    async submit(update: ModelUpdate): Promise<void> {
        this.updates.push(update);
    }
}
