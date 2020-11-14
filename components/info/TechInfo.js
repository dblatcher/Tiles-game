
import styles from './info.module.scss'

export default class TechInfo extends React.Component {

    render() {
        const { subject, content } = this.props
        const techDiscovery = subject
        if (!techDiscovery) {return null}

        return (
            <article className={styles.article}>

                <h2>{techDiscovery.name}</h2>

                {content && content.description
                    ? <p>{content.description}</p>
                    : <p>{techDiscovery.name} is a techDiscovery.</p>}


                <div className={styles.clear}></div>
            </article>
        )
    }

}