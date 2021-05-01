import React from 'react'
import { spriteSheets } from '../../lib/SpriteSheet'

import styles from './villageFigure.module.scss'

export default function VillageFigure(props) {

    let figureClassList = [styles.figure]
    let spriteClassList = [styles.sprite]


    const spriteStyle = spriteSheets.misc.getStyleForFrameCalled('village')


    return <figure
        className={figureClassList.join(" ")}
    >
        <i
            style={spriteStyle}
            className={spriteClassList.join(" ")}
        >
        </i>
    </figure>

}