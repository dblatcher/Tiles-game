class Message {
    text:string;
    constructor(text, config = {}) {

        if (Array.isArray(text)) {
            text = text.join('\n')
        }

        this.text = text
    }
    get type() {return 'Message'}
}

export {Message}