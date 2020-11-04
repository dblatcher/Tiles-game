import SvgIcon from "./SvgIcon"

export default function IconRow(props) {
    const { iconName, color=false, number = 1, rowWidth=10, shadow } = props

    const keyArray = []
    for (let i = 1; i < number + 1; i++) {
        keyArray.push(`Icon-${i}`)
    }


    let bunchUp = 0
    if (rowWidth == 20) {bunchUp = 5.5}
    if (rowWidth == 30) {bunchUp = 7}
    if (rowWidth == 40) {bunchUp = 7.8}


    return keyArray.map((key, index) => {


        return (
        <SvgIcon key={key}
            iconName={iconName}
            color={color}
            style={{ 
                flexShrink: 0,
                filter: shadow ? "drop-shadow(-1px 0px 0px black)" : "",
                marginRight:`-${bunchUp}%` 
            }} />
    )})
}