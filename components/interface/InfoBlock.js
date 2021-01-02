import React from 'react'
import Tile from '../Tile'
import UnitFigure from '../UnitFigure'
import styles from './infoBlock.module.scss'
import InfoLink from '../InfoLink'



export default class InfoBlock extends React.Component {


    render() {
        const { stateOfPlay, centerWindowOn, watchingFaction } = this.props;
        const { selectedSquare, selectedUnit, interfaceMode } = stateOfPlay;

        const visibleSelectedSquare = selectedSquare
            ? watchingFaction.worldMap && watchingFaction.worldMap[selectedSquare.y]
                ? watchingFaction.worldMap[selectedSquare.y][selectedSquare.x]
                : null
            : null;

        if (selectedUnit && interfaceMode == 'MOVE') {
            return <article className={styles.infoBlock}
                onClick={() => { centerWindowOn(selectedUnit) }}>
                <UnitFigure unit={selectedUnit} inInfoRow />

                <ul className={styles.infoList}>

                    {selectedUnit.infoList.map((infoPoint, index) => (
                        <li className={styles.infoLine} key={`selectedUnitInfo#${index}`}>
                            {infoPoint}
                            {index == 0 ? <InfoLink subject={selectedUnit} /> : null}
                        </li>
                    ))}
                </ul>
            </article>
        }

        if (visibleSelectedSquare && interfaceMode == 'VIEW') {
            return <article className={styles.infoBlock}>
                <Tile mapSquare={visibleSelectedSquare} inInfoRow showYields />
                <ul className={styles.infoList}>
                    {visibleSelectedSquare.infoList.map((infoPoint, index) => (
                        <li className={styles.infoLine} key={`selectedSquaretInfo#${index}`}>
                            {infoPoint}
                            {index == 0 ? <InfoLink subject={visibleSelectedSquare.terrain} /> : null}
                        </li>
                    ))}
                </ul>

            </article>
        }

        return null
    }
}