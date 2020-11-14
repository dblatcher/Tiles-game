
import styles from './info.module.scss'

export default class BuildingInfo extends React.Component {

    render() {
        const { subject, content } = this.props

        if (!subject) {return null}
        const buildingType = subject

        return (
            <article className={styles.article}>

                <h2>{buildingType.name}</h2>

                {content && content.description
                    ? <p>{content.description}</p>
                    : <p>{buildingType.name} is a type of building.</p>}


                <div className={styles.clear}></div>
            </article>
        )
    }

}