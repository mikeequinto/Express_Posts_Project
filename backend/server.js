const express = require('express');
const cors = require('cors');
const path = require('path')

const PORT = 3000;
const api = require('./app');

const app = express();
app.use(cors());

app.use('/api', api);

app.use('/images', express.static(__dirname + '/images'))

app.get('/', function(req, res) {
    res.send('Hello from server!');
});

app.listen(PORT, function() {
    console.log('Server is running on localhost: ' + PORT);
})
