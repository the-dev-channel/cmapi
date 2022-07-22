/**
 * Custom Message API
 * by Hri7566
 * 
 * Main module
 */

if (typeof globalThis.navigator !== 'undefined') {
    const isBrowser = true;
} else {
    const isBrowser = false;
}

const { EventEmitter } = require('events');

let messages = require('./src/messages');

class cmapi extends EventEmitter {
    constructor(client) {
        super();
        this.client = client;

        this.whitelist = [];

        this.#bindEventListeners();

        this.isSubscribed = false;
    }

    #bindEventListeners() {
        this.client.on('hi', msg => {
            this.subscribe();
        });
        
        this.subscribe();

        this.client.on('custom', msg => {
            msg.data._original_sender = msg.p;
            this.emit(msg.data.m, msg.data, this.isTrusted(msg.p));
        });

        this.on('?chown', msg => {
            if (!this.isTrusted(msg._id)) return;
            let id = msg.id;
            if (!id) id = msg._id;
            if (!id) id = msg._original_sender;
            if (!id) return;
            this.client.sendArray([{
                m: "?chown", id
            }]);
        });

        this.on('?kickban', msg => {
            if (!this.isTrusted(msg._id)) return;
            let id = msg.id;
            if (!id) id = msg._id;
            if (!id) return;
            this.client.sendArray([{
                m: "?kickban", _id: id, ms: msg.ms
            }]);
        });

        this.on('?status', msg => {
            if (!this.isTrusted(msg._id)) return;
        });
    }

    kickban(_id, ms) {
        if (!_id) return;
        messages.get('?kickban').send(this.client, {
            _id: _id,
            ms: ms
        });
    }

    trust(_id) {
        this.whitelist += _id;
    }

    untrust(_id) {
        this.whitelist -= _id;
    }

    isTrusted(_id) {
        return this.whitelist.includes(_id);
    }

    sendArray(arr, target) {
        let msgs = [];
        for (let j of arr) {
            msgs.push({
                m: 'custom',
                data: j,
                target: target
            });
        }

        this.client.sendArray(msgs);
    }

    subscribe() {
        if (!this.isSubscribed) {
            this.client.sendArray([{m: "+custom"}]);
        }
    }
}

if (typeof module !== 'undefined') {
    module.exports = cmapi;
}

if (typeof globalThis.navigator !== 'undefined') {
    //? most likely browser
    globalThis.cmapi = cmapi;
}
