import { camelToSentence } from '../utility';

class TechDiscovery {
    name: string;
    description: string;
    researchCost: number;
    prerequisites: Array<string>;
    forcedTier: number | null;
    aiPriority: "EXPAND"|"DEVELOP"|"DISCOVER"|"CONQUER"
    constructor(name: string, config: any = {}) {
        this.name = name
        this.description = config.description || camelToSentence(name)
        this.researchCost = config.researchCost || 20
        this.prerequisites = config.prerequisites || []
        this.forcedTier = config.forcedTier || null
        this.aiPriority = config.aiPriority || "DISCOVER"
    }

    getTier(techDiscoveries) {
        if (this.forcedTier) {return this.forcedTier}
        if (this.prerequisites.length === 0) { return 0 }
        return Math.max(
            ...this.prerequisites.map(name => techDiscoveries[name] ? techDiscoveries[name].getTier(techDiscoveries) : 0)
        ) + 1
    }

    checkCanResearchWith(knowTech: Array<TechDiscovery>) {
        if (knowTech.includes(this)) { return false }
        if (this.prerequisites.some(techName => !knowTech.includes(techDiscoveries[techName]))) {
            return false
        }
        return true
    }

    get infoPageUrl() {return `/info/tech/${this.name.toLowerCase()}`}

}


const techDiscoveries = {
    pottery: new TechDiscovery('pottery', {
        aiPriority: "DEVELOP",
    }),
    alphabet: new TechDiscovery('alphabet', {
    }),
    warriorCode: new TechDiscovery('warriorCode', {
        aiPriority: "CONQUER",
    }),
    masonry: new TechDiscovery('masonry', {
        aiPriority: "DEVELOP",
    }),
    ceremonialBurial: new TechDiscovery('ceremonialBurial', {
    }),
    bronzeWorking: new TechDiscovery('bronzeWorking', {
        aiPriority: "DEVELOP",
    }),
    horsebackRiding: new TechDiscovery('horsebackRiding', {
        aiPriority: "EXPAND",
    }),

    writing: new TechDiscovery('writing', {
        researchCost: 40,
        prerequisites: ['alphabet'],
    }),
    mapMaking: new TechDiscovery('mapMaking', {
        researchCost: 40,
        prerequisites: ['alphabet'],
        aiPriority: "EXPAND",
    }),
    codeOfLaws: new TechDiscovery('codeOfLaws', {
        researchCost: 40,
        prerequisites: ['alphabet'],
    }),
    mathematics: new TechDiscovery('mathematics', {
        researchCost: 50,
        prerequisites: ['alphabet', 'masonry'],
        aiPriority: "CONQUER",
    }),
    
    feudalism: new TechDiscovery('feudalism', {
        researchCost: 40,
        prerequisites: ['warriorCode', 'monarchy'],
    }),
    theWheel: new TechDiscovery('theWheel', {
        researchCost: 30,
        prerequisites: ['horsebackRiding'],
    }),
    construction: new TechDiscovery('construction', {
        researchCost: 50,
        prerequisites: ['currency', 'masonry'],
        aiPriority: "DEVELOP",
    }),
    mysticism: new TechDiscovery('mysticism', {
        prerequisites: ['ceremonialBurial'],
    }),
    polytheism: new TechDiscovery('polytheism', {
        researchCost: 30,
        prerequisites: ['ceremonialBurial', 'horsebackRiding'],
    }),
    
    currency: new TechDiscovery('currency', {
        researchCost: 30,
        prerequisites: ["bronzeWorking"],
        aiPriority: "DEVELOP",
    }),
    ironWorking: new TechDiscovery('ironWorking', {
        researchCost: 50,
        prerequisites: ['bronzeWorking', 'warriorCode'],
        forcedTier: 2,
        aiPriority: "CONQUER",
    }),
    
    chivalry: new TechDiscovery('chivalry', {
        prerequisites: ['feudalism', 'horsebackRiding'],
        researchCost: 50,
        aiPriority: "CONQUER",
    }),

    seafaring: new TechDiscovery('seafaring', {
        prerequisites: ['pottery', 'mapMaking'],
        researchCost: 40,
        aiPriority: "EXPAND",
    }),

    literacy: new TechDiscovery('literacy', {
        prerequisites: ['codeOfLaws', 'writing'],
        researchCost: 40,
    }),

    monarchy: new TechDiscovery('monarchy', {
        prerequisites: ['codeOfLaws', 'ceremonialBurial'],
        researchCost: 40,
        aiPriority: "DEVELOP",
    }),

    university: new TechDiscovery('university', {
        prerequisites: ['mathematics', 'philosophy'],
        researchCost: 50,
    }),

    engineering: new TechDiscovery('engineering', {
        prerequisites: ['theWheel', 'construction'],
        researchCost: 40,
    }),
    bridgeBuilding: new TechDiscovery('bridgeBuilding', {
        prerequisites: ['ironWorking', 'construction'],
        researchCost: 40,
        aiPriority: "EXPAND",
    }),
    trade: new TechDiscovery('trade', {
        prerequisites: ['currency', 'codeOfLaws'],
        researchCost: 40,
        aiPriority: "DEVELOP",
    }),
    astronomy: new TechDiscovery('astronomy', {
        prerequisites: ['mysticism', 'mathematics'],
        researchCost: 50,
    }),
    philosophy: new TechDiscovery('philosophy', {
        prerequisites: ['mysticism', 'literacy'],
        researchCost: 50,
    }),

    navigation: new TechDiscovery('navigation', {
        prerequisites: ['seafaring', 'astronomy'],
        researchCost: 40,
        aiPriority: "EXPAND",
    }),
    theRepublic: new TechDiscovery('theRepublic', {
        prerequisites: ['codeOfLaws',],
        researchCost: 40,
    }),
    chemistry: new TechDiscovery('chemistry', {
        prerequisites: ['university', 'medicine'],
        researchCost: 50,
    }),
    leadership: new TechDiscovery('leadership', {
        prerequisites: ['gunpowder', 'chivalry'],
        researchCost: 60,
        aiPriority: "CONQUER",
    }),
    invention: new TechDiscovery('invention', {
        prerequisites: ['engineering', 'literacy'],
        researchCost: 40,
    }),
    banking: new TechDiscovery('banking', {
        prerequisites: ['trade', 'theRepublic'],
        researchCost: 40,
        aiPriority: "DEVELOP",
    }),
    medicine: new TechDiscovery('medicine', {
        prerequisites: ['philosophy', 'trade'],
        researchCost: 40,
    }),
    theoryOfGravity: new TechDiscovery('theoryOfGravity', {
        prerequisites: ['astronomy', 'university'],
        researchCost: 40,
    }),
    monotheism: new TechDiscovery('monotheism', {
        prerequisites: ['philosophy', 'polytheism'],
        researchCost: 30,
        aiPriority: "CONQUER",
    }),
    gunpowder: new TechDiscovery('gunpowder', {
        prerequisites: ['ironWorking', 'invention'],
        researchCost: 40,
        aiPriority: "CONQUER",
    }),
    democracy: new TechDiscovery('democracy', {
        prerequisites: ['banking', 'invention'],
        researchCost: 40,
    }),

    theology: new TechDiscovery('theology', {
        prerequisites: ['monotheism', 'feudalism'],
        researchCost: 50,
    }),
    physics: new TechDiscovery('physics', {
        prerequisites: ['literacy', 'navigation'],
        researchCost: 40,
    }),
    magnetism: new TechDiscovery('magnetism', {
        prerequisites: ['ironWorking', 'physics'],
        researchCost: 40,
    }),
    metallurgy: new TechDiscovery('metallurgy', {
        prerequisites: ['university', 'gunpowder'],
        researchCost: 60,
        aiPriority: "CONQUER",
    }),
}



export { TechDiscovery, techDiscoveries }