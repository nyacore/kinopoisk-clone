require('dotenv').config();

const mongoose = require('mongoose');


mongoose.connect(
	`mongodb://${process.env.DB_HOST}/trinity`,
	{ useNewUrlParser: true }
);

module.exports = mongoose;