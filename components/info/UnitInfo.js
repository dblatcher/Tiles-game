import InfoLink from '../InfoLink'
import SvgIcon from '../SvgIcon'
import { techDiscoveries } from '../../lib/game-entities/TechDiscovery'

import styles from './info.module.scss'

export default class UnitInfo extends React.Component {
    render() {
        const { subject, content } = this.props
        const unitType = subject

        const prerequisite = techDiscoveries[unitType.prerequisite]
        const obseletedByList = unitType.obseletedBy
            ? unitType.obseletedBy
                .filter(techName => techDiscoveries[techName])
                .map(techName => techDiscoveries[techName])
            : []

        return (
            <article className={styles.article}>
                <h3>{unitType.displayName}</h3>
                <div className={styles.sideBox}>
                    <figure className={styles.figure}>
                        <i className={styles.sprite}
                            style={unitType.spriteStyle}></i>
                    </figure>
                </div>


                <table>
                    <tbody>
                        <tr><td>attack</td><td>{unitType.attack}</td></tr>
                        <tr><td>defend</td><td>{unitType.defend}</td></tr>
                        <tr><td>moves</td><td>{unitType.moves}</td></tr>
                        <tr><td>cost</td><td>{unitType.productionCost}<SvgIcon iconName="production" /></td></tr>
                        <tr><td>requires</td><td>{prerequisite
                            ? <InfoLink sameWindow useDescription subject={prerequisite} />
                            : 'none'}</td></tr>
                        {obseletedByList.length > 0 && <tr>
                            <td>made obselete by</td>
                            <td>
                                {obseletedByList.map((obseletingTech, index) => (
                                    <span key={`obseletingTech-${obseletingTech.name}`}>
                                        <InfoLink sameWindow useDescription subject={obseletingTech} />
                                        {index + 1 < obseletedByList.length && <span>&nbsp;|&nbsp;</span>}
                                    </span>
                                ))}
                            </td>
                        </tr>}
                        {unitType.specialRuleList.length > 0 && <tr>
                            <td colSpan={2}>
                                {unitType.specialRuleList.map((specialRuleDescriptions, index) => (
                                    <span key={`specialRule-${index}`}>
                                        <span>{specialRuleDescriptions}</span>
                                        {index + 1 < unitType.specialRuleList.length && <span>,&nbsp;</span>}
                                    </span>
                                ))}
                            </td>
                        </tr>}

                    </tbody>
                </table>
                <p>{content
                    ? content.description || `${unitType.displayName} is a type of unit.`
                    : ""}
                </p>
                <div className={styles.clear}></div>
            </article>
        )
    }

}