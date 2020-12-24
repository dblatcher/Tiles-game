import { spriteSheets } from '../SpriteSheet'


class TerrainType {
    name: string
    css: object
    spriteCss: object
    movementCost: number
    defenseBonus: number
    isWater: boolean
    foodYield: number
    productionYield: number
    tradeYield: number
    neverTrees: boolean
    neverTown: boolean
    canMine: boolean
    canIrrigate: boolean

    constructor(name, config: any = {}) {
        this.name = name
        this.css = config.css
        this.spriteCss = config.spriteCss
        this.movementCost = config.movementCost || 3
        this.defenseBonus = config.defenseBonus || 0
        this.isWater = config.isWater || false

        this.neverTrees = config.isWater || config.neverTrees || false
        this.neverTown = config.isWater || config.neverTown || false
        this.canMine = config.canMine || false
        this.canIrrigate = config.canIrrigate || false

        if (config.yields) {
            this.foodYield = config.yields[0] || 0
            this.productionYield = config.yields[1] || 0
            this.tradeYield = config.yields[2] || 0
        } else {
            this.foodYield = 0
            this.productionYield = 0
            this.tradeYield = 0
        }
    }
    get infoPageUrl() {return `/info/terrain/${this.name.toLowerCase()}`}
}

const terrainTypes = {
    grass: new TerrainType('grass', {
        yields: [4, 0, 0],
        canIrrigate: true,
        css: {
            background: 'greenyellow',
            backgroundImage: 'repeating-radial-gradient(green, transparent 0.6px)',
        },
    }),
    arctic: new TerrainType('arctic', {
        yields: [0, 0, 0],
        canIrrigate: false,
        neverTrees: true,
        css: {
            background: 'lightgray',
            backgroundImage: 'repeating-linear-gradient(7deg, transparent -.1em, white .5em)',
        },
    }),
    tundra: new TerrainType('tundra', {
        yields: [1, 0, 0],
        canIrrigate: true,
        css: {
            background: 'sandybrown',
            backgroundImage: 'repeating-linear-gradient(9deg, transparent -.1em, white .5em)',
        },
    }),
    desert: new TerrainType('desert', {
        yields: [1, 1, 0],
        canIrrigate: true,
        css: {
            background: 'khaki',
            backgroundImage: 'repeating-radial-gradient(goldenrod, transparent 0.6px)'
        },
    }),
    plain: new TerrainType('plain', {
        yields: [3, 1, 0],
        canIrrigate: true,
        css: {
            background: 'burlywood',
            backgroundImage: 'repeating-linear-gradient(0deg, transparent -.1em, black .5em)',
        },
    }),
    swamp: new TerrainType('swamp', {
        yields: [2, 1, 0],
        movementCost: 4,
        defenseBonus: .25,
        css: {
            background: 'rosybrown',
            backgroundImage: 'repeating-radial-gradient(green 7%, transparent 14%), repeating-linear-gradient(transparent 2%, steelblue 4%)'
        },
    }),
    ocean: new TerrainType('ocean', {
        yields: [2, 0, 1],
        isWater: true,
        css: {
            background: 'lightseagreen',
        },
    }),
    hills: new TerrainType('hills', {
        yields: [1, 0, 0],
        movementCost: 6,
        defenseBonus: .75,
        neverTrees: true,
        canIrrigate: true,
        canMine: true,
        css: {
            background: 'greenyellow',
            backgroundImage: 'repeating-radial-gradient(green, transparent 0.6px)',
        },
        spriteCss: spriteSheets.misc.getStyleForFrameCalled('hills'),
    }),
    mountains: new TerrainType('mountains', {
        yields: [0, 1, 0],
        movementCost: 9,
        defenseBonus: 1,
        neverTrees: true,
        neverTown: true,
        canMine: true,
        css: {
            background: 'khaki',
            backgroundImage: 'repeating-radial-gradient(goldenrod, transparent 0.6px)'
        },
        spriteCss: Object.assign(spriteSheets.misc.getStyleForFrameCalled('mountains'), {
            height: '120%',
            top: '-20%'
        }),
    }),
}

function randomTerrainType() {
    const terrainNames = Object.keys(terrainTypes)
    const nameIndex = Math.floor(Math.random() * terrainNames.length)
    return terrainTypes[terrainNames[nameIndex]]
}

export { TerrainType, terrainTypes, randomTerrainType } 