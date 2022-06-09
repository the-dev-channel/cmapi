let messages = new Map();

class Message {
    constructor(id) {
        this.id = id;

        messages.set(this.id, this);
    }

    send(cl, params) {
        params.m = this.id;
        cl.sendArray([params]);
    }
}


module.exports = messages;
