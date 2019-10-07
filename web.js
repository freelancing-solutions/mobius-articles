

const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const news = require('./news');
const PORT = process.env.PORT || 3030;
const redis = require('redis');
const config = {
  redis:"redis://h:peaedef6a4edb6f1fa3cc184fad918bbcd021336fa39a80c1713c5bfabf118679@ec2-54-174-43-7.compute-1.amazonaws.com:32049"
};
const cache = require("express-redis-cache")(redis.createClient(config.redis));

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
app.get('/', (req, res) => {    
    res.send('this is an article api good luck')
});

app.get("/search/:searchTerm",(req,res,next) => {
      //middle ware to define cache name
      //set chache name
      res.express_redis_cache_name = "searchcache" + req.params.searchTerm;
      next();},cache.route('search',36000),(req,res) => {
  
    const {searchTerm} = req.params;        
    const results = {status : false,payload:[],error:{}};

    
    news.search(searchTerm).then(response => {    
      console.log('ok lets see',response);   
      res.status(200).json(response);      
    }).catch(error => {
        res.status(401).json({
          message:'there was an error fetching news articles'
        });
    });
    
});

app.get("/refine/:category",(req, res, next) => {
      //middle ware to define cache name
      //set chache name
      res.express_redis_cache_name = "refinecache" + req.params.category;
      next();},cache.route("refine", 36000), (req, res) => {

        //destructuring
        const { category } = req.params;    

        if (category) {
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
        } else {
          res.status(401).json({
            message: "your query was not formatted correctly"
          });
        }
      }
);

// listening for requests
app.listen(PORT).on('listening', () => {
    console.log(`Articles API Running on  ${PORT} `);    
});






// TODO - consider turning this app into a simple crud app