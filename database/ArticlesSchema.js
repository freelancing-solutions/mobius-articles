let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ArticlesSchema = new Schema({
    author : String,
    content : String,
    description : String,
    content: String,
    publishedAt : String,
    source : {id: String,name:String},
    title : String,
    url : String,
    urlToImage : String
});

module.exports = ArticlesSchema;
