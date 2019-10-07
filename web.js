

const express = require('express');
const bodyParser = require("body-parser");
const news = require('./news');
const PORT = process.env.PORT || 3030;


// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json());

const results = news.search("bitcoin");
// define a simple route
app.get('/', (req, res) => {
    const{data} = req;
    res.json(results);
});

app.get('/search/:searchTerm',(req,res) => {
  
  const {searchTerm} = req.params;
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

app.get('/refine/:category',(req,res) = {
  
  //destructuring
  const {category} = req.params

  if (category){
      news.refine(category).then(response => {
        if (response){
          res.status(200).json(response);
        }else{
          res.status(401).json('message':'there was an error fetching articles please try again later');
        }
      }).catch(error => {
        res.status(401).json('message':error.message);
      });    
  }else{
    res.status(401).json('message':'your query was not formatted correctly');
  };

});

// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});

app.listen(PORT).on('listening', () => {
    console.log(`Realtime server running on ${PORT} `);
    console.log(results.payload);
});






// TODO - consider turning this app into a simple crud app