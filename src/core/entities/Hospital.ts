export class Hospital {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly location: string,
        public readonly tier: 'startup' | 'hospital' | 'university' = 'hospital',
        public readonly isActive: boolean = true
    ) {
        if (!name) throw new Error('Hospital name is required');
    }

    isEligibleForTraining(): boolean {
        return this.isActive;
    }
}
