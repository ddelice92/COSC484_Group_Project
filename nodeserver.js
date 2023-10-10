const { MongoClient } = require('mongodb');
const express = require('express')
const app = express();
const port = 3001;

async function main() {
    const uri = "mongodb://localhost";
    const client = new MongoClient(uri);
    var gameobject = {
        gameId: "abcdefg",
        gameType: "tictactoe",
        currentBoard: ["e", "e", "e", "e", "e", "e", "e", "e", "e"]
    }

    
    try {
        await client.connect();
        await listDatabases(client);
        //await createGame(client, gameobject)
    }catch (e) {
        console.error(e);
    }finally {
        
    }

    app.listen(port, () => {
        console.log("Server Listening on PORT:", port);
    });
    
    app.get("/api/getgamedata/:gameid", async (request, response) => {
        console.log("1")
        
        game = await findGameById(client.db("testingdb"), request.params.gameid);
        response.json(game);
    });
   

    

}


async function listDatabases(client) {
    databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));

}

async function createGame(client, game) {
    const result = await client.db("testingdb").collection("samplegame").insertOne(game);
    console.log(`New listing created with the following id: ${result.insertedId}`);
}

async function findGameById(db, gameId) {
    return await db.collection('samplegame').find({ "gameId": gameId }).toArray();
}

main().catch(console.error);

