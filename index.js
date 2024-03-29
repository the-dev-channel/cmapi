/**
 * Custom Message API
 * by Hri7566
 * 
 * Main module
 */

let isBrowser = true;
 
if (typeof process === 'object') {
    if (typeof process.versions === 'object') {
        if (typeof process.versions.node !== 'undefined') {
            isBrowser = false;
        }
    }
}

let EventEmitter;

if (!isBrowser) {
    EventEmitter = require('events').EventEmitter;
} else {
    EventEmitter = globalThis.EvenEmitter;
}

class cmapi extends (EventEmitter || globalThis.EventEmitter) {
    constructor(client) {
        super();

        this.client = client;
        this.age = Date.now();
        this.status_data = {};
        
        if (this.client.isConnected()) {
            this.subscribe();
        }
        
        this.knownSubscribers = [];
        this.isSubscribed = false;
        
        this.#bindEventListeners();
    }

    #bindEventListeners() {
        this.client.on('hi', msg => {
            this.subscribe();
            this.age = Date.now();
        });

        this.client.on('custom', msg => {
            msg.data._original_sender = msg.p;
            this.emit(msg.data.m, msg.data);
        });

        this.client.on('participant added', msg => {
            this.sendArray([{
                m: '?cmapi_info'
            }], { mode: 'id', id: msg._id, global: false });
        });

        this.client.on('participant removed', msg => {
            if (typeof this.findSubscriberByID(msg._id) !== 'undefined') {
                this.knownSubscribers.splice(this.knownSubscribers.indexOf(this.findSubscriberByID(msg._id)), 1);
            }
        });

        this.on('?cmapi_info', msg => {
            this.sendArray([{
                m: 'cmapi_info', isBrowser,
                age: Date.now() - this.age,
                status_data: this.status_data,
            }], { mode: 'id', id: msg._original_sender, global: false });
        });

        this.on('cmapi_info', msg => {
            if (typeof this.findSubscriberByID(msg._original_sender) == 'undefined') {
                this.knownSubscribers.push({
                    id: msg._original_sender,
                    _id: msg._original_sender,
                    isBrowser: msg.isBrowser,
                    status_data: msg.status_data
                });
            }
        });
    }

    findSubscriberByID(id) {
        for (let s of this.knownSubscribers) {
            if (s.id == id) {
                return s;
            }
        }
    }

    sendArray(arr, target, global = false) {
        let msgs = [];
        
        if (typeof target === 'string') {
            if (target == "subscribed") {
                target = {
                    mode: target,
                    global
                }
            } else {
                target = {
                    mode: 'id',
                    id: target,
                    global
                }
            }
        }

        if (Array.isArray(target)) {
            target = {
                mode: 'ids',
                ids: target,
                global
            }
        }

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
            this.client.sendArray([{ m: "+custom" }]);
            this.isSubscribed = true;
        }
    }

    unsubscribe() {
        if (this.isSubscribed) {
            this.client.sendArray([{ m: '-custom' }]);
            this.isSubscribed = false;
        }
    }
}

if (typeof module !== 'undefined') {
    module.exports = cmapi;
}

// if (typeof globalThis.navigator !== 'undefined') {
//     //? most likely browser
//     globalThis.cmapi = cmapi;
// }

if (isBrowser) {
    globalThis.cmapi = cmapi;
}
