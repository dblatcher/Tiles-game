
import styles from './townFigure.module.scss'
import { spriteSheets } from '../lib/SpriteSheet.tsx'

export default class TownFigure extends React.Component {

    render() {
        const { town, handleClick, isFallen, onMapSection, xPlacement = 0, yPlacement = 0 } = this.props

        let figureClassList = [styles.figure]
        let spriteClassList = [styles.sprite]

        figureClassList.push(styles.figureOnMap)


        if (isFallen) {
            spriteClassList.push(styles.fallenSprite)
        }

        const figureStyle = {
            left: onMapSection ? `${xPlacement * 4}rem` : `${town.x * 4}rem`,
            top: onMapSection ? `${yPlacement * 4}rem` : `${town.y * 4}rem`,
            pointerEvents: isFallen ? 'none' : 'unset',
        }

        const spriteStyle = {
            backgroundColor: town.faction.color,
        }

        return (
            <figure
                onClick={() => { handleClick() }}
                style={figureStyle}
                className={figureClassList.join(" ")}
            >
                <i
                    style={spriteStyle}
                    className={spriteClassList.join(" ")}
                >
                </i>

                {onMapSection
                    ? <></>
                    : <>
                        <span className={styles.caption}>{town.name}</span>
                        <span className={styles.populationNumber}>{town.population}</span>
                    </>
                }
            </figure>
        )

    }

}