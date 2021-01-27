import React from 'react'
import SvgIcon from './SvgIcon'
import TownFigure from './TownFigure';
import styles from './tile.module.scss'
import { spriteSheets } from '../lib/SpriteSheet'


export default class Tile extends React.Component {

    constructor(props) {
        super(props)
    }

    get needsCoastline() {
        const { mapSquare, adjacentSquares } = this.props
        if (!adjacentSquares) { return false }
        for (let key in adjacentSquares) {
            if (adjacentSquares[key] && adjacentSquares[key].isWater != mapSquare.isWater) { return true }
        }
        return false
    }

    renderDirectionedSprite(spriteSheet, bgClasses) {
        const { adjacentSquares, inInfoRow } = this.props
        let style = spriteSheet.getStyleFromAdjacentSquares(adjacentSquares)
        if (inInfoRow) { style.top = "0" } //override the top property used on spriteSheets.trees.css
        return <i className={bgClasses} style={style}></i>
    }

    renderYieldLines() {
        const { mapSquare, citizenOutput } = this.props
        let foodYield, productionYield, tradeYield

        if (citizenOutput) {
            foodYield = citizenOutput.foodYield
            productionYield = citizenOutput.productionYield
            tradeYield = citizenOutput.tradeYield
        } else {
            foodYield = mapSquare.foodYield
            productionYield = mapSquare.productionYield
            tradeYield = mapSquare.tradeYield
        }

        return <>
            {foodYield ?
                <p className={styles.yieldLine}>
                    {foodYield} <SvgIcon iconName="food" color="white" />
                </p>
                : null}
            {productionYield ?
                <p className={styles.yieldLine}>
                    {productionYield} <SvgIcon iconName="production" color="white" />
                </p>
                : null}

            {tradeYield ?
                <p className={styles.yieldLine}>
                    {tradeYield} <SvgIcon iconName="trade" color="white" />
                </p>
                : null}
        </>
    }

    renderVoid(bgClasses) {
        return <i className={[bgClasses, styles.unknown].join(" ")}></i>
    }

    render() {
        const { mapSquare, handleClick, isSelected, notInSight, isComputerPlayersTurn,
            selectedUnit, inInfoRow, squareSelectedUnitIsIn, interfaceMode, unitsInMapSquare,
            gameHasOpenDialogue, showYields, town, onMapSection, occupier, showVoid, mapSquareOnFactionWorldMap,
            mapGridWidth
        } = this.props

        const selectedUnitCanMoveTo = selectedUnit && !selectedUnit.onGoingOrder &&
            selectedUnit.canMoveToOrAttack(mapSquare, squareSelectedUnitIsIn, town, unitsInMapSquare, mapGridWidth);

        let figureClassList = [styles.tile]
        let bgSpriteClassList = [styles.spriteHolder]

        if (!inInfoRow && !onMapSection) {
            if (interfaceMode === 'VIEW') {
                if (isSelected) { figureClassList.push(styles.selected) }
            } else if (interfaceMode === 'MOVE') {
                if (selectedUnitCanMoveTo && !isComputerPlayersTurn && !gameHasOpenDialogue) { figureClassList.push(styles.inRange) }
            }

        }

        if (occupier) { figureClassList.push(styles.occupied) }

        if (notInSight) {
            bgSpriteClassList.push(styles.notInSight)
        }

        const viewerVersionOfMapSquare = mapSquareOnFactionWorldMap || mapSquare;

        const bgClasses = bgSpriteClassList.join(" ")

        return (
            <figure
                className={figureClassList.join(" ")}
                onClick={handleClick
                    ? () => { return handleClick(false) }
                    : null
                }
                onContextMenu={handleClick
                    ? (event) => { 
                        event.preventDefault()
                        return handleClick(true) 
                    }
                    : null
                }
            >
                {showVoid
                    ? this.renderVoid(bgClasses)
                    : (<>
                        <i className={bgClasses} style={mapSquare.css}></i>
                        {this.needsCoastline
                            ? this.renderDirectionedSprite(spriteSheets[mapSquare.isWater ? 'coastlines' : 'innerCoastlines'], bgClasses)
                            : (null)
                        }


                        {mapSquare.terrain.spriteCss ? (
                            <i className={bgClasses} style={mapSquare.terrain.spriteCss}></i>
                        ) : null}

                        {viewerVersionOfMapSquare.road ? this.renderDirectionedSprite(spriteSheets.roads, bgClasses) : (null)}

                        { town ? <TownFigure town={town} onMapSection={onMapSection} units={unitsInMapSquare} /> : null}

                        {viewerVersionOfMapSquare.tree ? this.renderDirectionedSprite(spriteSheets.trees, bgClasses) : (null)}

                        {viewerVersionOfMapSquare.irrigation ? (
                            <i className={bgClasses} style={spriteSheets.misc.getStyleForFrameCalled('irrigation')}></i>
                        ) : null}

                        {viewerVersionOfMapSquare.mine ? (
                            <i className={bgClasses} style={spriteSheets.misc.getStyleForFrameCalled('mine')}></i>
                        ) : null}

                        {showYields && this.renderYieldLines()}
                    </>)
                }

                {inInfoRow && (
                    <span className={styles.coordinates}>{`[${mapSquare.x}, ${mapSquare.y}]`}</span>
                )}
            </figure>
        )
    }
}
