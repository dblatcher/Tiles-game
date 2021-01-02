import React from 'react'
import styles from './controlBar.module.scss'

export default function ControlBar(props: {
    mainMenuOpen: boolean
    setMainMenuOpen: Function
    setMapZoomLevel: Function
    children: React.ReactChildren
}) {

    const { children, setMainMenuOpen, mainMenuOpen, setMapZoomLevel } = props


    return <nav className={styles.bar}>
        {children}


        <div className={styles.menu}>
            <i className={["material-icons", "md-36", styles.menuButton].join(" ")}
                onClick={() => { setMapZoomLevel('OUT') }}
            >zoom_out</i>
            <i className={["material-icons", "md-36", styles.menuButton].join(" ")}
                onClick={() => { setMapZoomLevel('IN') }}
            >zoom_in</i>

            <i className={["material-icons", "md-48", styles.menuButton].join(" ")}
                onClick={() => { setMainMenuOpen() }}>
                {mainMenuOpen ? "menu_open" : "menu"}
            </i>
        </div>

    </nav>
}