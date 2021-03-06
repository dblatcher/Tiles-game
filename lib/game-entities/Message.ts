class Message {
    text:Array<String>;
    constructor(text, config = {}) {

        if (!Array.isArray(text)) {
            text = [text]
        }

        this.text = text
    }
    get type() {return 'Message'}
}

class TechDiscoveryChoice {
    get type() {return 'TechDiscoveryChoice'}
}

export {Message, TechDiscoveryChoice}