import InfoLink from '../InfoLink'


import { techDiscoveries } from '../../lib/game-entities/TechDiscovery.tsx'
import styles from './info.module.scss'
import SvgIcon from '../SvgIcon'
import { BASE_POPULATION_LIMIT } from '../../lib/game-logic/constants'

export default class BuildingInfo extends React.Component {

    render() {
        const { subject, content } = this.props

        if (!subject) { return null }
        const buildingType = subject
        const { prerequisite, reduceUnhappiness, revenueMultiplierBonus, allowExtraPopulation } = buildingType

        const prerequisiteTech = techDiscoveries[prerequisite]

        let bonusDescriptionItems = []
        if (reduceUnhappiness) {
            bonusDescriptionItems.push(`reduces unhappiness by ${reduceUnhappiness}`)
        }
        if (allowExtraPopulation) {
            bonusDescriptionItems.push(`allows ${allowExtraPopulation} extra population (${BASE_POPULATION_LIMIT} base)`)
        }
        if (revenueMultiplierBonus) {
            for (let item in revenueMultiplierBonus) {
                bonusDescriptionItems.push(`${item}: ${revenueMultiplierBonus[item] * 100}%`)
            }
        }
        const bonusDescription = bonusDescriptionItems.join(", ")


        return (
            <article className={styles.article}>
                <h3>{buildingType.name}</h3>

                {content && content.description
                    ? <p>{content.description}</p>
                    : <p>{buildingType.name} is a type of building.</p>}


                <table>
                    <tbody>
                        <tr>
                            <td>cost:</td>
                            <td>{buildingType.productionCost}<SvgIcon iconName="production" /> </td>
                        </tr>
                        <tr>
                            <td>maintenance:</td>
                            <td>{buildingType.maintenanceCost}<SvgIcon iconName="coins" /></td>
                        </tr>

                        {bonusDescription ? (
                            <tr>
                                <td>bonus</td>
                                <td>{bonusDescription}</td>
                            </tr>
                        ) : null}

                        <tr>
                            <td>requires:</td>
                            <td>{prerequisiteTech
                                ? <InfoLink sameWindow useDescription subject={prerequisiteTech} />
                                : 'none'}
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div className={styles.clear}></div>
            </article>
        )
    }

}