import { TechDiscovery } from "./TechDiscovery";

class TextQuestion {
    questionText: string;
    answerHandler: Function;
    cancelHandler: Function | null;
    initialAnswer: string | null;
    errorText: string | null;
    constructor(questionText: string, answerHandler: Function, cancelHandler: Function, initialAnswer: string, errorText: string = null) {
        this.questionText = questionText;
        this.answerHandler = answerHandler;
        this.cancelHandler = cancelHandler;
        this.initialAnswer = initialAnswer;
        this.errorText = errorText;
    }

    get type() { return 'TextQuestion' }
    get canCancel() { return typeof this.cancelHandler === 'function' }
    clearError() { this.errorText = null }
}

class OptionsQuestion {
    questionText: string;
    options: Array<{ ["label"]: string, ["handler"]: Function }>
    constructor(questionText: string, options: Array<{ ["label"]: string, ["handler"]: Function }>) {
        this.questionText = questionText;
        this.options = options
    }
    get type() { return 'OptionsQuestion' }
    get canCancel() { return false }
}

class TechStealQuestion {
    questionText: string;
    options: Array<TechDiscovery>
    constructor(questionText: string, options: Array<TechDiscovery>) {
        this.questionText = questionText;
        this.options = options
    }
    get type() { return 'TechStealQuestion' }
    get canCancel() { return false }
}

export { TextQuestion, OptionsQuestion, TechStealQuestion }