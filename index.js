/**
 * Custom Message API
 * by Hri7566
 * 
 * Main module
 */

const events = require('events');

let messages = require('./src/messages');

class cmapi extends events.EventEmitter {
    constructor(client) {
        super();
        this.client = client;

        this.whitelist = [];
    }

    bindEventListeners() {
        this.client.sendArray([{m: "+custom"}]);

        this.client.on('custom', msg => {
            msg.data._original_sender = msg.p;
            this.emit(msg.data.m, msg.data);
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
}

module.exports = cmapi;
