import react from 'react'
import styles from './modeButtons.module.scss'


interface InterfaceModeOption {
    value: "MOVE" | "VIEW"
    description: string
}

const interfaceModeOptions: InterfaceModeOption[] = [
    { value: "MOVE", description: "move units" },
    { value: "VIEW", description: "examine map" },
]


interface ModeButtonsProps {
    interfaceMode: "MOVE" | "VIEW"
    changeMode: Function
}

export default class ModeButtons extends react.Component {
    props: ModeButtonsProps

    constructor(props: ModeButtonsProps) {
        super(props);
        this.handleModeButton = this.handleModeButton.bind(this);
    }


    handleModeButton(option) {
        const { changeMode } = this.props
        changeMode(option.value)
    }

    render() {
        const { interfaceMode } = this.props

        const currentOption = interfaceModeOptions.filter(option => option.value == interfaceMode)[0]
        const currentOptionsClasses = [styles.button, styles.current].join(" ")

        return <section className={styles.holder}>

            {interfaceModeOptions.map(option => (
                <div key={option.value}
                onClick={() => this.handleModeButton(option)}
                    className={option === currentOption ? currentOptionsClasses : styles.button} >
                    {option.description}
                </div>

            ))}
        </section>
    }

}