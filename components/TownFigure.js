
import styles from './townFigure.module.scss'
import { spriteSheets } from '../lib/SpriteSheet.tsx'

export default class TownFigure extends React.Component {

    render() {
        const { town, handleClick, isFallen, onMapSection} = this.props

        let figureClassList = [styles.figure]
        let spriteClassList = [styles.sprite]

        figureClassList.push( onMapSection ? styles.figureOnMapSection : styles.figureOnTileBoard)


        //TO DO - burnning town animation?
        if (isFallen) {
            spriteClassList.push(styles.fallenSprite)
        }

        const figureStyle = {
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
                    onClick={handleClick}
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