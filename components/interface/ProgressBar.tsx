import React from 'react'
import { Town } from '../../lib/game-entities/Town'
import { getTurnsToComplete, displayTurnsToComplete } from '../../lib/utility'
import SvgIcon from '../SvgIcon'
import styles from './progressBar.module.scss'

class ProgressBarProps {
    subject: Town
    topic: "PRODUCTION" | "FOOD"
    showAmount?: boolean
    showTurnsToComplete?: boolean
}

export { ProgressBarProps }

export default class ProgressBar extends React.Component {
    props: ProgressBarProps

    constructor(props: ProgressBarProps) {
        super(props)
    }

    get values() {
        const { subject, topic } = this.props
        let amount = 0, gain = 0, goal = 0, turnsToComplete = Infinity;
        if (subject.classIs === "Town") {
            if (topic === "PRODUCTION") {
                gain = subject.output.productionYield
                amount = subject.productionStore
                if (subject.isProducing) {
                    goal = subject.isProducing ? subject.isProducing.productionCost : 0
                    turnsToComplete = getTurnsToComplete(goal - amount, gain);
                }

            }
        }
        return { amount, gain, goal, turnsToComplete }
    }

    get iconName() {
        const { topic } = this.props
        switch (topic) {
            case "PRODUCTION": return "production"
            case "FOOD": return "food"
            default: return ""
        }
    }

    get label() {
        const { topic, subject } = this.props
        switch (topic) {
            case "PRODUCTION": return subject.isProducing ? subject.isProducing.name : "nothing"
            case "FOOD": return "growth"
            default: return ""
        }
    }

    render() {
        const { amount, goal, turnsToComplete } = this.values
        const { showAmount, showTurnsToComplete } = this.props
        const articleClassList = [styles.progressBar]

        let percentage = goal > 0 
            ? `${100 * (amount / goal)}%`
            : `0%`

        return (
            <article className={articleClassList.join(" ")}>

                {showAmount && (
                    <span>
                        {this.label}: {amount}/{goal}
                        <SvgIcon iconName={this.iconName} />
                    </span>
                )}
                <figure>
                    <div><div style={{ width: percentage }}></div></div>
                </figure>
                {showTurnsToComplete && (
                    <span>{displayTurnsToComplete(turnsToComplete)}</span>
                )}


            </article>
        )
    }

}

