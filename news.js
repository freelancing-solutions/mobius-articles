const moment = require("moment");
const NewsAPI = require("newsapi");
const newsapi = new NewsAPI(
  process.env.NEWS_API_KEY || "41e896a0a1c94b61903408fae1a49471"
);

const news_articles = [];

const searchNews = async term => {
    const results = {status:false,payload:[],error:{}};
        
        const today = moment().format("YYYY-MM-DD");
        await newsapi.v2.everything({
            q: term,        
            from: today,    
            language: "en",
            sortBy: "relevancy",    
        }).then(response_json => {
            console.log(response_json);
            const articles = JSON.parse(response_json);        
            results.payload =[...articles.articles];
            results.status = true;
        }).catch(error => {
            console.log(error);
            results.payload = [];
            results.error = {...error};
            results.status = false;
        });
    return results;
};


module.exports= {
    search : searchNews
};
