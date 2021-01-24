import React from 'react'
import Tile from '../Tile'
import styles from './infoBlock.module.scss'
import InfoLink from '../InfoLink'



export default class InfoBlock extends React.Component {


    render() {
        const { stateOfPlay, watchingFaction } = this.props;
        const { selectedSquare, interfaceMode } = stateOfPlay;

        const visibleSelectedSquare = selectedSquare
            ? watchingFaction.worldMap && watchingFaction.worldMap[selectedSquare.y]
                ? watchingFaction.worldMap[selectedSquare.y][selectedSquare.x]
                : null
            : null;

        return <article className={styles.infoBlock}>

            <section className={styles.calendar}>
                <span>turn {stateOfPlay.turnNumber}</span>
            </section>

            {(visibleSelectedSquare && interfaceMode == 'VIEW') && <>
                <Tile mapSquare={visibleSelectedSquare} inInfoRow showYields />
                <ul className={styles.infoList}>
                    {visibleSelectedSquare.infoList.map((infoPoint, index) => (
                        <li className={styles.infoLine} key={`selectedSquaretInfo#${index}`}>
                            {infoPoint}
                            {index == 0 ? <InfoLink subject={visibleSelectedSquare.terrain} /> : null}
                        </li>
                    ))}
                </ul>
            </>}
        </article>


    }
}