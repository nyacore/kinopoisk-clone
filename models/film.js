const connection = require('../db/connection');

const Schema = connection.Schema;

const Film = new Schema({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	type: {
		type: String,
		default: 'Movie'
	},
	director: {
		type: String,
		required: true
	},
	added_by: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	poster: {
		type: String,
		required: true
	},
	release_date: {
		type: Date,
		required: true
	},
	rating: {
		type: Number,
		default: 0
	},
	actors: [{ type: Schema.Types.ObjectId, ref: 'Actor' }],
	gallery: [{ type: String }],
	n_of_episodes: {
		type: Number,
		default: 1,
		required: true
	},
	added_date: {
		type: Date,
		default: Date.now
	},
});

const FilmModel = connection.model('Film', Film);

module.exports = FilmModel;