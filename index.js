/* eslint-disable no-console */
const express = require('express');
const app = express();
const routes = require('./routes');

const PORT = 3001;

app.use(express.json());

app.use('/api', routes);

app.listen(PORT, 'localhost', () => {
	console.log(`App started at localhost:${PORT}`);
});