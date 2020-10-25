
class Faction {
    name: string;
    color: string;
    treasury: number;
    research: number;
    constructor(name: string, config: any = {}) {
        this.name = name;
        this.color = config.color || "#FFF";
        this.treasury = config.treasury || 0
        this.research = config.research || 0
    }
}

export { Faction }