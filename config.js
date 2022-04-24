module.exports = {
    port: process.env.PORT || 3001,
    database: 'mongodb://127.0.0.1:27017/todolist',
    secret: '5439ugdfvhjd6yu9ter5',
    authEmail: 'xxx@gmail.com',
    authPass: 'xxx',
    baseUrl: 'https://eun1.api.riotgames.com/lol',
    riotApiKey: 'api_key=RGAPI-b4548e51-f429-48cc-955a-44a001f20046' // key resets every 24 hours so You need to implement new one
}

