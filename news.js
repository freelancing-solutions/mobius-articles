const moment = require("moment");
const NewsAPI = require("newsapi");
const newsapi = new NewsAPI(
  process.env.NEWS_API_KEY || "41e896a0a1c94b61903408fae1a49471"
);

const news_articles = [];
const fetch_date = null;

const searchNews = async term => {
    const results = {status:false,payload:[],error:{}};        
        const today = moment().format("YYYY-MM-DD");

        if ((fetch_date === null) || (fetch_date !== today)){
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
                news_articles = results.payload;
                fetch_date = today;
            }).catch(error => {
                console.log(error);
                results.payload = [];
                results.error = {...error};
                results.status = false;
            });

        }else{
            results.payload = news_articles;
            results.status = true;
            results.error = {};
        }

    return results;
};


module.exports= {
    search : searchNews
};
