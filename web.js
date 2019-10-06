

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

app.get('/search',(req,res) => {
  const { data } = req;
  res.json(news.search(data));
});

app.get('/refine/${category}',(req,res) = {
  const{data} = req;
  res.json(news.refine(data));
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