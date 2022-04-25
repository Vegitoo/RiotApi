module.exports = {
    port: process.env.PORT || 3001,
    database: 'mongodb://127.0.0.1:27017/todolist',
    secret: '5439ugdfvhjd6yu9ter5',
    baseUrl: 'https://eun1.api.riotgames.com/lol',
    riotApiKey: 'api_key=RGAPI-43498e1e-8618-43b5-802d-0ed83adc1067' // key resets every 24 hours so You need to implement new one
}

