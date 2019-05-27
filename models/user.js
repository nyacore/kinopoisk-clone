const connection = require('../db/connection');

const Schema = connection.Schema;

const User = new Schema({
	login: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	token: {
		type: String, default: ''
	},
	register_date: {
		type: Date, default: Date.now
	},
	role: {
		type: String, default: 'User'
	},
	rated_films: [{ type: Schema.Types.ObjectId, ref: 'Film' }],
	liked_films: [{ type: Schema.Types.ObjectId, ref: 'Film' }],
	reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }]
});

const UserModel = connection.model('User', User);

module.exports = UserModel;

