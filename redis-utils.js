
const redis = require('redis');
const moment = require('moment');
const config = { redis: process.env.REDIS_URL };

let client = redis.createClient(config.redis);

client.on('connect', () => {
    console.log('connected to redis',config.redis);
});

const retrieveFromRedis = searchTerm => {
  
  let today = moment().format("YYYY-MM-DD");
  
  let redisKey = `${today}:${searchTerm}`;

  let response = null;  

  client.get(redisKey, (error, results) => {
    if (results) {
        response = results;
    } 
  });
  console.log('retrieved from redis',response);
  return response;
};

const storeToRedis = (data, searchTerm) => {
    let today = moment().format("YYYY-MM-DD");
    let redisKey = `${today}:${searchTerm}`;
    client.setex(redisKey, 3600, JSON.stringify(data));
    console.log('set on redis',data);
    return true;
};


module.exports = {
    store : storeToRedis,
    retrieve : retrieveFromRedis
};

