
const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const news = require('./news');
const PORT = process.env.PORT || 3030;


// Search Services




// initializing express and feathers
const app = express(feathers());

// adding the ability to parse json
app.use(express.json());

//config socket io in realtion APIs
app.configure(socketio());

//Enable rest services
app.configure(express.rest());

// register services

app.use('/search', (data) => {
  news.search(data);
});

// new connections connect to stream
app.on('connection', conn => app.channel('stream').join(conn));

// publish to stream
app.publish(data => app.channel('stream'));

const results = news.search("bitcoin");

app.listen(PORT).on('listening', () => {
    console.log(`Realtime server running on ${PORT} `);
    console.log(results.payload);
});





app.io.on("connection", socket => {
  
  console.log('connected socket',socket.id);
    
  // disconnect
  socket.on("disconnect", data => {
    console.log("Disconnected : ",socket.id);
  });

  // send message
  socket.on("search", data => {            
    
    news.search(data).then(results => {
      socket.emit("search", results);
    });

  });

  socket.on("category", data => {    
    news.refine(data).then(results => {
      socket.emit("category",results);
    });

  });

});

// TODO - consider turning this app into a simple crud app