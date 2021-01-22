import React from 'react'
import styles from './controlBar.module.scss'

export default function ControlBar(props: {
    mainMenuOpen: boolean
    setMainMenuOpen: Function
    setMapZoomLevel: Function
    centerOnSelection: Function
    children: React.ReactChildren
    interfaceMode: "MOVE" | "VIEW"
}) {

    const { children, setMainMenuOpen, mainMenuOpen, setMapZoomLevel, centerOnSelection, interfaceMode } = props


    return <nav className={styles.bar}>
        {children}


        <div className={styles.menu}>
            {interfaceMode == "MOVE" && (
                <i className={["material-icons", "md-36", styles.menuButton].join(" ")}
                    onClick={() => { centerOnSelection() }}
                >filter_center_focus</i>
            )}
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