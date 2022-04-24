# RiotApi
Api collecting data about Summoner from popular game 'League of Legends'.

To launch:

1) Run Postman and MongoDBCompass,
2) In confing change riotApiKey to valid key (You can get it from here after You register: https://developer.riotgames.com)
3) To launch server type in terminal: node index
4) In Postman create new Post request at localhost:3001/api/auth/register and data {
    "login": "xxxxx",
    "password": "12345",
    "email": "xxxxx@gmail.com",
    "InfoAboutRiotAcc": {
        "summonerName": "ostedneni"
        }
}
5) Next login in Postman at Post request localhost:3001/api/auth/login
6) Create Get request localhost:3001/api/home/get-matches-ids
7) Create next Get request localhost:3001/api/home/get-matches-history
