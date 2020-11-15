class TextQuestion {
    questionText: string;
    answerHandler: Function;
    cancelHandler: Function;
    constructor(questionText, answerHandler, cancelHandler) {
        this.questionText = questionText;
        this.answerHandler = answerHandler;
        this.cancelHandler = cancelHandler;
    }

    get type() { return 'TextQuestion' }
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

export { TextQuestion, OptionsQuestion }