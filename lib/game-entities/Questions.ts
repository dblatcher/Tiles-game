import { TechDiscovery } from "./TechDiscovery";

class TextQuestion {
    questionText: string;
    answerHandler: Function;
    cancelHandler: Function;
    initialAnswer: string|null;
    errorText: string|null;
    constructor(questionText, answerHandler, cancelHandler, initialAnswer, errorText=null) {
        this.questionText = questionText;
        this.answerHandler = answerHandler;
        this.cancelHandler = cancelHandler;
        this.initialAnswer = initialAnswer;
        this.errorText = errorText;
    }

    get type() { return 'TextQuestion' }
    clearError() {this.errorText = null}
}

class OptionsQuestion {
    questionText:string;
    options: Array< {["label"]: string, ["handler"]:Function} >
    constructor(questionText:string, options:Array< {["label"]: string, ["handler"]:Function} >) {
        this.questionText = questionText;
        this.options = options
    }
    get type() { return 'OptionsQuestion' }
}

class TechStealQuestion {
    questionText:string;
    options: Array<TechDiscovery>
    constructor(questionText:string, options:Array<TechDiscovery>) {
        this.questionText = questionText;
        this.options = options
    }
    get type() { return 'TechStealQuestion' }
}

export { TextQuestion, OptionsQuestion, TechStealQuestion }