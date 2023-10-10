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
        await client.close();
    }

    app.listen(port, () => {
        console.log("Server Listening on PORT:", port);
    });
    
    app.get("/api/getgamedata/:gameid", (request, response) => {
        console.log("1")
        
        game = findGameById(client, request.params.gameid);
        console.log(game);
        response.send("ok");
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

async function findGameById(client, gameId) {
    game = null;
    client.connect(function (err, db) {
        console.log("2");
        if (err) throw err;
        var dbo = db.db("testingdb").collection("samplegame");
        dbo.collection.find({ "gameId": gameId }).toObject(function (err, result) {
            if (err) throw err;
            console.log(result)
            game = result;
            db.close
            
        })
    });
    return game;
}

main().catch(console.error);

