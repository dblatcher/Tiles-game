import { Citizen } from "../lib/game-entities/Citizen";
import { citizenJobs } from "../lib/game-entities/CitizenJob";
import { GameState } from "../lib/game-entities/GameState";
import { Town } from "../lib/game-entities/Town";
import styles from "./citizenRow.module.scss";

interface CitizenRowProps {
    town: Town
    handleCitizenClick: Function
    stateOfPlay: GameState
    onFactionWindow?: boolean
    splitSpecialists?: boolean
}



export default function CitizenRow(props: CitizenRowProps) {
    const { town, handleCitizenClick, onFactionWindow = false, stateOfPlay, splitSpecialists } = props
    const { units } = stateOfPlay
    const { population, happiness } = town

    const isInRevolt = town.getIsInRevolt(units)
    const unhappiness = town.getUnhappiness(units)
    const rowClassList = [styles.citizenRow]
    if (onFactionWindow) { rowClassList.push(styles.rowInFactionWindow) }
    if (isInRevolt) { rowClassList.push(styles.inRevolt) }


    const citizensSortedByJob = town.citizens.sort(
        (a, b) => (a.job === citizenJobs.worker ? 1 : -1) - (b.job === citizenJobs.worker ? 1 : -1)
    )

    const renderCitizen = (citizen: Citizen, index: number, array: Citizen[]) => {
        const classList = [styles.citizenFigure]

        let indexInFullList = citizensSortedByJob.indexOf(citizen);

        if (indexInFullList + 1 > population - unhappiness) { classList.push(styles.unhappy) }
        if (indexInFullList < happiness) { classList.push(styles.happy) }

        const styleObject = Object.assign({
            left: `${(index + .5) * (100 / array.length)}%`,
            zIndex: '1'
        }, citizen.job.spriteStyle)

        return (
            <i key={`citizen-${index}`}
                onClick={handleCitizenClick ? () => handleCitizenClick(citizen) : null}
                className={classList.join(" ")}
                style={styleObject}
            />
        )
    }

    if (splitSpecialists) {

        const specialists = town.citizens.filter(citizen => citizen.job !== citizenJobs.worker)
        const workers = town.citizens.filter(citizen => citizen.job === citizenJobs.worker)

        return (
            <article className={styles.splitRowContainer}>
                <section style={{ flex: specialists.length * 2.5 }} className={rowClassList.join(" ")}>
                    {specialists.map(renderCitizen)}
                </section>
                <section style={{ flex: workers.length }} className={rowClassList.join(" ")}>
                    {workers.map(renderCitizen)}
                </section>
            </article>
        )
    }


    return (
        <article>
            <section className={rowClassList.join(" ")}>
                {town.citizens.map(renderCitizen)}
            </section>
        </article>
    )
}