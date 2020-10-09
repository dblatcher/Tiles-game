import React from 'react'
import Tile from './Tile'
import UnitFigure from './UnitFigure'
import styles from './interfaceWindow.module.scss'

export default class InterfaceWindow extends React.Component {


    render() {

        const { selectedSquare, selectedUnit } = this.props;

        return (<>
            <section className={styles.infoRow}>
                {selectedSquare ? (<>
                    <Tile mapSquare={selectedSquare} />

                    <div className={styles.infoList}>
                        <p className={styles.infoLine}>{selectedSquare.description}</p>
                        <p className={styles.infoLine}>{`[${selectedSquare.x},${selectedSquare.y}]`}</p>
                    </div>
                </>) : (null)}
            </section>

            <section className={styles.infoRow}>
                {selectedUnit ? (<>
                    <UnitFigure unit={selectedUnit} inInfoRow />

                    <div className={styles.infoList}>
                        <p className={styles.infoLine}>{`${selectedUnit.faction.name} ${selectedUnit.type.name}`}</p>
                        <p className={styles.infoLine}>{`[${selectedUnit.x},${selectedUnit.y}]`}</p>
                    </div>
                </>) : (null)}
            </section>
        </>)
    }
}