const e = require('express');
const express = require('express');
const https = require('https');

//Load Movie Model
const Movie = require('../../models/Movie');

module.exports.test = (req, res) => {
    return res.status(200).json({ msg: 'Movie works' });
}


module.exports.fetchMovies = (req, res) => {
    if (!req.params.pageNum || Number(req.params.pageNum) < 1) {
        return res.status(400).json({ success: false, pageNum: 'pageNum >= 1 is required in params' });
    }
    var num = 0;
    try {
        num = Number(req.params.pageNum) - 1;
    } catch (e) {
        return res.status(400).json({ success: false, msg: 'error parsing num' });
    }
    const skip = 20 * num;        // Fetch 20 movies at a time

    Movie.find()
        .limit(20)
        .skip(skip)
        .select('name rating numRating')
        .exec((err, docs) => {
            if (err) {
                return res.status(400).json({ success: false, error: 'Database error: unable to find movies, please retry' });
            } else if (docs.length == 0 || docs.length == undefined) {
                return res.status(400).json({ success: false, msg: 'No movies data exists' });
            }

            return res.status(200).json({ success: true, page: num + 1, movies: docs });
        });
}


module.exports.rateMovie = (req, res) => {
    if (!req.params.movieId) {
        return res.json({ success: false, movieId: 'MovieId is required' });
    }

    if (!req.body.rating) {
        return res.json({ success: false, rating: 'Rating is required' });
    }

    const rating = Number(req.body.rating);

    if (rating > 5 || rating < 1) {
        return res.json({ success: false, rating: 'Rating must be between 1 and 5' });
    }

    Movie.findById(req.params.movieId)
        .select('name rating numRating')
        .exec((err, movie) => {
            if (err) {
                return res.json({ success: false, error: 'Database error while fetching' });
            } else if (!movie) {
                return res.json({ success: false, msg: 'No movie exist with this id' });
            }

            if (movie.rating == 'NA') {
                movie.rating = rating;
                movie.numRating = 1;
            } else {
                movie.rating = (Number(movie.rating) * movie.numRating + rating) / (movie.numRating + 1);
                movie.numRating += 1;
            }

            console.log(movie);

            movie.save((err, movie) => {
                if (err) {
                    return res.json('Error while saving movie rating');
                }
                return res.json({ success: true, movie: movie })
            });

        });

}



function saveMovies(id) {

    var url = 'https://api.themoviedb.org/3/movie/' + id + '?api_key=717ee6d5554767557bdf32515498aa52&language=en-US';

    const request = https.request(url, (response) => {
        let data = '';
        response.on('data', (chunk) => {
            data = data + chunk.toString();
        });

        response.on('end', () => {
            const body = JSON.parse(data);
            if (body.success == false) {
                console.log('Invalid id')
                // Do nothing
            } else {
                Movie.findOne({ name: body.title }, (err, movie) => {
                    if (err) {
                        console.log('Database error');
                    } else if (movie) {
                        console.log('Movie already exists');
                    } else {
                        const newMovie = new Movie({
                            name: body.title,
                        });

                        newMovie.save();
                        console.log(`Saved movie - id: ${id}, ${body.title}`);
                    }
                });
            }

        });
    });

    request.on('error', (error) => {
        console.log('An error', error);
    });

    request.end();

}

module.exports.extract = async (req, res) => {
    for (let i = 0; i < 100000; i++) {
        await new Promise(resolve => setTimeout(resolve, 50));
        saveMovies(i);
    }

    return res.json('Extracted');
}



