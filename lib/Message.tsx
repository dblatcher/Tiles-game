class Message {
    text:string;
    constructor(text, config = {}) {

        if (Array.isArray(text)) {
            text = text.join('\n')
        }

        this.text = text
    }

}

export {Message}