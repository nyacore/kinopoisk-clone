const express = require('express');

// const connection = require('./db/connection');

const filmModel = require('./models/film');
const userModel = require('./models/user');

const router = express.Router();

router.use((req, res, next) => {
	next();
});

router.get('/', (req, res) => {
	res.json({
		message: 'Trinity project API'
	});
});

router.get('/films', (req, res) => {
	filmModel.find()
		.populate('added_by')
		.populate('actors')
		.exec((err, result) => {
			res.json(result);
		});
});

router.get('/users', (req, res) => {
	userModel.find()
		.populate('liked_films')
		.populate('rated_films')
		.populate('reviews')
		.exec((err, result) => {
			res.json(result);
		});
});

router.post('/users', (req, res) => {
	
});

module.exports = router;
