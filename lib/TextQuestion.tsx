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

export { TextQuestion }