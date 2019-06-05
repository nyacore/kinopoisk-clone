const connection = require('../db/connection');

const Schema = connection.Schema;

const Review = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true
  },
  film: {
    type: Schema.Types.ObjectId,
    ref: 'Film',
    required: true
  },
  added_date: {
    type: Date,
    default: Date.now()
  }
});

const ReviewModel = connection.model('Review', Review);

module.exports = ReviewModel;