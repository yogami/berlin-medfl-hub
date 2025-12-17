import { ModelUpdate } from '../entities/ModelUpdate';

export interface IModelUpdateRepository {
    getByRound(roundId: number): Promise<ModelUpdate[]>;
    submit(update: ModelUpdate): Promise<void>;
}
