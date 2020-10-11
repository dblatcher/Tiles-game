import React from 'react'
import Tile from './Tile'
import ModeButtons from './ModeButtons'
import UnitFigure from './UnitFigure'
import styles from './interfaceWindow.module.scss'

export default class InterfaceWindow extends React.Component {


    render() {

        const { selectedSquare, selectedUnit, handleInterfaceButton, interfaceMode, changeMode, interfaceModeOptions } = this.props;

        return (<>
            {/* <section className={styles.infoRow}>
                {selectedSquare ? (<>
                    <Tile mapSquare={selectedSquare} />

                    <div className={styles.infoList}>
                        <p className={styles.infoLine}>{selectedSquare.description}</p>
                        <p className={styles.infoLine}>{`[${selectedSquare.x},${selectedSquare.y}]`}</p>
                    </div>
                </>) : (null)}
            </section> */}

            <section
                className={styles.infoRow}
                onClick={() => { handleInterfaceButton('CENTER_MAP', selectedUnit) }}
            >
                {selectedUnit ? (<>
                    <UnitFigure unit={selectedUnit} inInfoRow />

                    <div className={styles.infoList}>
                        <p className={styles.infoLine}>{`${selectedUnit.faction.name} ${selectedUnit.type.name}`}</p>
                        <p className={styles.infoLine}>{`${selectedUnit.remainingMoves}/${selectedUnit.type.moves} movement`}</p>
                        <p className={styles.infoLine}>{`[${selectedUnit.x},${selectedUnit.y}]`}</p>
                    </div>
                </>) : (null)}
            </section>

            <section>
                <button onClick={() => { handleInterfaceButton('PREVIOUS_UNIT') }}>previous unit</button>
                <button onClick={() => { handleInterfaceButton('NEXT_UNIT') }}>Next unit</button>
            </section>

            <section>
                <button onClick={() => { handleInterfaceButton('END_OF_TURN') }}>End of turn</button>
            </section>

            <ModeButtons
                interfaceMode={interfaceMode}
                changeMode={changeMode}
                interfaceModeOptions={interfaceModeOptions}
            />
        </>)
    }
}