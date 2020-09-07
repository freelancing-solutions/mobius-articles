const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const config = require('config');
const news = require('./news');
const PORT = process.env.PORT || 3030;
const redis = require('redis');
const cache_config = {redis:process.env.REDIS_URL || config.get('redis') };
const cache = require("express-redis-cache")({
  client: redis.createClient(cache_config.redis)
});

cache.on("connected", () => {
  // ....
  console.log("cache connected");
});
cache.on("disconnected", () => {
  // ....
  console.log("cache disconneted");
});


// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json());

// adding cors
app.use(cors());

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
    //  cache set for one hour
    res.set('Cache-control', 'public, max-age=3600');
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

app.get("/refine/:category",(req, res, next) => {
      //middle ware to define cache name
      //set chache name
      res.express_redis_cache_name = "refine-" + req.params.category;
      next();},cache.route({expire:36000}), (req, res) => {
        //destructuring
      const  category  = req.params.category;
      //  cache set for one hour
      res.set('Cache-control', 'public, max-age=3600');
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






