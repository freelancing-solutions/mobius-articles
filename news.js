const moment = require("moment");
const NewsAPI = require("newsapi");
const newsapi = new NewsAPI(
  process.env.NEWS_API_KEY
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


async function get_blog_articles(category) {	
	let results = '';
	let apiRequest = '';
    console.log('CATEGORY',category);	
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
		results = articles;
	}).catch(error => {
		console.log(error);
	});
	console.log('RESULTS : ', results);
	return results.articles;
};

module.exports = {
  search: searchNews,
  refine: get_blog_articles,
};
