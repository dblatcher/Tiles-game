import SvgIcon from "./SvgIcon"

export default function IconRow(props) {
    const { iconName, color = false, number = 1, useTens = true } = props
    const onesKeyArray = [], tensKeyArray = []

    const tenStyle = {
        backgroundColor: 'black',
        padding: '.1rem',
        borderRadius: '50%',
        width: '1.5rem',
        height: '1.5rem',
        marginRight: '.2rem',
    }

    const spanStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        minHeight: "2rem",
    }

    let numberOfOnes = useTens ? number % 10 : number;

    if (useTens) {
        for (let i = 0; i < number; i = i + 10) {
            if (i == 0) { continue }
            tensKeyArray.push(`TenIcon-${i}`)
        }
    }

    for (let i = 1; i < numberOfOnes + 1; i++) {
        onesKeyArray.push(`Icon-${i}`)
    }

    return <span style={spanStyle}>
        {tensKeyArray.map((key, index) => <SvgIcon
            key={key}
            iconName={iconName}
            color={color}
            style={tenStyle} />
        )}
        {onesKeyArray.map((key, index) => <SvgIcon
            key={key}
            iconName={iconName}
            color={color} />
        )}
    </span>
}