import React from 'react'

import SvgIcon from "./SvgIcon"
import styles from "./progressBox.module.scss"
import { displayTurnsToComplete } from '../lib/utility'

class ProgressBoxProps {
    current: number
    target: number
    unit: string
    fullWidth?: boolean
    showTurnsToComplete?: boolean
    turnsToComplete?: number
    useBlankSymbols?: boolean
    maxRows?: number
    noFrame?: boolean
    showNumbers?: boolean
}

export default class ProgressBox extends React.Component {
    props: ProgressBoxProps

    getSymbolBreakdown(rowWidth) {
        const { current, target, maxRows } = this.props

        if (maxRows == 1) { return [current] }

        const rowsNeeded = Math.ceil(target / rowWidth)
        const numberToShow = Math.min(current, rowWidth * (rowsNeeded + 2));
        const numberOfFullRows = (numberToShow - numberToShow % rowWidth) / rowWidth

        const symbolRows: number[] = rowWidth > 0 ? new Array(numberOfFullRows).fill(rowWidth) : []
        symbolRows.push(numberToShow % rowWidth)

        while (symbolRows.length < rowsNeeded) {
            symbolRows.push(0)
        }
        return symbolRows
    }


    renderIconRow(number, rowindex, rowWidth) {
        const { unit, target } = this.props

        const keyArray = []
        for (let i = 1; i < number + 1; i++) {
            keyArray.push(`Icon-${rowindex || ""}-${i}`)
        }

        return keyArray.map((key, index) => {

            const isPastTarget = (rowindex * rowWidth) + index + 1 > target

            return (
                <SvgIcon key={key}
                    iconName={unit}
                    color={isPastTarget ? 'red' : undefined}
                    style={{
                        filter: "drop-shadow(-1px 0px 0px black)",
                        position: 'absolute',
                        left: `${(index + .5) * (100 / rowWidth)}%`,
                        transform: 'translateX(-50%)',
                    }} />
            )
        })
    }

    renderIconRowWithBlanks(number = 0, rowindex, rowWidth) {
        const { unit, target } = this.props

        const keyArray: string[] = []
        for (let i = 0; i < rowWidth; i++) {

            if ((rowindex * rowWidth) + i + 1 > target && i >= number) { continue }

            keyArray.push(i >= number
                ? `Blank-${rowindex || ""}-${i}`
                : `Icon-${rowindex || ""}-${i}`
            )
        }

        return keyArray.reverse().map((key, index) => {

            const isBlank = key.startsWith('Blank')
            const isPastTarget = (rowindex * rowWidth) + index + 1 > target

            const color = isBlank
                ? 'rgba(0,0,0,.2)'
                : isPastTarget
                    ? 'red'
                    : undefined

            return (
                <SvgIcon key={key}
                    iconName={unit}
                    color={color}
                    style={{
                        filter: isBlank ? '' : 'drop-shadow(1px 0px 0px black)',
                        position: 'absolute',
                        right: `${(index + .5) * (100 / rowWidth)}%`,
                        transform: 'translateX(+50%)',
                    }} />
            )
        })
    }

    render() {
        const { current, target, turnsToComplete, 
            showTurnsToComplete, fullWidth, useBlankSymbols, maxRows,
            noFrame, showNumbers
        } = this.props

        let rowWidth = 10
        if (target > 80) { rowWidth = 20 }
        if (target > 160) { rowWidth = 30 }
        if (target > 240) { rowWidth = 40 }

        if (maxRows == 1) { rowWidth = target }
        else if (maxRows > 1) {
            rowWidth = Math.max(rowWidth, Math.ceil(target/maxRows))
        }


        const breakdown = this.getSymbolBreakdown(rowWidth)

        let articleClassList = [], sectionClassList = []
        if (fullWidth) {
            articleClassList.push(styles.fullWidthBox)
            sectionClassList.push(styles.innerBox)
        } else if (noFrame) {
            articleClassList.push(styles.noFrameBox)
        } else {
            articleClassList.push(styles.box)
        }

        return (
            <article className={articleClassList.join(" ")}>

                <section className={sectionClassList.join(" ")}>
                    {breakdown.map((number, index) => {
                        return (
                            <div key={`iconRow-${index}`} className={styles.row}>
                                {useBlankSymbols
                                    ? this.renderIconRowWithBlanks(number, index, rowWidth)
                                    : this.renderIconRow(number, index, rowWidth)
                                }
                            </div>
                        )
                    })}
                </section>

                {showTurnsToComplete && (
                    <span className={[styles.label, styles.top].join(" ")}>{displayTurnsToComplete(turnsToComplete)}</span>
                )}

                {showNumbers && (
                    <span className={styles.label}>{current} / {target}</span>
                )}
            </article>
        )
    }
}