# cmapi

**cmapi** stands for ***c***ustom ***m***essage ***api***. This module is meant to be used on [MPPClone](https://mppclone.com). It is meant to make the use of custom messages easier.

## Usage

To use this module, first instantiate it on the client, then you're free to use it as you wish.

The module can detect whether or not your client is already connected, so you can choose to construct it at any point in time, but only once per client.

### Node

```js
const cmapi = require('mppclone-cmapi');
const Client = require('mppclone-client');

const client = new Client("wss://mppclone.com:8443", process.env.MPPCLONE_TOKEN);
const cm = new cmapi(client);

client.start();
client.setChannel('test/awkward');

client.on('hi', msg => {
    console.log('Connected to server');
});

cmapi.on('hello', msg => {
    console.log('Received hello');
});

```

### Browser

If you're using a userscript manager such as [tampermonkey](https://www.tampermonkey.net/), you can add a `@require` tag to your userscript header. Otherwise, you can use webpack or a script tag.

```js
// @require     https://unpkg.com/mppclone-cmapi@latest/dist/cmapi.dist.js
```

```html
<script src="https://unpkg.com/mppclone-cmapi@latest/dist/cmapi.dist.js"></script>
```

The usage is the same as Node, however, you don't have to create a client.

```js
MPP.cmapi = new cmapi(MPP.client);

MPP.client.on('hi', msg => {
    console.log('Connected to server');
});

MPP.cmapi.on('hello', msg => {
    console.log('Received hello');
});
```
