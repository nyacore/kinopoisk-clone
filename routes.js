const express = require('express');
const bcrypt = require('bcrypt');

// const connection = require('./db/connection');

const filmModel = require('./models/film');
const userModel = require('./models/user');
const reviewModel = require('./models/review');

const router = express.Router();

router.get('/', (req, res) => {
	res.json({
		message: 'Trinity project API'
	});
});

router.get('/films', (req, res) => {
	filmModel.find()
		.populate('added_by')
		// .populate('actors')
		.exec((err, result) => {
			res.json(result);
		});
});

router.get('/films/:id', async (req, res) => {
	const foundFilm = await filmModel.findById(req.params.id)
		.populate('added_by');
	res.json(foundFilm);
});

router.get('/films_count', async (req, res) => {
	const count = await filmModel.find().estimatedDocumentCount();
	res.json({
		count
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

// router.get('/users/:id', async (req, res) => {
// 	const foundUser = await userModel.findById(req.params.id)
// 		.populate('liked_films')
// 		.populate('rated_films');
// 	res.json(foundUser);
// });

router.get('/reviews/:film_id', async (req, res) => {
	const reviews = await reviewModel.find({ film: req.params.film_id })
		.populate('author');
	res.json(reviews);
})

router.get('/users/:token', async (req, res) => {
	const foundUser = await userModel.findOne({ token: req.params.token })
		.populate('liked_films')
		.populate('reviews')
		.populate('rated_films');
	res.json(foundUser);
});

router.get('/users/id/:id', async (req, res) => {
	const foundUser = await userModel.findById(req.params.id)
		.populate('liked_films')
		.populate('reviews')
		.populate('rated_films');
	res.json(foundUser);
});

router.get('/users_count', async (req, res) => {
	const count = await userModel.find().estimatedDocumentCount();
	res.json({
		count
	});
});

router.get('/reviews_count', async (req, res) => {
	const count = await reviewModel.find().estimatedDocumentCount();
	res.json({
		count
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

router.post('/auth', async (req, res) => {
	// TODO: Massive refactor. 
	// Firstly, try to select user object from database, not array of users
	// Model.findOne() does the thing
	try {
		const user = await userModel.find({
			login: req.body.login
		});
		if (user.length == 0) {
			res.json({
				status: false,
				message: 'Неверные имя пользователя или пароль'
			});
		} else {
			const isValidPassword = await bcrypt.compare(req.body.password, user[0].password);
			if (isValidPassword) {
				const token = await  bcrypt.hash(`${user[0].password}.${user[0].login}`, 10);
				user[0].token = token;
				user[0].save();
				res.json({
					token,
					status: true
				});
			} else {
				res.json({
					status: false,
					message: 'Неверные имя пользователя или пароль'
				});
			}
		}
	} catch (err) {
		res.json(err);
	}
});

/*
Authentication middleware.
It applies to all paths below
 */
const authentication = ((req, res, next) => {
	const authorization_string = req.get('Authorization');
	const token = authorization_string ? authorization_string.split(' ')[1] : '';
	userModel.findOne({ token })
		.exec((err, user) => {
			if (!user) res.status(403).json({ message: 'Bad Auth' });
			else next();
		});
});

router.post('/films/:id/rate', async (req, res) => {
	const authorization_string = req.get('Authorization');
	const token = authorization_string.split(' ')[1];
	const user = await userModel.findOne({ token });
	const film = await filmModel.findById(req.params.id);

	film.votes_sum += req.body.mark;
	film.number_of_votes++;
	film.rating = film.votes_sum / film.number_of_votes;
	user.rated_films.push(film._id);

	film.save();
	user.save();

	res.json({
		status: true
	});
});

router.post('/films', authentication, async (req, res) => {
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
			gallery: req.body.gallery,
			genre: req.body.genre
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

router.post('/films/:id/like', authentication,  async (res, req) => {
	try {	
		const authorization_string = req.get('Authorization');
		const token = authorization_string.split(' ')[1];
		const user = await userModel.findOne({ token });
		const film = await filmModel.findById(req.params.id);
		
		user.liked_films.push(film._id);
		user.save();
		
		res.json({
			status: true
		});
	} catch (err) {
		res.json(err);
	}
});

router.post('/films/:id/review', async (req, res) => {
	const authorization_string = req.get('Authorization');
	const token = authorization_string.split(' ')[1];
	const user = await userModel.findOne({ token });
	const film = await filmModel.findById(req.params.id);
	const review = new reviewModel({
		author: user._id,
		film: film._id,
		text: req.body.text
	});

	user.reviews.push(review._id);

	review.save();
	user.save();

	res.json({
		status: true
	});
});



module.exports = router;
