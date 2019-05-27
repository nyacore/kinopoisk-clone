const mongoose = require('mongoose');

mongoose.connect(
	'mongodb://localhost/trinity',
	{ useNewUrlParser: true }
);

module.exports = mongoose;