const moment = require("moment");
const NewsAPI = require("newsapi");
const axios = require('axios');
const api_key = process.env.NEWS_API_KEY || "41e896a0a1c94b61903408fae1a49471";
const newsapi = new NewsAPI(api_key);
const redis_utils = require('./redis-utils');


let fetch_date = null;


const searchNews = async term => {

    let results = {status:false,payload:[],error:{}};            
    let today = moment().format("YYYY-MM-DD");    
    // checking if results is already saved in redis if yes then use the results
    
    let response = redis_utils.retrieve(term);

    if(response === null)
        {
            await newsapi.v2.everything({
                q: term,        
                from: today,    
                language: "en",
                sortBy: "relevancy",    
            
            }).then(response_json => {
                
                console.log(response_json);

                results.payload = [...response_json.articles];
                results.status = true;
                const data = results.payload;
                redis_utils.store(data,term);

            }).catch(error => {
                
                results.payload = [];
                results.error = {...error};
                results.status = false;
            });
        }else{
            console.log('Retrieved from redis',response);
            results.payload = response;
            results.status = true;
            results.error = {};
        }

    return results;
};


const articles_api = {	
	entertainment: `https://newsapi.org/v2/top-headlines?country=za&category=entertainment&apiKey=${api_key}`,
	sports: `https://newsapi.org/v2/top-headlines?country=za&category=sports&apiKey=${api_key}`,
    business: `https://newsapi.org/v2/top-headlines?country=za&category=business&apiKey=${api_key}`,
    tech: `https://newsapi.org/v2/top-headlines?country=za&category=technology&apiKey=${api_key}`,
    science: `https://newsapi.org/v2/top-headlines?country=za&category=science&apiKey=${api_key}`,
	health: `https://newsapi.org/v2/top-headlines?country=za&category=health&apiKey=${api_key}`		
};    

const category_memory ={
    fetch_date : null,
    entertainment : [],
    sports : [],
    business : [],
    tech : [],
    science : [],
    health : [],
};    

async function get_blog_articles(category){
	let results = null;
    let apiRequest = null;
    const today = moment().format("YYYY-MM-DD");
    
    if ((fetch_date !== today) && (category_memory[category] && category_memory[category].length < 1)){

     apiRequest = articles_api[category];
      await axios.get(apiRequest).then(result => {
          if (result.status === 200){
            return result.data;
          }else{
              throw new Error('there was an error fetching data');
          }
          
        }).then(json_articles => {
            results = json_articles.articles;
            category_memory[category] = results;
        }).catch(error => {
          console.log(error);
        });

      category_memory.fetch_date = today;
    } else {
      results = category_memory[category];
    }

	return results;
};

module.exports = {
  search: searchNews,
  refine: get_blog_articles,
};
