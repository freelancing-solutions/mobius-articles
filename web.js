
const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const news = require('./news');
const PORT = process.env.PORT || 5000;

// initializing express and feathers
const app = express(feathers());

// adding the ability to parse json
app.use(express.json());

//config socket io in realtion APIs
app.configure(socketio());

//Enable rest services
app.configure(express.rest());

// register services

// app.use('/chat', new ChatService());

// new connections connect to stream
app.on('connection', conn => app.channel('stream').join(conn));

// publish to stream
app.publish(data => app.channel('stream'));

const results = news.search("bitcoin");

app.listen(PORT).on('listening', () => {
    console.log(`Realtime server running on ${PORT} `);
    console.log(results.payload[2]);
});
