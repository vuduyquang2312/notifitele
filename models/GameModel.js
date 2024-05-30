const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  image: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Game', gameSchema);
