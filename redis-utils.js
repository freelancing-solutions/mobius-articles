
const redis = require('redis');
const moment = require('moment');
const config = { redis: process.env.REDIS_URL || 'redis://h:peaedef6a4edb6f1fa3cc184fad918bbcd021336fa39a80c1713c5bfabf118679@ec2-54-174-43-7.compute-1.amazonaws.com:32049' };

let client = redis.createClient(config.redis);

client.on('connect', () => {
    console.log('connected to redis',config.redis);
});

const retrieveFromRedis = searchTerm => {

  let today = moment().format("YYYY-MM-DD");
  
  let redisKey = `${today}:${searchTerm}`;

  let response = null;  

  client.hgetall(redisKey, (error, results) => {
    if (results) {
        response = JSON.parse(results);
    } 
  });
  console.log('retrieved from redis',response);
  return response;
};

const storeToRedis = (data, searchTerm) => {
    let today = moment().format("YYYY-MM-DD");
    let redisKey = `${today}:${searchTerm}`;

    client.hmset(redisKey,JSON.stringify(data),(err,reply) => {
        if(err){
            console.log(err);
        }
        console.log(reply);
    });

    // client.setex(redisKey, 36000, (data)).then(results => {
    //     console.log("set on redis", results,data);
    // });
    
    return true;
};


module.exports = {
    store : storeToRedis,
    retrieve : retrieveFromRedis
};

