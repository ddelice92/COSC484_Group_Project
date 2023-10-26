require('dotenv').config({ override: true, path: `${__dirname}/credentials.env` });
const { MongoClient } = require('mongodb');
const express = require('express')
const jwt = require('jsonwebtoken');
var cors = require('cors');
const app = express();
const port = 3001;

async function main() {
    const client = new MongoClient(process.env.MONGO_URI);
    const gameCollection = client.db("Game").collection("Games");
    const userCollection = client.db("Game").collection("Users");

    const secretKey = process.env.SECRET_KEY;

    app.use(cors({
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }));

    app.use(express.json())

    
    try {
        await client.connect();
        await listDatabases(client);
        await createGame(gameCollection, generateGame('tictactoe', 'samplegametictactoe'));
        await createGame(gameCollection, generateGame('checkers', 'samplegamecheckers'));
        console.log(await addUser(userCollection, 'testuser', 'testpassword'));
        await authUser(userCollection, 'testuser', 'notreal');
    }catch (e) {
        console.error(e);
    }finally {
        
    }

    game = generateGame('tictactoe', 'win');
    tictactoeMakeMove(game, 2, 'x');
    tictactoeMakeMove(game, 4, 'x');
    tictactoeMakeMove(game, 6, 'x');
    console.log(game.currentBoard)
    console.log(tictactoeCheckForWin(game));



    app.listen(port, () => {
        console.log("Server Listening on PORT:", port);
    });
    
    app.get("/api/getgamedata/:gamename", async (request, response) => {// returns game object of game with name gamename
        console.log("retrieved " + request.params.gamename)
        game = await findGameByName(gameCollection, request.params.gamename);
        if (!game) {
            game = {};
        }
        response.json(game);
    });

    app.get("/api/getgamedata/", async (request, response) => {//Returns empty object if no gamename parameter is given
        response.json({});
    });

    app.post('/login', async (req, res) => { //Expects request with body in form of {"username":"username", "password":"password"}, returns session token if successful auth
        const username = req.body.username;
        const password = req.body.password;

        if (await authUser(userCollection, username, password) == 'USER_AUTHED') {
            const token = generateToken(username, secretKey);
            console.log(token);
            await updateUserSessionID(userCollection, username, token);
            res.json({ token });
        } else {
            res.status(401);
            res.json({});
        }
        

    })

    

}

function tictactoeMakeMove(game, space, side) {
    if (game.currentBoard[space] == 'e') {
        game.currentBoard[space] = side;
    }
}

function tictactoeCheckForWin(game) {
    winner = {
        winner: 'e',
        type: '',
        position: 0
    }
    for (let j = 0; j <= 6; j = j + 3) {//Check rows for winner
        last = game.currentBoard[j];
        if (winner.winner != 'e') {
            winner.position = j / 3;
            winner.type = 'row';
            return winner;
        }
        for (let i = 1; i <= 2; i++) {
            if (game.currentBoard[i + j] == last) {
                last = game.currentBoard[j+i];
                winner.winner = last;
            } else {
                last = game.currentBoard[j + i];
                winner.winner = 'e';
            }
        }
    }
    
    for (let j = 0; j <= 2; j ++) {//check cols for winner
        last = game.currentBoard[j];
        if (winner.winner != 'e') {
            winner.position = j;
            winner.type = 'col';
            return winner;
        }
        for (let i = 3; i <= 6; i = i+3) {
            if (game.currentBoard[i + j] == last) {
                last = game.currentBoard[j + i];
                winner.winner = last;
            } else {
                last = game.currentBoard[j + i];
                winner.winner = 'e';
            }
        }
    }

    for (let j = 0; j <= 4; j = j + 4) {//check diagonal for winner
        last = game.currentBoard[j];
        if (winner.winner != 'e') {
            winner.position = 1;
            winner.type = 'diag';
            return winner;
        }
        if (game.currentBoard[j + 4] == last) {
            last = game.currentBoard[j + 4];
            winner.winner = last;
        } else {
            last = game.currentBoard[j + 4];
            winner.winner = 'e';
        }
    }

    for (let j = 2; j <= 4; j = j+2) {//check reverse diagonal for winner
        last = game.currentBoard[j];
        if (winner.winner != 'e') {
            winner.position = 2;
            winner.type = 'diag';
            return winner;
        }
        if (game.currentBoard[j+2] == last) {
            last = game.currentBoard[j+2];
            winner.winner = last;
        } else {
            last = game.currentBoard[j + 2];
            winner.winner = 'e';
        }
    }
    
 
    return winner;
}

function generateGame(gameType, gameName) {//Returns a game object with name gameName and type gameType
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

async function createGame(gameCollection, game) {//Adds a game object to the database
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

async function addUser(userCollection, username, password) {//Creates account. If success returns USER_ADDED if failure returns USER_ALREADY_EXISTS
    if (await userCollection.findOne({ _id: username })) {
        return 'USER_ALREADY_EXISTS';
    } else {
        await userCollection.insertOne({ _id: username, password: password, session_id: '', wins: 0, played: 0});
        return 'USER_ADDED';
    }
}

async function authUser(userCollection, username, password) {//returns 'USER_AUTHED' if username:password combo is good, 'INVALID_PASSWORD' if user exists but password is wrong, and 'USER_DOES_NOT_EXIST' if user does not exist
    const result = await userCollection.findOne({ _id: username });
    if (result) {
        if (result.password == password) {
            return 'USER_AUTHED';
        } else {
            return 'INVALID_PASSWORD';
        }
    } else {
        return 'USER_DOES_NOT_EXIST';
    }
}

async function updateUserSessionID(userCollection, username, token) {//Updates session_id for user with username
    await userCollection.updateOne(
        { _id: username },
        {
            "$set": {
                session_id: token
            }
        }
    );
}

function generateToken(user, secretKey){
    const payload = {
        id: user
    };

    const token = jwt.sign(payload, secretKey, {
        expiresIn: '1h', // The token expires after 1 hour
    });

    return token;
};


main().catch(console.error);

