const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const {createBundleRenderer} = require('vue-server-renderer');
const brain = require('brain.js');
let data = require('./scripts/training');
const bodyParser = require('body-parser');

const html = fs.readFileSync('./dist/views/index.html', 'utf-8');
const serverBundle = path.join(__dirname, 'dist', 'vue-ssr-server-bundle.json');

const renderer = createBundleRenderer(serverBundle, {
    runInNewContext: true,
    template: html
});

/* Brain stuff */
const alphabet = 'abcdefghijklmnopqrstuvwxyz';

const encode = (arg) => {
    const ret = [];
    for (let i of arg) {
        i = i.toLowerCase();
        alphabet.indexOf(i) !== -1 && ret.push(i.charCodeAt(0) / 255);
    }
    return ret;
};

const net = new brain.NeuralNetwork();

if (fs.existsSync('newdata.js')) {
    data = JSON.parse(fs.readFileSync('newdata.js'));
}

// Map the data to ascii
const dataset = data.map((d) => {
    return {
        input: encode(d.input),
        output: d.output
    };
});

const fixLengths = (currentdata) => {
    let maxLength = -1;

    for (const i of currentdata) {
        if (i.input.length > maxLength) {
            maxLength = i.input.length;
        }
    }

    for (const i in currentdata) {
        while (currentdata[i].input.length < maxLength) {
            currentdata[i].input.push(0);
        }
    }

    return currentdata;
}

console.log(dataset);

net.train(fixLengths(dataset), {
    log: true,
    logPeriod: 1000
});

console.warn('Done training, saving dataset...');

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
    console.warn(result);
    res.end(JSON.stringify(result));
});

app.post('/train', (req, res) => {
    data.push({
        input: req.body.tweet,
        output: req.body.who === 'trump' ? {trump: 1} : {obama: 1}
    });
    console.log(req.body.tweet);
    console.log(req.body.who);
    console.log(data);
    res.end('trained');
    fs.writeFile('newdata.js', JSON.stringify(data), (err) => {
        if (err) { console.error(err); }
        console.warn('The training data was saved!');
    });
});

app.listen(8080);

console.warn('Running at Port 8080');
