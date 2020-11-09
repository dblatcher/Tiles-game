class TechDiscovery {
    name: string;
    description: string;
    researchCost: number;
    prerequisites: Array<string>;
    constructor(name:string, config:any = {}) {
        this.name = name
        this.description = config.description || name
        this.researchCost = config.researchCost || 10
        this.prerequisites = config.prerequisites || []
    }

    getTier(techDiscoveries) {
        if (this.prerequisites.length === 0) {return 0}
        return Math.max(
            ...this.prerequisites.map(name => techDiscoveries[name].getTier(techDiscoveries))
        ) + 1
    }

    checkCanResearchWith(knowTech:Array<TechDiscovery>) {
        if (knowTech.includes(this)) {return false}
        if (this.prerequisites.some(techName => !knowTech.includes(techDiscoveries[techName]) )) {
            return false
        }
        return true
    }

}


const techDiscoveries = {
    alphabet: new TechDiscovery('alphabet', {

    }),
    pottery: new TechDiscovery('pottery', {

    }),
    bronzeWorking: new TechDiscovery('bronzeWorking', {
        description: "bronze working",
    }),
    ironWorking: new TechDiscovery('ironWorking', {
        description: "iron working",
        prerequisites: ['bronzeWorking'],
    }),
    horseRiding: new TechDiscovery('horseRiding', {

    }),
    chivalry: new TechDiscovery('chivalry', {
        prerequisites: ['ironWorking', 'horseRiding'],
        researchCost: 20,
    }),
    writing: new TechDiscovery('writing', {
        researchCost: 15,
        prerequisites: ['alphabet'],
    }),
}



export {TechDiscovery, techDiscoveries}