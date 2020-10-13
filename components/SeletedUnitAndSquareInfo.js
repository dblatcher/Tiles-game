import React from 'react'
import Tile from './Tile'

import UnitFigure from './UnitFigure'
import styles from './seletedUnitAndSquareInfo.module.scss'



export default class SeletedUnitAndSquareInfo extends React.Component {


    render() {

        const { selectedSquare, selectedUnit, scrollToSquare } = this.props;

        return (
            <section className={styles.infoRow}>

                <article className={styles.infoBlock}
                    onClick={() => { scrollToSquare(selectedUnit) }}>
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