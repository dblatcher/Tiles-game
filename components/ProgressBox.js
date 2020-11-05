import SvgIcon from "./SvgIcon"
import styles from "./progressBox.module.scss"


export default class ProgressBox extends React.Component {


    getSymbolBreakdown(rowWidth) {
        const { current, target } = this.props
        const rowsNeeded = Math.ceil(target / rowWidth)
        const numberToShow = Math.min(current, rowWidth * (rowsNeeded + 2));
        const numberOfFullRows = (numberToShow - numberToShow % rowWidth) / rowWidth
        const symbolRows = new Array(numberOfFullRows).fill(rowWidth)

        symbolRows.push(numberToShow % rowWidth)

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
        if (rowWidth == 20) { bunchUp = 5.5 }
        if (rowWidth == 30) { bunchUp = 7 }
        if (rowWidth == 40) { bunchUp = 7.8 }


        return keyArray.map((key, index) => {

            const isPastTarget = (rowindex * rowWidth) + index + 1 > target

            return (
                <SvgIcon key={key}
                    iconName={unit}
                    color={isPastTarget ? 'red' : color}
                    style={{ flexShrink: 0, filter: "drop-shadow(-1px 0px 0px black)", marginRight: `-${bunchUp}%` }} />
            )
        })
    }

    render() {
        const { current, target } = this.props

        let rowWidth = 10
        if (target > 50) { rowWidth = 20 }
        if (target > 100) { rowWidth = 30 }
        if (target > 150) { rowWidth = 40 }


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