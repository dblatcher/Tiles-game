import React from 'react'
import Tile from './Tile'

import UnitFigure from './UnitFigure'
import styles from './interfaceWindow.module.scss'



export default class InterfaceWindow extends React.Component {


    render() {

        const { selectedSquare, selectedUnit, handleInterfaceButton} = this.props;

        return (
            <section className={styles.infoRow}>

                <article className={styles.infoBlock}
                    onClick={() => { handleInterfaceButton('CENTER_MAP', selectedUnit) }}>
                    {selectedUnit ? (<>
                        <UnitFigure unit={selectedUnit} inInfoRow />

                        <ul className={styles.infoList}>
                            {selectedUnit.infoList.map((infoPoint, index) => <li className={styles.infoLine} key={`selectedUnitInfo#${index}`}>{infoPoint}</li>)}
                        </ul>
                    </>) : (null)}
                </article>

                <article className={styles.infoBlock}>
                    {selectedSquare ? (<>
                        <ul className={[styles.infoList, styles.infoListRight].join(" ")}>
                            {selectedSquare.infoList.map((infoPoint, index) => <li className={styles.infoLine} key={`selectedSquaretInfo#${index}`}>{infoPoint}</li>)}
                        </ul>

                        <Tile mapSquare={selectedSquare} inInfoRow />
                    </>) : (null)}
                </article>

            </section>
        )
    }
}