import InfoLink from '../InfoLink'


import { buildingTypes } from '../../lib/game-entities/BuildingType'
import { techDiscoveries } from '../../lib/game-entities/TechDiscovery'
import styles from './info.module.scss'
import SvgIcon from '../SvgIcon'
import { BASE_POPULATION_LIMIT } from '../../lib/game-logic/constants'

export default class BuildingInfo extends React.Component {

    get bonusDescription() {
        const { subject } = this.props
        if (!subject) { return [] }
        const { reduceUnhappiness, revenueMultiplierBonus, allowExtraPopulation } = subject
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

        if (subject == buildingTypes.granary) {
            bonusDescriptionItems.push('Keep 50% of food store after population growth')
        }

        if (subject == buildingTypes.barracks) {
            bonusDescriptionItems.push('Land units start as veteran')
        }

        if (subject == buildingTypes.harbour) {
            bonusDescriptionItems.push('Naval units start as veteran')
            bonusDescriptionItems.push('+1 food in ocean squares')
        }

        return bonusDescriptionItems
    }

    render() {
        const { subject, content } = this.props
        if (!subject) { return null }

        const buildingType = subject
        const prerequisiteTech = techDiscoveries[buildingType.prerequisite]
        const bonusDescription = this.bonusDescription.join(", ")


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