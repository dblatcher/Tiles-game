import styles from './modeButtons.module.scss'

export default class ModeButtons extends React.Component {


    constructor(props) {
        super(props);

        this.handleModeButton = this.handleModeButton.bind(this);
    }


    handleModeButton() {
        const { interfaceModeOptions, changeMode, interfaceMode } = this.props

        let indexOfCurrentMode = interfaceModeOptions.map(option=>option.value).indexOf(interfaceMode)
        let nextOption = interfaceModeOptions[indexOfCurrentMode+1] || interfaceModeOptions[0]

        changeMode(nextOption.value)
    }

    render() {
        const { interfaceModeOptions, changeMode, interfaceMode } = this.props

        const currentOption = interfaceModeOptions.filter(option => option.value == interfaceMode)[0]

        return <section className={styles.holder}>
            <div className={styles.button} onClick={this.handleModeButton}>
                {currentOption.description}
            </div>
        </section>
    }

}