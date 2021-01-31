import InfoLink from '../../components/InfoLink'
import styles from './index.module.scss'

export default function IndexList({ title, listObject }) {

    return (
        <section className={styles.indexSection}>
            <h3 className={styles.indexTitle}>{title}</h3>
            <ul className={styles.indexList}>
                {Object.keys(listObject).map(typeName => (
                    <li className={styles.indexItem} key={`unit-${typeName.toLowerCase()}`}>
                        <InfoLink subject={listObject[typeName]} useDescription sameWindow />
                    </li>
                ))}
            </ul>
        </section>
    )
}