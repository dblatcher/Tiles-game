import { camelToSentence } from '../utility';

class TechDiscovery {
    name: string;
    description: string;
    researchCost: number;
    prerequisites: Array<string>;
    forcedTier: number | null;
    constructor(name: string, config: any = {}) {
        this.name = name
        this.description = config.description || camelToSentence(name)
        this.researchCost = config.researchCost || 10
        this.prerequisites = config.prerequisites || []
        this.forcedTier = config.forcedTier || null
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

    get infoPageUrl() {return `info/tech/${this.name}`}

}


const techDiscoveries = {
    pottery: new TechDiscovery('pottery', {
    }),
    alphabet: new TechDiscovery('alphabet', {
    }),
    warriorCode: new TechDiscovery('warriorCode', {
    }),
    masonry: new TechDiscovery('masonry', {
    }),
    ceremonialBurial: new TechDiscovery('ceremonialBurial', {
    }),
    bronzeWorking: new TechDiscovery('bronzeWorking', {
    }),
    horsebackRiding: new TechDiscovery('horsebackRiding', {
    }),

    writing: new TechDiscovery('writing', {
        researchCost: 15,
        prerequisites: ['alphabet'],
    }),
    mapMaking: new TechDiscovery('mapMaking', {
        prerequisites: ['alphabet'],
    }),
    codeOfLaws: new TechDiscovery('codeOfLaws', {
        prerequisites: ['alphabet'],
    }),
    mathematics: new TechDiscovery('mathematics', {
        prerequisites: ['alphabet', 'masonry'],
    }),

    feudalism: new TechDiscovery('feudalism', {
        prerequisites: ['warriorCode', 'monarchy'],
    }),
    theWheel: new TechDiscovery('theWheel', {
        prerequisites: ['horsebackRiding'],
    }),
    construction: new TechDiscovery('construction', {
        prerequisites: ['currency', 'masonry'],
    }),
    mysticism: new TechDiscovery('mysticism', {
        prerequisites: ['ceremonialBurial'],
    }),
    polytheism: new TechDiscovery('polytheism', {
        prerequisites: ['ceremonialBurial', 'horsebackRiding'],
    }),



    currency: new TechDiscovery('currency', {
        prerequisites: ["bronzeWorking"],
    }),
    ironWorking: new TechDiscovery('ironWorking', {
        prerequisites: ['bronzeWorking', 'warriorCode'],
        forcedTier: 2,
    }),

    chivalry: new TechDiscovery('chivalry', {
        prerequisites: ['feudalism', 'horsebackRiding'],
        researchCost: 20,
    }),

    seafaring: new TechDiscovery('seafaring', {
        prerequisites: ['pottery', 'mapMaking'],
        researchCost: 20,
    }),

    literacy: new TechDiscovery('literacy', {
        prerequisites: ['codeOfLaws', 'writing'],
        researchCost: 20,
    }),

    monarchy: new TechDiscovery('monarchy', {
        prerequisites: ['codeOfLaws', 'ceremonialBurial'],
        researchCost: 20,
    }),

    university: new TechDiscovery('university', {
        prerequisites: ['mathematics', 'philosophy'],
        researchCost: 20,
    }),

    engineering: new TechDiscovery('engineering', {
        prerequisites: ['theWheel', 'construction'],
        researchCost: 20,
    }),
    bridgeBuilding: new TechDiscovery('bridgeBuilding', {
        prerequisites: ['ironWorking', 'construction'],
        researchCost: 20,
    }),
    trade: new TechDiscovery('trade', {
        prerequisites: ['currency', 'codeOfLaws'],
        researchCost: 20,
    }),
    astronomy: new TechDiscovery('astronomy', {
        prerequisites: ['mysticism', 'mathematics'],
        researchCost: 20,
    }),
    philosophy: new TechDiscovery('philosophy', {
        prerequisites: ['mysticism', 'literacy'],
        researchCost: 20,
    }),

    navigation: new TechDiscovery('navigation', {
        prerequisites: ['seafaring', 'astronomy'],
        researchCost: 30,
    }),
    theRepublic: new TechDiscovery('theRepublic', {
        prerequisites: ['codeOfLaws',],
        researchCost: 30,
    }),
    chemistry: new TechDiscovery('chemistry', {
        prerequisites: ['university', 'medicine'],
        researchCost: 30,
    }),
    leadership: new TechDiscovery('leadership', {
        prerequisites: ['gunpowder', 'chivalry'],
        researchCost: 30,
    }),
    invention: new TechDiscovery('invention', {
        prerequisites: ['engineering', 'literacy'],
        researchCost: 30,
    }),
    banking: new TechDiscovery('banking', {
        prerequisites: ['trade', 'theRepublic'],
        researchCost: 30,
    }),
    medicine: new TechDiscovery('medicine', {
        prerequisites: ['philosophy', 'trade'],
        researchCost: 30,
    }),
    theoryOfGravity: new TechDiscovery('theoryOfGravity', {
        prerequisites: ['astronomy', 'university'],
        researchCost: 30,
    }),
    monotheism: new TechDiscovery('monotheism', {
        prerequisites: ['philosophy', 'polytheism'],
        researchCost: 30,
    }),
    gunpowder: new TechDiscovery('gunpowder', {
        prerequisites: ['ironWorking', 'invention'],
        researchCost: 30,
    }),
    democracy: new TechDiscovery('democracy', {
        prerequisites: ['banking', 'invention'],
        researchCost: 30,
    }),

    theology: new TechDiscovery('theology', {
        prerequisites: ['monotheism', 'feudalism'],
        researchCost: 35,
    }),
    physics: new TechDiscovery('physics', {
        prerequisites: ['literacy', 'navigation'],
        researchCost: 35,
    }),
    magnetism: new TechDiscovery('magnetism', {
        prerequisites: ['ironWorking', 'physics'],
        researchCost: 40,
    }),
    metallurgy: new TechDiscovery('metallurgy', {
        prerequisites: ['university', 'gunpowder'],
        researchCost: 40,
    }),
}



export { TechDiscovery, techDiscoveries }