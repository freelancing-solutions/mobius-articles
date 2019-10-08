# mobius-articles
 a realtime article server created to help populate web apps with blog articles scrapped from news api and other articles api around the world,

 # Features
 The API limits the number of times requests are made to news api by catching the results of the 
 commonly requested articles in redis cache, meaning several visits to the pages on your blog
 wont create multiple requests to your News API.

 Therefore this implementation can be used with mainly free heroku accounts, and free news api
 accounts.

 # how to use

 1. clone this repository
 2. npm install
 3. create a heroku free account
 4. open your app in heroku and the add a free redis Add-on
 5. take note of your redis config
 6. go to settings and create REDIS_URL config var --- paste the previous redis config there
 7. in the meantime you can also add your news NEWS_API_KEY config here, get the key from newsapi.org
 8. go to deploy and attach your github account
 9. set heroku to automatically deploy your repository created previously
 10. you should be set...

 dont forget to read heroku docs and also newsapi docs for more information but in case
 you cant get this to work let me know i will help.

 

