import UnitFigure from './UnitFigure';

const styles = {
    list: {
        margin: 0,
        padding:0,
        listStyle: 'none',
    },

    item: {
        display: 'inline-block'
    }
}

export default function SupportedUnitsList (props) {
    const { town } = props

    return (
    <section>
        <h2>{`${town.supportedUnits.length} units supported`}</h2>
        <ul style={styles.list}>
            {town.supportedUnits.map(unit => (
                <li key={unit.indexNumber} style={styles.item}>
                    <UnitFigure unit={unit} inInfoRow/>
                </li>
            ))}
        </ul>
    </section>
    )

}