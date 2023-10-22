const { MongoClient } = require('mongodb');
const express = require('express')
var cors = require('cors');
const app = express();
const port = 3001;

async function main() {
    const uri = "mongodb://localhost";
    const client = new MongoClient(uri);
    const gameCollection = client.db("testingdb").collection("samplegame");
    var gameobject = {
        gameName: "sampletictactoe",
        gameType: "tictactoe",
        currentBoard: ["e", "e", "e", "e", "e", "e", "e", "e", "e"]
    }
    app.use(cors({
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }));

    
    try {
        await client.connect();
        await listDatabases(client);
        await createGame(gameCollection, generateGame('tictactoe', 'samplegametictactoe'));
        await createGame(gameCollection, generateGame('checkers', 'samplegamecheckers'));
    }catch (e) {
        console.error(e);
    }finally {
        
    }

    app.listen(port, () => {
        console.log("Server Listening on PORT:", port);
    });
    
    app.get("/api/getgamedata/:gamename", async (request, response) => {
        console.log("retrieved " + request.params.gamename)
        game = await findGameByName(client.db("testingdb"), request.params.gamename);
        if (!game) {
            game = {};
        }
        response.json(game);
    });

    app.get("/api/getgamedata/", async (request, response) => {
        response.json({});
    });
   

    

}

function generateGame(gameType, gameName) {
    if (gameType == 'tictactoe') {
        return {
            _id: gameName,
            gameType: "tictactoe",
            currentBoard: ["e", "e", "e", "e", "e", "e", "e", "e", "e"]
        }
    } else if (gameType == "checkers") {
        return {
            _id: gameName,
            gameType: "checkers",
            currentBoard: [
                "e", "w", "e", "w", "e", "w", "e", "w",
                "w", "e", "w", "e", "w", "e", "w", "e",
                "e", "w", "e", "w", "e", "w", "e", "w",
                "e", "e", "e", "e", "e", "e", "e", "e",
                "e", "e", "e", "e", "e", "e", "e", "e",
                "e", "e", "e", "e", "e", "e", "e", "e",
                "b", "e", "b", "e", "b", "e", "b", "e",
                "e", "b", "e", "b", "e", "b", "e", "b",
                "b", "e", "b", "e", "b", "e", "b", "e"]
            }
        }else {
            console.error("tried to create a game of invalid gameType");
        }
}


async function listDatabases(client) {
    databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));

}

async function createGame(gameCollection, game) {
    if (await gameCollection.findOne({ _id: game._id })) {
        console.log("Tried to create a game with a name that already exists: " + game._id );
    }else {
        const result = await gameCollection.insertOne(game);
        console.log(`New listing created with the following id: ${result.insertedId}`);
    }
}

async function findGameByName(gameCollection, gameName) {
    return await gameCollection.find({ "_id": gameName }).toArray();
}

main().catch(console.error);

