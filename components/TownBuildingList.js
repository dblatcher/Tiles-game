import SvgIcon from './SvgIcon'
import styles from "./townBuildingList.module.scss";

export default class TownBuildingList extends React.Component {

    render() {
        const { town } = this.props

        return (
            <article className={styles.box}>
                <ul className={styles.buildingList}>
                    {town.buildings.map(buildingType => {
                        return (
                            <li className={styles.buildingListItem} key={`buildingListItem-${buildingType.name}`}>
                                <span>{buildingType.displayName}</span>
                                <span>{buildingType.maintenanceCost}<SvgIcon iconName="coins" /></span>
                            </li>
                        )
                    })}
                </ul>
            </article>
        )
    }
}