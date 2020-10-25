import Link from 'next/link'
import dialogueStyles from './dialogue.module.scss'


export default class MainMenu extends React.Component {


    render() {
        const { toggle } = this.props
        return <>
            <aside className={dialogueStyles.dialogueHolder}>
                <nav className={dialogueStyles.dialogueFrame}>

                    <header className={dialogueStyles.headerRow}>
                        <h2>Menu</h2>
                        <button onClick={toggle}
                            className={dialogueStyles.button}>
                            close
                        </button>
                    </header>

                    <Link href="/"><a>Back to home</a></Link>

                </nav>
            </aside>
        </>
    }
}