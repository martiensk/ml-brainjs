const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const {createBundleRenderer} = require('vue-server-renderer');
const brain = require('brain.js');
const data = require('./scripts/training');
const bodyParser = require('body-parser');

const html = fs.readFileSync('./dist/views/index.html', 'utf-8');
const serverBundle = path.join(__dirname, 'dist', 'vue-ssr-server-bundle.json');

const renderer = createBundleRenderer(serverBundle, {
    runInNewContext: true,
    template: html
});

/* Brain stuff */
const encode = (arg) => {
    return arg.split('').map((x) => { return (x.charCodeAt(0) / 255); });
};

const net = new brain.NeuralNetwork();

const dataset = data.map((d) => {
    return {
        input: encode(d.input),
        output: d.output
    };
});

net.train(dataset);

/* Brain stuff done */

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/dist')));

app.get('/', (req, res) => {
    const context = {name: 'Hello World!'};

    renderer.renderToString(context, (err, page) => {
        if (err) {
            console.error('Server error');
            console.warn(err);
            console.warn(err.message);
            res.status(500).end('Internal Server Error');
            return;
        }
        res.end(page);
    });
});

app.post('/assess', (req, res) => {
    const result = net.run(encode(req.body.tweet));
    console.log(result);
    res.end(JSON.stringify(result));
});

app.listen(8080);

console.warn('Running at Port 8080');
