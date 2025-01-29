const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.static('public'));

const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
};

https.createServer(options, app).listen(3000, () => {
    console.log('Server running on https://localhost:3000');
});

app.listen(8080, () => {
    console.log('Server also running on http://localhost:8080');
});
