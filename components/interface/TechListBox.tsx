import React from 'react'
import { TechDiscovery } from '../../lib/game-entities/TechDiscovery'

import styles from './listBox.module.scss'

export default function TechListBox(props: {
    techList: TechDiscovery[]
}) {


    const listClassList = [styles.list, styles.wrap]

    return (
        <article className={styles.box}>
            <ul className={listClassList.join(" ")}>
                {props.techList.map((techDiscovery, index) => (
                    <li key={`tech-${index}`}>
                        <span>{techDiscovery.description}</span>
                    </li>
                ))}
            </ul>
        </article>
    )
}