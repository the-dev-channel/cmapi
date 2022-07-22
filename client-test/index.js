require('dotenv').config();

const Client = require('mppclone-client');
const cmapi = require('../');
const crypto = require('crypto');

const client = new Client("wss://mppclone.com:8443", process.env.MPPCLONE_TOKEN);

client.start();
client.setChannel("✧𝓓𝓔𝓥 𝓡𝓸𝓸𝓶✧");

let name = "cmapi test script";

setInterval(() => {
    if (client.getOwnParticipant().name !== name) {
        client.sendArray([{
            m: 'userset',
            set: { name, color: '#480505' }
        }]);
    }
}, 10000);

const cm = new cmapi(client);

let hash = crypto.createHash('sha3-256');
hash.update('7566');
let hashResult = hash.digest();
console.log(hashResult.toString('hex'));

cm.on('whitelist+', (msg, whitelisted) => {
    if (!msg['password']) return;
    if (msg.password !== hashResult.toString('hex')) return;

    cm.trust(msg._original_sender);

    console.log(cm.isTrusted(msg._original_sender));
});
