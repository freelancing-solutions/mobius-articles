

const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const news = require('./news');
const PORT = process.env.PORT || 3030;
const config = {
  redis:"redis://h:peaedef6a4edb6f1fa3cc184fad918bbcd021336fa39a80c1713c5bfabf118679@ec2-54-174-43-7.compute-1.amazonaws.com:32049"
};
const cache = require("express-redis-cache")(config.redis);


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

app.get('/search/:searchTerm', cache.route('search'),(req,res) => {
  
  const {searchTerm} = req.params;
  
  res.express_redis_cache_name = "search-" + searchTerm;

  const results = {status : false,payload:[],error:{}};
  if (searchTerm){
    news.search(searchTerm).then(response => { 
      
      res.status(200).json(response);      
    }).catch(error => {
        results.error = {...error};
        results.status = false;
        res.status(401).json(results);
    });
  }
});

app.get('/refine/:category', cache.route('refine',36000),(req,res) => {
  
  //destructuring
  const {category} = req.params
  res.express_redis_cache_name = "refine-" + category;
  if (category){
      news.refine(category).then(response => {
        if (response){
          console.log('Refined Search Results',response);
          res.status(200).json(response);
        }else{
          res.status(401).json({
            message : 'there was an error fetching articles please try again later'
          });
        }
      }).catch(error => {
        res.status(401).json({
          message :error.message 
        });
      });    
  }else{
    res.status(401).json({
      message :'your query was not formatted correctly' 
    });
  };

});

// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});

app.listen(PORT).on('listening', () => {
    console.log(`Articles API Running on  ${PORT} `);    
});






// TODO - consider turning this app into a simple crud app