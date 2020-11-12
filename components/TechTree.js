import { techDiscoveries } from '../lib/game-entities/TechDiscovery.tsx'

import styles from './techTree.module.scss'

class TechBubble {
    constructor(tech, tier, x, y, width, isKnown, isPossibleResearchGoal, isCurrentResearchGoal) {
        this.tech = tech
        this.tier = tier
        this.x = x
        this.y = y
        this.width = width
        this.isKnown = isKnown
        this.isPossibleResearchGoal = isPossibleResearchGoal
        this.isCurrentResearchGoal = isCurrentResearchGoal
    }

    get polygonPoints() {
        const { x, y, longEdgeWidth } = this
        const { cornerSize } = TechBubble
        return `${x + cornerSize},${y + 0} ${x + cornerSize + longEdgeWidth},${y + 0} ${x + cornerSize * 2 + longEdgeWidth},${y + cornerSize} ${x + cornerSize + longEdgeWidth},${y + cornerSize * 2} ${x + cornerSize},${y + cornerSize * 2}, ${x + 0},${y + cornerSize}`
    }

    get leftPoint() {
        const { x, y } = this
        const { cornerSize } = TechBubble
        return { x: x, y: y + cornerSize };

    }

    get rightPoint() {
        const { x, y, longEdgeWidth } = this
        const { cornerSize } = TechBubble
        return { x: x + cornerSize * 2 + longEdgeWidth, y: y + cornerSize }
    }

    get longEdgeWidth() { return this.width - (TechBubble.cornerSize * 2) }

    render(handleClickOnTech) {
        const { x, y, tech, polygonPoints, isKnown, isPossibleResearchGoal, isCurrentResearchGoal } = this
        const { cornerSize } = TechBubble

        const polygonClassList = [styles.techPolygon]
        const gClassList = [styles.techG]

        if (isKnown) {
            polygonClassList.push(styles.known)
            gClassList.push(styles.known)
        }
        if (isPossibleResearchGoal) {
            polygonClassList.push(styles.possibleResearchGoal)
            gClassList.push(styles.possibleResearchGoal)
        }
        if (isCurrentResearchGoal) {
            polygonClassList.push(styles.currentResearchGoal)
            gClassList.push(styles.currentResearchGoal)
        }

        return (
            <g key={`techBubble-${tech.name}`}
                className={gClassList.join(" ")}
                onClick={handleClickOnTech ? () => handleClickOnTech(tech) : null}
            >
                <polygon
                    points={polygonPoints}
                    className={polygonClassList.join(" ")}>
                </polygon>
                <text
                    x={x + cornerSize}
                    y={y + (cornerSize * 1.25)}
                    className={styles.techText}
                >
                    {tech.description}{isKnown ? "✓" : ""}
                </text>
            </g>
        )
    }

    static cornerSize = 10
    static get height() { return this.cornerSize * 2 }

    static renderJoiningLine(bubble1, bubble2, index) {
        if (!bubble1 || !bubble2) { return null }
        return (
            <line key={`joiningLine-${index}`}
                x1={bubble1.rightPoint.x} y1={bubble1.rightPoint.y}
                x2={bubble2.leftPoint.x} y2={bubble2.leftPoint.y}
                stroke="black" strokeDasharray="4"
            />
        )
    }

    static withTech(techName, techBubbles) {
        return techBubbles.filter(bubble => bubble.tech.name === techName)[0]
    }
}


export default class TechTree extends React.Component {

    render() {
        const { knownTech = [], possibleResearchGoals = [], currentResearchGoal = null, handleClickOnTech } = this.props

        const techBubbles = [];
        let tier, highestTier = 0, bubbleIndexInTier, highestBubbleIndex = 0;

        const sizing = {
            width: 90,
            spaceBetweenTiers: 40,
            spaceBetweenBubbles: 10,
        }

        for (let techName in techDiscoveries) {
            tier = techDiscoveries[techName].getTier(techDiscoveries)
            bubbleIndexInTier = techBubbles.filter(techBubble => techBubble.tier === tier).length
            if (tier > highestTier) { highestTier = tier }
            if (bubbleIndexInTier > highestBubbleIndex) { highestBubbleIndex = bubbleIndexInTier }


            techBubbles.push(new TechBubble(
                techDiscoveries[techName],
                tier,
                tier * (sizing.width + sizing.spaceBetweenTiers),
                bubbleIndexInTier * (sizing.spaceBetweenBubbles + TechBubble.height),
                sizing.width,
                knownTech.includes(techDiscoveries[techName]),
                possibleResearchGoals.includes(techDiscoveries[techName]),
                currentResearchGoal === techDiscoveries[techName]
            ))
        }

        const joiningLines = []

        techBubbles.forEach(bubble => {
            bubble.tech.prerequisites.forEach(prerequisiteTech => {
                joiningLines.push([
                    TechBubble.withTech(prerequisiteTech, techBubbles),
                    bubble
                ])
            })
        })


        const viewBox = {
            width: ((highestTier + 1) * sizing.width) + highestTier * sizing.spaceBetweenTiers,
            height: ((highestBubbleIndex + 1) * TechBubble.height) + highestBubbleIndex * sizing.spaceBetweenBubbles
        }

        return (
            <article className={styles.article}>

                <svg className={styles.svg}
                    viewBox={`0 0 ${600} ${viewBox.height}`}
                    xmlns="http://www.w3.org/2000/svg">
                    {joiningLines.map((line, index) => TechBubble.renderJoiningLine(...line, index))}
                    {techBubbles.map(bubble => bubble.render(handleClickOnTech))}
                </svg>
            </article>
        )

    }
}