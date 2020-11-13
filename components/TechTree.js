import { techDiscoveries } from '../lib/game-entities/TechDiscovery.tsx'

import styles from './techTree.module.scss'

class TechBubble {
    constructor(tech, tier, bubbleIndexInTier, isKnown, isPossibleResearchGoal, isCurrentResearchGoal, sizing) {
        this.tech = tech
        this.tier = tier
        this.bubbleIndexInTier = bubbleIndexInTier
        this.isKnown = isKnown
        this.isPossibleResearchGoal = isPossibleResearchGoal
        this.isCurrentResearchGoal = isCurrentResearchGoal
        this.sizing = sizing
    }

    get x() {
        const { sizing, tier } = this
        return tier * (sizing.width + sizing.spaceBetweenTiers)
    }

    get y() {
        const { bubbleIndexInTier, height, tier } = this
        const { longestTierLength, cornerSize, spaceBetweenBubbles, tierLengths } = this.sizing

        const blockHeight = (longestTierLength * (2 * cornerSize)) + (longestTierLength - 1) * spaceBetweenBubbles
        const tierHeight = (tierLengths[tier] * (2 * cornerSize)) + (tierLengths[tier] - 1) * spaceBetweenBubbles
        const placeWithinTier = bubbleIndexInTier * (spaceBetweenBubbles + height)

        const spaceLeft = blockHeight - tierHeight

        return placeWithinTier + spaceLeft / 2
    }

    get polygonPoints() {
        const { x, y, longEdgeWidth } = this
        const { cornerSize } = this.sizing
        return `${x + cornerSize},${y + 0} ${x + cornerSize + longEdgeWidth},${y + 0} ${x + cornerSize * 2 + longEdgeWidth},${y + cornerSize} ${x + cornerSize + longEdgeWidth},${y + cornerSize * 2} ${x + cornerSize},${y + cornerSize * 2}, ${x + 0},${y + cornerSize}`
    }

    get leftPoint() {
        const { x, y } = this
        const { cornerSize } = this.sizing
        return { x: x, y: y + cornerSize };

    }

    get rightPoint() {
        const { x, y, longEdgeWidth } = this
        const { cornerSize } = this.sizing
        return { x: x + cornerSize * 2 + longEdgeWidth, y: y + cornerSize }
    }

    get longEdgeWidth() { return this.sizing.width - (this.sizing.cornerSize * 2) }
    get height() { return this.sizing.cornerSize * 2 }

    render(handleClickOnTech) {
        const { x, y, tech, polygonPoints, isKnown, isPossibleResearchGoal, isCurrentResearchGoal } = this
        const { cornerSize, width } = this.sizing

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

            >
                <polygon
                    onClick={handleClickOnTech ? () => handleClickOnTech(tech) : null}
                    points={polygonPoints}
                    className={polygonClassList.join(" ")} />

                <text
                    x={x + cornerSize}
                    y={y + (cornerSize * 1.25)}
                    className={styles.techText}
                >
                    {tech.description}{isKnown ? "✓" : ""}
                </text>

                <a href={this.tech.infoPageUrl} 
                target="_blank" 
                className={styles.infoLink}
                onClick={event => event.stopPropagation()}>
                    <circle
                        cx={x + width - cornerSize*1.5}
                        cy={y + (cornerSize * 1.25) - 5}
                        r="10"
                        className={styles.infoLinkCircle}
                    >
                    </circle>
                    <text
                        x={x + width - cornerSize*1.5 - 5}
                        y={y + (cornerSize * 1.25)}
                        className={styles.infoLinkText}
                    >?</text>
                </a>

            </g>
        )
    }


    static renderJoiningLine(bubble1, bubble2, index) {
        if (!bubble1 || !bubble2) { return null }

        const colors = ['blue', 'red', 'green']
        const color = colors[bubble1.tier % colors.length]
        const dash = 1 + bubble2.tier - bubble1.tier

        return (
            <g key={`joiningLine-${index}`}>
                <line
                    x1={bubble1.rightPoint.x} y1={bubble1.rightPoint.y}
                    x2={bubble2.leftPoint.x} y2={bubble2.leftPoint.y}
                    stroke={color} strokeDasharray={dash}
                />
                <circle cx={bubble2.leftPoint.x} cy={bubble2.leftPoint.y} r={3} fill={color} />
            </g>
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
        let tier, highestTier = 0, bubbleIndexInTier;

        const sizing = {
            width: 150,
            spaceBetweenTiers: 100,
            spaceBetweenBubbles: 30,
            cornerSize: 15,
            longestTierLength: 0,
            tierLengths: [],
        }

        for (let techName in techDiscoveries) {
            tier = techDiscoveries[techName].getTier(techDiscoveries)
            bubbleIndexInTier = techBubbles.filter(techBubble => techBubble.tier === tier).length
            if (tier > highestTier) { highestTier = tier }
            if (bubbleIndexInTier + 1 > sizing.longestTierLength) { sizing.longestTierLength = bubbleIndexInTier + 1 }

            sizing.tierLengths[tier] = sizing.tierLengths[tier] ? sizing.tierLengths[tier] + 1 : 1;

            techBubbles.push(new TechBubble(
                techDiscoveries[techName],
                tier,
                bubbleIndexInTier,
                knownTech.includes(techDiscoveries[techName]),
                possibleResearchGoals.includes(techDiscoveries[techName]),
                currentResearchGoal === techDiscoveries[techName],
                sizing,
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
            height: (sizing.longestTierLength * (2 * sizing.cornerSize)) + (sizing.longestTierLength - 1) * sizing.spaceBetweenBubbles
        }

        return (
            <article className={styles.article}>
                <svg className={styles.svg}
                    style={{ width: `${viewBox.width * (2 / 3)}px` }}
                    viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
                    xmlns="http://www.w3.org/2000/svg">
                    {joiningLines.map((line, index) => TechBubble.renderJoiningLine(...line, index))}
                    {techBubbles.map(bubble => bubble.render(handleClickOnTech))}
                </svg>
            </article>
        )

    }
}