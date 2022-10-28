require('dotenv').config();

const Client = require('mppclone-client');
const cmapi = require('../');

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

let password = '7566';

function isWhitelisted(id) {
    if (whitelist.indexOf(id) !== -1) return true;
}

function whitelistAdd(id) {
    console.log(`Adding ${id} to the whitelist`);
    if (!isWhitelisted(id)) {
        whitelist.push(id);
    } else {
        console.log('ID is already in the whitelist');
    }
}

function whitelistRemove(id) {
    console.log(`Removing ${id} from the whitelist`);
    if (isWhitelisted(id)) {
        whitelist.splice(whitelist.indexOf(id), 1);
    } else {
        console.log('ID is not in the whitelist');
    }
}

cm.on('whitelist+', msg => {
    if (!isWhitelisted(msg._original_sender)) {
        if (!msg['password']) return;
        if (msg.password !== password) return;
    }

    whitelistAdd(msg.id || msg._original_sender);
});

cm.on('whitelist-', msg => {
    if (!isWhitelisted(msg._original_sender)) return;
    whitelistRemove(msg.id || msg._original_sender);
});
