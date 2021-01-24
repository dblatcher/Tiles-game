import { GameState } from "../lib/game-entities/GameState";
import { Town } from "../lib/game-entities/Town";
import styles from "./citizenRow.module.scss";

interface CitizenRowProps {
    town: Town
    handleCitizenClick: Function
    onFactionWindow?: boolean
    stateOfPlay: GameState
}

export default function CitizenRow(props: CitizenRowProps) {
    const { town, handleCitizenClick, onFactionWindow = false, stateOfPlay } = props
    const { units } = stateOfPlay
    const { population, happiness } = town

    const isInRevolt = town.getIsInRevolt(units)
    const unhappiness = town.getUnhappiness(units)
    const rowClassList = [styles.citizenRow]
    if (onFactionWindow) { rowClassList.push(styles.rowInFactionWindow) }
    if (isInRevolt) { rowClassList.push(styles.inRevolt) }

    return (
        <article className={rowClassList.join(" ")}>
            {town.citizens.map((citizen, index) => {

                const classList = [styles.citizenFigure]
                if (index + 1 > population - unhappiness) { classList.push(styles.unhappy) }
                if (index < happiness) { classList.push(styles.happy) }

                const styleObject = Object.assign({
                    left: `${(index + .5) * (100 / town.citizens.length)}%`,
                    zIndex: '1'
                }, citizen.job.spriteStyle)

                return (
                    <i key={`citizen-${index}`}
                        onClick={handleCitizenClick ? () => handleCitizenClick(citizen) : null}
                        className={classList.join(" ")}
                        style={styleObject}
                    />
                )
            })}
        </article>
    )
}