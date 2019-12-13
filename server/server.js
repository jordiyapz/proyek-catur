const http = require('http');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 7000;

const clientPath = `${__dirname}/../client`;
app.use(express.static(clientPath));

const server = http.createServer(app); //express app handles all the request and put it into http server
server.on('error', err => console.error('Server error: ', err));
server.listen(PORT, () => console.log('Server started on ', PORT));