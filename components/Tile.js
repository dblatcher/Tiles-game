import React, { version } from 'react'
import SvgIcon from './SvgIcon'
import TownFigure from './TownFigure';
import styles from './tile.module.scss'
import { spriteSheets } from '../lib/SpriteSheet.tsx'


export default class Tile extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            isHoveredOn: false
        }
        this.handleHover = this.handleHover.bind(this)
    }

    handleHover(wasEnterEvent) {
        const { inInfoRow, handleTileHoverEnter, mapSquare, mapSquareOnFactionWorldMap, showVoid } = this.props

        const viewerVersionOfMapSquare = mapSquareOnFactionWorldMap || mapSquare;

        this.setState({ isHoveredOn: wasEnterEvent }, () => {
            if (!inInfoRow && this.state.isHoveredOn && !showVoid && handleTileHoverEnter) {
                handleTileHoverEnter(viewerVersionOfMapSquare)
            }
        })
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
        const { mapSquare } = this.props

        return <>
            {mapSquare.foodYield ?
                <p className={styles.yieldLine}>
                    {mapSquare.foodYield} <SvgIcon iconName="food" color="white" />
                </p>
                : null}
            {mapSquare.productionYield ?
                <p className={styles.yieldLine}>
                    {mapSquare.productionYield} <SvgIcon iconName="production" color="white" />
                </p>
                : null}

            {mapSquare.tradeYield ?
                <p className={styles.yieldLine}>
                    {mapSquare.tradeYield} <SvgIcon iconName="trade" color="white" />
                </p>
                : null}
        </>
    }

    render() {
        const { mapSquare, handleClick, isSelected, notInSight,
            selectedUnit, inInfoRow, squareSelectedUnitIsIn, interfaceMode,
            gameHasOpenDialogue, showYields, town, onMapSection, occupier, showVoid, mapSquareOnFactionWorldMap } = this.props

        const selectedUnitCanMoveTo = selectedUnit && !selectedUnit.onGoingOrder && selectedUnit.canMoveTo(mapSquare, squareSelectedUnitIsIn);

        let figureClassList = [styles.tile]
        let bgSpriteClassList = [styles.spriteHolder]

        if (!inInfoRow) {
            if (interfaceMode === 'VIEW') {
                if (isSelected) { figureClassList.push(styles.selected) }
            } else if (interfaceMode === 'MOVE' && !gameHasOpenDialogue) {

                figureClassList.push(styles.inMoveMode)
                if (selectedUnitCanMoveTo) { figureClassList.push(styles.inRange) }
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
                onClick={handleClick || function () { }}
                onPointerEnter={() => { this.handleHover(true) }}
                onPointerLeave={() => { this.handleHover(false) }}
            >
                {showVoid
                    ? (null)
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

                        { town ? <TownFigure town={town} onMapSection={onMapSection} /> : null}

                        {viewerVersionOfMapSquare.tree ? this.renderDirectionedSprite(spriteSheets.trees, bgClasses) : (null)}

                        {viewerVersionOfMapSquare.irrigation ? (
                            <i className={bgClasses} style={spriteSheets.misc.getStyleForFrameCalled('irrigation')}></i>
                        ) : null}

                        {viewerVersionOfMapSquare.mine ? (
                            <i className={bgClasses} style={spriteSheets.misc.getStyleForFrameCalled('mine')}></i>
                        ) : null}

                        {showYields ? this.renderYieldLines() : null}
                    </>)
                }



            </figure>
        )
    }
}
