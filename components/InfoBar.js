import React from 'react'
import Tile from './Tile'
import SvgIcon from './SvgIcon'
import UnitFigure from './UnitFigure'
import styles from './infoBar.module.scss'



export default class InfoBar extends React.Component {


    render() {

        const { selectedSquare, selectedUnit, scrollToSquare, activeFaction } = this.props;

        return (
            <section className={styles.infoRow}>

                <article className={styles.factionBlock}>
                    

                        <p>
                            {activeFaction.name}
                        </p>
                        <p >
                            <SvgIcon color="darkgoldenrod" iconName="coins" />
                            : {activeFaction.treasury}
                        </p>
                        <p>
                            <SvgIcon color="skyblue" iconName="lightBulb" />
                            : {activeFaction.research}
                        </p>
                    
                </article>

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
                        <Tile mapSquare={selectedSquare} inInfoRow showYields />
                        <ul className={styles.infoList}>
                            {selectedSquare.infoList.map((infoPoint, index) => <li className={styles.infoLine} key={`selectedSquaretInfo#${index}`}>{infoPoint}</li>)}
                        </ul>

                    </>) : (null)}
                </article>

            </section>
        )
    }
}