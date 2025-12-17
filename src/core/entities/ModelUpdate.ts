export class ModelUpdate {
    constructor(
        public readonly id: string,
        public readonly hospitalId: string,
        public readonly roundId: number,
        public readonly weightsPath: string,
        public readonly timestamp: Date = new Date(),
        public readonly accuracy: number
    ) {
        if (accuracy < 0 || accuracy > 1) {
            throw new Error('Accuracy must be between 0 and 1');
        }
    }

    isValid(): boolean {
        // Mock validation logic (e.g., check signature)
        return !!this.weightsPath;
    }
}
