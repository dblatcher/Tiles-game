import React from 'react'
import { Citizen } from '../../lib/game-entities/Citizen'
import { Town } from '../../lib/game-entities/Town'

import styles from './citizenFigure.module.scss'

export default function CitizenFigure(props: {
    citizen: Citizen
    handleClick?: Function
    mapXOffset?: number
    mapYOffset?: number
    occupierTown?: Town
}) {

    const { handleClick, citizen, mapYOffset = 0, mapXOffset = 0, occupierTown = null } = props
    const xPlacement = citizen.mapSquare.x - mapXOffset
    const yPlacement = citizen.mapSquare.y - mapYOffset

    const figureStyle = {
        left: `${xPlacement * 4}em`,
        top: `${yPlacement * 4}em`,
    }

    return (
        <figure
            style={figureStyle}
            className={styles.citizenFigure}
            onClick={handleClick ? () => { handleClick() } : null}
        >

            <i className={styles.spriteOnMapSection}
                style={{
                    backgroundImage: occupierTown
                        ? `radial-gradient(${occupierTown.faction.color} 65%, rgba(0,0,0,0) 65%)`
                        : '',
                }}
            />
            <i className={styles.spriteOnMapSection}
                style={citizen.job.spriteStyle}
            />

        </figure>
    )

}