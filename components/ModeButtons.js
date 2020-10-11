export default class ModeButtons extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            currentMode: props.interfaceMode
        };

        this.handleInputSelect = this.handleInputSelect.bind(this);
    }


    handleInputSelect(event) {
        this.setState({ currentMode: event.target.value }, () => {
            this.props.changeMode(this.state.currentMode)
        });
    }

    renderOption(option) {
        const { value, description } = option
        const { currentMode } = this.state
        const inputId = "mode-" + value
        return (
            <span key={inputId}>
                <input type="checkbox" id={inputId} value={value} checked={currentMode == value} onChange={this.handleInputSelect} />
                <label htmlFor={inputId}>{description}</label>
            </span>
        )

    }

    render() {
        const { interfaceModeOptions } = this.props

        return <section>
            {interfaceModeOptions.map(option => this.renderOption(option) )}
        </section>
    }

}