import InfoLink from '../../components/InfoLink'
export default function IndexList({ title, listObject }) {

    return (
        <section>
            <h2>{title}</h2>
            <ul>
                {Object.keys(listObject).map(typeName => (
                    <li key={`unit-${typeName.toLowerCase()}`}>
                        <InfoLink subject={listObject[typeName]} useDescription sameWindow />
                    </li>
                ))}
            </ul>
        </section>
    )
}