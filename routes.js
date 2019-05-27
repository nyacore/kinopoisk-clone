const express = require('express');
const bcrypt = require('bcrypt');

// const connection = require('./db/connection');

const filmModel = require('./models/film');
const userModel = require('./models/user');

const router = express.Router();

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

router.post('/users', async (req, res) => {
	const user = new userModel({
		login: req.body.login,
		password: await bcrypt.hash(req.body.password, 10),
		token: await bcrypt.hash(`${req.body.password}.${req.body.login}`, 10)
	});

	user.save()
		.then((newUser) => {
			res.json({
				token: newUser.token
			});
		})
		.catch((error) => {
			res.json(error);
		});
});

// Authentication middleware
router.use((req, res, next) => {
	const authorization_string = req.get('Authorization');
	const token = authorization_string.split(' ')[1];
	userModel.findOne({ token })
		.exec((err, user) => {
			if (!user) res.status(403).json({ message: 'Bad Auth' });
			else next();
		});
});

router.post('/films', async (req, res) => {
	const authorization_string = req.get('Authorization');
	const token = authorization_string.split(' ')[1];
	const user = await userModel.findOne({ token });
	if (user.role != 'Admin') {
		res.status(403).json({ message: 'Insufficient rights' });
	}
	else {
		const film = new filmModel({
			title: req.body.title,
			description: req.body.description,
			director: req.body.director,
			added_by: user._id,
			poster: req.body.poster,
			release_date: req.body.release_date,
			actors: req.body.actors,
			gallery: req.body.gallery
		});
		film.save()
			.then((newFilm) => {
				res.json(newFilm);
			})
			.catch((error) => {
				res.json(error);
			});
	}
});



module.exports = router;
