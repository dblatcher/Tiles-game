
import styles from './townFigure.module.scss'
import { spriteSheets } from '../lib/SpriteSheet.tsx'

export default class TownFigure extends React.Component {

    render() {
        const { town, handleClick, inInfoRow, isFallen } = this.props

        let figureClassList = [styles.figure]
        let spriteClassList = [styles.sprite]

        figureClassList.push(inInfoRow ? styles.figureInInfoRow : styles.figureOnMap)


        if (isFallen) {
            spriteClassList.push(styles.fallenSprite)
        }

        const figureStyle = {
            left: inInfoRow ? 'unset' : `${town.x * 4}rem`,
            top: inInfoRow ? 'unset' : `${town.y * 4}rem`,
            pointerEvents: isFallen ? 'none' : 'unset',
        }
        
        const spriteStyle = {
            backgroundColor: town.faction.color,

        }

        return (
            <figure
                onClick={handleClick}
                style={figureStyle}
                className={figureClassList.join(" ")}
            >
                <i
                    style={spriteStyle}
                    className={spriteClassList.join(" ")}
                    onClick={handleClick || function () { }}
                >
                </i>

                <span className={styles.caption}>{town.name}</span>
                <span className={styles.populationNumber}>{town.population}</span>
            </figure>
        )

    }

}