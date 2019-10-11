let mongoose = require('mongoose');

exports.Articles = mongoose.model('Articles', require('./ArticlesSchema'));