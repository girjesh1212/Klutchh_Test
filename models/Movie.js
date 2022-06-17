const mongoose = require('mongoose');

// Create Movie Schema 
const MovieSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: mongoose.Schema.Types.Mixed, default: 'NA' },
    numRating: { type: Number, default: 0 },
});

const Movie = mongoose.model('movies', MovieSchema);
module.exports = Movie;
