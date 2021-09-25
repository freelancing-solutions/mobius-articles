const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const config = require('config');
const news = require('./news');
const PORT = process.env.PORT || 3030;
const redis = require('redis');

// You need to configure redis for this server to work
const cache_config = {redis:process.env.REDIS_URL || config.get('redis') };
const cache = require("express-redis-cache")({client: redis.createClient(cache_config.redis)});

cache.on("connected", () => {console.log("cache connected")});
cache.on("disconnected", () => {
  // .... this is a redis cache
  console.log("cache disconneted");
});

// create express app
const app = express();

let setCache = function (req, res, next) {
  // here you can define period in second, this one is 12 hours
  const period = 60 * 60 * 12;
  if (req.method == 'GET'){
      res.set('Cache-control', `public, max-age=${period}`)
  }else{
      res.set('Cache-control', `no-store`)
  }
// you only want to cache for GET requests
// remember to call next() to pass on the request
  next()
};
// parse requests of content-type - application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
// app.use(bodyParser.json());

// adding cors
app.use(cors());
app.use(setCache);


// define a simple route
app.get('/:search', (req, res) => {
    res.redirect(`/search/${req.params.search}`);
});

app.get("/search/:searchTerm",(req,res,next) => {
      //middle ware to define cache name
      //set chache name
      res.express_redis_cache_name = "search-" + req.params.searchTerm;
      next();},cache.route({expire:36000}),(req,res) => {

    const searchTerm = req.params.searchTerm;


    news.search(searchTerm).then(response => {
      if(response){
        res.status(200).json(response);
      }else{
          res.status(401).json({
            message:
              "there was an error fetching articles please try again later"
          });
      }
    }).catch(error => {
        res.status(401).json({
          message: error.message
        });
    });
});

app.get("/refine/:category",
    (req, res, next) => {
      //middle ware to define cache name
      //set chache name
      res.express_redis_cache_name = "refine-" + req.params.category;
      next();},cache.route({expire:36000}), (req, res) => {
        //destructuring
      const  category  = req.params.category;

      news.refine(category).then(response => {
          if (response) {
            res.status(200).json(response);
          } else {
            res.status(401).json({
              message:
                "there was an error fetching articles please try again later"
            });
          }
        }).catch(error => {
          res.status(401).json({
            message: error.message
          });
        });
      }
);

// listening for requests
app.listen(PORT).on('listening', () => {
    console.log(`Articles API Running on  ${PORT} `);
});






