import SvgIcon from "./SvgIcon"
import styles from "./progressBox.module.scss"


export default class ProgressBox extends React.Component {


    getSymbolBreakdown(rowWidth) {
        const { current, target } = this.props

        const rowsNeeded = Math.ceil(target / rowWidth)

        const numberOfFullRows = (current - current % rowWidth) / rowWidth
        const symbolRows = new Array(numberOfFullRows).fill(rowWidth)
        symbolRows.push(current % rowWidth)

        while (symbolRows.length < rowsNeeded) {
            symbolRows.push(0)
        }
        return symbolRows
    }



    renderIconRow(number = 1, rowindex, rowWidth) {
        const { unit, target } = this.props

        const keyArray = []
        for (let i = 1; i < number + 1; i++) {
            keyArray.push(`Icon-${rowindex || ""}-${i}`)
        }
        let color = unit === 'food' ? 'green' : 'brown';
        let bunchUp = 0
        if (rowWidth == 20) {bunchUp = 5.5}
        if (rowWidth == 30) {bunchUp = 7}
        if (rowWidth == 40) {bunchUp = 7.8}


        return keyArray.map((key, index) => {
            
            const isPastTarget = (rowindex*rowWidth) + index > target

            return (
            <SvgIcon key={key}
                iconName={unit}
                color={isPastTarget ? 'red':color}
                style={{ flexShrink: 0, filter:"drop-shadow(-1px 0px 0px black)", marginRight:`-${bunchUp}%` }} />
        )})
    }

    render() {
        const { current, target } = this.props

        const rowWidth = target < 80 
            ? 10
            : target < 200 
                ? 20
                : 30;

        const breakdown = this.getSymbolBreakdown(rowWidth)

        return (
            <article className={styles.box}>

                {breakdown.map((number, index) => {
                    return (
                        <div key={`iconRow-${index}`} className={styles.row}>
                            {this.renderIconRow(number, index, rowWidth)}
                        </div>
                    )
                })}

                <span className={styles.label}>{current} / {target}</span>
            </article>
        )
    }
}