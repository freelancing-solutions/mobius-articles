const moment = require("moment");
const NewsAPI = require("newsapi");
const api_key = process.env.NEWS_API_KEY || "41e896a0a1c94b61903408fae1a49471";
const newsapi = new NewsAPI(api_key);

let news_articles = [];
let fetch_date = null;
let last_term = null;

const searchNews = async term => {

    let results = {status:false,payload:[],error:{}};        
    let today = moment().format("YYYY-MM-DD");

        if ((fetch_date === null) || (last_term === null) || (last_term !== term) || (fetch_date !== today)){

            await newsapi.v2.everything({
                q: term,        
                from: today,    
                language: "en",
                sortBy: "relevancy",    
            
            }).then(response_json => {
                
                console.log(response_json);

                results.payload = [...response_json.articles];
                results.status = true;

                news_articles = results.payload;
                fetch_date = today;
                last_term = term;

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


const articles_api = {	
	entertainment_news: `https://newsapi.org/v2/top-headlines?country=za&category=entertainment&apiKey=${api_key}`,
	sports_news: `https://newsapi.org/v2/top-headlines?country=za&category=sports&apiKey=${api_key}`,
    business_news: `https://newsapi.org/v2/top-headlines?country=za&category=business&apiKey=${api_key}`,
    tech_news: `https://newsapi.org/v2/top-headlines?country=za&category=technology&apiKey=${api_key}`,
    science_news: `https://newsapi.org/v2/top-headlines?country=za&category=science&apiKey=${api_key}`,
	health_news: `https://newsapi.org/v2/top-headlines?country=za&category=health&apiKey=${api_key}`		
};    

const category_memory ={
    fetch_date : null,
    entertainment_news : [],
    sports_news : [],
    business_news : [],
    tech_news : [],
    science_news : [],
    health_news : [],
};    




async function get_blog_articles(category) {	

	let results = null;
    let apiRequest = null;
    const today = moment().format("YYYY-MM-DD");
    
    if ((fetch_date !== today) && (category_memory[category].length < 1)){
        switch(category){
            case 'entertainment': apiRequest = articles_api.entertainment_news;break;
            case 'sports' : apiRequest = articles_api.sports_news;break;
            case 'business' : apiRequest = articles_api.business_news;break;
            case 'tech' : apiRequest = articles_api.tech_news;break;
            case 'science': apiRequest = articles_api.science_news;break;
            case 'health' : apiRequest = articles_api.health_news;break;
            default: apiRequest = articles_api.entertainment_news;break;        
        }
            
        await axios.get(apiRequest).then(result => {
            if (result.status === 200) {
                return result.data;
            } else {
                throw new Error('There was an error fetching articles');
            }
        }).then(articles => {
            results = articles.articles;
            switch(category){
                case 'entertainment': category_memory.entertainment_news = articles.articles;break;
                case 'sports' : category_memory.sports_news = articles.articles;break;
                case 'business' : category_memory.business_news = articles.articles;break;
                case 'tech' : category_memory.tech_news = articles.articles;break;
                case 'science': category_memory.science_news = articles.articles;break;
                case 'health' : category_memory.health_news = articles.articles;break;
                default: category_memory.entertainment_news = articles.articles;break;        
            }

        }).catch(error => {
            console.log(error);
        });

        
        category_memory.fetch_date = today;
    }else{

        results = category_memory[category]
    }

	return results;
};

module.exports = {
  search: searchNews,
  refine: get_blog_articles,
};
