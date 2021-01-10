import React from 'react'
import styles from './tabMenu.module.scss'

class TabMenuItem {
    label: any
    content: any
}

interface propsObject {
    tabs: TabMenuItem[]
    initialyActiveTabIndex?: number,
    mobileOnly?: boolean,
}

export default class TabMenu extends React.Component {
    props: propsObject
    state: {
        activeTabIndex: number
    }

    constructor(props: propsObject) {
        super(props)

        this.state = {
            activeTabIndex: props.initialyActiveTabIndex || 0
        }
    }

    render() {
        const { tabs, mobileOnly = false } = this.props
        const { activeTabIndex } = this.state

        const articleClassList = [styles.tabMenu]
        if (mobileOnly) { articleClassList.push(styles.mobileOnly) }

        return (
            <article className={articleClassList.join(" ")}>
                <nav>
                    {tabs.map((tab, index) => (
                        <div key={index}
                            className={index === activeTabIndex ? styles.activeLabel : styles.inactiveLabel}
                            onClick={() => this.setState({ activeTabIndex: index })}>
                            {tab.label}
                        </div>
                    ))}
                </nav>

                {tabs.map((tab, index) => (
                    <div key={index}
                        className={index === activeTabIndex ? styles.activeTab : styles.inactiveTab} >
                        {tab.content}
                    </div>
                ))}
            </article>
        )
    }

}

export { TabMenuItem }