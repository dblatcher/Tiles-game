
import styles from './townFigure.module.scss'

export default class TownFigure extends React.Component {

    render() {
        const { town, handleClick, isFallen, onMapSection} = this.props

        let figureClassList = [styles.figure]
        let spriteClassList = [styles.sprite]

        figureClassList.push( onMapSection ? styles.figureOnMapSection : styles.figureOnTileBoard)


        //TO DO - burning town animation?
        if (isFallen) {
            spriteClassList.push(styles.fallenSprite)
        }

        const figureStyle = {
            pointerEvents: isFallen ? 'none' : 'unset',
        }

        //TO DO - town sprite images?
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